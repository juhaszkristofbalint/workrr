"use server";

import { requireRole } from "@/lib/auth/require-role";
import { categoryLookupSlugs, isJobCategorySlug } from "@/lib/jobs/categories";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const DURATION_MINUTES: Record<string, number> = {
  "30 min": 30,
  "1 hour": 60,
  "2 hours": 120,
  "4 hours": 240,
  "Full day": 480,
};

function readCategory(formData: FormData) {
  const values = formData
    .getAll("category")
    .map((value) => String(value).trim().toLowerCase())
    .filter(Boolean);
  return values.at(-1) ?? "";
}

async function resolveCategoryId(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  slug: string,
) {
  const slugs = categoryLookupSlugs(slug);
  const { data } = await supabase
    .from("categories")
    .select("id")
    .in("slug", slugs)
    .limit(1);

  return data?.[0]?.id ?? null;
}

async function revalidateJobSurfaces() {
  revalidatePath("/customer");
  revalidatePath("/customer/jobs");
  revalidatePath("/pro");
  revalidatePath("/pro/requests");
  revalidatePath("/pro/schedule");
  revalidatePath("/admin");
  revalidatePath("/admin/jobs");
  revalidatePath("/admin/bookings");
}

export type CreateJobResult =
  | { ok: true; message: string; jobId: string }
  | { ok: false; error: string };

function isUploadFile(value: FormDataEntryValue): value is File {
  return value instanceof File && value.size > 0;
}

function fileExt(file: File) {
  const allowed = new Set(["jpg", "jpeg", "png", "webp", "heic", "heif", "gif"]);
  const fromName = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (allowed.has(fromName)) return fromName === "jpeg" ? "jpg" : fromName;
  const fromType = file.type.split("/")[1]?.toLowerCase() ?? "jpg";
  if (allowed.has(fromType)) return fromType === "jpeg" ? "jpg" : fromType;
  return "jpg";
}

export async function createJobAction(formData: FormData): Promise<CreateJobResult> {
  const user = await requireRole("customer");

  const title = String(formData.get("title") ?? "").trim();
  const category = readCategory(formData);
  const description = String(formData.get("description") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const preferredDate = String(formData.get("preferredDate") ?? "").trim();
  const emergency = String(formData.get("emergency") ?? "") === "true";
  const latRaw = String(formData.get("lat") ?? "").trim();
  const lngRaw = String(formData.get("lng") ?? "").trim();
  const photos = formData.getAll("photos").filter(isUploadFile);

  if (!title || !description || !address) {
    return { ok: false, error: "missing" };
  }

  if (!isJobCategorySlug(category)) {
    return { ok: false, error: "category" };
  }

  if (!isSupabaseConfigured()) {
    return { ok: false, error: "unavailable" };
  }

  const supabase = await createSupabaseServerClient();
  const categoryId = await resolveCategoryId(supabase, category);

  if (!categoryId) {
    return { ok: false, error: "save" };
  }

  const { error: profileError } = await supabase.rpc("ensure_customer_profile");
  if (profileError) {
    const { error: upsertError } = await supabase.from("customer_profiles").upsert(
      { profile_id: user.id },
      { onConflict: "profile_id" },
    );
    if (upsertError) {
      console.error("createJob customer profile", profileError, upsertError);
      return { ok: false, error: "save" };
    }
  }

  const jobId = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const latitude = latRaw ? Number(latRaw) : null;
  const longitude = lngRaw ? Number(lngRaw) : null;

  const photoUrls: string[] = [];

  for (const [index, photo] of photos.entries()) {
    const ext = fileExt(photo);
    const path = `${user.id}/${jobId}/${index}-${crypto.randomUUID()}.${ext}`;
    const bytes = await photo.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from("job-images")
      .upload(path, bytes, {
        contentType: photo.type || "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      return { ok: false, error: "photos" };
    }

    const { data } = supabase.storage.from("job-images").getPublicUrl(path);
    photoUrls.push(data.publicUrl);
  }

  const { error } = await supabase.from("jobs").insert({
    id: jobId,
    customer_id: user.id,
    created_by: user.id,
    category_id: categoryId,
    category,
    title,
    description,
    address,
    address_text: address,
    latitude: Number.isFinite(latitude) ? latitude : null,
    longitude: Number.isFinite(longitude) ? longitude : null,
    lat: Number.isFinite(latitude) ? latitude : null,
    lng: Number.isFinite(longitude) ? longitude : null,
    status: "open",
    created_at: createdAt,
    emergency,
    preferred_date: preferredDate || null,
    photo_urls: photoUrls,
  });

  if (error) {
    console.error("createJob insert", error);
    return { ok: false, error: "save" };
  }

  await revalidateJobSurfaces();
  return {
    ok: true,
    jobId,
    message: "Job created successfully.",
  };
}

export async function acceptOfferAction(formData: FormData) {
  await requireRole("customer");

  const jobId = String(formData.get("jobId") ?? "").trim();
  const offerId = String(formData.get("offerId") ?? "").trim();

  if (!jobId || !offerId) {
    redirect("/customer/jobs");
  }

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.rpc("accept_offer", { p_offer_id: offerId });
    await revalidateJobSurfaces();
  }

  redirect(`/customer/jobs/${jobId}?accepted=${offerId}`);
}

export async function submitOfferAction(input: {
  jobId: string;
  price: number;
  availableDate: string;
  duration: string;
  message: string;
  featured: boolean;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await requireRole("professional");

  if (!isSupabaseConfigured()) {
    return { ok: false, error: "unavailable" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("offers").insert({
    job_id: input.jobId,
    professional_id: user.id,
    price: input.price,
    available_date: input.availableDate,
    duration_minutes: DURATION_MINUTES[input.duration] ?? 120,
    message: input.message.trim(),
    featured: input.featured,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  await revalidateJobSurfaces();
  return { ok: true };
}

export async function removeJobAction(jobId: string) {
  const user = await requireRole("admin");

  if (!isSupabaseConfigured()) {
    return { ok: false as const };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("jobs")
    .update({
      status: "removed",
      removed_at: new Date().toISOString(),
      removed_by: user.id,
    })
    .eq("id", jobId);

  if (error) {
    return { ok: false as const };
  }

  await revalidateJobSurfaces();
  return { ok: true as const };
}

import type { GeoPoint } from "@/lib/geo/haversine";
import {
  JOB_SELECT,
  displayName,
  postedLabel,
  toListRow,
  type EmbeddedPro,
  type JobRow,
} from "@/lib/jobs/job-row";
import { myJobStage } from "@/lib/jobs/status";
import { queryOpenJobs } from "@/lib/jobs/open-jobs";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CustomerJob, JobListRow, JobOffer, MyJob, NearbyJob } from "@/types/jobs";

async function client() {
  if (!isSupabaseConfigured()) return null;
  return createSupabaseServerClient();
}

export async function getProfessionalLocation(
  professionalId: string,
): Promise<GeoPoint | null> {
  const supabase = await client();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("professional_profiles")
    .select("lat, lng")
    .eq("profile_id", professionalId)
    .maybeSingle();

  if (error || data?.lat == null || data?.lng == null) return null;
  return { lat: data.lat, lng: data.lng };
}

export async function listOpenJobs(
  origin?: GeoPoint | null,
): Promise<NearbyJob[]> {
  const supabase = await client();
  if (!supabase) return [];
  return queryOpenJobs(supabase, origin);
}

export async function listMyJobs(userId: string): Promise<MyJob[]> {
  const supabase = await client();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("jobs")
    .select(
      `
      ${JOB_SELECT},
      offers ( id )
    `,
    )
    .eq("customer_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return (data as (JobRow & { offers?: { id: string }[] })[]).map((row) => {
    const list = toListRow(row);
    return {
      ...list,
      offerCount: row.offers?.length ?? 0,
      stage: myJobStage(list.status),
    };
  });
}

export async function listCustomerJobs(customerId: string): Promise<JobListRow[]> {
  const supabase = await client();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("jobs")
    .select(JOB_SELECT)
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as JobRow[]).map(toListRow);
}

export async function listAssignedJobs(professionalId: string): Promise<JobListRow[]> {
  const supabase = await client();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("jobs")
    .select(JOB_SELECT)
    .eq("assigned_professional_id", professionalId)
    .is("removed_at", null)
    .in("status", ["matched", "en_route", "in_progress"])
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as JobRow[]).map(toListRow);
}

export async function listAllJobs(): Promise<JobListRow[]> {
  const supabase = await client();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("jobs")
    .select(JOB_SELECT)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as JobRow[]).map(toListRow);
}

export async function listMatchedJobs(): Promise<JobListRow[]> {
  const supabase = await client();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("jobs")
    .select(JOB_SELECT)
    .not("assigned_professional_id", "is", null)
    .is("removed_at", null)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as JobRow[]).map(toListRow);
}

function timelineFor(row: JobRow, offerCount: number): CustomerJob["timeline"] {
  const submitted = postedLabel(row.created_at);
  const status = row.status;
  const accepted = ["matched", "en_route", "in_progress", "completed"].includes(status);
  const enRoute = ["en_route", "in_progress", "completed"].includes(status);

  function state(done: boolean, current: boolean): "done" | "current" | "upcoming" {
    if (done) return "done";
    if (current) return "current";
    return "upcoming";
  }

  return [
    { id: "t1", label: "Job submitted", at: submitted, state: "done" },
    {
      id: "t2",
      label: "Professionals notified",
      at: submitted,
      state: state(offerCount > 0 || accepted, status === "open" && offerCount === 0),
    },
    {
      id: "t3",
      label: "Offers received",
      at: offerCount > 0 ? submitted : "",
      state: state(accepted || offerCount > 0, status === "open" && offerCount > 0),
    },
    {
      id: "t4",
      label: "Offer accepted",
      at: accepted ? submitted : "",
      state: state(enRoute || status === "matched" || status === "completed", status === "matched"),
    },
    {
      id: "t5",
      label: "Pro on the way",
      at: enRoute ? submitted : "",
      state: state(status === "in_progress" || status === "completed", status === "en_route"),
    },
  ];
}

export async function getCustomerJob(id: string): Promise<CustomerJob | null> {
  const supabase = await client();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("jobs")
    .select(
      `
      ${JOB_SELECT},
      offers (
        id,
        price,
        available_date,
        message,
        status,
        professional_id,
        professional_profiles!offers_professional_id_fkey (
          profiles ( display_name )
        )
      )
    `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  const row = data as JobRow & {
    offers?: {
      id: string;
      price: number;
      available_date: string;
      message: string;
      status: string;
      professional_id: string;
      professional_profiles: EmbeddedPro;
    }[];
  };

  const offers: JobOffer[] = (row.offers ?? []).map((offer) => ({
    id: offer.id,
    professionalId: offer.professional_id,
    professionalName: displayName(offer.professional_profiles),
    rating: 0,
    reviews: 0,
    price: Number(offer.price),
    availableDate: offer.available_date,
    message: offer.message,
    accepted: offer.status === "accepted",
  }));

  const list = toListRow(row);

  return {
    id: list.id,
    title: list.title,
    trade: list.category,
    category: list.category,
    description: list.description,
    address: list.address,
    status: list.status,
    submittedAt: list.posted,
    photos: list.photos,
    timeline: timelineFor(row, offers.length),
    offers,
  };
}

export async function listMyOfferedJobIds(professionalId: string) {
  const supabase = await client();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("offers")
    .select("job_id")
    .eq("professional_id", professionalId);

  if (error || !data) return [];
  return data.map((row) => row.job_id);
}

export async function listJobNotifications(profileId: string) {
  const supabase = await client();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("notifications")
    .select("id, title, body, created_at, read_at")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !data) return [];
  return data.map((item) => ({
    id: item.id,
    title: item.title,
    detail: item.body ?? "",
    time: postedLabel(item.created_at),
    unread: !item.read_at,
  }));
}

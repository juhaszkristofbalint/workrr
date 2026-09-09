"use server";

import { requireRole } from "@/lib/auth/require-role";
import { redirect } from "next/navigation";

export async function createJobAction(formData: FormData) {
  await requireRole("customer");

  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();

  if (!title || !category || !description || !address) {
    redirect("/customer/jobs/new?error=missing");
  }

  redirect("/customer/jobs?created=1");
}

export async function acceptOfferAction(formData: FormData) {
  await requireRole("customer");

  const jobId = String(formData.get("jobId") ?? "").trim();
  const offerId = String(formData.get("offerId") ?? "").trim();

  if (!jobId || !offerId) {
    redirect("/customer/jobs");
  }

  redirect(`/customer/jobs/${jobId}?accepted=${offerId}`);
}

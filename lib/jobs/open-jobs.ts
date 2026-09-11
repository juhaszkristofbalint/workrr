import type { GeoPoint } from "@/lib/geo/haversine";
import { JOB_SELECT, sortOpenJobs, toNearbyJob, type JobRow } from "@/lib/jobs/job-row";
import type { NearbyJob } from "@/types/jobs";
import type { Database } from "@/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";

type Client = SupabaseClient<Database>;

export async function queryOpenJobs(
  supabase: Client,
  origin?: GeoPoint | null,
): Promise<NearbyJob[]> {
  const { data, error } = await supabase
    .from("jobs")
    .select(JOB_SELECT)
    .eq("status", "open")
    .is("removed_at", null)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return sortOpenJobs((data as JobRow[]).map((row) => toNearbyJob(row, origin)));
}

export async function queryOpenJobById(
  supabase: Client,
  id: string,
  origin?: GeoPoint | null,
): Promise<NearbyJob | null> {
  const { data, error } = await supabase
    .from("jobs")
    .select(JOB_SELECT)
    .eq("id", id)
    .eq("status", "open")
    .is("removed_at", null)
    .maybeSingle();

  if (error || !data) return null;
  return toNearbyJob(data as JobRow, origin);
}

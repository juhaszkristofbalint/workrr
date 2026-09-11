import { haversineKm, type GeoPoint } from "@/lib/geo/haversine";
import type { JobListRow, JobPhoto, NearbyJob } from "@/types/jobs";
import type { JobStatus as DbJobStatus } from "@/types/database";

export const JOB_SELECT = `
  id,
  title,
  description,
  address_text,
  status,
  emergency,
  created_at,
  preferred_date,
  lat,
  lng,
  budget_min,
  budget_max,
  flagged,
  photo_urls,
  removed_at,
  customer_id,
  assigned_professional_id,
  categories ( name_en, slug ),
  job_images ( storage_path, alt, sort_order ),
  customer_profiles!jobs_customer_id_fkey (
    profiles ( display_name )
  ),
  professional_profiles!jobs_assigned_professional_id_fkey (
    profiles ( display_name )
  )
`;

type EmbeddedProfile = { display_name?: string | null } | { display_name?: string | null }[] | null;
type EmbeddedCustomer = { profiles?: EmbeddedProfile } | { profiles?: EmbeddedProfile }[] | null;
export type EmbeddedPro = { profiles?: EmbeddedProfile } | { profiles?: EmbeddedProfile }[] | null;
type EmbeddedCategory = { name_en?: string | null; slug?: string | null } | { name_en?: string | null; slug?: string | null }[] | null;
type EmbeddedImage = {
  storage_path: string;
  alt: string | null;
  sort_order: number;
};

export type JobRow = {
  id: string;
  title: string;
  description: string;
  address_text: string;
  status: DbJobStatus;
  emergency: boolean;
  created_at: string;
  preferred_date: string | null;
  lat: number | null;
  lng: number | null;
  budget_min: number | null;
  budget_max: number | null;
  flagged: boolean;
  photo_urls: string[] | null;
  removed_at: string | null;
  customer_id: string;
  assigned_professional_id: string | null;
  categories: EmbeddedCategory;
  job_images: EmbeddedImage[] | null;
  customer_profiles: EmbeddedCustomer;
  professional_profiles: EmbeddedPro;
};

function one<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

type TOrArray = EmbeddedProfile | EmbeddedCustomer | EmbeddedPro;

export function displayName(
  embedded: EmbeddedProfile | EmbeddedCustomer | EmbeddedPro,
): string {
  const top = one(embedded as TOrArray);
  if (!top || typeof top !== "object") return "";
  if ("display_name" in top) return String(top.display_name ?? "");
  if ("profiles" in top) return displayName(top.profiles as EmbeddedProfile);
  return "";
}

function categoryName(embedded: EmbeddedCategory) {
  return one(embedded)?.name_en ?? "";
}

function publicAssetUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) {
    return path;
  }
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return path;
  return `${base}/storage/v1/object/public/job-images/${path}`;
}

function photosOf(row: JobRow): JobPhoto[] {
  const urls = (row.photo_urls ?? []).filter(Boolean);
  if (urls.length) {
    return urls.map((src, index) => ({
      src,
      alt: `${row.title} ${index + 1}`,
    }));
  }

  return [...(row.job_images ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((image) => ({
      src: publicAssetUrl(image.storage_path),
      alt: image.alt ?? row.title,
    }));
}

export function uiStatus(status: DbJobStatus) {
  if (status === "en_route") return "en route";
  if (status === "in_progress") return "in progress";
  return status;
}

export function postedLabel(iso: string) {
  return iso.slice(0, 10);
}

function budgetLabel(min: number | null, max: number | null) {
  if (min != null && max != null) return `$${min}–${max}`;
  if (min != null) return `$${min}+`;
  if (max != null) return `Up to $${max}`;
  return "";
}

function neighborhood(address: string) {
  const parts = address.split(",").map((part) => part.trim()).filter(Boolean);
  return parts.at(-1) ?? address;
}

export function toListRow(row: JobRow): JobListRow {
  return {
    id: row.id,
    title: row.title,
    category: categoryName(row.categories),
    description: row.description,
    address: row.address_text,
    status: uiStatus(row.status),
    emergency: row.emergency,
    posted: postedLabel(row.created_at),
    photos: photosOf(row),
    customerName: displayName(row.customer_profiles),
    assignedProfessional: displayName(row.professional_profiles) || null,
    flagged: row.flagged,
    budget: budgetLabel(row.budget_min, row.budget_max),
    preferredDate: row.preferred_date,
  };
}

export function toNearbyJob(row: JobRow, origin?: GeoPoint | null): NearbyJob {
  const list = toListRow(row);
  const canMeasure =
    origin != null && row.lat != null && row.lng != null;
  return {
    id: list.id,
    title: list.title,
    category: list.category,
    customerName: list.customerName,
    address: list.address,
    neighborhood: neighborhood(list.address),
    distanceKm: canMeasure
      ? haversineKm(origin, { lat: row.lat as number, lng: row.lng as number })
      : null,
    lat: row.lat,
    lng: row.lng,
    createdAt: row.created_at,
    budget: list.budget,
    posted: list.posted,
    description: list.description,
    emergency: list.emergency,
    photos: list.photos,
  };
}

export function withOriginDistance(
  jobs: NearbyJob[],
  origin: GeoPoint | null,
): NearbyJob[] {
  if (!origin) return jobs;
  return jobs.map((job) => ({
    ...job,
    distanceKm:
      job.lat != null && job.lng != null
        ? haversineKm(origin, { lat: job.lat, lng: job.lng })
        : null,
  }));
}

export function sortOpenJobs(jobs: NearbyJob[]) {
  return [...jobs].sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0;
    }
    return b.posted.localeCompare(a.posted);
  });
}

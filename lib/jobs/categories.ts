export const JOB_CATEGORIES = [
  "plumbing",
  "electrical",
  "locksmith",
  "hvac",
  "cleaning",
  "handyman",
  "other",
] as const;

export type JobCategorySlug = (typeof JOB_CATEGORIES)[number];

export const JOB_CATEGORY_NAME: Record<JobCategorySlug, string> = {
  plumbing: "Plumbing",
  electrical: "Electrical",
  locksmith: "Locksmith",
  hvac: "HVAC",
  cleaning: "Cleaning",
  handyman: "Handyperson",
  other: "Other",
};

export function isJobCategorySlug(value: string): value is JobCategorySlug {
  return (JOB_CATEGORIES as readonly string[]).includes(value);
}

export function categoryLookupSlugs(slug: string) {
  const normalized = slug.trim().toLowerCase();
  if (normalized === "handyman" || normalized === "handyperson") {
    return ["handyman", "handyperson"];
  }
  return [normalized];
}

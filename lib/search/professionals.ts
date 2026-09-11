import { JOB_CATEGORY_NAME, isJobCategorySlug } from "@/lib/jobs/categories";
import type { Professional } from "@/types/marketplace";

export type ProfessionalFilters = {
  query: string;
  category: string;
  maxKm: number | null;
  minRating: number | null;
  availableOnly: boolean;
};

export function filterProfessionals(
  professionals: Professional[],
  filters: ProfessionalFilters,
) {
  const query = filters.query.trim().toLowerCase();

  return professionals
    .filter((pro) => {
      if (filters.category) {
        const label = isJobCategorySlug(filters.category)
          ? JOB_CATEGORY_NAME[filters.category]
          : filters.category;
        if (pro.category !== filters.category && pro.category !== label) {
          return false;
        }
      }
      if (filters.maxKm != null && pro.distanceKm > filters.maxKm) return false;
      if (filters.minRating != null && pro.rating < filters.minRating) {
        return false;
      }
      if (filters.availableOnly && !pro.available) return false;
      if (!query) return true;

      const haystack = [
        pro.name,
        pro.trade,
        pro.category,
        ...pro.specialties,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

export function professionalInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

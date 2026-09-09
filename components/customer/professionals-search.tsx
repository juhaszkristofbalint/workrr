"use client";

import {
  ListIcon,
  MapPinIcon,
  MapViewIcon,
  SearchIcon,
  StarIcon,
} from "@/components/icons";
import { useLocale, useT } from "@/components/i18n/locale-provider";
import { Badge, Card, Input, ScreenHeader } from "@/components/ui";
import { nearbyProfessionals } from "@/lib/data/marketplace";
import { JOB_CATEGORIES } from "@/lib/jobs/categories";
import { categoryLabel } from "@/lib/i18n/translate";
import { cn } from "@/lib/cn";
import {
  filterProfessionals,
  professionalInitials,
} from "@/lib/search/professionals";
import type { Professional } from "@/types/marketplace";
import { useMemo, useState } from "react";

const DISTANCE_OPTIONS = [
  { label: "Any", value: null },
  { label: "2 km", value: 2 },
  { label: "5 km", value: 5 },
  { label: "10 km", value: 10 },
] as const;

const RATING_OPTIONS = [
  { label: "Any", value: null },
  { label: "4.0+", value: 4 },
  { label: "4.5+", value: 4.5 },
  { label: "4.8+", value: 4.8 },
] as const;

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-9 shrink-0 rounded-full px-3 text-footnote font-semibold",
        active ? "bg-primary text-primary-foreground" : "bg-fill text-label",
      )}
    >
      {children}
    </button>
  );
}

function ProfessionalCard({
  pro,
  selected = false,
  onSelect,
}: {
  pro: Professional;
  selected?: boolean;
  onSelect?: () => void;
}) {
  return (
    <Card
      className={cn(
        "flex gap-3 p-3.5",
        selected && "ring-2 ring-primary",
      )}
    >
      {onSelect ? (
        <button
          type="button"
          onClick={onSelect}
          className="flex min-w-0 flex-1 gap-3 text-left"
        >
          <CardBody pro={pro} />
        </button>
      ) : (
        <div className="flex min-w-0 flex-1 gap-3">
          <CardBody pro={pro} />
        </div>
      )}
    </Card>
  );
}

function CardBody({ pro }: { pro: Professional }) {
  const t = useT();
  return (
    <>
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/12 text-footnote font-bold text-primary">
        {professionalInitials(pro.name)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span className="block text-subhead font-semibold">{pro.name}</span>
          <span className="inline-flex shrink-0 items-center gap-0.5 text-footnote font-semibold text-label">
            <StarIcon className="h-3.5 w-3.5 text-warning" />
            {pro.rating.toFixed(1)}
            <span className="font-medium text-muted">({pro.reviews})</span>
          </span>
        </span>
        <span className="mt-0.5 flex items-center gap-1 text-footnote text-muted">
          <MapPinIcon className="h-3.5 w-3.5" />
          {pro.distanceKm} km · {pro.trade}
        </span>
        <span className="mt-2 flex flex-wrap gap-1.5">
          {pro.specialties.map((skill) => (
            <Badge key={skill} className="bg-fill px-2 py-0.5">
              {skill}
            </Badge>
          ))}
        </span>
        <span
          className={cn(
            "mt-2 block text-caption font-semibold",
            pro.available ? "text-success" : "text-muted",
          )}
        >
          {pro.available ? t("common.availableNow") : t("common.busyToday")}
        </span>
      </span>
    </>
  );
}

export function ProfessionalsSearch() {
  const t = useT();
  const { locale } = useLocale();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [maxKm, setMaxKm] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [view, setView] = useState<"list" | "map">("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const results = useMemo(
    () =>
      filterProfessionals(nearbyProfessionals, {
        query,
        category,
        maxKm,
        minRating,
        availableOnly,
      }),
    [availableOnly, category, maxKm, minRating, query],
  );

  const selected =
    results.find((pro) => pro.id === selectedId) ?? results[0] ?? null;

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-10 bg-background/92 px-5 pb-3 pt-1 backdrop-blur-md">
        <ScreenHeader
          eyebrow={t("search.eyebrow")}
          title={t("search.title")}
          action={
            <div
              className="flex rounded-full bg-fill p-1"
              role="group"
              aria-label={t("search.mapOrList")}
            >
              <button
                type="button"
                aria-pressed={view === "list"}
                onClick={() => setView("list")}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full",
                  view === "list" && "bg-card text-primary shadow-xs",
                )}
                aria-label={t("search.listView")}
              >
                <ListIcon className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-pressed={view === "map"}
                onClick={() => setView("map")}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full",
                  view === "map" && "bg-card text-primary shadow-xs",
                )}
                aria-label={t("search.mapView")}
              >
                <MapViewIcon className="h-5 w-5" />
              </button>
            </div>
          }
        />

        <div className="relative mt-4">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("search.placeholder")}
            aria-label={t("search.aria")}
            className="pl-11"
          />
        </div>

        <div className="mt-3">
          <p className="mb-2 text-caption font-semibold uppercase tracking-wide text-muted">
            {t("search.category")}
          </p>
          <div
            className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="group"
            aria-label={t("search.category")}
          >
            <Chip active={!category} onClick={() => setCategory("")}>
              {t("common.all")}
            </Chip>
            {JOB_CATEGORIES.map((item) => (
              <Chip
                key={item}
                active={category === item}
                onClick={() => setCategory(category === item ? "" : item)}
              >
                {categoryLabel(locale, item)}
              </Chip>
            ))}
          </div>
        </div>

        <FilterRow label={t("search.distance")}>
          {DISTANCE_OPTIONS.map((option) => (
            <Chip
              key={String(option.value)}
              active={maxKm === option.value}
              onClick={() => setMaxKm(option.value)}
            >
              {option.value === null
                ? t("common.any")
                : option.value === 2
                  ? t("search.km2")
                  : option.value === 5
                    ? t("search.km5")
                    : t("search.km10")}
            </Chip>
          ))}
        </FilterRow>

        <FilterRow label={t("search.rating")}>
          {RATING_OPTIONS.map((option) => (
            <Chip
              key={option.label}
              active={minRating === option.value}
              onClick={() => setMinRating(option.value)}
            >
              {option.value === null ? t("common.any") : option.label}
            </Chip>
          ))}
        </FilterRow>

        <FilterRow label={t("search.availability")}>
          <Chip active={!availableOnly} onClick={() => setAvailableOnly(false)}>
            {t("common.any")}
          </Chip>
          <Chip active={availableOnly} onClick={() => setAvailableOnly(true)}>
            {t("common.availableNow")}
          </Chip>
        </FilterRow>

        <p className="mt-3 text-footnote text-muted">
          {t("search.nearbyCount", { n: results.length })}
        </p>
      </div>

      <div className="px-5 pb-2">
        {view === "list" ? (
          results.length ? (
            <ul className="flex flex-col gap-3">
              {results.map((pro) => (
                <li key={pro.id}>
                  <ProfessionalCard pro={pro} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState />
          )
        ) : (
          <div className="flex flex-col gap-3">
            <div
              className="relative h-[340px] overflow-hidden rounded-xl bg-[#d7e6d4] shadow-card"
              role="img"
              aria-label={t("search.mapAria")}
            >
              <div className="absolute inset-0 [background-image:linear-gradient(#c5d4c4_1px,transparent_1px),linear-gradient(90deg,#c5d4c4_1px,transparent_1px)] [background-size:28px_28px]" />
              <div className="absolute left-[12%] top-[18%] h-16 w-28 rounded-lg bg-[#b7d0b4]" />
              <div className="absolute bottom-[16%] right-[10%] h-20 w-24 rounded-lg bg-[#b7d0b4]" />
              <p className="absolute left-3 top-3 rounded-full bg-white/80 px-2.5 py-1 text-caption font-semibold text-label">
                North Yard
              </p>
              {results.map((pro) => {
                const isSelected = selected?.id === pro.id;
                return (
                  <button
                    key={pro.id}
                    type="button"
                    onClick={() => setSelectedId(pro.id)}
                    className={cn(
                      "absolute flex -translate-x-1/2 -translate-y-full flex-col items-center",
                      isSelected ? "z-10" : "z-0",
                    )}
                    style={{ left: `${pro.mapX}%`, top: `${pro.mapY}%` }}
                    aria-label={t("search.pinAria", {
                      name: pro.name,
                      rating: pro.rating.toFixed(1),
                      km: pro.distanceKm,
                    })}
                    aria-pressed={isSelected}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold shadow-md",
                        isSelected
                          ? "bg-primary text-primary-foreground ring-2 ring-white"
                          : "bg-white text-primary",
                      )}
                    >
                      {professionalInitials(pro.name)}
                    </span>
                    <span className="mt-0.5 h-0 w-0 border-x-[5px] border-t-[6px] border-x-transparent border-t-white" />
                  </button>
                );
              })}
            </div>
            {selected ? (
              <ProfessionalCard
                pro={selected}
                selected
                onSelect={() => setSelectedId(selected.id)}
              />
            ) : (
              <EmptyState />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-3">
      <p className="mb-2 text-caption font-semibold uppercase tracking-wide text-muted">
        {label}
      </p>
      <div
        className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="group"
        aria-label={label}
      >
        {children}
      </div>
    </div>
  );
}

function EmptyState() {
  const t = useT();
  return (
    <Card>
      <p className="text-subhead font-semibold">{t("search.emptyTitle")}</p>
      <p className="mt-1 text-footnote text-muted">{t("search.emptyBody")}</p>
    </Card>
  );
}

"use client";

import { EmptyJobsState } from "@/components/jobs/empty-jobs-state";
import { LowCreditsWarning } from "@/components/credits/low-credits-warning";
import { useCredits } from "@/components/credits/credits-provider";
import { useT } from "@/components/i18n/locale-provider";
import { MapPinIcon } from "@/components/icons";
import { SubmitOfferModal } from "@/components/pro/submit-offer-modal";
import { Badge, Button, Card, ScreenHeader } from "@/components/ui";
import { OFFER_CREDIT_COST, offerCreditCost } from "@/lib/credits";
import type { GeoPoint } from "@/lib/geo/haversine";
import { submitOfferAction } from "@/lib/jobs/actions";
import { useOpenJobs } from "@/lib/jobs/use-open-jobs";
import { cn } from "@/lib/cn";
import type { NearbyJob } from "@/types/jobs";
import Link from "next/link";
import { useState } from "react";

function preview(text: string, max = 110) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

export function NearbyJobsFeed({
  jobs: initialJobs,
  offeredJobIds = [],
  origin = null,
}: {
  jobs: NearbyJob[];
  offeredJobIds?: string[];
  origin?: GeoPoint | null;
}) {
  const t = useT();
  const jobs = useOpenJobs(initialJobs, origin);
  const { balance, spendOffer } = useCredits();
  const [offeredIds, setOfferedIds] = useState<string[]>(offeredJobIds);
  const [selected, setSelected] = useState<NearbyJob | null>(null);
  const [offerError, setOfferError] = useState("");
  const canAffordOffer = balance >= OFFER_CREDIT_COST;

  return (
    <div className="flex flex-col gap-4 px-5">
      <ScreenHeader
        eyebrow={t("nearbyJobs.eyebrow")}
        title={t("nearbyJobs.title")}
        action={
          <Link
            href="/pro/credits"
            className="rounded-full bg-fill px-3 py-1 text-caption font-semibold text-label"
          >
            {t("nearbyJobs.credits", { n: balance })}
          </Link>
        }
      />
      <LowCreditsWarning />
      {offerError ? (
        <p className="rounded-lg bg-danger/10 px-3 py-2 text-footnote text-danger">
          {offerError}
        </p>
      ) : null}
      {jobs.length === 0 ? (
        <EmptyJobsState />
      ) : (
        <ul className="flex flex-col gap-4">
          {jobs.map((job) => (
            <li key={job.id}>
              <NearbyJobCard
                job={job}
                offered={offeredIds.includes(job.id)}
                canAfford={canAffordOffer}
                onSubmit={() => setSelected(job)}
              />
            </li>
          ))}
        </ul>
      )}
      {selected ? (
        <SubmitOfferModal
          job={selected}
          credits={balance}
          onClose={() => setSelected(null)}
          onSubmitted={async (featured, draft) => {
            const result = await submitOfferAction({
              jobId: selected.id,
              price: Number(draft.price),
              availableDate: draft.date,
              duration: draft.duration,
              message: draft.message,
              featured,
            });
            if (!result.ok) {
              setOfferError(result.error);
              return false;
            }
            const ok = spendOffer(selected.title, featured);
            if (ok) setOfferedIds((current) => [...current, selected.id]);
            setOfferError("");
            setSelected(null);
            return true;
          }}
        />
      ) : null}
    </div>
  );
}

function NearbyJobCard({
  job,
  offered,
  canAfford,
  onSubmit,
}: {
  job: NearbyJob;
  offered: boolean;
  canAfford: boolean;
  onSubmit: () => void;
}) {
  const t = useT();
  return (
    <Card className="overflow-hidden p-0">
      {job.photos.length ? (
        <ul className="flex gap-px overflow-x-auto snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {job.photos.map((photo) => (
            <li
              key={photo.src}
              className={
                job.photos.length === 1
                  ? "w-full"
                  : "w-[78%] shrink-0 snap-start"
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.alt}
                className="h-36 w-full object-cover"
              />
            </li>
          ))}
        </ul>
      ) : null}
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-body font-semibold">{job.title}</p>
            <p className="mt-1 text-footnote font-medium text-label">
              {job.category || t("category.Other")}
            </p>
          </div>
          {job.emergency ? (
            <Badge className="shrink-0 bg-danger/12 text-danger">{t("common.emergency")}</Badge>
          ) : null}
        </div>
        <p className="text-footnote leading-5 text-label">
          {preview(job.description)}
        </p>
        <p className="inline-flex items-start gap-1 text-footnote text-label">
          <MapPinIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{job.address}</span>
        </p>
        <p className="text-subhead font-semibold">
          {job.distanceKm != null
            ? t("common.km", { n: job.distanceKm })
            : t("nearbyJobs.distanceUnknown")}
        </p>
        <p className="text-caption text-muted">
          {t("proHome.posted", { when: job.posted })}
        </p>
        {job.budget ? (
          <p
            className={cn(
              "text-subhead font-semibold",
              job.emergency && "text-danger",
            )}
          >
            {job.budget}
          </p>
        ) : null}
        {offered ? (
          <Badge className="self-start bg-success-soft text-success">
            {t("nearbyJobs.offerSent")}
          </Badge>
        ) : (
          <Button
            className="mt-1 w-full"
            onClick={onSubmit}
            disabled={!canAfford}
          >
            {canAfford
              ? t("nearbyJobs.submitOffer", { n: offerCreditCost(false) })
              : t("nearbyJobs.notEnough")}
          </Button>
        )}
      </div>
    </Card>
  );
}

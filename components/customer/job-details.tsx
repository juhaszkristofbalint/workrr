"use client";

import { JobPhotoGallery } from "@/components/customer/job-photo-gallery";
import { useLocale, useT } from "@/components/i18n/locale-provider";
import { MapPinIcon, StarIcon } from "@/components/icons";
import { Badge, Button, Card } from "@/components/ui";
import { acceptOfferAction } from "@/lib/jobs/actions";
import { jobStatusLabel } from "@/lib/i18n/translate";
import { professionalInitials } from "@/lib/search/professionals";
import { cn } from "@/lib/cn";
import type { CustomerJob } from "@/types/jobs";

const statusTone: Record<string, string> = {
  open: "bg-accent/15 text-primary",
  matched: "bg-success-soft text-success",
  "en route": "bg-warning-soft text-warning",
};

export function JobDetails({
  job,
  justAccepted,
}: {
  job: CustomerJob;
  justAccepted?: boolean;
}) {
  const t = useT();
  const { locale } = useLocale();
  const accepted = job.offers.find((offer) => offer.accepted);

  return (
    <div className="flex flex-col gap-6 px-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-footnote font-medium text-muted">{job.category}</p>
          <h1 className="mt-1 text-large-title font-bold tracking-tight">
            {job.title}
          </h1>
          <p className="mt-1 text-footnote text-muted">{job.submittedAt}</p>
        </div>
        <Badge className={cn("capitalize shrink-0", statusTone[job.status])}>
          {jobStatusLabel(locale, job.status)}
        </Badge>
      </div>

      {justAccepted && accepted ? (
        <p className="rounded-lg bg-success-soft px-3 py-2 text-footnote text-success">
          {t("jobDetails.acceptedNotice", { name: accepted.professionalName })}
        </p>
      ) : null}

      <JobPhotoGallery photos={job.photos} />

      <section>
        <h2 className="text-body font-semibold">{t("jobDetails.description")}</h2>
        <p className="mt-2 text-subhead leading-6 text-label">{job.description}</p>
      </section>

      <section>
        <h2 className="text-body font-semibold">{t("jobDetails.address")}</h2>
        <Card className="mt-2 flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MapPinIcon className="h-5 w-5" />
          </span>
          <p className="text-subhead font-medium">{job.address}</p>
        </Card>
      </section>

      <section aria-labelledby="timeline-heading">
        <h2 id="timeline-heading" className="text-body font-semibold">
          {t("jobDetails.timeline")}
        </h2>
        <ol className="mt-4 flex flex-col">
          {job.timeline.map((step, index) => {
            const last = index === job.timeline.length - 1;
            return (
              <li key={step.id} className="flex gap-3">
                <div className="flex w-5 flex-col items-center">
                  <span
                    className={cn(
                      "mt-0.5 h-3.5 w-3.5 rounded-full",
                      step.state === "done" && "bg-primary",
                      step.state === "current" && "bg-primary ring-4 ring-accent/40",
                      step.state === "upcoming" && "bg-separator",
                    )}
                  />
                  {last ? null : (
                    <span
                      className={cn(
                        "w-0.5 flex-1",
                        step.state === "upcoming" ? "bg-separator" : "bg-primary/40",
                      )}
                    />
                  )}
                </div>
                <div className={cn("pb-5", last && "pb-0")}>
                  <p
                    className={cn(
                      "text-subhead font-semibold",
                      step.state === "upcoming" && "text-muted",
                    )}
                  >
                    {t(`timeline.${step.id}`)}
                  </p>
                  <p className="text-caption text-muted">
                    {step.at || t("jobDetails.waiting")}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="offers-heading" className="pb-2">
        <div className="mb-3 flex items-end justify-between">
          <h2 id="offers-heading" className="text-body font-semibold">
            {t("jobDetails.offers")}
          </h2>
          <p className="text-footnote text-muted">
            {t("jobDetails.offersFrom", { n: job.offers.length })}
          </p>
        </div>
        <ul className="flex flex-col gap-3">
          {job.offers.map((offer) => (
            <li key={offer.id}>
              <Card className={cn(offer.accepted && "ring-2 ring-primary")}>
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/12 text-footnote font-bold text-primary">
                    {professionalInitials(offer.professionalName)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-subhead font-semibold">
                        {offer.professionalName}
                      </p>
                      <p className="text-title font-bold tabular-nums text-foreground">
                        ${offer.price}
                      </p>
                    </div>
                    <p className="mt-0.5 inline-flex items-center gap-1 text-footnote text-muted">
                      <StarIcon className="h-3.5 w-3.5 text-warning" />
                      {offer.rating.toFixed(1)}
                      <span>({offer.reviews})</span>
                    </p>
                    <p className="mt-2 text-footnote font-medium text-label">
                      {t("jobDetails.available", { when: offer.availableDate })}
                    </p>
                    <p className="mt-2 text-footnote leading-5 text-muted">
                      {offer.message}
                    </p>
                    {offer.accepted ? (
                      <Badge className="mt-3 bg-success-soft text-success">
                        {t("jobDetails.accepted")}
                      </Badge>
                    ) : (
                      <form action={acceptOfferAction} className="mt-3">
                        <input type="hidden" name="jobId" value={job.id} />
                        <input type="hidden" name="offerId" value={offer.id} />
                        <Button
                          type="submit"
                          size="md"
                          className="w-full"
                          disabled={Boolean(accepted)}
                        >
                          {t("jobDetails.accept")}
                        </Button>
                      </form>
                    )}
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

"use client";

import { CreditsBalanceCard } from "@/components/credits/credits-balance-card";
import { EmptyJobsState } from "@/components/jobs/empty-jobs-state";
import { LowCreditsWarning } from "@/components/credits/low-credits-warning";
import { useLocale, useT } from "@/components/i18n/locale-provider";
import { MapPinIcon, StarIcon } from "@/components/icons";
import { Badge, buttonClassName, Card } from "@/components/ui";
import { proDashboardStats } from "@/lib/data/marketplace";
import { jobStatusLabel } from "@/lib/i18n/translate";
import { cn } from "@/lib/cn";
import type { GeoPoint } from "@/lib/geo/haversine";
import { useOpenJobs } from "@/lib/jobs/use-open-jobs";
import type { JobListRow, NearbyJob } from "@/types/jobs";
import Link from "next/link";

const jobStatusTone: Record<string, string> = {
  matched: "bg-accent/15 text-primary",
  accepted: "bg-accent/15 text-primary",
  "en route": "bg-warning-soft text-warning",
  "in progress": "bg-success-soft text-success",
};

export type ProNotificationItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
  unread: boolean;
};

export function ProDashboard({
  name,
  trade,
  nearbyJobs: initialNearbyJobs,
  origin = null,
  activeJobs,
  notifications,
}: {
  name: string;
  trade: string;
  nearbyJobs: NearbyJob[];
  origin?: GeoPoint | null;
  activeJobs: JobListRow[];
  notifications: ProNotificationItem[];
}) {
  const t = useT();
  const { locale } = useLocale();
  const nearbyJobs = useOpenJobs(initialNearbyJobs, origin);
  const stats = proDashboardStats;
  const unread = notifications.filter((item) => item.unread).length;
  const displayName = name || t("proHome.fallbackName");
  const displayTrade = trade || t("proHome.fallbackTrade");

  return (
    <div className="flex flex-col gap-6">
      <header className="px-5">
        <p className="text-footnote font-medium text-muted">{t("proHome.date")}</p>
        <h1 className="mt-1 text-large-title font-bold tracking-tight">
          {t("proHome.title")}
        </h1>
        <p className="mt-1 text-body text-label">
          {displayName} · {displayTrade}
        </p>
      </header>

      <div className="px-5">
        <LowCreditsWarning />
      </div>

      <section className="px-5" aria-labelledby="nearby-jobs-heading">
        <div className="mb-3 flex items-end justify-between">
          <h2 id="nearby-jobs-heading" className="text-body font-semibold">
            {t("proHome.nearby")}
          </h2>
          <Link
            href="/pro/requests"
            className="text-footnote font-semibold text-primary"
          >
            {t("common.seeAll")}
          </Link>
        </div>
        {nearbyJobs.length === 0 ? (
          <EmptyJobsState />
        ) : (
          <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {nearbyJobs.map((job) => (
              <li key={job.id} className="w-[240px] shrink-0 snap-start">
                <Link href="/pro/requests">
                  <Card className="h-full overflow-hidden p-0 active:scale-[0.99]">
                    {job.photos[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={job.photos[0].src}
                        alt=""
                        className="h-28 w-full object-cover"
                      />
                    ) : null}
                    <div className="p-3.5">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-subhead font-semibold">{job.title}</p>
                        {job.emergency ? (
                          <Badge className="shrink-0 bg-danger/12 text-danger">
                            {t("common.emergency")}
                          </Badge>
                        ) : null}
                      </div>
                      <p className="mt-1 text-footnote text-muted">{job.category}</p>
                      <p className="mt-3 inline-flex items-start gap-1 text-caption text-muted">
                        <MapPinIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        {job.address}
                      </p>
                      <p className="mt-2 text-caption font-semibold text-label">
                        {job.distanceKm != null
                          ? t("common.km", { n: job.distanceKm })
                          : t("nearbyJobs.distanceUnknown")}
                      </p>
                      <p className="mt-2 text-caption text-muted">
                        {t("proHome.posted", { when: job.posted })}
                      </p>
                      {job.budget ? (
                        <p className="mt-2 text-subhead font-semibold">{job.budget}</p>
                      ) : null}
                    </div>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="px-5" aria-labelledby="credits-heading">
        <CreditsBalanceCard />
      </section>

      <section className="px-5" aria-labelledby="alerts-heading">
        <div className="mb-3 flex items-end justify-between">
          <h2 id="alerts-heading" className="text-body font-semibold">
            {t("proHome.notifications")}
          </h2>
          <Badge className="bg-primary/12 text-primary">
            {t("proHome.newCount", { n: unread })}
          </Badge>
        </div>
        {notifications.length === 0 ? (
          <Card>
            <p className="px-2 py-6 text-center text-footnote text-muted">
              {t("proHome.notifications")}
            </p>
          </Card>
        ) : (
          <ul className="flex flex-col gap-3">
            {notifications.map((item) => (
              <li key={item.id}>
                <Card
                  className={cn(
                    "flex items-start gap-3",
                    item.unread && "ring-1 ring-primary/25",
                  )}
                >
                  <span
                    className={cn(
                      "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                      item.unread ? "bg-primary" : "bg-separator",
                    )}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-subhead font-semibold">{item.title}</p>
                    <p className="mt-0.5 text-footnote text-muted">{item.detail}</p>
                  </div>
                  <p className="shrink-0 text-caption text-muted">{item.time}</p>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="px-5" aria-labelledby="active-heading">
        <div className="mb-3 flex items-end justify-between">
          <h2 id="active-heading" className="text-body font-semibold">
            {t("proHome.active")}
          </h2>
          <Link
            href="/pro/schedule"
            className="text-footnote font-semibold text-primary"
          >
            {t("tabs.schedule")}
          </Link>
        </div>
        {activeJobs.length === 0 ? (
          <EmptyJobsState />
        ) : (
          <ul className="flex flex-col gap-3">
            {activeJobs.map((job) => (
              <li key={job.id}>
                <Card className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-subhead font-semibold">{job.title}</p>
                    <p className="text-footnote text-muted">
                      {job.customerName} · {job.posted}
                    </p>
                  </div>
                  <Badge className={cn("capitalize", jobStatusTone[job.status])}>
                    {jobStatusLabel(locale, job.status)}
                  </Badge>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="px-5" aria-labelledby="earnings-heading">
        <h2 id="earnings-heading" className="mb-3 text-body font-semibold">
          {t("proHome.earnings")}
        </h2>
        <Card>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-caption font-semibold uppercase tracking-wide text-muted">
                {t("proHome.thisWeek")}
              </p>
              <p className="mt-1 text-title font-bold tabular-nums">
                ${stats.weekEarnings}
              </p>
              <p className="text-caption text-muted">
                {t("proHome.jobsCount", { n: stats.jobsThisWeek })}
              </p>
            </div>
            <div>
              <p className="text-caption font-semibold uppercase tracking-wide text-muted">
                {t("proHome.thisMonth")}
              </p>
              <p className="mt-1 text-title font-bold tabular-nums">
                ${stats.monthEarnings}
              </p>
              <p className="text-caption text-muted">
                {t("proHome.jobsCount", { n: stats.jobsThisMonth })}
              </p>
            </div>
          </div>
          <p className="mt-4 rounded-lg bg-fill px-3 py-2 text-footnote text-label">
            {t("proHome.pending", { n: stats.pendingPayout })}
          </p>
        </Card>
      </section>

      <section className="px-5 pb-2" aria-labelledby="rating-heading">
        <h2 id="rating-heading" className="mb-3 text-body font-semibold">
          {t("proHome.rating")}
        </h2>
        <Card>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-large-title font-bold tabular-nums">
                {stats.rating.toFixed(1)}
              </p>
              <p className="inline-flex items-center gap-1 text-footnote font-semibold text-label">
                <StarIcon className="h-4 w-4 text-warning" />
                {t("common.reviews", { n: stats.reviews })}
              </p>
            </div>
            <div className="min-w-0 flex-1">
              <div className="h-2 overflow-hidden rounded-full bg-fill">
                <div
                  className="h-full rounded-full bg-warning"
                  style={{ width: `${stats.hireAgainPercent}%` }}
                />
              </div>
              <p className="mt-2 text-footnote text-muted">
                {t("proHome.hireAgain", { n: stats.hireAgainPercent })}
              </p>
            </div>
          </div>
          <Link
            href="/pro/profile"
            className={buttonClassName({
              variant: "outline",
              className: "mt-4 w-full",
            })}
          >
            {t("proHome.viewProfile")}
          </Link>
        </Card>
      </section>
    </div>
  );
}

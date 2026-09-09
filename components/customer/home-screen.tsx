"use client";

import { CameraShortcut } from "@/components/customer/camera-shortcut";
import { useLocale, useT } from "@/components/i18n/locale-provider";
import { MapPinIcon, PhoneIcon } from "@/components/icons";
import { Badge, buttonClassName, Card } from "@/components/ui";
import { jobStatusLabel } from "@/lib/i18n/translate";
import {
  emergencyServices,
  nearbyProfessionals,
  recentCustomerRequests,
} from "@/lib/data/marketplace";
import Link from "next/link";

const statusTone: Record<string, string> = {
  open: "bg-accent/15 text-primary",
  matched: "bg-success-soft text-success",
  "en route": "bg-warning-soft text-warning",
};

export function CustomerHome({ name }: { name: string }) {
  const t = useT();
  const { locale } = useLocale();
  const greetingName = name || t("customerHome.fallbackName");

  return (
    <div className="flex flex-col gap-6">
      <header className="px-5">
        <p className="text-footnote font-medium text-muted">
          {t("customerHome.date")}
        </p>
        <h1 className="mt-1 text-large-title font-bold tracking-tight">
          {t("customerHome.greeting")}
        </h1>
        <p className="mt-1 text-body text-label">{greetingName}</p>
      </header>

      <section className="flex gap-3 px-5" aria-label={t("customerHome.requestAria")}>
        <Link
          href="/customer/jobs/new"
          className={buttonClassName({
            size: "lg",
            className:
              "min-h-[72px] flex-1 flex-col rounded-xl text-body shadow-md",
          })}
        >
          {t("customerHome.report")}
        </Link>
        <CameraShortcut />
      </section>

      <section className="px-5" aria-labelledby="recent-heading">
        <div className="mb-3 flex items-end justify-between">
          <h2 id="recent-heading" className="text-body font-semibold">
            {t("customerHome.recent")}
          </h2>
          <Link
            href="/customer/jobs"
            className="text-footnote font-semibold text-primary"
          >
            {t("common.seeAll")}
          </Link>
        </div>
        <ul className="flex flex-col gap-3">
          {recentCustomerRequests.map((request) => (
            <li key={request.id}>
              <Link href={`/customer/jobs/${request.id}`}>
                <Card className="flex items-start justify-between gap-3 active:scale-[0.99]">
                  <div>
                    <p className="text-subhead font-semibold">{request.title}</p>
                    <p className="text-footnote text-muted">
                      {request.trade} · {request.when}
                    </p>
                  </div>
                  <Badge className={statusTone[request.status] ?? ""}>
                    {jobStatusLabel(locale, request.status)}
                  </Badge>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="nearby-heading">
        <div className="mb-3 flex items-end justify-between px-5">
          <h2 id="nearby-heading" className="text-body font-semibold">
            {t("customerHome.nearby")}
          </h2>
          <Link
            href="/customer/search"
            className="text-footnote font-semibold text-primary"
          >
            {t("common.search")}
          </Link>
        </div>
        <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {nearbyProfessionals.map((pro) => (
            <li key={pro.id} className="w-[220px] shrink-0 snap-start">
              <Card className="h-full">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-footnote font-semibold text-primary">
                  {pro.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </div>
                <p className="mt-3 text-subhead font-semibold">{pro.name}</p>
                <p className="text-footnote text-muted">{pro.trade}</p>
                <p className="mt-2 inline-flex items-center gap-1 text-caption text-muted">
                  <MapPinIcon className="h-3.5 w-3.5" />
                  {t("common.km", { n: pro.distanceKm })} · {pro.rating}
                </p>
                <p className="mt-2 text-subhead font-semibold tabular-nums">
                  {t("common.perHour", { n: pro.hourlyRate })}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-5" aria-labelledby="emergency-heading">
        <h2 id="emergency-heading" className="mb-3 text-body font-semibold">
          {t("customerHome.emergency")}
        </h2>
        <ul className="flex flex-col gap-3">
          {emergencyServices.map((service) => (
            <li key={service.id}>
              <a href={`tel:${service.tel}`}>
                <Card className="flex items-center gap-3 active:scale-[0.99]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-danger/10 text-danger">
                    <PhoneIcon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-subhead font-semibold">
                      {t(`emergency.${service.id}Name`)}
                    </span>
                    <span className="block text-footnote text-muted">
                      {t(`emergency.${service.id}Detail`)}
                    </span>
                  </span>
                  <span className="text-footnote font-semibold text-primary">
                    {t("common.call")}
                  </span>
                </Card>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

"use client";

import { LanguageToggle } from "@/components/i18n/language-toggle";
import { useT } from "@/components/i18n/locale-provider";
import { MapPinIcon, StarIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge, Button, buttonClassName, Card, ScreenHeader } from "@/components/ui";
import { signOutAction } from "@/lib/auth/actions";
import { professionalProfile } from "@/lib/data/pro-profile";
import { professionalInitials } from "@/lib/search/professionals";
import type { SessionUser } from "@/types/auth";
import Link from "next/link";

export function ProfessionalProfile({ user }: { user: SessionUser }) {
  const t = useT();
  const profile = professionalProfile;
  const displayName = user.displayName || profile.companyName;
  const email = user.email || profile.email;
  const trade = user.trade || profile.trade;

  return (
    <div className="flex flex-col gap-6">
      <div className="px-5">
        <ScreenHeader eyebrow={t("profile.publicEyebrow")} title={t("profile.title")} />
      </div>

      <section className="px-5" aria-label="Company">
        <Card className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.logo}
            alt={t("proProfile.logoAlt", { name: profile.companyName })}
            className="h-16 w-16 rounded-2xl bg-secondary object-cover shadow-sm"
          />
          <div className="min-w-0">
            <p className="text-title font-semibold">{profile.companyName}</p>
            <p className="text-footnote text-muted">
              {displayName} · {trade}
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-caption text-muted">
              <MapPinIcon className="h-3.5 w-3.5" />
              {profile.city}
            </p>
          </div>
        </Card>
      </section>

      <section className="px-5" aria-labelledby="gallery-heading">
        <h2 id="gallery-heading" className="mb-3 text-body font-semibold">
          {t("proProfile.gallery")}
        </h2>
        <ul className="grid grid-cols-2 gap-2">
          {profile.gallery.map((photo) => (
            <li key={photo.src} className="overflow-hidden rounded-xl bg-fill">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.alt}
                className="h-28 w-full object-cover"
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="px-5" aria-labelledby="services-heading">
        <h2 id="services-heading" className="mb-3 text-body font-semibold">
          {t("proProfile.services")}
        </h2>
        <div className="flex flex-wrap gap-2">
          {profile.services.map((service) => (
            <Badge key={service}>{service}</Badge>
          ))}
        </div>
      </section>

      <section className="px-5" aria-labelledby="about-heading">
        <h2 id="about-heading" className="mb-3 text-body font-semibold">
          {t("proProfile.about")}
        </h2>
        <Card>
          <p className="text-subhead leading-6 text-label">{profile.about}</p>
        </Card>
      </section>

      <section className="px-5" aria-labelledby="ratings-heading">
        <h2 id="ratings-heading" className="mb-3 text-body font-semibold">
          {t("proProfile.ratings")}
        </h2>
        <Card className="flex items-center gap-4">
          <div>
            <p className="text-large-title font-bold tabular-nums">
              {profile.rating.toFixed(1)}
            </p>
            <p className="inline-flex items-center gap-1 text-footnote font-semibold text-label">
              <StarIcon className="h-4 w-4 text-warning" />
              {t("common.reviews", { n: profile.reviewsCount })}
            </p>
          </div>
          <div className="min-w-0 flex-1">
            <div className="h-2 overflow-hidden rounded-full bg-fill">
              <div
                className="h-full rounded-full bg-warning"
                style={{ width: `${profile.hireAgainPercent}%` }}
              />
            </div>
            <p className="mt-2 text-footnote text-muted">
              {t("proProfile.hireAgain", { n: profile.hireAgainPercent })}
            </p>
          </div>
        </Card>
      </section>

      <section className="px-5" aria-labelledby="reviews-heading">
        <h2 id="reviews-heading" className="mb-3 text-body font-semibold">
          {t("proProfile.reviews")}
        </h2>
        <ul className="flex flex-col gap-3">
          {profile.reviews.map((review) => (
            <li key={review.id}>
              <Card>
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/12 text-caption font-bold text-primary">
                    {professionalInitials(review.customerName)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-subhead font-semibold">
                        {review.customerName}
                      </p>
                      <p className="inline-flex items-center gap-0.5 text-footnote font-semibold">
                        <StarIcon className="h-3.5 w-3.5 text-warning" />
                        {review.rating.toFixed(1)}
                      </p>
                    </div>
                    <p className="text-caption text-muted">{review.date}</p>
                    <p className="mt-2 text-footnote leading-5 text-label">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-5" aria-labelledby="certs-heading">
        <h2 id="certs-heading" className="mb-3 text-body font-semibold">
          {t("proProfile.certificates")}
        </h2>
        <ul className="flex flex-col gap-3">
          {profile.certificates.map((item) => (
            <li key={item.id}>
              <Card>
                <p className="text-subhead font-semibold">{item.name}</p>
                <p className="text-footnote text-muted">
                  {item.issuer} · {item.year}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-5" aria-labelledby="hours-heading">
        <h2 id="hours-heading" className="mb-3 text-body font-semibold">
          {t("proProfile.hours")}
        </h2>
        <Card className="flex flex-col gap-3">
          {profile.hours.map((row) => (
            <div
              key={row.day}
              className="flex items-center justify-between gap-3 text-subhead"
            >
              <p className="font-medium text-label">
                {row.day === "Mon–Fri"
                  ? t("proProfile.monFri")
                  : row.day === "Saturday"
                    ? t("proProfile.saturday")
                    : row.day === "Sunday"
                      ? t("proProfile.sunday")
                      : row.day}
              </p>
              <p className="tabular-nums text-muted">
                {row.hours === "Emergency only"
                  ? t("proProfile.emergencyOnly")
                  : row.hours}
              </p>
            </div>
          ))}
        </Card>
      </section>

      <section className="px-5" aria-labelledby="contact-heading">
        <h2 id="contact-heading" className="mb-3 text-body font-semibold">
          {t("proProfile.contact")}
        </h2>
        <Card className="flex flex-col gap-3">
          <p>
            <span className="block text-caption font-semibold uppercase tracking-wide text-muted">
              {t("proProfile.phone")}
            </span>
            <a href={`tel:${profile.phone}`} className="text-subhead font-medium text-primary">
              {profile.phone}
            </a>
          </p>
          <p>
            <span className="block text-caption font-semibold uppercase tracking-wide text-muted">
              {t("proProfile.email")}
            </span>
            <a href={`mailto:${email}`} className="text-subhead font-medium text-primary">
              {email}
            </a>
          </p>
          <p>
            <span className="block text-caption font-semibold uppercase tracking-wide text-muted">
              {t("proProfile.address")}
            </span>
            <span className="text-subhead text-label">{profile.address}</span>
          </p>
        </Card>
      </section>

      <div className="flex flex-col gap-4 px-5 pb-2">
        <Link
          href="/pro/credits"
          className={buttonClassName({ variant: "outline", className: "w-full" })}
        >
          {t("proProfile.wallet")}
        </Link>
        <Card>
          <p className="mb-3 text-footnote font-medium text-muted">
            {t("language.title")}
          </p>
          <LanguageToggle />
        </Card>
        <Card>
          <p className="mb-3 text-footnote font-medium text-muted">
            {t("common.appearance")}
          </p>
          <ThemeToggle />
        </Card>
        <form action={signOutAction}>
          <Button type="submit" variant="outline" className="w-full">
            {t("common.signOut")}
          </Button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { Button, Field, Input, Textarea } from "@/components/ui";
import { useT } from "@/components/i18n/locale-provider";
import { offerCreditCost } from "@/lib/credits";
import { cn } from "@/lib/cn";
import type { NearbyJob } from "@/types/jobs";
import { useEffect, useId, useMemo, useState } from "react";

const DURATION_KEYS = [
  { value: "30 min", key: "offer.d30" },
  { value: "1 hour", key: "offer.d1h" },
  { value: "2 hours", key: "offer.d2h" },
  { value: "4 hours", key: "offer.d4h" },
  { value: "Full day", key: "offer.dDay" },
] as const;

type OfferDraft = {
  price: string;
  date: string;
  duration: string;
  message: string;
};

export function SubmitOfferModal({
  job,
  credits,
  onClose,
  onSubmitted,
}: {
  job: NearbyJob;
  credits: number;
  onClose: () => void;
  onSubmitted: (
    featured: boolean,
    draft: OfferDraft,
  ) => boolean | Promise<boolean>;
}) {
  const t = useT();
  const titleId = useId();
  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [featured, setFeatured] = useState(false);
  const cost = offerCreditCost(featured);
  const remainingAfter = credits - cost;
  const canAfford = remainingAfter >= 0;
  const [step, setStep] = useState<"form" | "confirm">("form");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [draft, setDraft] = useState<OfferDraft>({
    price: "",
    date: minDate,
    duration: "2 hours",
    message: "",
  });

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function review() {
    const price = Number(draft.price);
    if (
      !Number.isFinite(price) ||
      price <= 0 ||
      !draft.date ||
      !draft.duration ||
      !draft.message.trim()
    ) {
      setError(t("offer.formError"));
      return;
    }
    if (!canAfford) {
      setError(t("offer.needCredits", { n: cost }));
      return;
    }
    setError("");
    setStep("confirm");
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/50 sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[88dvh] w-full max-w-[390px] flex-col rounded-t-2xl bg-background shadow-float sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 px-5 pt-5">
          <div>
            <p className="text-footnote font-medium text-muted">{t("offer.title")}</p>
            <h2 id={titleId} className="text-title font-bold tracking-tight">
              {job.title}
            </h2>
          </div>
          <p className="shrink-0 rounded-full bg-fill px-3 py-1 text-caption font-semibold text-label">
            {t("nearbyJobs.credits", { n: credits })}
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {step === "form" ? (
            <div className="flex flex-col gap-4">
              <p className="rounded-lg bg-fill px-3 py-2 text-footnote text-label">
                {t("offer.cost", {
                  n: cost,
                  rest: canAfford
                    ? t("offer.remaining", { n: remainingAfter })
                    : t("offer.notEnough"),
                })}
              </p>
              <div className="flex items-center justify-between gap-3 rounded-xl border border-separator px-4 py-3">
                <div>
                  <p className="text-subhead font-semibold">{t("offer.featured")}</p>
                  <p className="text-footnote text-muted">
                    {t("offer.featuredHint")}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={featured}
                  onClick={() => setFeatured((current) => !current)}
                  className={cn(
                    "relative h-8 w-14 shrink-0 rounded-full transition-colors",
                    featured ? "bg-primary" : "bg-fill",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow-sm transition-transform",
                      featured && "translate-x-6",
                    )}
                  />
                </button>
              </div>
              {error ? (
                <p className="rounded-lg bg-danger/10 px-3 py-2 text-footnote text-danger">
                  {error}
                </p>
              ) : null}
              <Field label={t("offer.price")} hint={t("offer.priceHint")}>
                <Input
                  type="number"
                  min={1}
                  inputMode="decimal"
                  value={draft.price}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, price: event.target.value }))
                  }
                  placeholder="140"
                />
              </Field>
              <Field label={t("offer.date")}>
                <Input
                  type="date"
                  min={minDate}
                  value={draft.date}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, date: event.target.value }))
                  }
                />
              </Field>
              <Field label={t("offer.duration")}>
                <select
                  value={draft.duration}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      duration: event.target.value,
                    }))
                  }
                  className="min-h-11 w-full rounded-lg border border-separator bg-fill px-4 text-body outline-none focus:border-primary focus:ring-2 focus:ring-accent/40"
                >
                  {DURATION_KEYS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {t(item.key)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t("offer.message")}>
                <Textarea
                  value={draft.message}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      message: event.target.value,
                    }))
                  }
                  placeholder={t("offer.messagePlaceholder")}
                />
              </Field>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-subhead font-semibold">{t("offer.confirmTitle")}</p>
              <p className="text-footnote text-muted">
                {t("offer.confirmBody", {
                  n: cost,
                  featured: featured ? t("offer.featuredDeduct") : "",
                  left: remainingAfter,
                })}
              </p>
              <dl className="rounded-xl bg-fill px-4 py-3 text-footnote">
                <div className="flex justify-between gap-3 py-1">
                  <dt className="text-muted">{t("offer.priceLabel")}</dt>
                  <dd className="font-semibold">${draft.price}</dd>
                </div>
                <div className="flex justify-between gap-3 py-1">
                  <dt className="text-muted">{t("offer.available")}</dt>
                  <dd className="font-semibold">{draft.date}</dd>
                </div>
                <div className="flex justify-between gap-3 py-1">
                  <dt className="text-muted">{t("offer.durationLabel")}</dt>
                  <dd className="font-semibold">
                    {t(
                      DURATION_KEYS.find((item) => item.value === draft.duration)
                        ?.key ?? "offer.d2h",
                    )}
                  </dd>
                </div>
                <div className="flex justify-between gap-3 py-1">
                  <dt className="text-muted">{t("offer.placement")}</dt>
                  <dd className="font-semibold">
                    {featured
                      ? t("offer.featuredPlacement")
                      : t("offer.standardPlacement")}
                  </dd>
                </div>
                <div className="pt-2">
                  <dt className="text-muted">{t("offer.message")}</dt>
                  <dd className="mt-1 text-label">{draft.message}</dd>
                </div>
              </dl>
            </div>
          )}
        </div>

        <div className="flex gap-3 px-5 pb-[max(1.25rem,var(--safe-bottom))] pt-1">
          {step === "form" ? (
            <>
              <Button variant="outline" className="flex-1" onClick={onClose}>
                {t("common.cancel")}
              </Button>
              <Button className="flex-1" onClick={review} disabled={!canAfford}>
                {t("offer.review")}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep("form")}
              >
                {t("offer.edit")}
              </Button>
              <Button
                className="flex-1"
                disabled={pending}
                onClick={async () => {
                  setPending(true);
                  const ok = await onSubmitted(featured, draft);
                  setPending(false);
                  if (!ok) setStep("form");
                }}
              >
                {t("offer.confirm", { n: cost })}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

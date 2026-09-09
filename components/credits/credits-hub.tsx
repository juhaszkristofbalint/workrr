"use client";

import { LowCreditsWarning } from "@/components/credits/low-credits-warning";
import { useCredits } from "@/components/credits/credits-provider";
import { useT } from "@/components/i18n/locale-provider";
import { Badge, buttonClassName, Card, ScreenHeader } from "@/components/ui";
import {
  REGISTRATION_CREDIT_BONUS,
  CREDIT_RULES,
  formatCreditDelta,
  FEATURED_OFFER_CREDIT_COST,
  OFFER_CREDIT_COST,
} from "@/lib/credits";
import { cn } from "@/lib/cn";
import Link from "next/link";

export function CreditsHub() {
  const { balance, ledger } = useCredits();
  const t = useT();
  const history = [...ledger].reverse();

  const typeLabel: Record<string, string> = {
    registration: t("credits.typeRegistration"),
    offer: t("credits.typeOffer"),
    featured: t("credits.typeFeatured"),
    purchase: t("credits.typePurchase"),
    admin: t("credits.typeAdmin"),
  };

  return (
    <div className="flex flex-col gap-6 px-5">
      <ScreenHeader eyebrow={t("credits.eyebrow")} title={t("credits.title")} />
      <LowCreditsWarning />
      <Card className="bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-md">
        <p className="text-footnote font-medium text-white/80">{t("credits.balance")}</p>
        <p className="mt-2 text-large-title font-bold tabular-nums">{balance}</p>
        <p className="mt-1 text-footnote text-white/80">
          {t("credits.perOffer", {
            offer: OFFER_CREDIT_COST,
            featured: FEATURED_OFFER_CREDIT_COST,
          })}
        </p>
        <Link
          href="/pro/credits/buy"
          className={buttonClassName({
            variant: "glass",
            className: "mt-4 w-full",
          })}
        >
          {t("credits.buy")}
        </Link>
      </Card>

      <section>
        <h2 className="mb-3 text-body font-semibold">{t("credits.how")}</h2>
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-left text-footnote">
            <thead className="bg-fill text-caption font-semibold uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-2.5 font-semibold">{t("credits.event")}</th>
                <th className="px-4 py-2.5 font-semibold">{t("credits.creditsCol")}</th>
              </tr>
            </thead>
            <tbody>
              {CREDIT_RULES.map((row) => (
                <tr key={row.event} className="border-t border-separator">
                  <td className="px-4 py-3 text-label">
                    {row.event === "Registration"
                      ? t("credits.ruleRegistration")
                      : row.event === "Send offer"
                        ? t("credits.ruleSendOffer")
                        : row.event === "Featured offer"
                          ? t("credits.ruleFeatured")
                          : t("credits.rulePurchase")}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {row.event === "Registration"
                      ? t("credits.ruleRegCredit", { n: REGISTRATION_CREDIT_BONUS })
                      : row.event === "Send offer"
                        ? t("credits.ruleOfferCredit", { n: OFFER_CREDIT_COST })
                        : row.event === "Featured offer"
                          ? t("credits.ruleFeaturedCredit", {
                              n: FEATURED_OFFER_CREDIT_COST,
                            })
                          : t("credits.rulePurchaseCredit")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>

      <section>
        <h2 className="mb-3 text-body font-semibold">{t("credits.historyTitle")}</h2>
        <ul className="flex flex-col gap-3">
          {history.map((event) => (
            <li key={event.id}>
              <Card className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-subhead font-semibold">
                    {typeLabel[event.type] ?? event.label}
                  </p>
                  <p className="text-footnote text-muted">
                    {event.type === "registration"
                      ? t("credits.welcomeBonus")
                      : event.detail}
                  </p>
                  <p className="mt-1 text-caption text-muted">
                    {event.at === "Just now" ? t("credits.justNow") : event.at}
                  </p>
                </div>
                <Badge
                  className={cn(
                    "tabular-nums",
                    event.delta > 0
                      ? "bg-success-soft text-success"
                      : "bg-danger/12 text-danger",
                  )}
                >
                  {formatCreditDelta(event.delta)}
                </Badge>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

"use client";

import { useCredits } from "@/components/credits/credits-provider";
import { useT } from "@/components/i18n/locale-provider";
import { buttonClassName } from "@/components/ui";
import { LOW_CREDITS_THRESHOLD, OFFER_CREDIT_COST } from "@/lib/credits";
import Link from "next/link";

export function LowCreditsWarning() {
  const { isLow, balance } = useCredits();
  const t = useT();
  if (!isLow) return null;

  return (
    <div className="rounded-xl bg-warning-soft px-4 py-3">
      <p className="text-subhead font-semibold text-warning">{t("credits.lowTitle")}</p>
      <p className="mt-1 text-footnote text-label">
        {t("credits.lowBody", {
          balance,
          cost: OFFER_CREDIT_COST,
          threshold: LOW_CREDITS_THRESHOLD,
        })}
      </p>
      <Link
        href="/pro/credits/buy"
        className={buttonClassName({
          size: "sm",
          className: "mt-3 bg-warning text-white",
        })}
      >
        {t("credits.buy")}
      </Link>
    </div>
  );
}

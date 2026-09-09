"use client";

import { useCredits } from "@/components/credits/credits-provider";
import { useT } from "@/components/i18n/locale-provider";
import { buttonClassName, Card } from "@/components/ui";
import {
  FEATURED_OFFER_CREDIT_COST,
  OFFER_CREDIT_COST,
} from "@/lib/credits";
import Link from "next/link";

export function CreditsBalanceCard() {
  const { balance } = useCredits();
  const t = useT();

  return (
    <Card className="bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-md">
      <p id="credits-heading" className="text-footnote font-medium text-white/80">
        {t("credits.balance")}
      </p>
      <p className="mt-2 text-large-title font-bold tabular-nums">{balance}</p>
      <p className="mt-1 text-footnote text-white/80">
        {t("credits.perOffer", {
          offer: OFFER_CREDIT_COST,
          featured: FEATURED_OFFER_CREDIT_COST,
        })}
      </p>
      <Link
        href="/pro/credits"
        className={buttonClassName({
          variant: "glass",
          size: "sm",
          className: "mt-4",
        })}
      >
        {t("credits.wallet")}
      </Link>
    </Card>
  );
}

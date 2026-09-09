"use client";

import { useCredits } from "@/components/credits/credits-provider";
import { useT } from "@/components/i18n/locale-provider";
import { Button, Card, ScreenHeader } from "@/components/ui";
import { ADMIN_GRANT_AMOUNT, CREDIT_PACKS } from "@/lib/credits";
import Link from "next/link";
import { useState } from "react";

export function PurchaseCredits() {
  const { balance, purchasePack, applyAdminGrant } = useCredits();
  const t = useT();
  const [pendingPack, setPendingPack] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  function startStripe(packId: string) {
    setPendingPack(packId);
    setMessage("");
  }

  function confirmStripe() {
    if (!pendingPack) return;
    purchasePack(pendingPack);
    setPendingPack(null);
    setMessage(t("credits.stripeDone"));
  }

  function grant() {
    applyAdminGrant();
    setMessage(t("credits.grantDone", { n: ADMIN_GRANT_AMOUNT }));
  }

  const pack = CREDIT_PACKS.find((item) => item.id === pendingPack);

  return (
    <div className="flex flex-col gap-6 px-5">
      <ScreenHeader
        eyebrow={t("credits.eyebrow")}
        title={t("credits.buyTitle")}
        action={
          <Link href="/pro/credits" className="text-footnote font-semibold text-primary">
            {t("credits.history")}
          </Link>
        }
      />
      <p className="text-subhead text-muted">
        {t("credits.balance")}{" "}
        <span className="font-semibold text-foreground">{balance}</span>
      </p>
      {message ? (
        <p className="rounded-lg bg-success-soft px-3 py-2 text-footnote text-success">
          {message}
        </p>
      ) : null}

      <ul className="flex flex-col gap-3">
        {CREDIT_PACKS.map((item) => (
          <li key={item.id}>
            <Card className="flex items-center justify-between gap-3">
              <div>
                <p className="text-subhead font-semibold">
                  {item.id === "pack-10"
                    ? t("credits.packStarter")
                    : item.id === "pack-25"
                      ? t("credits.packPopular")
                      : t("credits.packPro")}
                </p>
                <p className="text-footnote text-muted">
                  {t("credits.packCredits", { n: item.credits })}
                </p>
              </div>
              <Button onClick={() => startStripe(item.id)}>${item.price}</Button>
            </Card>
          </li>
        ))}
      </ul>

      <Card>
        <p className="text-subhead font-semibold">{t("credits.adminGrant")}</p>
        <p className="mt-1 text-footnote text-muted">{t("credits.adminHint")}</p>
        <Button variant="outline" className="mt-3 w-full" onClick={grant}>
          {t("credits.applyGrant", { n: ADMIN_GRANT_AMOUNT })}
        </Button>
      </Card>

      {pack ? (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/50 sm:items-center"
          onClick={() => setPendingPack(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="stripe-title"
            className="w-full max-w-[390px] rounded-t-2xl bg-background p-5 pb-[max(1.25rem,var(--safe-bottom))] shadow-float sm:rounded-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-footnote font-medium text-muted">{t("credits.stripe")}</p>
            <h2 id="stripe-title" className="text-title font-bold tracking-tight">
              {t("credits.pay", { n: pack.price })}
            </h2>
            <p className="mt-2 text-footnote text-muted">
              {t("credits.demoCheckout", { n: pack.credits })}
            </p>
            <div className="mt-5 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setPendingPack(null)}
              >
                {t("common.cancel")}
              </Button>
              <Button className="flex-1" onClick={confirmStripe}>
                {t("credits.payStripe")}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

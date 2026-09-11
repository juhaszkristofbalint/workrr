"use client";

import {
  ADMIN_GRANT_AMOUNT,
  CREDIT_PACKS,
  ledgerBalance,
  LOW_CREDITS_THRESHOLD,
  offerCreditCost,
  seedCreditLedger,
  type CreditEvent,
} from "@/lib/credits";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "workrr-credit-ledger-v2";

function readStoredLedger(): CreditEvent[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed as CreditEvent[];
  } catch {
    return null;
  }
}

type CreditsContextValue = {
  ledger: CreditEvent[];
  balance: number;
  isLow: boolean;
  spendOffer: (detail: string, featured: boolean) => boolean;
  purchasePack: (packId: string) => boolean;
  applyAdminGrant: () => void;
};

const CreditsContext = createContext<CreditsContextValue | null>(null);

export function CreditsProvider({ children }: { children: React.ReactNode }) {
  const [ledger, setLedger] = useState<CreditEvent[]>(seedCreditLedger);

  useEffect(() => {
    const stored = readStoredLedger();
    if (stored) setLedger(stored);
  }, []);

  const persist = useCallback((next: CreditEvent[]) => {
    setLedger(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const spendOffer = useCallback(
    (detail: string, featured: boolean) => {
      const cost = offerCreditCost(featured);
      if (ledgerBalance(ledger) < cost) return false;
      persist([
        ...ledger,
        {
          id: `cr-${Date.now()}`,
          type: featured ? "featured" : "offer",
          label: featured ? "Featured offer" : "Send offer",
          detail,
          delta: -cost,
          at: "Just now",
        },
      ]);
      return true;
    },
    [ledger, persist],
  );

  const purchasePack = useCallback(
    (packId: string) => {
      const pack = CREDIT_PACKS.find((item) => item.id === packId);
      if (!pack) return false;
      persist([
        ...ledger,
        {
          id: `cr-${Date.now()}`,
          type: "purchase",
          label: "Purchase",
          detail: `Stripe · ${pack.label} ${pack.credits} credits`,
          delta: pack.credits,
          at: "Just now",
        },
      ]);
      return true;
    },
    [ledger, persist],
  );

  const applyAdminGrant = useCallback(() => {
    persist([
      ...ledger,
      {
        id: `cr-${Date.now()}`,
        type: "admin",
        label: "Admin grant",
        detail: "WorkRR ops",
        delta: ADMIN_GRANT_AMOUNT,
        at: "Just now",
      },
    ]);
  }, [ledger, persist]);

  const balance = useMemo(() => ledgerBalance(ledger), [ledger]);

  const value = useMemo(
    () => ({
      ledger,
      balance,
      isLow: balance < LOW_CREDITS_THRESHOLD,
      spendOffer,
      purchasePack,
      applyAdminGrant,
    }),
    [applyAdminGrant, balance, ledger, purchasePack, spendOffer],
  );

  return (
    <CreditsContext.Provider value={value}>{children}</CreditsContext.Provider>
  );
}

export function useCredits() {
  const context = useContext(CreditsContext);
  if (!context) {
    throw new Error("useCredits must be used within CreditsProvider");
  }
  return context;
}

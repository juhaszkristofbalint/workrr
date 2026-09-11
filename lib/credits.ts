export const REGISTRATION_CREDIT_BONUS = 10;
export const OFFER_CREDIT_COST = 1;
export const FEATURED_OFFER_CREDIT_COST = 3;
export const LOW_CREDITS_THRESHOLD = 5;
export const ADMIN_GRANT_AMOUNT = 10;

export type CreditEventType =
  | "registration"
  | "offer"
  | "featured"
  | "purchase"
  | "admin";

export type CreditEvent = {
  id: string;
  type: CreditEventType;
  label: string;
  detail: string;
  delta: number;
  at: string;
};

export const CREDIT_RULES: {
  event: string;
  credit: string;
}[] = [
  { event: "Registration", credit: `+${REGISTRATION_CREDIT_BONUS} free credits` },
  { event: "Send offer", credit: `−${OFFER_CREDIT_COST} credit` },
  { event: "Featured offer", credit: `−${FEATURED_OFFER_CREDIT_COST} credits` },
  { event: "Purchase", credit: "Stripe or admin grant" },
];

export const CREDIT_PACKS = [
  { id: "pack-10", credits: 10, price: 9, label: "Starter" },
  { id: "pack-25", credits: 25, price: 19, label: "Popular" },
  { id: "pack-50", credits: 50, price: 35, label: "Pro" },
] as const;

export const seedCreditLedger: CreditEvent[] = [];

export function ledgerBalance(events: CreditEvent[]) {
  return events.reduce((sum, event) => sum + event.delta, 0);
}

export function offerCreditCost(featured: boolean) {
  return featured ? FEATURED_OFFER_CREDIT_COST : OFFER_CREDIT_COST;
}

export function formatCreditDelta(delta: number) {
  if (delta > 0) return `+${delta}`;
  return String(delta);
}

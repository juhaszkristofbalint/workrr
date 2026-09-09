"use client";

import { CreditsProvider } from "@/components/credits/credits-provider";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { PhoneFrame } from "@/components/layout/phone-frame";
import {
  customerTabs,
  professionalTabs,
} from "@/components/layout/tabs";

export function MobileAppShell({
  role,
  children,
}: {
  role: "customer" | "professional";
  children: React.ReactNode;
}) {
  const tabs = role === "customer" ? customerTabs : professionalTabs;
  const frame = (
    <PhoneFrame>
      <main className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-safe">
        <div className="min-h-full pb-nav pt-[max(0.75rem,var(--safe-top))] sm:pt-14">
          {children}
        </div>
      </main>
      <MobileTabBar tabs={tabs} />
    </PhoneFrame>
  );

  if (role === "professional") {
    return <CreditsProvider>{frame}</CreditsProvider>;
  }

  return frame;
}

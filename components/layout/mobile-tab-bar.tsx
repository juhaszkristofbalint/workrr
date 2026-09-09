"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT } from "@/components/i18n/locale-provider";
import { cn } from "@/lib/cn";
import type { ComponentType } from "react";

export type TabItem = {
  href: string;
  labelKey: string;
  Icon: ComponentType<{ className?: string }>;
  IconActive: ComponentType<{ className?: string }>;
};

export function MobileTabBar({ tabs }: { tabs: readonly TabItem[] }) {
  const pathname = usePathname();
  const t = useT();

  return (
    <nav
      className="pointer-events-none absolute inset-x-0 bottom-0 z-50 px-4 pb-[max(0.75rem,var(--safe-bottom))]"
      aria-label={t("tabs.primary")}
    >
      <div className="pointer-events-auto h-[var(--nav-height)] rounded-[28px] border border-white/50 bg-tab/70 shadow-float backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10 dark:bg-card/70">
        <div className="grid h-full grid-cols-5 px-1">
          {tabs.map(({ href, labelKey, Icon, IconActive }) => {
            const active =
              pathname === href ||
              (href !== "/customer" &&
                href !== "/pro" &&
                href !== "/admin" &&
                pathname.startsWith(`${href}/`));
            const TabIcon = active ? IconActive : Icon;

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-full text-[10px] font-medium",
                  active ? "text-primary" : "text-muted",
                )}
                aria-current={active ? "page" : undefined}
              >
                <TabIcon className="h-[22px] w-[22px]" />
                {t(labelKey)}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

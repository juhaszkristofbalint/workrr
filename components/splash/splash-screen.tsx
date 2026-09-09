"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WorkRRLogo } from "@/components/logo";
import { BriefcaseIcon, PersonIcon } from "@/components/icons";
import { LanguageToggle } from "@/components/i18n/language-toggle";
import { useT } from "@/components/i18n/locale-provider";
import { PhoneFrame } from "@/components/layout/phone-frame";
import { cn } from "@/lib/cn";

const LOAD_MS = 2200;

export function SplashScreen() {
  const t = useT();
  const [phase, setPhase] = useState<"loading" | "choose">("loading");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setPhase("choose");
      return;
    }

    const timer = window.setTimeout(() => setPhase("choose"), LOAD_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const ready = phase === "choose";
  const roles = [
    {
      href: "/customer/login",
      title: t("splash.customerTitle"),
      body: t("splash.customerBody"),
      Icon: PersonIcon,
    },
    {
      href: "/pro/login",
      title: t("splash.proTitle"),
      body: t("splash.proBody"),
      Icon: BriefcaseIcon,
    },
  ] as const;

  return (
    <PhoneFrame className="bg-transparent text-white">
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[radial-gradient(120%_80%_at_50%_-10%,#60A5FA_0%,transparent_52%),linear-gradient(165deg,#1E3A8A_0%,#2563EB_48%,#1E40AF_100%)]">
        <div
          className="animate-splash-orb pointer-events-none absolute -left-16 top-24 h-56 w-56 rounded-full bg-accent/40 blur-3xl"
          aria-hidden
        />
        <div
          className="animate-splash-orb pointer-events-none absolute -right-10 bottom-32 h-64 w-64 rounded-full bg-white/15 blur-3xl [animation-delay:-3s]"
          aria-hidden
        />

        <div className="relative flex min-h-0 flex-1 flex-col px-6 pt-[max(2.5rem,var(--safe-top))] pb-[max(1.5rem,var(--safe-bottom))] sm:pt-16">
          <div className="relative z-10 flex justify-end">
            <div className="w-44">
              <LanguageToggle variant="onDark" />
            </div>
          </div>
          <div
            className={cn(
              "flex flex-1 flex-col items-center justify-center text-center transition-all duration-700",
              ready && "-translate-y-10",
            )}
          >
            <div className="animate-splash-fade">
              <div className="animate-splash-logo-glow">
                <WorkRRLogo className="h-[88px] w-[88px]" />
              </div>
            </div>
            <p className="animate-splash-fade-late mt-5 text-[34px] font-bold leading-none tracking-tight">
              WorkRR
            </p>
            <p className="animate-splash-fade-late mt-3 max-w-[16rem] text-subhead text-white/80">
              {t("splash.tagline")}
            </p>
          </div>

          <div className="relative min-h-[220px]">
            {!ready ? (
              <div className="absolute inset-x-0 bottom-8">
                <p className="mb-3 text-center text-footnote text-white/75">
                  {t("splash.gettingReady")}
                </p>
                <div
                  className="h-1.5 overflow-hidden rounded-full bg-white/20"
                  role="progressbar"
                  aria-label={t("splash.loading")}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div className="animate-splash-progress h-full origin-left rounded-full bg-white" />
                </div>
              </div>
            ) : (
              <div className="animate-splash-fade flex flex-col gap-3">
                <p className="text-center text-footnote font-medium text-white/80">
                  {t("splash.continueAs")}
                </p>
                {roles.map((role) => (
                  <Link
                    key={role.href}
                    href={role.href}
                    className="flex items-center gap-3 rounded-xl bg-white/14 p-4 text-left shadow-lg ring-1 ring-white/20 backdrop-blur-md transition active:scale-[0.98]"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-secondary">
                      <role.Icon className="h-6 w-6" />
                    </span>
                    <span>
                      <span className="block text-body font-semibold">{role.title}</span>
                      <span className="mt-0.5 block text-footnote text-white/75">
                        {role.body}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

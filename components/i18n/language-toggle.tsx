"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { cn } from "@/lib/cn";
import type { AppLocale } from "@/lib/i18n/locale";

export function LanguageToggle({
  variant = "default",
}: {
  variant?: "default" | "onDark";
}) {
  const { locale, setLocale, t } = useLocale();
  const options: { id: AppLocale; labelKey: "language.english" | "language.hungarian" }[] =
    [
      { id: "en", labelKey: "language.english" },
      { id: "hu", labelKey: "language.hungarian" },
    ];

  return (
    <div
      className={cn(
        "grid grid-cols-2 rounded-full p-1",
        variant === "onDark" ? "bg-white/18" : "bg-fill",
      )}
      role="group"
      aria-label={t("language.title")}
    >
      {options.map((option) => {
        const active = locale === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => setLocale(option.id)}
            className={cn(
              "inline-flex min-h-11 items-center justify-center rounded-full px-3 text-footnote font-semibold transition",
              variant === "onDark"
                ? active
                  ? "bg-white text-secondary shadow-sm"
                  : "text-white/80"
                : active
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted",
            )}
            aria-pressed={active}
          >
            {t(option.labelKey)}
          </button>
        );
      })}
    </div>
  );
}

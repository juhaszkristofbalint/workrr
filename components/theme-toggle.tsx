"use client";

import { MoonIcon, SunIcon } from "@/components/icons";
import { Button } from "@/components/ui";
import { useT } from "@/components/i18n/locale-provider";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/cn";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useT();

  return (
    <div
      className="grid grid-cols-2 rounded-full bg-fill p-1"
      role="group"
      aria-label={t("common.appearance")}
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-card px-3 text-footnote font-semibold text-foreground shadow-sm transition dark:bg-transparent dark:text-muted dark:shadow-none"
        aria-pressed={theme === "light"}
      >
        <SunIcon className="h-4 w-4" />
        {t("common.light")}
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full px-3 text-footnote font-semibold text-muted transition dark:bg-card dark:text-foreground dark:shadow-sm"
        aria-pressed={theme === "dark"}
      >
        <MoonIcon className="h-4 w-4" />
        {t("common.dark")}
      </button>
    </div>
  );
}

export function ThemeIconButton({
  className = "",
  variant = "ghost",
}: {
  className?: string;
  variant?: "ghost" | "glass";
}) {
  const { toggleTheme, theme } = useTheme();
  const t = useT();

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={toggleTheme}
      className={cn(variant === "ghost" && "bg-card shadow-sm", className)}
      aria-label={
        theme === "dark" ? t("common.switchToLight") : t("common.switchToDark")
      }
    >
      <SunIcon className="h-5 w-5 dark:hidden" />
      <MoonIcon className="hidden h-5 w-5 dark:block" />
    </Button>
  );
}

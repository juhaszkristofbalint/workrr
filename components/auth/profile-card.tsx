"use client";

import { LanguageToggle } from "@/components/i18n/language-toggle";
import { useT } from "@/components/i18n/locale-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button, Card } from "@/components/ui";
import { signOutAction } from "@/lib/auth/actions";
import type { SessionUser } from "@/types/auth";

export function ProfileCard({ user }: { user: SessionUser }) {
  const t = useT();

  return (
    <div className="flex flex-col gap-4 px-5">
      <Card className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-subhead font-semibold text-white">
          {user.displayName
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </div>
        <div>
          <p className="text-title font-semibold">{user.displayName}</p>
          <p className="text-footnote text-muted">{user.email}</p>
          <p className="text-caption capitalize text-primary">{user.role}</p>
        </div>
      </Card>
      <Card>
        <p className="mb-3 text-footnote font-medium text-muted">
          {t("language.title")}
        </p>
        <LanguageToggle />
      </Card>
      <Card>
        <p className="mb-3 text-footnote font-medium text-muted">
          {t("common.appearance")}
        </p>
        <ThemeToggle />
      </Card>
      <form action={signOutAction}>
        <Button type="submit" variant="outline" className="w-full">
          {t("common.signOut")}
        </Button>
      </form>
    </div>
  );
}

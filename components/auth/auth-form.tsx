"use client";

import { WorkRRLogo } from "@/components/logo";
import { LanguageToggle } from "@/components/i18n/language-toggle";
import { useT } from "@/components/i18n/locale-provider";
import { Button, Field, Input } from "@/components/ui";
import { signInAction, signUpAction } from "@/lib/auth/actions";
import type { UserRole } from "@/types/auth";
import Link from "next/link";

export function AuthForm({
  role,
  mode,
  error,
}: {
  role: UserRole;
  mode: "login" | "signup";
  error?: string;
}) {
  const t = useT();
  const action =
    mode === "login" ? signInAction.bind(null, role) : signUpAction.bind(null, role);
  const localized =
    role === "customer"
      ? { title: t("auth.customerTitle"), subtitle: t("auth.customerSubtitle"), signup: "/customer/signup" }
      : role === "professional"
        ? { title: t("auth.proTitle"), subtitle: t("auth.proSubtitle"), signup: "/pro/signup" }
        : {
            title: "Admin console",
            subtitle: "Marketplace operations and trust & safety.",
          };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <WorkRRLogo className="h-11 w-11" />
          <p className="text-body font-semibold">WorkRR</p>
        </div>
        {role !== "admin" ? (
          <div className="w-40 shrink-0">
            <LanguageToggle />
          </div>
        ) : null}
      </div>
      <h1 className="mt-8 text-large-title font-bold tracking-tight">
        {mode === "login" ? localized.title : t("auth.createAccount")}
      </h1>
      <p className="mt-2 text-subhead text-muted">{localized.subtitle}</p>

      {error ? (
        <p className="mt-4 rounded-lg bg-danger/10 px-3 py-2 text-footnote text-danger">
          {t("auth.error")}
        </p>
      ) : null}

      <form action={action} className="mt-8 flex flex-col gap-4">
        {mode === "signup" ? (
          <Field label={t("auth.fullName")}>
            <Input name="displayName" autoComplete="name" required />
          </Field>
        ) : null}
        <Field label={t("auth.email")}>
          <Input
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder={
              role === "admin" ? "ops@workrr.com" : "you@example.com"
            }
          />
        </Field>
        <Field label={t("auth.password")}>
          <Input
            name="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
            minLength={6}
          />
        </Field>
        <Button type="submit" size="lg" className="mt-2 w-full">
          {mode === "login" ? t("auth.signIn") : t("auth.create")}
        </Button>
      </form>

      {"signup" in localized && localized.signup && mode === "login" ? (
        <p className="mt-6 text-center text-footnote text-muted">
          {t("auth.newHere")}{" "}
          <Link href={localized.signup} className="font-semibold text-primary">
            {t("auth.create")}
          </Link>
        </p>
      ) : null}
      {mode === "signup" ? (
        <p className="mt-6 text-center text-footnote text-muted">
          {t("auth.already")}{" "}
          <Link
            href={role === "professional" ? "/pro/login" : "/customer/login"}
            className="font-semibold text-primary"
          >
            {t("auth.signIn")}
          </Link>
        </p>
      ) : null}
        {role === "admin" ? (
        <p className="mt-6 text-center text-caption text-muted">
          Admin access is invite-only. No public signup.
        </p>
      ) : null}
    </div>
  );
}

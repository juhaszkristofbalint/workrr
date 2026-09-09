"use client";

import { CameraIcon } from "@/components/icons";
import { LanguageToggle } from "@/components/i18n/language-toggle";
import { useLocale, useT } from "@/components/i18n/locale-provider";
import { WorkRRLogo } from "@/components/logo";
import { Button, Field, Input, Textarea } from "@/components/ui";
import { registerProfessionalAction } from "@/lib/auth/actions";
import { cn } from "@/lib/cn";
import { JOB_CATEGORIES } from "@/lib/jobs/categories";
import { categoryLabel } from "@/lib/i18n/translate";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";

type AccountType = "individual" | "company";
type ImageFile = { id: string; url: string; file: File };

const STEP_KEYS = [
  "signup.account",
  "signup.location",
  "signup.services",
  "signup.photos",
] as const;

function toImage(file: File): ImageFile {
  return {
    id: `${file.name}-${file.lastModified}-${Math.random()}`,
    url: URL.createObjectURL(file),
    file,
  };
}

export function ProRegistrationForm({ error }: { error?: string }) {
  const t = useT();
  const { locale } = useLocale();
  const [step, setStep] = useState(0);
  const [pending, startTransition] = useTransition();
  const [accountType, setAccountType] = useState<AccountType>("individual");
  const [businessName, setBusinessName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [radius, setRadius] = useState(15);
  const [categories, setCategories] = useState<string[]>([]);
  const [years, setYears] = useState("");
  const [description, setDescription] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<ImageFile | null>(null);
  const [logo, setLogo] = useState<ImageFile | null>(null);
  const [portfolio, setPortfolio] = useState<ImageFile[]>([]);
  const [stepError, setStepError] = useState("");

  useEffect(() => {
    return () => {
      if (profilePhoto) URL.revokeObjectURL(profilePhoto.url);
      if (logo) URL.revokeObjectURL(logo.url);
      portfolio.forEach((item) => URL.revokeObjectURL(item.url));
    };
    // Revoke only on unmount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleCategory(item: string) {
    setCategories((current) =>
      current.includes(item)
        ? current.filter((value) => value !== item)
        : [...current, item],
    );
  }

  function validateStep(index: number) {
    if (index === 0) {
      if (accountType === "company" && !businessName.trim()) {
        return t("signup.errBusiness");
      }
      if (!displayName.trim() || !email.trim() || !phone.trim() || password.length < 6) {
        return t("signup.errAccount");
      }
    }
    if (index === 1 && (!city.trim() || !address.trim())) {
      return t("signup.errLocation");
    }
    if (index === 2) {
      if (!categories.length || !years.trim() || !description.trim()) {
        return t("signup.errServices");
      }
    }
    return "";
  }

  function next() {
    const message = validateStep(step);
    if (message) {
      setStepError(message);
      return;
    }
    setStepError("");
    setStep((current) => Math.min(current + 1, STEP_KEYS.length - 1));
  }

  function submit() {
    const lastError = validateStep(2);
    if (lastError) {
      setStepError(lastError);
      setStep(2);
      return;
    }

    const formData = new FormData();
    formData.set("accountType", accountType);
    formData.set("businessName", businessName);
    formData.set("displayName", displayName);
    formData.set("email", email);
    formData.set("phone", phone);
    formData.set("password", password);
    formData.set("city", city);
    formData.set("address", address);
    formData.set("radius", String(radius));
    formData.set("categories", categories.join(","));
    formData.set("yearsExperience", years);
    formData.set("description", description);
    if (profilePhoto) formData.set("profilePhoto", profilePhoto.file);
    if (logo) formData.set("companyLogo", logo.file);
    portfolio.forEach((item) => formData.append("portfolio", item.file));

    startTransition(() => {
      registerProfessionalAction(formData);
    });
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <WorkRRLogo className="h-11 w-11" />
          <p className="text-body font-semibold">WorkRR</p>
        </div>
        <div className="w-40 shrink-0">
          <LanguageToggle />
        </div>
      </div>
      <h1 className="mt-8 text-large-title font-bold tracking-tight">
        {t("signup.title")}
      </h1>
      <p className="mt-2 text-subhead text-muted">{t("signup.subtitle")}</p>

      <div className="mt-6" aria-hidden>
        <div className="flex gap-1.5">
          {STEP_KEYS.map((label, index) => (
            <span
              key={label}
              className={cn(
                "h-1.5 flex-1 rounded-full",
                index <= step ? "bg-primary" : "bg-fill",
              )}
            />
          ))}
        </div>
        <p className="mt-2 text-caption font-semibold uppercase tracking-wide text-muted">
          {t("signup.step", {
            n: step + 1,
            total: STEP_KEYS.length,
            label: t(STEP_KEYS[step] ?? "signup.account"),
          })}
        </p>
      </div>

      {error || stepError ? (
        <p className="mt-4 rounded-lg bg-danger/10 px-3 py-2 text-footnote text-danger">
          {stepError || t("signup.checkDetails")}
        </p>
      ) : null}

      <div className="mt-6 flex flex-1 flex-col gap-4">
        {step === 0 ? (
          <>
            <div>
              <p className="mb-2 text-footnote font-medium text-muted">
                {t("signup.accountType")}
              </p>
              <div
                className="grid grid-cols-2 gap-1 rounded-xl bg-fill p-1"
                role="group"
                aria-label={t("signup.individualOrCompany")}
              >
                <button
                  type="button"
                  aria-pressed={accountType === "individual"}
                  onClick={() => setAccountType("individual")}
                  className={cn(
                    "min-h-11 rounded-lg text-subhead font-semibold",
                    accountType === "individual"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted",
                  )}
                >
                  {t("signup.individual")}
                </button>
                <button
                  type="button"
                  aria-pressed={accountType === "company"}
                  onClick={() => setAccountType("company")}
                  className={cn(
                    "min-h-11 rounded-lg text-subhead font-semibold",
                    accountType === "company"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted",
                  )}
                >
                  {t("signup.company")}
                </button>
              </div>
            </div>
            {accountType === "company" ? (
              <Field label={t("signup.businessName")}>
                <Input
                  value={businessName}
                  onChange={(event) => setBusinessName(event.target.value)}
                  autoComplete="organization"
                  required
                />
              </Field>
            ) : null}
            <Field label={t("auth.fullName")}>
              <Input
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                autoComplete="name"
                required
              />
            </Field>
            <Field label={t("auth.email")}>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </Field>
            <Field label={t("signup.phone")}>
              <Input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                autoComplete="tel"
                required
              />
            </Field>
            <Field label={t("auth.password")} hint={t("signup.passwordHint")}>
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                minLength={6}
                required
              />
            </Field>
          </>
        ) : null}

        {step === 1 ? (
          <>
            <Field label={t("signup.city")}>
              <Input
                value={city}
                onChange={(event) => setCity(event.target.value)}
                autoComplete="address-level2"
                required
              />
            </Field>
            <Field label={t("signup.address")}>
              <Input
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                autoComplete="street-address"
                required
              />
            </Field>
            <Field
              label={t("signup.radius")}
              hint={t("signup.radiusHint", { n: radius })}
            >
              <input
                type="range"
                min={1}
                max={50}
                value={radius}
                onChange={(event) => setRadius(Number(event.target.value))}
                className="radius-slider mt-3 w-full"
                aria-valuemin={1}
                aria-valuemax={50}
                aria-valuenow={radius}
                aria-label={t("signup.radiusAria")}
              />
              <p className="mt-2 text-title font-bold tabular-nums">{radius} km</p>
            </Field>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <div>
              <p className="mb-2 text-footnote font-medium text-muted">
                {t("signup.categories")}
              </p>
              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label={t("signup.categoriesAria")}
              >
                {JOB_CATEGORIES.map((item) => {
                  const active = categories.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleCategory(item)}
                      className={cn(
                        "min-h-10 rounded-full px-3 text-footnote font-semibold",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-fill text-label",
                      )}
                    >
                      {categoryLabel(locale, item)}
                    </button>
                  );
                })}
              </div>
            </div>
            <Field label={t("signup.years")}>
              <Input
                type="number"
                min={0}
                max={60}
                inputMode="numeric"
                value={years}
                onChange={(event) => setYears(event.target.value)}
                required
              />
            </Field>
            <Field label={t("signup.description")}>
              <Textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder={t("signup.descriptionPlaceholder")}
                required
              />
            </Field>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <ImageWell
              label={t("signup.profilePhoto")}
              hint={t("signup.profileHint")}
              shape="circle"
              image={profilePhoto}
              onChange={(file) => {
                if (profilePhoto) URL.revokeObjectURL(profilePhoto.url);
                setProfilePhoto(file ? toImage(file) : null);
              }}
            />
            {accountType === "company" ? (
              <ImageWell
                label={t("signup.logo")}
                hint={t("signup.logoHint")}
                shape="square"
                image={logo}
                onChange={(file) => {
                  if (logo) URL.revokeObjectURL(logo.url);
                  setLogo(file ? toImage(file) : null);
                }}
              />
            ) : null}
            <PortfolioWell
              images={portfolio}
              onAdd={(files) => {
                const next = files.map(toImage);
                setPortfolio((current) => [...current, ...next].slice(0, 8));
              }}
              onRemove={(id) => {
                setPortfolio((current) => {
                  const target = current.find((item) => item.id === id);
                  if (target) URL.revokeObjectURL(target.url);
                  return current.filter((item) => item.id !== id);
                });
              }}
            />
          </>
        ) : null}
      </div>

      <div className="mt-6 flex gap-3">
        {step > 0 ? (
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={() => {
              setStepError("");
              setStep((current) => current - 1);
            }}
          >
            {t("common.back")}
          </Button>
        ) : null}
        {step < STEP_KEYS.length - 1 ? (
          <Button size="lg" className="flex-1" onClick={next}>
            {t("common.continue")}
          </Button>
        ) : (
          <Button
            size="lg"
            className="flex-1"
            disabled={pending}
            onClick={submit}
          >
            {pending ? t("signup.creating") : t("signup.createProfile")}
          </Button>
        )}
      </div>

      <p className="mt-6 text-center text-footnote text-muted">
        {t("auth.already")}{" "}
        <Link href="/pro/login" className="font-semibold text-primary">
          {t("auth.signIn")}
        </Link>
      </p>
    </div>
  );
}

function ImageWell({
  label,
  hint,
  shape,
  image,
  onChange,
}: {
  label: string;
  hint: string;
  shape: "circle" | "square";
  image: ImageFile | null;
  onChange: (file: File | null) => void;
}) {
  const t = useT();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <p className="text-footnote font-medium text-muted">{label}</p>
      <p className="mt-1 text-caption text-muted">{hint}</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          onChange(event.target.files?.[0] ?? null);
          event.target.value = "";
        }}
      />
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex h-20 w-20 items-center justify-center overflow-hidden bg-fill text-muted",
            shape === "circle" ? "rounded-full" : "rounded-xl",
          )}
          aria-label={t("signup.uploadAria", { label })}
        >
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image.url} alt="" className="h-full w-full object-cover" />
          ) : (
            <CameraIcon className="h-7 w-7" />
          )}
        </button>
        <div className="flex flex-col gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => inputRef.current?.click()}
          >
            {image ? t("signup.replace") : t("signup.upload")}
          </Button>
          {image ? (
            <button
              type="button"
              className="text-left text-caption font-semibold text-danger"
              onClick={() => onChange(null)}
            >
              {t("signup.remove")}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function PortfolioWell({
  images,
  onAdd,
  onRemove,
}: {
  images: ImageFile[];
  onAdd: (files: File[]) => void;
  onRemove: (id: string) => void;
}) {
  const t = useT();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <p className="text-footnote font-medium text-muted">{t("signup.portfolio")}</p>
      <p className="mt-1 text-caption text-muted">{t("signup.portfolioHint")}</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => {
          const files = event.target.files
            ? Array.from(event.target.files).filter((file) =>
                file.type.startsWith("image/"),
              )
            : [];
          onAdd(files.slice(0, 8 - images.length));
          event.target.value = "";
        }}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {images.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onRemove(item.id)}
            className="h-16 w-16 overflow-hidden rounded-lg bg-fill"
            aria-label={t("signup.removePortfolio", { n: index + 1 })}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.url} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
        {images.length < 8 ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-16 w-16 flex-col items-center justify-center rounded-lg border border-dashed border-separator bg-fill text-[11px] font-semibold text-muted"
          >
            {t("signup.add")}
          </button>
        ) : null}
      </div>
    </div>
  );
}

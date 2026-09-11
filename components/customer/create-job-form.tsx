"use client";

import { CameraIcon } from "@/components/icons";
import { useLocale, useT } from "@/components/i18n/locale-provider";
import { Button, Field, Input, Switch, Textarea } from "@/components/ui";
import {
  JOB_CATEGORIES,
  isJobCategorySlug,
  type JobCategorySlug,
} from "@/lib/jobs/categories";
import { createJobAction } from "@/lib/jobs/actions";
import { categoryLabel } from "@/lib/i18n/translate";
import { cn } from "@/lib/cn";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";

type Photo = { id: string; url: string; file: File };

export function CreateJobForm({
  openCamera = false,
}: {
  openCamera?: boolean;
  error?: string;
}) {
  const t = useT();
  const { locale } = useLocale();
  const router = useRouter();
  const cameraRef = useRef<HTMLInputElement>(null);
  const libraryRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<"idle" | "loading" | "error">(
    "idle",
  );
  const [emergency, setEmergency] = useState(false);
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const categoryRef = useRef("");

  useEffect(() => {
    if (openCamera) {
      cameraRef.current?.click();
    }
  }, [openCamera]);

  useEffect(() => {
    return () => {
      photos.forEach((photo) => URL.revokeObjectURL(photo.url));
    };
  }, [photos]);

  function addFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    const next = Array.from(fileList)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, 8 - photos.length)
      .map((file) => ({
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        url: URL.createObjectURL(file),
        file,
      }));
    setPhotos((current) => [...current, ...next].slice(0, 8));
  }

  function removePhoto(id: string) {
    setPhotos((current) => {
      const target = current.find((photo) => photo.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return current.filter((photo) => photo.id !== id);
    });
  }

  function useGps() {
    if (!navigator.geolocation) {
      setGpsStatus("error");
      return;
    }
    setGpsStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setGps(coords);
        setGpsStatus("idle");
        setAddress(t("createJob.gpsCurrent"));
      },
      () => setGpsStatus("error"),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  const hero = photos[0];
  const today = new Date().toISOString().slice(0, 10);

  function errorMessage(code: string) {
    if (code === "unavailable") return t("createJob.errorUnavailable");
    if (code === "category") return t("createJob.errorCategory");
    if (code === "save") return t("createJob.errorSave");
    if (code === "photos") return t("createJob.errorPhotos");
    return t("createJob.error");
  }

  function selectCategory(slug: JobCategorySlug) {
    categoryRef.current = slug;
    setCategory(slug);
    setFormError((current) => (current === "category" ? "" : current));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const selectedCategory = categoryRef.current || category;

    if (!isJobCategorySlug(selectedCategory)) {
      setFormError("category");
      setSuccess("");
      return;
    }

    const trimmedAddress = address.trim();
    if (!trimmedAddress) {
      setFormError("missing");
      setSuccess("");
      return;
    }

    const formData = new FormData(event.currentTarget);
    formData.set("category", selectedCategory);
    formData.set("address", trimmedAddress);
    formData.set("emergency", emergency ? "true" : "false");
    if (gps) {
      formData.set("lat", String(gps.lat));
      formData.set("lng", String(gps.lng));
    }
    photos.forEach((photo) => formData.append("photos", photo.file));
    setPending(true);
    setFormError("");
    setSuccess("");

    try {
      const result = await createJobAction(formData);
      if (!result.ok) {
        setFormError(result.error);
        return;
      }

      setSuccess(t("createJob.success"));
      router.push("/customer/jobs?created=1");
      router.refresh();
    } catch {
      setFormError("save");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6 pb-8">
      <input type="hidden" name="category" value={category} />
      <input type="hidden" name="address" value={address} />
      <input type="hidden" name="emergency" value={emergency ? "true" : "false"} />
      {gps ? (
        <>
          <input type="hidden" name="lat" value={gps.lat} />
          <input type="hidden" name="lng" value={gps.lng} />
        </>
      ) : null}

      <section aria-label={t("createJob.photos")}>
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = "";
          }}
        />
        <input
          ref={libraryRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = "";
          }}
        />

        <button
          type="button"
          onClick={() => cameraRef.current?.click()}
          className="relative flex min-h-[240px] w-full flex-col items-center justify-center overflow-hidden bg-slate-950 text-white"
        >
          {hero ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hero.url}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}
          <span
            className={cn(
              "relative z-10 flex flex-col items-center gap-3",
              hero && "rounded-xl bg-black/45 px-5 py-4 backdrop-blur-sm",
            )}
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-primary shadow-lg">
              <CameraIcon className="h-8 w-8" />
            </span>
            <span className="text-body font-semibold">
              {hero ? t("createJob.retake") : t("createJob.takePhoto")}
            </span>
            <span className="text-footnote text-white/80">
              {t("createJob.cameraHint")}
            </span>
          </span>
        </button>

        <div className="flex gap-2 overflow-x-auto px-5 pt-3">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => removePhoto(photo.id)}
              className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-fill"
              aria-label={t("createJob.removePhoto", { n: index + 1 })}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
          <button
            type="button"
            onClick={() => libraryRef.current?.click()}
            className="flex h-16 min-w-16 shrink-0 flex-col items-center justify-center rounded-lg border border-dashed border-separator bg-fill px-2 text-center text-[11px] font-semibold text-muted"
          >
            {t("createJob.addPhotos")}
          </button>
        </div>
        <p className="px-5 pt-2 text-caption text-muted">
          {t("createJob.photoCount", { n: photos.length })}
        </p>
      </section>

      <div className="flex flex-col gap-5 px-5">
        {formError && formError !== "category" ? (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-footnote text-danger">
            {["missing", "unavailable", "save", "photos"].includes(formError)
              ? errorMessage(formError)
              : formError}
          </p>
        ) : null}
        {success ? (
          <p className="rounded-lg bg-success-soft px-3 py-2 text-footnote text-success">
            {success}
          </p>
        ) : null}

        <div className="flex flex-col gap-2">
          <p className="text-footnote font-medium text-muted">{t("createJob.category")}</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label={t("createJob.category")}>
            {JOB_CATEGORIES.map((slug) => {
              const selected = category === slug;
              return (
                <button
                  key={slug}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => selectCategory(slug)}
                  className={cn(
                    "inline-flex min-h-10 items-center rounded-full px-3 text-footnote font-semibold",
                    selected
                      ? "bg-primary text-primary-foreground"
                      : "bg-fill text-label",
                  )}
                >
                  {categoryLabel(locale, slug)}
                </button>
              );
            })}
          </div>
          {formError === "category" ? (
            <p className="text-footnote text-danger">
              {t("createJob.errorCategory")}
            </p>
          ) : null}
        </div>

        <Field label={t("createJob.shortTitle")}>
          <Input
            name="title"
            required
            maxLength={80}
            placeholder={t("createJob.titlePlaceholder")}
          />
        </Field>

        <Field label={t("createJob.description")}>
          <Textarea
            name="description"
            required
            placeholder={t("createJob.descriptionPlaceholder")}
          />
        </Field>

        <div className="flex flex-col gap-2">
          <p className="text-footnote font-medium text-muted">{t("createJob.address")}</p>
          <Input
            name="address"
            required
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder={t("createJob.addressPlaceholder")}
            autoComplete="street-address"
          />
        </div>

        <div className="rounded-xl bg-card p-4 shadow-card">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-subhead font-semibold">{t("createJob.gps")}</p>
              <p className="text-footnote text-muted">
                {gps
                  ? `${gps.lat.toFixed(5)}, ${gps.lng.toFixed(5)}`
                  : gpsStatus === "error"
                    ? t("createJob.gpsUnavailable")
                    : t("createJob.gpsShare")}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={useGps}
              disabled={gpsStatus === "loading"}
            >
              {gpsStatus === "loading" ? t("createJob.locating") : t("createJob.useGps")}
            </Button>
          </div>
        </div>

        <Field label={t("createJob.preferredDate")}>
          <Input name="preferredDate" type="date" min={today} required />
        </Field>

        <div className="rounded-xl bg-card p-4 shadow-card">
          <Switch
            checked={emergency}
            onCheckedChange={setEmergency}
            label={t("createJob.emergency")}
            description={t("createJob.emergencyHint")}
          />
        </div>

        <div className="sticky bottom-[calc(var(--nav-height)+var(--nav-inset)+var(--safe-bottom)+0.35rem)] z-40 -mx-1 bg-gradient-to-t from-background via-background to-transparent pt-3">
          <Button
            type="submit"
            size="lg"
            disabled={pending}
            className={cn(
              "w-full",
              emergency && "bg-danger active:bg-danger/90",
            )}
          >
            {pending
              ? t("createJob.sending")
              : emergency
                ? t("createJob.submitEmergency")
                : t("createJob.submit")}
          </Button>
        </div>
      </div>
    </form>
  );
}

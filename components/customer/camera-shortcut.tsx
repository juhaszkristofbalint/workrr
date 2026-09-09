"use client";

import { CameraIcon } from "@/components/icons";
import { useT } from "@/components/i18n/locale-provider";
import { cn } from "@/lib/cn";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export function CameraShortcut({ className = "" }: { className?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const t = useT();

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        aria-label={t("customerHome.photograph")}
        onChange={(event) => {
          if (event.target.files?.length) {
            router.push("/customer/jobs/new?camera=1");
          }
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "inline-flex h-[72px] w-[72px] shrink-0 flex-col items-center justify-center gap-1 rounded-xl bg-fill text-foreground shadow-sm active:scale-[0.98]",
          className,
        )}
        aria-label={t("customerHome.openCamera")}
      >
        <CameraIcon className="h-6 w-6" />
        <span className="text-[11px] font-semibold">{t("customerHome.camera")}</span>
      </button>
    </>
  );
}

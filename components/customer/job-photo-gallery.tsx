"use client";

import { useState } from "react";
import type { JobPhoto } from "@/types/jobs";
import { cn } from "@/lib/cn";

export function JobPhotoGallery({ photos }: { photos: JobPhoto[] }) {
  const [active, setActive] = useState(0);
  const current = photos[active] ?? photos[0];

  if (!current) return null;

  return (
    <section aria-label="Uploaded photos">
      <div className="overflow-hidden rounded-xl bg-fill">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.src}
          alt={current.alt}
          className="h-52 w-full object-cover"
        />
      </div>
      {photos.length > 1 ? (
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {photos.map((photo, index) => (
            <li key={photo.src}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={photo.alt}
                aria-pressed={index === active}
                className={cn(
                  "h-16 w-20 overflow-hidden rounded-lg ring-2 ring-offset-2 ring-offset-background",
                  index === active ? "ring-primary" : "ring-transparent",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

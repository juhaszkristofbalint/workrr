"use client";

import type { GeoPoint } from "@/lib/geo/haversine";
import { withOriginDistance } from "@/lib/jobs/job-row";
import { queryOpenJobs } from "@/lib/jobs/open-jobs";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { NearbyJob } from "@/types/jobs";
import { useEffect, useRef, useState } from "react";

export function useOpenJobs(initialJobs: NearbyJob[], origin: GeoPoint | null) {
  const [jobs, setJobs] = useState(initialJobs);
  const [liveOrigin, setLiveOrigin] = useState<GeoPoint | null>(origin);
  const originRef = useRef<GeoPoint | null>(origin);
  const jobsKey = initialJobs.map((job) => job.id).join(",");

  useEffect(() => {
    setJobs(initialJobs);
  }, [jobsKey]);

  useEffect(() => {
    originRef.current = liveOrigin ?? origin;
  }, [liveOrigin, origin]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        originRef.current = next;
        setLiveOrigin(next);
        setJobs((current) => withOriginDistance(current, next));
      },
      () => undefined,
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60_000 },
    );
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = createSupabaseBrowserClient();

    async function refresh() {
      const next = await queryOpenJobs(supabase, originRef.current);
      setJobs(next);
    }

    let refreshTimer: ReturnType<typeof setTimeout> | undefined;

    function scheduleRefresh() {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => {
        void refresh();
      }, 150);
    }

    const channel = supabase
      .channel(`open-jobs-${crypto.randomUUID()}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "jobs" },
        () => {
          scheduleRefresh();
        },
      )
      .subscribe();

    return () => {
      clearTimeout(refreshTimer);
      void supabase.removeChannel(channel);
    };
  }, []);

  return withOriginDistance(jobs, liveOrigin ?? origin);
}

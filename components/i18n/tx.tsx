"use client";

import { useT } from "@/components/i18n/locale-provider";

export function Tx({
  k,
  values,
}: {
  k: string;
  values?: Record<string, string | number>;
}) {
  const t = useT();
  return t(k, values);
}

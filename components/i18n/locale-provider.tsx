"use client";

import {
  isLocale,
  localeToHtmlLang,
  LOCALE_COOKIE,
  type AppLocale,
} from "@/lib/i18n/locale";
import { translate } from "@/lib/i18n/translate";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type LocaleContextValue = {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function persistLocale(locale: AppLocale) {
  localStorage.setItem(LOCALE_COOKIE, locale);
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
  document.documentElement.lang = localeToHtmlLang(locale);
}

export function LocaleProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: AppLocale;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<AppLocale>(initialLocale);

  const setLocale = useCallback(
    (next: AppLocale) => {
      if (!isLocale(next)) return;
      setLocaleState(next);
      persistLocale(next);
      router.refresh();
    },
    [router],
  );

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) =>
      translate(locale, key, vars),
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}

export function useT() {
  return useLocale().t;
}

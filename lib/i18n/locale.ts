export const LOCALE_COOKIE = "workrr-locale";

export type AppLocale = "en" | "hu";

export function isLocale(value: unknown): value is AppLocale {
  return value === "en" || value === "hu";
}

export function localeToHtmlLang(locale: AppLocale) {
  return locale === "hu" ? "hu" : "en";
}

import { JOB_CATEGORY_NAME, isJobCategorySlug } from "@/lib/jobs/categories";
import { messages, type Messages } from "@/lib/i18n/messages";
import type { AppLocale } from "@/lib/i18n/locale";

type Vars = Record<string, string | number>;

export function translate(
  locale: AppLocale,
  key: string,
  vars?: Vars,
) {
  const raw = lookup(messages[locale], key) ?? lookup(messages.en, key) ?? key;
  if (!vars) return raw;
  return raw.replace(/\{(\w+)\}/g, (_, name: string) =>
    Object.prototype.hasOwnProperty.call(vars, name)
      ? String(vars[name])
      : `{${name}}`,
  );
}

function lookup(tree: Messages, key: string): string | null {
  const parts = key.split(".");
  let current: unknown = tree;
  for (const part of parts) {
    if (!current || typeof current !== "object" || !(part in current)) {
      return null;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : null;
}

export function categoryLabel(locale: AppLocale, category: string) {
  const name = isJobCategorySlug(category)
    ? JOB_CATEGORY_NAME[category]
    : category;
  return translate(locale, `category.${name}`) === `category.${name}`
    ? name
    : translate(locale, `category.${name}`);
}

export function jobStatusLabel(locale: AppLocale, status: string) {
  const map: Record<string, string> = {
    open: "status.open",
    matched: "status.matched",
    "en route": "status.enRoute",
    completed: "status.completed",
    accepted: "status.accepted",
    "in progress": "status.inProgress",
    confirmed: "status.confirmed",
    requested: "status.requested",
    cancelled: "status.cancelled",
    removed: "status.cancelled",
  };
  const key = map[status];
  return key ? translate(locale, key) : status;
}

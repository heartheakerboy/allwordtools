// ============================================================================
// Language detection + persistence (client-side only).
//
// Priority: saved preference -> browser languages -> default (English).
// Detection NEVER forces a redirect — it only powers the switcher's default
// highlight and an optional one-time suggestion. The user is always in control.
// ============================================================================

import { DEFAULT_LOCALE, enabledLocales, getLocale } from "./locales";

const STORAGE_KEY = "awt_locale";
const PINNED_KEY = "awt_locale_pinned";
const RECENT_KEY = "awt_locale_recent";
const COOKIE_KEY = "awt_locale";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/** Match a browser language tag (e.g. "es-419", "pt-BR") to an enabled locale. */
function matchEnabled(tag: string): string | undefined {
  const lower = tag.toLowerCase();
  const exact = getLocale(lower);
  if (exact?.enabled) return exact.code;
  const base = lower.split("-")[0];
  const baseCfg = getLocale(base);
  return baseCfg?.enabled ? baseCfg.code : undefined;
}

export function getSavedLocale(): string | undefined {
  if (!isBrowser()) return undefined;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && getLocale(stored)?.enabled) return stored;
  } catch {
    /* ignore */
  }
  return undefined;
}

export function detectLocale(): string {
  const saved = getSavedLocale();
  if (saved) return saved;
  if (isBrowser() && navigator.languages) {
    for (const tag of navigator.languages) {
      const match = matchEnabled(tag);
      if (match) return match;
    }
  }
  return DEFAULT_LOCALE;
}

export function saveLocale(locale: string): void {
  if (!isBrowser() || !getLocale(locale)?.enabled) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
    // Cookie lets SSR read the preference on future navigations.
    document.cookie = `${COOKIE_KEY}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    pushRecent(locale);
  } catch {
    /* ignore */
  }
}

function readList(key: string): string[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((c) => getLocale(c)?.enabled) : [];
  } catch {
    return [];
  }
}

function writeList(key: string, list: string[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

export function getPinnedLocales(): string[] {
  return readList(PINNED_KEY);
}

export function togglePinnedLocale(locale: string): string[] {
  const current = getPinnedLocales();
  const next = current.includes(locale)
    ? current.filter((c) => c !== locale)
    : [...current, locale];
  writeList(PINNED_KEY, next);
  return next;
}

export function getRecentLocales(): string[] {
  return readList(RECENT_KEY);
}

function pushRecent(locale: string): void {
  const next = [locale, ...getRecentLocales().filter((c) => c !== locale)].slice(0, 4);
  writeList(RECENT_KEY, next);
}

/** Convenience: enabled locales the switcher should show, all validated. */
export function switchableLocales() {
  return enabledLocales();
}

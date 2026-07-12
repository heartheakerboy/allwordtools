// ============================================================================
// URL helpers for locale-prefixed routing.
//
// URL model (Google-recommended): the default language (English) is served
// WITHOUT a prefix; every other locale lives under its code:
//   en  ->  /tool/word-unscrambler
//   es  ->  /es/tool/word-unscrambler
//   ar  ->  /ar/tool/word-unscrambler
//
// Localized slugs are supported but optional — until a localized slug exists
// for a path, the English slug is reused (only the language prefix changes).
// ============================================================================

import { DEFAULT_LOCALE, getLocale } from "./locales";

/** Optional per-locale slug overrides. Shape: SLUGS[locale][englishSlug] = localizedSlug. */
export const LOCALIZED_SLUGS: Record<string, Record<string, string>> = {
  // es: { "word-unscrambler": "desordenador-de-palabras" },
};

export function localizedSlug(englishSlug: string, locale: string): string {
  return LOCALIZED_SLUGS[locale]?.[englishSlug] ?? englishSlug;
}

/** Normalize a path to a leading slash, no trailing slash (except root). */
function normalize(path: string): string {
  if (!path || path === "/") return "/";
  const p = path.startsWith("/") ? path : `/${path}`;
  return p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;
}

/** Build a locale-aware URL for a given (locale-agnostic) app path. */
export function localePath(locale: string, path = "/"): string {
  const clean = normalize(path);
  if (locale === DEFAULT_LOCALE) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** Split a pathname into its locale (if any) and the remaining app path. */
export function stripLocale(pathname: string): { locale: string; path: string } {
  const clean = normalize(pathname);
  const [, first, ...rest] = clean.split("/");
  const cfg = getLocale(first);
  if (cfg && cfg.enabled && cfg.code !== DEFAULT_LOCALE) {
    return { locale: cfg.code, path: normalize("/" + rest.join("/")) };
  }
  return { locale: DEFAULT_LOCALE, path: clean };
}

/** Given the current pathname, produce the equivalent URL in another locale. */
export function switchLocalePath(currentPathname: string, nextLocale: string): string {
  const { path } = stripLocale(currentPathname);
  return localePath(nextLocale, path);
}

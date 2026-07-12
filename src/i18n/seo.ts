// ============================================================================
// Per-locale SEO helpers — hreflang, canonical, Open Graph & JSON-LD language.
//
// Every localized route calls buildLocaleHead() so that:
//  • canonical + og:url self-reference the CURRENT locale's URL,
//  • <link rel="alternate" hreflang="..."> is emitted for EVERY enabled locale
//    plus x-default -> English,
//  • og:locale / html lang reflect the active language.
//
// Paths are absolute and prefixed with the production domain.
// ============================================================================

import { DEFAULT_LOCALE, enabledLocales, getLocale } from "./locales";
import { localePath } from "./paths";

const BASE_URL = "https://allwordtools.com";

export interface LocaleHeadInput {
  /** Locale-agnostic app path, e.g. "/tool/word-unscrambler" or "/". */
  path: string;
  locale: string;
  title: string;
  description: string;
  /** Absolute https URL of a share image (optional). */
  image?: string;
  /** og:type — "website" (default) or "article" etc. */
  type?: string;
  keywords?: string;
  robots?: string;
}

export interface HeadMeta {
  title?: string;
  name?: string;
  property?: string;
  content?: string;
}
export interface HeadLink {
  rel: string;
  href: string;
  hrefLang?: string;
}

/** hreflang alternates for a path across all enabled locales (+ x-default). */
export function hreflangLinks(path: string): HeadLink[] {
  const links: HeadLink[] = enabledLocales().map((l) => ({
    rel: "alternate",
    hrefLang: l.code,
    href: `${BASE_URL}${localePath(l.code, path)}`,
  }));
  links.push({ rel: "alternate", hrefLang: "x-default", href: `${BASE_URL}${localePath(DEFAULT_LOCALE, path)}` });
  return links;
}

export function buildLocaleHead(input: LocaleHeadInput): {
  meta: HeadMeta[];
  links: HeadLink[];
} {
  const cfg = getLocale(input.locale) ?? getLocale(DEFAULT_LOCALE)!;
  const url = `${BASE_URL}${localePath(cfg.code, input.path)}`;

  const meta: HeadMeta[] = [
    { title: input.title },
    { name: "description", content: input.description },
    { name: "robots", content: input.robots ?? "index, follow" },
    { property: "og:title", content: input.title },
    { property: "og:description", content: input.description },
    { property: "og:type", content: input.type ?? "website" },
    { property: "og:url", content: url },
    { property: "og:site_name", content: "AllWordTools.com" },
    { property: "og:locale", content: cfg.ogLocale },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: input.title },
    { name: "twitter:description", content: input.description },
  ];

  // og:locale:alternate for the other enabled locales.
  for (const l of enabledLocales()) {
    if (l.code !== cfg.code) {
      meta.push({ property: "og:locale:alternate", content: l.ogLocale });
    }
  }

  if (input.keywords) meta.push({ name: "keywords", content: input.keywords });
  if (input.image) {
    meta.push({ property: "og:image", content: input.image });
    meta.push({ name: "twitter:image", content: input.image });
  }

  const links: HeadLink[] = [{ rel: "canonical", href: url }, ...hreflangLinks(input.path)];

  return { meta, links };
}

/** JSON-LD language tag helper. */
export function inLanguage(locale: string): string {
  return getLocale(locale)?.intl ?? "en-US";
}

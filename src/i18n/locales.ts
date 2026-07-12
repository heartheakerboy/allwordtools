// ============================================================================
// Locale registry — the single source of truth for every language on the site.
//
// Adding a new language = add ONE entry here (enabled: true) + one dictionary
// file in src/i18n/dictionaries/<code>.json. Nothing else in the codebase
// needs to change. This is what makes the platform scale to 50+ locales.
// ============================================================================

export type Direction = "ltr" | "rtl";

export interface LocaleConfig {
  /** BCP-47 language code used in the URL prefix (e.g. "es", "pt-br"). */
  code: string;
  /** English name of the language. */
  name: string;
  /** Native endonym shown in the language switcher. */
  nativeName: string;
  /** Text direction — drives RTL layout + font loading. */
  dir: Direction;
  /** Emoji flag (optional visual aid in the switcher). */
  flag: string;
  /** Intl locale used for date/number/currency formatting. */
  intl: string;
  /** og:locale value for Open Graph. */
  ogLocale: string;
  /** Only enabled locales are routable, listed in the switcher, and emitted in hreflang. */
  enabled: boolean;
}

// English is the default language and is served WITHOUT a URL prefix
// (Google-recommended pattern). All other enabled locales are served under
// their code prefix, e.g. /es, /ar/tool/word-unscrambler.
export const DEFAULT_LOCALE = "en";

export const LOCALES: LocaleConfig[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    dir: "ltr",
    flag: "🇬🇧",
    intl: "en-US",
    ogLocale: "en_US",
    enabled: true,
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    dir: "ltr",
    flag: "🇪🇸",
    intl: "es-ES",
    ogLocale: "es_ES",
    enabled: true,
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    dir: "ltr",
    flag: "🇮🇳",
    intl: "hi-IN",
    ogLocale: "hi_IN",
    enabled: true,
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    dir: "rtl",
    flag: "🇸🇦",
    intl: "ar",
    ogLocale: "ar_AR",
    enabled: true,
  },

  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    dir: "ltr",
    flag: "🇩🇪",
    intl: "de-DE",
    ogLocale: "de_DE",
    enabled: true,
  },
  {
    code: "pt",
    name: "Portuguese",
    nativeName: "Português",
    dir: "ltr",
    flag: "🇧🇷",
    intl: "pt-BR",
    ogLocale: "pt_BR",
    enabled: true,
  },
  {
    code: "id",
    name: "Indonesian",
    nativeName: "Bahasa Indonesia",
    dir: "ltr",
    flag: "🇮🇩",
    intl: "id-ID",
    ogLocale: "id_ID",
    enabled: true,
  },
  {
    code: "ru",
    name: "Russian",
    nativeName: "Русский",
    dir: "ltr",
    flag: "🇷🇺",
    intl: "ru-RU",
    ogLocale: "ru_RU",
    enabled: true,
  },

  // ---- Ready to enable: flip `enabled` to true and drop in a dictionary. ----
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    dir: "ltr",
    flag: "🇫🇷",
    intl: "fr-FR",
    ogLocale: "fr_FR",
    enabled: false,
  },
  {
    code: "it",
    name: "Italian",
    nativeName: "Italiano",
    dir: "ltr",
    flag: "🇮🇹",
    intl: "it-IT",
    ogLocale: "it_IT",
    enabled: false,
  },
  {
    code: "nl",
    name: "Dutch",
    nativeName: "Nederlands",
    dir: "ltr",
    flag: "🇳🇱",
    intl: "nl-NL",
    ogLocale: "nl_NL",
    enabled: false,
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    dir: "ltr",
    flag: "🇯🇵",
    intl: "ja-JP",
    ogLocale: "ja_JP",
    enabled: false,
  },
  {
    code: "ko",
    name: "Korean",
    nativeName: "한국어",
    dir: "ltr",
    flag: "🇰🇷",
    intl: "ko-KR",
    ogLocale: "ko_KR",
    enabled: false,
  },
  {
    code: "tr",
    name: "Turkish",
    nativeName: "Türkçe",
    dir: "ltr",
    flag: "🇹🇷",
    intl: "tr-TR",
    ogLocale: "tr_TR",
    enabled: false,
  },
  {
    code: "ru",
    name: "Russian",
    nativeName: "Русский",
    dir: "ltr",
    flag: "🇷🇺",
    intl: "ru-RU",
    ogLocale: "ru_RU",
    enabled: false,
  },
  {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    dir: "ltr",
    flag: "🇧🇩",
    intl: "bn-BD",
    ogLocale: "bn_BD",
    enabled: false,
  },
  {
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    dir: "ltr",
    flag: "🇮🇳",
    intl: "ta-IN",
    ogLocale: "ta_IN",
    enabled: false,
  },
  {
    code: "ur",
    name: "Urdu",
    nativeName: "اردو",
    dir: "rtl",
    flag: "🇵🇰",
    intl: "ur-PK",
    ogLocale: "ur_PK",
    enabled: false,
  },
  {
    code: "fa",
    name: "Persian",
    nativeName: "فارسی",
    dir: "rtl",
    flag: "🇮🇷",
    intl: "fa-IR",
    ogLocale: "fa_IR",
    enabled: false,
  },
  {
    code: "he",
    name: "Hebrew",
    nativeName: "עברית",
    dir: "rtl",
    flag: "🇮🇱",
    intl: "he-IL",
    ogLocale: "he_IL",
    enabled: false,
  },
];

const LOCALE_MAP = new Map(LOCALES.map((l) => [l.code, l]));

export function getLocale(code: string | undefined | null): LocaleConfig | undefined {
  if (!code) return undefined;
  return LOCALE_MAP.get(code.toLowerCase());
}

export function isLocale(code: string | undefined | null): boolean {
  const l = getLocale(code);
  return Boolean(l && l.enabled);
}

export function isRtl(code: string): boolean {
  return getLocale(code)?.dir === "rtl";
}

export function getDirection(code: string): Direction {
  return getLocale(code)?.dir ?? "ltr";
}

/** All routable / indexable locales (used by the switcher, hreflang, sitemaps). */
export function enabledLocales(): LocaleConfig[] {
  return LOCALES.filter((l) => l.enabled);
}

export const defaultLocaleConfig = getLocale(DEFAULT_LOCALE)!;

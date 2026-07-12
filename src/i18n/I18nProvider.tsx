// ============================================================================
// i18n runtime — React context + useI18n() hook.
//
// Provides: active locale, text direction, t(key, vars) with {var} interpolation
// and automatic English fallback, plus Intl-based date/number/currency helpers.
//
// The provider is mounted once at the root (English by default) so useI18n()
// works on every page, and re-mounted (nested) inside the /$locale layout with
// the active locale + its loaded dictionary. The innermost provider wins.
// ============================================================================

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { DEFAULT_LOCALE, getDirection, getLocale, type Direction } from "./locales";
import { enDictionary, type Dictionary } from "./getDictionary";

type Vars = Record<string, string | number>;

export interface I18nContextValue {
  locale: string;
  dir: Direction;
  t: (key: string, vars?: Vars) => string;
  formatDate: (date: Date | number | string, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (value: number, currency: string) => string;
  formatRelativeTime: (value: number, unit: Intl.RelativeTimeFormatUnit) => string;
}

function resolve(dict: Dictionary | Record<string, unknown>, key: string): string | undefined {
  const value = key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, dict);
  return typeof value === "string" ? value : undefined;
}

function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    name in vars ? String(vars[name]) : match,
  );
}

export function createTranslator(dictionary: Dictionary) {
  return (key: string, vars?: Vars): string => {
    const localized = resolve(dictionary, key);
    const fallback = localized ?? resolve(enDictionary, key) ?? key;
    return interpolate(fallback, vars);
  };
}

function buildValue(locale: string, dictionary: Dictionary): I18nContextValue {
  const cfg = getLocale(locale) ?? getLocale(DEFAULT_LOCALE)!;
  const intl = cfg.intl;
  return {
    locale: cfg.code,
    dir: getDirection(cfg.code),
    t: createTranslator(dictionary),
    formatDate: (date, options) =>
      new Intl.DateTimeFormat(intl, options ?? { dateStyle: "long" }).format(
        typeof date === "string" ? new Date(date) : date,
      ),
    formatNumber: (value, options) => new Intl.NumberFormat(intl, options).format(value),
    formatCurrency: (value, currency) =>
      new Intl.NumberFormat(intl, { style: "currency", currency }).format(value),
    formatRelativeTime: (value, unit) =>
      new Intl.RelativeTimeFormat(intl, { numeric: "auto" }).format(value, unit),
  };
}

const defaultValue = buildValue(DEFAULT_LOCALE, enDictionary);

const I18nContext = createContext<I18nContextValue>(defaultValue);

export function I18nProvider({
  locale,
  dictionary,
  children,
}: {
  locale: string;
  dictionary: Dictionary;
  children: ReactNode;
}) {
  const value = useMemo(() => buildValue(locale, dictionary), [locale, dictionary]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  return useContext(I18nContext);
}

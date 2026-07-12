// ============================================================================
// Dictionary loader — lazy + cached.
//
// • English is bundled statically so SSR + the default site are instant.
// • Every other locale is loaded on demand via dynamic import() and cached in
//   a Map, so a page never ships more than one language's strings.
//
// This is the performance contract from the plan: "Only the active dictionary
// loads; English inlined for instant SSR; no N-language payload on any page."
// ============================================================================

import { DEFAULT_LOCALE } from "./locales";
import en from "./dictionaries/en.json";

export type Dictionary = typeof en;

// Static import of the default locale only. Others are code-split.
const LOADERS: Record<string, () => Promise<{ default: Dictionary }>> = {
  es: () => import("./dictionaries/es.json") as Promise<{ default: Dictionary }>,
  hi: () => import("./dictionaries/hi.json") as Promise<{ default: Dictionary }>,
  ar: () => import("./dictionaries/ar.json") as Promise<{ default: Dictionary }>,
  de: () => import("./dictionaries/de.json") as Promise<{ default: Dictionary }>,
  pt: () => import("./dictionaries/pt.json") as Promise<{ default: Dictionary }>,
  id: () => import("./dictionaries/id.json") as Promise<{ default: Dictionary }>,
  ru: () => import("./dictionaries/ru.json") as Promise<{ default: Dictionary }>,
};

const cache = new Map<string, Dictionary>([[DEFAULT_LOCALE, en]]);

export const enDictionary = en;

/** Load (and cache) a locale's dictionary. Falls back to English when missing. */
export async function getDictionary(locale: string): Promise<Dictionary> {
  const code = locale.toLowerCase();
  const cached = cache.get(code);
  if (cached) return cached;

  const loader = LOADERS[code];
  if (!loader) return en;

  const mod = await loader();
  cache.set(code, mod.default);
  return mod.default;
}

/** Synchronous read of an already-cached dictionary (English always available). */
export function getDictionarySync(locale: string): Dictionary {
  return cache.get(locale.toLowerCase()) ?? en;
}

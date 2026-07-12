/**
 * Thin client for the free Dictionary API (https://dictionaryapi.dev/).
 * Powers the Dictionary, Word Meaning, Pronunciation, IPA Converter and
 * Word Origin tools. No API key is required and every call runs client-side,
 * so these tools stay completely free.
 */

export type Definition = {
  definition: string;
  example?: string;
  synonyms: string[];
  antonyms: string[];
};

export type Meaning = {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
};

export type Phonetic = {
  text?: string;
  audio?: string;
};

export type DictionaryEntry = {
  word: string;
  phonetic?: string;
  phonetics: Phonetic[];
  origin?: string;
  meanings: Meaning[];
};

const BASE = "https://api.dictionaryapi.dev/api/v2/entries/en";

export class WordNotFoundError extends Error {
  constructor(word: string) {
    super(`No dictionary entry found for "${word}".`);
    this.name = "WordNotFoundError";
  }
}

/** Look up a single English word and return every entry the dictionary has. */
export async function lookupWord(word: string): Promise<DictionaryEntry[]> {
  const clean = word.trim().toLowerCase();
  if (!clean) return [];
  const res = await fetch(`${BASE}/${encodeURIComponent(clean)}`);
  if (res.status === 404) throw new WordNotFoundError(clean);
  if (!res.ok) throw new Error(`Lookup failed (${res.status})`);
  const data = (await res.json()) as DictionaryEntry[];
  if (!Array.isArray(data) || data.length === 0) throw new WordNotFoundError(clean);
  return data;
}

/** Return the first available IPA / phonetic spelling across all entries. */
export function firstPhoneticText(entries: DictionaryEntry[]): string | undefined {
  for (const e of entries) {
    if (e.phonetic) return e.phonetic;
    const withText = e.phonetics.find((p) => p.text);
    if (withText?.text) return withText.text;
  }
  return undefined;
}

/** Return the first available pronunciation audio URL across all entries. */
export function firstAudio(entries: DictionaryEntry[]): string | undefined {
  for (const e of entries) {
    const withAudio = e.phonetics.find((p) => p.audio && p.audio.trim().length > 0);
    if (withAudio?.audio) return withAudio.audio;
  }
  return undefined;
}

/** Collect every distinct phonetic spelling (text + optional audio). */
export function allPhonetics(entries: DictionaryEntry[]): Phonetic[] {
  const seen = new Set<string>();
  const out: Phonetic[] = [];
  for (const e of entries) {
    if (e.phonetic && !seen.has(e.phonetic)) {
      seen.add(e.phonetic);
      out.push({ text: e.phonetic });
    }
    for (const p of e.phonetics) {
      const key = `${p.text ?? ""}|${p.audio ?? ""}`;
      if ((p.text || p.audio) && !seen.has(key)) {
        seen.add(key);
        out.push(p);
      }
    }
  }
  return out;
}

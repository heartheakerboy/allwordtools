/**
 * Thin client for the free Datamuse API (https://www.datamuse.com/api/).
 * Powers the writing tools that need thesaurus / phonetic data the local
 * word list does not contain — synonyms, antonyms and rhymes. No API key
 * is required and every call runs client-side, so these tools stay free.
 */

export type RelatedWord = {
  word: string;
  score: number;
  numSyllables?: number;
};

type DatamuseRow = {
  word: string;
  score?: number;
  numSyllables?: number;
  tags?: string[];
};

const BASE = "https://api.datamuse.com/words";

async function query(params: Record<string, string>): Promise<RelatedWord[]> {
  const search = new URLSearchParams({ ...params, md: "s", max: "300" });
  const res = await fetch(`${BASE}?${search.toString()}`);
  if (!res.ok) throw new Error(`Lookup failed (${res.status})`);
  const rows = (await res.json()) as DatamuseRow[];
  return rows
    .filter((r) => /^[a-zA-Z][a-zA-Z'-]*$/.test(r.word))
    .map((r) => ({
      word: r.word,
      score: r.score ?? 0,
      numSyllables: r.numSyllables,
    }));
}

/** Synonyms (words with the same meaning). */
export function fetchSynonyms(word: string): Promise<RelatedWord[]> {
  return query({ rel_syn: word });
}

/** Strict antonyms (opposite meaning). */
export function fetchAntonyms(word: string): Promise<RelatedWord[]> {
  return query({ rel_ant: word });
}

/** Perfect rhymes. */
export function fetchPerfectRhymes(word: string): Promise<RelatedWord[]> {
  return query({ rel_rhy: word });
}

/** Near / approximate rhymes. */
export function fetchNearRhymes(word: string): Promise<RelatedWord[]> {
  return query({ rel_nry: word });
}

/** Reverse dictionary: words that mean like a phrase or definition. */
export function fetchMeansLike(phrase: string): Promise<RelatedWord[]> {
  return query({ ml: phrase });
}

/** Words that commonly FOLLOW the given word (e.g. "make" → "sense"). */
export function fetchFollowers(word: string): Promise<RelatedWord[]> {
  return query({ rel_bga: word });
}

/** Words that commonly PRECEDE the given word (e.g. "common" ← "sense"). */
export function fetchPredecessors(word: string): Promise<RelatedWord[]> {
  return query({ rel_bgb: word });
}

/** Statistically associated / "trigger" words (topical collocations). */
export function fetchAssociated(word: string): Promise<RelatedWord[]> {
  return query({ rel_trg: word });
}

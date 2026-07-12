/** Standard English Scrabble letter values. */
export const LETTER_SCORES: Record<string, number> = {
  a: 1,
  e: 1,
  i: 1,
  o: 1,
  u: 1,
  l: 1,
  n: 1,
  s: 1,
  t: 1,
  r: 1,
  d: 2,
  g: 2,
  b: 3,
  c: 3,
  m: 3,
  p: 3,
  f: 4,
  h: 4,
  v: 4,
  w: 4,
  y: 4,
  k: 5,
  j: 8,
  x: 8,
  q: 10,
  z: 10,
};

export function scoreWord(word: string): number {
  let total = 0;
  for (const ch of word) total += LETTER_SCORES[ch] ?? 0;
  return total;
}

export type UnscrambleFilters = {
  startsWith?: string;
  endsWith?: string;
  contains?: string;
  minLength?: number;
};

export type UnscrambleResult = {
  word: string;
  score: number;
  length: number;
};

function countLetters(letters: string): { counts: Record<string, number>; wildcards: number } {
  const counts: Record<string, number> = {};
  let wildcards = 0;
  for (const ch of letters) {
    if (ch === "?" || ch === "*") {
      wildcards += 1;
    } else if (ch >= "a" && ch <= "z") {
      counts[ch] = (counts[ch] ?? 0) + 1;
    }
  }
  return { counts, wildcards };
}

/** True if `word` can be built from the available letter counts + wildcards. */
function canMake(word: string, counts: Record<string, number>, wildcards: number): boolean {
  const need: Record<string, number> = {};
  for (const ch of word) need[ch] = (need[ch] ?? 0) + 1;
  let blanksLeft = wildcards;
  for (const ch in need) {
    const have = counts[ch] ?? 0;
    const shortfall = need[ch] - have;
    if (shortfall > 0) {
      blanksLeft -= shortfall;
      if (blanksLeft < 0) return false;
    }
  }
  return true;
}

/**
 * Returns every dictionary word that can be formed from `letters`.
 * `letters` may include `?` wildcards. Results are ranked by score then length.
 */
export function unscramble(
  rawLetters: string,
  dictionary: Set<string>,
  filters: UnscrambleFilters = {},
  limit = 400,
): UnscrambleResult[] {
  const letters = rawLetters.toLowerCase().replace(/[^a-z?*]/g, "");
  if (!letters) return [];

  const { counts, wildcards } = countLetters(letters);
  const totalLetters = letters.length;
  const minLength = Math.max(2, filters.minLength ?? 2);
  const startsWith = (filters.startsWith ?? "").toLowerCase().replace(/[^a-z]/g, "");
  const endsWith = (filters.endsWith ?? "").toLowerCase().replace(/[^a-z]/g, "");
  const contains = (filters.contains ?? "").toLowerCase().replace(/[^a-z]/g, "");

  const results: UnscrambleResult[] = [];
  for (const word of dictionary) {
    if (word.length < minLength || word.length > totalLetters) continue;
    if (startsWith && !word.startsWith(startsWith)) continue;
    if (endsWith && !word.endsWith(endsWith)) continue;
    if (contains && !word.includes(contains)) continue;
    if (!canMake(word, counts, wildcards)) continue;
    results.push({ word, score: scoreWord(word), length: word.length });
  }

  results.sort((a, b) => b.score - a.score || b.length - a.length || a.word.localeCompare(b.word));
  return results.slice(0, limit);
}

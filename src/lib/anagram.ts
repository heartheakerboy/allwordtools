import { scoreWord } from "./unscramble";

export type AnagramResult = { word: string; score: number; length: number };
export type MultiWordAnagram = { display: string; words: string[]; score: number };

function letterCounts(s: string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const ch of s) counts[ch] = (counts[ch] ?? 0) + 1;
  return counts;
}

function sortedKey(s: string): string {
  return s.split("").sort().join("");
}

/** Cache the signature map (sorted-letters -> words) per dictionary instance. */
const signatureCache = new WeakMap<Set<string>, Map<string, string[]>>();

function getSignatureMap(dictionary: Set<string>): Map<string, string[]> {
  const cached = signatureCache.get(dictionary);
  if (cached) return cached;
  const map = new Map<string, string[]>();
  for (const word of dictionary) {
    const key = sortedKey(word);
    const arr = map.get(key);
    if (arr) arr.push(word);
    else map.set(key, [word]);
  }
  signatureCache.set(dictionary, map);
  return map;
}

/** Can `word` be built from the available letter counts plus wildcards? */
function canMake(word: string, counts: Record<string, number>, wildcards: number): boolean {
  const need = letterCounts(word);
  let blanks = wildcards;
  for (const ch in need) {
    const shortfall = need[ch] - (counts[ch] ?? 0);
    if (shortfall > 0) {
      blanks -= shortfall;
      if (blanks < 0) return false;
    }
  }
  return true;
}

/**
 * Full-letter anagrams: every dictionary word that uses ALL of the given
 * letters exactly once (wildcards `?` may stand in for any letter).
 */
export function findAnagrams(
  rawLetters: string,
  dictionary: Set<string>,
  limit = 300,
): AnagramResult[] {
  const cleaned = rawLetters.toLowerCase().replace(/[^a-z?*]/g, "");
  if (cleaned.length < 2) return [];
  const total = cleaned.length;
  const counts: Record<string, number> = {};
  let wildcards = 0;
  for (const ch of cleaned) {
    if (ch === "?" || ch === "*") wildcards += 1;
    else counts[ch] = (counts[ch] ?? 0) + 1;
  }

  const results: AnagramResult[] = [];
  for (const word of dictionary) {
    if (word.length !== total) continue;
    if (!canMake(word, counts, wildcards)) continue;
    results.push({ word, score: scoreWord(word), length: word.length });
  }
  results.sort((a, b) => b.score - a.score || a.word.localeCompare(b.word));
  return results.slice(0, limit);
}

/**
 * Two-word anagrams that together use ALL letters exactly. Wildcards are not
 * supported here to keep results exact and fast. Pairs are de-duplicated.
 */
export function findMultiWordAnagrams(
  rawLetters: string,
  dictionary: Set<string>,
  minWordLength = 2,
  limit = 200,
): MultiWordAnagram[] {
  const cleaned = rawLetters.toLowerCase().replace(/[^a-z]/g, "");
  if (cleaned.length < minWordLength * 2) return [];

  const total = cleaned.length;
  const counts = letterCounts(cleaned);
  const sigMap = getSignatureMap(dictionary);

  const seen = new Set<string>();
  const results: MultiWordAnagram[] = [];

  for (const w1 of dictionary) {
    if (results.length >= limit) break;
    if (w1.length < minWordLength || w1.length > total - minWordLength) continue;
    if (!canMake(w1, counts, 0)) continue;

    // Remainder multiset after removing w1.
    const remain = { ...counts };
    let ok = true;
    for (const ch of w1) {
      remain[ch] -= 1;
      if (remain[ch] < 0) {
        ok = false;
        break;
      }
    }
    if (!ok) continue;

    const remainStr = Object.entries(remain)
      .flatMap(([ch, n]) => Array(n).fill(ch))
      .join("");
    if (remainStr.length < minWordLength) continue;

    const partners = sigMap.get(sortedKey(remainStr));
    if (!partners) continue;

    for (const w2 of partners) {
      const pair = [w1, w2].sort();
      const key = pair.join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      results.push({
        words: pair,
        display: `${pair[0]} ${pair[1]}`,
        score: scoreWord(w1) + scoreWord(w2),
      });
      if (results.length >= limit) break;
    }
  }

  results.sort((a, b) => b.score - a.score || a.display.localeCompare(b.display));
  return results;
}

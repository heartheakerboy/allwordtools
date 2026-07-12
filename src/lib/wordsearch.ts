import { scoreWord } from "./unscramble";

export type WordMatch = { word: string; score: number; length: number };

export type FinderFilters = {
  startsWith?: string;
  endsWith?: string;
  contains?: string;
  length?: number; // exact length, 0/undefined = any
  availableLetters?: string; // if set, words must be buildable from these letters (+ ? wildcards)
};

function letterPool(letters: string): { counts: Record<string, number>; wildcards: number } {
  const counts: Record<string, number> = {};
  let wildcards = 0;
  for (const ch of letters.toLowerCase()) {
    if (ch === "?" || ch === "*") wildcards += 1;
    else if (ch >= "a" && ch <= "z") counts[ch] = (counts[ch] ?? 0) + 1;
  }
  return { counts, wildcards };
}

function buildableFrom(word: string, counts: Record<string, number>, wildcards: number): boolean {
  const need: Record<string, number> = {};
  for (const ch of word) need[ch] = (need[ch] ?? 0) + 1;
  let blanks = wildcards;
  for (const ch in need) {
    const short = need[ch] - (counts[ch] ?? 0);
    if (short > 0) {
      blanks -= short;
      if (blanks < 0) return false;
    }
  }
  return true;
}

/**
 * General dictionary word finder. Filters by starts/ends/contains/length,
 * optionally constrained to letters you actually have.
 */
export function findWords(
  dictionary: Set<string>,
  filters: FinderFilters,
  limit = 500,
): WordMatch[] {
  const startsWith = (filters.startsWith ?? "").toLowerCase().replace(/[^a-z]/g, "");
  const endsWith = (filters.endsWith ?? "").toLowerCase().replace(/[^a-z]/g, "");
  const contains = (filters.contains ?? "").toLowerCase().replace(/[^a-z]/g, "");
  const length = filters.length && filters.length > 0 ? filters.length : 0;
  const hasPool = Boolean(filters.availableLetters && filters.availableLetters.trim());
  const { counts, wildcards } = hasPool
    ? letterPool(filters.availableLetters!)
    : { counts: {}, wildcards: 0 };

  if (!startsWith && !endsWith && !contains && !length && !hasPool) return [];

  const results: WordMatch[] = [];
  for (const word of dictionary) {
    if (length && word.length !== length) continue;
    if (startsWith && !word.startsWith(startsWith)) continue;
    if (endsWith && !word.endsWith(endsWith)) continue;
    if (contains && !word.includes(contains)) continue;
    if (hasPool && !buildableFrom(word, counts, wildcards)) continue;
    results.push({ word, score: scoreWord(word), length: word.length });
  }
  results.sort((a, b) => b.length - a.length || b.score - a.score || a.word.localeCompare(b.word));
  return results.slice(0, limit);
}

/**
 * Crossword solver. Pattern uses letters for known squares and `?`, `_` or `.`
 * for blanks. Example: "c?t" -> cat, cot, cut. Length is inferred from pattern.
 */
export function solveCrossword(pattern: string, dictionary: Set<string>, limit = 400): WordMatch[] {
  const p = pattern
    .toLowerCase()
    .replace(/[_.]/g, "?")
    .replace(/[^a-z?]/g, "");
  if (p.length < 1) return [];
  const len = p.length;

  const results: WordMatch[] = [];
  for (const word of dictionary) {
    if (word.length !== len) continue;
    let ok = true;
    for (let i = 0; i < len; i++) {
      const c = p[i];
      if (c !== "?" && word[i] !== c) {
        ok = false;
        break;
      }
    }
    if (ok) results.push({ word, score: scoreWord(word), length: word.length });
  }
  results.sort((a, b) => b.score - a.score || a.word.localeCompare(b.word));
  return results.slice(0, limit);
}

/**
 * Advanced letter-pattern finder. Supports `?` (exactly one any letter) and
 * `*` (zero or more any letters) alongside fixed letters. `_` and `.` are
 * treated as `?`. Optional exact length further narrows the matches.
 * Example: "c*t" -> cat, chart, comfort; "?e??" -> best, help, next.
 */
export function matchPattern(
  pattern: string,
  dictionary: Set<string>,
  length = 0,
  limit = 500,
): WordMatch[] {
  const p = pattern
    .toLowerCase()
    .replace(/[_.]/g, "?")
    .replace(/[^a-z?*]/g, "");
  if (!p) return [];

  const regexSource =
    "^" +
    p
      .split("")
      .map((c) => (c === "?" ? "[a-z]" : c === "*" ? "[a-z]*" : c))
      .join("") +
    "$";
  const regex = new RegExp(regexSource);

  const results: WordMatch[] = [];
  for (const word of dictionary) {
    if (length && word.length !== length) continue;
    if (!regex.test(word)) continue;
    results.push({ word, score: scoreWord(word), length: word.length });
  }
  results.sort((a, b) => a.length - b.length || b.score - a.score || a.word.localeCompare(b.word));
  return results.slice(0, limit);
}

export type WordleClues = {
  /** length-5 array; letter if green at that position, else "" */
  greens: string[];
  /** letters present in the word but position(s) unknown, with excluded positions */
  yellows: { letter: string; notAt: number[] }[];
  /** letters known to be absent entirely */
  absent: string[];
};

/**
 * Wordle solver. Returns 5-letter candidates matching greens/yellows/absent
 * clues, ranked by positional letter frequency (best next guesses first).
 */
export function solveWordle(clues: WordleClues, dictionary: Set<string>, limit = 200): WordMatch[] {
  const greens = clues.greens.map((g) => g.toLowerCase());
  const yellows = clues.yellows.map((y) => ({
    letter: y.letter.toLowerCase(),
    notAt: y.notAt,
  }));
  const requiredLetters = new Set<string>();
  greens.forEach((g) => g && requiredLetters.add(g));
  yellows.forEach((y) => y.letter && requiredLetters.add(y.letter));
  // Absent letters that are not otherwise required (a letter can be both, e.g. doubles).
  const absent = new Set(
    clues.absent.map((a) => a.toLowerCase()).filter((a) => a && !requiredLetters.has(a)),
  );

  const candidates: string[] = [];
  for (const word of dictionary) {
    if (word.length !== 5) continue;
    let ok = true;

    for (let i = 0; i < 5; i++) {
      if (greens[i] && word[i] !== greens[i]) {
        ok = false;
        break;
      }
    }
    if (!ok) continue;

    for (const y of yellows) {
      if (!y.letter) continue;
      if (!word.includes(y.letter)) {
        ok = false;
        break;
      }
      if (y.notAt.some((pos) => word[pos] === y.letter)) {
        ok = false;
        break;
      }
    }
    if (!ok) continue;

    for (const ch of word) {
      if (absent.has(ch)) {
        ok = false;
        break;
      }
    }
    if (ok) candidates.push(word);
  }

  // Rank by positional letter frequency across candidates (better guesses first).
  const freq: Record<string, number>[] = [{}, {}, {}, {}, {}];
  for (const w of candidates) {
    for (let i = 0; i < 5; i++) freq[i][w[i]] = (freq[i][w[i]] ?? 0) + 1;
  }
  const scored = candidates.map((word) => {
    const seen = new Set<string>();
    let s = 0;
    for (let i = 0; i < 5; i++) {
      s += freq[i][word[i]] ?? 0;
      if (!seen.has(word[i])) {
        seen.add(word[i]);
      } else {
        s -= 2; // slight penalty for repeated letters (less information)
      }
    }
    return { word, score: s, length: 5 };
  });
  scored.sort((a, b) => b.score - a.score || a.word.localeCompare(b.word));
  return scored.slice(0, limit);
}

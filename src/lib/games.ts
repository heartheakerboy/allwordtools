import { LETTER_SCORES, scoreWord } from "./unscramble";

export type RackResult = { word: string; score: number; length: number };

/** Words With Friends letter values (differ from Scrabble). */
export const WWF_LETTER_SCORES: Record<string, number> = {
  a: 1,
  e: 1,
  i: 1,
  o: 1,
  t: 1,
  r: 1,
  s: 1,
  d: 2,
  l: 2,
  n: 2,
  u: 2,
  g: 3,
  h: 3,
  y: 3,
  b: 4,
  c: 4,
  f: 4,
  m: 4,
  p: 4,
  w: 4,
  k: 5,
  v: 5,
  x: 8,
  j: 10,
  q: 10,
  z: 10,
};

export function scoreWordWith(word: string, table: Record<string, number>): number {
  let total = 0;
  for (const ch of word) total += table[ch] ?? 0;
  return total;
}

export type RackGame = "scrabble" | "wwf";

function countLetters(letters: string): { counts: Record<string, number>; wildcards: number } {
  const counts: Record<string, number> = {};
  let wildcards = 0;
  for (const ch of letters) {
    if (ch === "?" || ch === "*") wildcards += 1;
    else if (ch >= "a" && ch <= "z") counts[ch] = (counts[ch] ?? 0) + 1;
  }
  return { counts, wildcards };
}

function canMake(word: string, counts: Record<string, number>, wildcards: number): boolean {
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

export type RackFilters = {
  startsWith?: string;
  endsWith?: string;
  contains?: string;
  minLength?: number;
};

/**
 * Finds every playable word from a rack of tiles for Scrabble or Words With
 * Friends, scored with that game's letter values and ranked highest first.
 */
export function rackSolve(
  rawLetters: string,
  dictionary: Set<string>,
  game: RackGame,
  filters: RackFilters = {},
  limit = 400,
): RackResult[] {
  const letters = rawLetters.toLowerCase().replace(/[^a-z?*]/g, "");
  if (!letters) return [];
  const table = game === "wwf" ? WWF_LETTER_SCORES : LETTER_SCORES;
  const { counts, wildcards } = countLetters(letters);
  const total = letters.length;
  const minLength = Math.max(2, filters.minLength ?? 2);
  const startsWith = (filters.startsWith ?? "").toLowerCase().replace(/[^a-z]/g, "");
  const endsWith = (filters.endsWith ?? "").toLowerCase().replace(/[^a-z]/g, "");
  const contains = (filters.contains ?? "").toLowerCase().replace(/[^a-z]/g, "");

  const results: RackResult[] = [];
  for (const word of dictionary) {
    if (word.length < minLength || word.length > total) continue;
    if (startsWith && !word.startsWith(startsWith)) continue;
    if (endsWith && !word.endsWith(endsWith)) continue;
    if (contains && !word.includes(contains)) continue;
    if (!canMake(word, counts, wildcards)) continue;
    results.push({ word, score: scoreWordWith(word, table), length: word.length });
  }
  results.sort((a, b) => b.score - a.score || b.length - a.length || a.word.localeCompare(b.word));
  return results.slice(0, limit);
}

/** Standard Boggle scoring by word length. */
export function boggleScore(len: number): number {
  if (len <= 2) return 0;
  if (len <= 4) return 1;
  if (len === 5) return 2;
  if (len === 6) return 3;
  if (len === 7) return 5;
  return 11;
}

export type BoggleResult = { word: string; score: number; length: number };

/**
 * Boggle solver. `grid` is a 2D array of cell tokens (a single letter, or a
 * multi-letter tile like "qu"). Finds every dictionary word that can be traced
 * through orthogonally/diagonally adjacent cells without reusing a cell.
 */
export function solveBoggle(
  grid: string[][],
  dictionary: Set<string>,
  minLength = 3,
  limit = 500,
): BoggleResult[] {
  const rows = grid.length;
  if (rows === 0) return [];
  const cols = grid[0].length;
  const cells: string[] = [];
  for (const row of grid) for (const c of row) cells.push(c.toLowerCase());
  if (cells.every((c) => c === "")) return [];

  // Letters available on the board (for a quick pre-filter).
  const boardLetters = new Set<string>();
  for (const cell of cells) for (const ch of cell) boardLetters.add(ch);

  const idx = (r: number, c: number) => r * cols + c;
  const neighbors: number[][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const list: number[] = [];
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) list.push(idx(nr, nc));
        }
      }
      neighbors[idx(r, c)] = list;
    }
  }

  const visited = new Array<boolean>(cells.length).fill(false);

  // Depth-first: can we match word[pos..] starting from cell `at`?
  function trace(word: string, pos: number, at: number): boolean {
    const cell = cells[at];
    if (!cell) return false;
    if (!word.startsWith(cell, pos)) return false;
    const next = pos + cell.length;
    if (next === word.length) return true;
    visited[at] = true;
    for (const n of neighbors[at]) {
      if (!visited[n] && trace(word, next, n)) {
        visited[at] = false;
        return true;
      }
    }
    visited[at] = false;
    return false;
  }

  const maxLen = cells.reduce((sum, c) => sum + Math.max(c.length, 1), 0);
  const results: BoggleResult[] = [];
  for (const word of dictionary) {
    if (word.length < minLength || word.length > maxLen) continue;
    let ok = true;
    for (const ch of word) {
      if (!boardLetters.has(ch)) {
        ok = false;
        break;
      }
    }
    if (!ok) continue;
    let found = false;
    for (let i = 0; i < cells.length; i++) {
      if (word.startsWith(cells[i], 0) && cells[i] && trace(word, 0, i)) {
        found = true;
        break;
      }
    }
    if (found) results.push({ word, score: boggleScore(word.length), length: word.length });
  }
  results.sort((a, b) => b.length - a.length || b.score - a.score || a.word.localeCompare(b.word));
  return results.slice(0, limit);
}

export type HangmanSuggestion = { letter: string; count: number; percent: number };
export type HangmanSolution = {
  candidates: string[];
  suggestions: HangmanSuggestion[];
  total: number;
};

/**
 * Hangman solver. `pattern` uses known letters and `_`, `.` or `?` for unknown
 * positions (e.g. "_pp_e"). `excluded` are letters already guessed wrong.
 * Returns matching words plus the best next letters to guess by frequency.
 */
export function solveHangman(
  pattern: string,
  excluded: string,
  dictionary: Set<string>,
  limit = 300,
): HangmanSolution {
  const p = pattern
    .toLowerCase()
    .replace(/[.?]/g, "_")
    .replace(/[^a-z_]/g, "");
  if (!p) return { candidates: [], suggestions: [], total: 0 };
  const len = p.length;
  const excludedSet = new Set(
    excluded
      .toLowerCase()
      .replace(/[^a-z]/g, "")
      .split(""),
  );
  const knownSet = new Set(p.split("").filter((c) => c !== "_"));

  const matches: string[] = [];
  for (const word of dictionary) {
    if (word.length !== len) continue;
    let ok = true;
    for (let i = 0; i < len; i++) {
      const c = p[i];
      if (c === "_") {
        // A blank can't hold a letter we've already revealed or excluded.
        if (knownSet.has(word[i]) || excludedSet.has(word[i])) {
          ok = false;
          break;
        }
      } else if (word[i] !== c) {
        ok = false;
        break;
      }
    }
    if (ok) matches.push(word);
  }

  // Suggest the letters that appear in the most candidate words (best info).
  const counts: Record<string, number> = {};
  for (const word of matches) {
    const seen = new Set<string>();
    for (const ch of word) {
      if (knownSet.has(ch) || excludedSet.has(ch) || seen.has(ch)) continue;
      seen.add(ch);
      counts[ch] = (counts[ch] ?? 0) + 1;
    }
  }
  const suggestions: HangmanSuggestion[] = Object.entries(counts)
    .map(([letter, count]) => ({
      letter,
      count,
      percent: matches.length ? Math.round((count / matches.length) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count || a.letter.localeCompare(b.letter))
    .slice(0, 8);

  matches.sort((a, b) => scoreWord(b) - scoreWord(a) || a.localeCompare(b));
  return { candidates: matches.slice(0, limit), suggestions, total: matches.length };
}

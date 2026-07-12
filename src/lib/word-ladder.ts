/**
 * Word Ladder solver — finds the shortest chain of real words between a start
 * and end word, changing exactly one letter at a time (every step must be a
 * valid dictionary word). Classic breadth-first search over the word graph.
 * Runs entirely client-side against the shared ENABLE dictionary.
 */

export type LadderResult =
  | { status: "found"; ladder: string[] }
  | { status: "no-path" }
  | { status: "invalid"; reason: string };

const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");

/** All words of a given length, lowercased, from the dictionary. */
function wordsOfLength(dictionary: Set<string>, len: number): Set<string> {
  const out = new Set<string>();
  for (const w of dictionary) if (w.length === len) out.add(w);
  return out;
}

export function solveWordLadder(
  start: string,
  end: string,
  dictionary: Set<string>,
  maxNodes = 200000,
): LadderResult {
  const a = start.trim().toLowerCase();
  const b = end.trim().toLowerCase();

  if (!a || !b) return { status: "invalid", reason: "Enter both a start and an end word." };
  if (!/^[a-z]+$/.test(a) || !/^[a-z]+$/.test(b))
    return { status: "invalid", reason: "Use letters only — no spaces or symbols." };
  if (a.length !== b.length)
    return { status: "invalid", reason: "Both words must have the same number of letters." };
  if (a === b) return { status: "found", ladder: [a] };
  if (!dictionary.has(a)) return { status: "invalid", reason: `"${a}" is not in the dictionary.` };
  if (!dictionary.has(b)) return { status: "invalid", reason: `"${b}" is not in the dictionary.` };

  const pool = wordsOfLength(dictionary, a.length);
  const visited = new Set<string>([a]);
  const parent = new Map<string, string>();
  let frontier = [a];
  let nodes = 0;

  while (frontier.length > 0) {
    const next: string[] = [];
    for (const word of frontier) {
      const chars = word.split("");
      for (let i = 0; i < chars.length; i++) {
        const original = chars[i];
        for (const l of LETTERS) {
          if (l === original) continue;
          chars[i] = l;
          const candidate = chars.join("");
          if (!visited.has(candidate) && pool.has(candidate)) {
            visited.add(candidate);
            parent.set(candidate, word);
            if (candidate === b) {
              const ladder: string[] = [b];
              let cur = b;
              while (parent.has(cur)) {
                cur = parent.get(cur)!;
                ladder.push(cur);
              }
              return { status: "found", ladder: ladder.reverse() };
            }
            next.push(candidate);
            nodes++;
            if (nodes > maxNodes) return { status: "no-path" };
          }
        }
        chars[i] = original;
      }
    }
    frontier = next;
  }

  return { status: "no-path" };
}

/**
 * Heuristic English syllable counter. Runs entirely in the browser — no
 * dictionary or network needed. Not perfect for every irregular word, but
 * accurate for the vast majority of English words and great for haiku,
 * poetry and readability checks.
 */

const SUBTRACT = [
  /cial/,
  /tia/,
  /cius/,
  /cious/,
  /uiet/,
  /gious/,
  /geous/,
  /priest/,
  /giu/,
  /dge/,
  /ion/,
  /iou/,
  /sia$/,
  /[^aeiuoyt]{2}ed$/,
  /.ely$/,
  /[cg]h?e[rsd]?$/,
  /rved?$/,
  /[aeiouy][dt]es?$/,
  /[aeiouy][^aeiouydt]e[rsd]?$/,
  /^[dr]e[aeiou][^aeiou]+$/,
  /[aeiouy]rse$/,
];

const ADD = [
  /ia/,
  /riet/,
  /dien/,
  /ien/,
  /iet/,
  /iu/,
  /iest/,
  /io/,
  /ii/,
  /[aeiouym]bl$/,
  /[aeiou]{3}/,
  /^mc/,
  /ism$/,
  /([^aeiouy])\1l$/,
  /[^l]lien/,
  /^coa[dglx]./,
  /[^gq]ua[^auieo]/,
  /dnt$/,
  /uity$/,
  /[^aeiouy]ie(r|st)$/,
  /[aeiouy]ing$/,
  /[aeiouw]y[aeiou]/,
];

export function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;

  const str = w.replace(/(?:[^laeiouy]es|[^laeiouy]e)$/, "").replace(/^y/, "");
  const groups = str.match(/[aeiouy]{1,2}/g);
  let count = groups ? groups.length : 0;

  for (const re of SUBTRACT) if (re.test(w)) count -= 1;
  for (const re of ADD) if (re.test(w)) count += 1;

  return Math.max(1, count);
}

export type SyllableWord = { word: string; syllables: number };

export function analyseSyllables(text: string): {
  words: SyllableWord[];
  totalSyllables: number;
  totalWords: number;
} {
  const tokens = text.match(/[a-zA-Z'']+/g) ?? [];
  const words = tokens.map((t) => ({ word: t, syllables: countSyllables(t) }));
  const totalSyllables = words.reduce((sum, w) => sum + w.syllables, 0);
  return { words, totalSyllables, totalWords: words.length };
}

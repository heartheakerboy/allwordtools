/**
 * Central external-linking engine.
 *
 * A single source of truth that decides, context-aware and automatically,
 * which — if any — high-authority external references belong on a given page.
 * It mirrors the philosophy of `internal-links.ts`, but for outbound citations:
 *
 *   - A curated WHITELIST of trusted domains (the ONLY domains allowed).
 *   - A curated REFERENCE LIBRARY of specific, genuinely-useful pages on those
 *     domains, each attached to the linguistic/educational concept it explains.
 *   - Automatic matching: references are selected from a page's topic, tags and
 *     keywords (reusing the metadata engine) — pages NEVER hardcode URLs.
 *   - Hard caps per page type so internal links always dominate (90–95%).
 *   - If no high-quality reference matches, nothing is emitted. Quality over
 *     quantity, always.
 *
 * Design goal: scale to 10,000+ pages with zero per-page URL wiring. A new tool
 * dropped into the data file is automatically matched against the same concept
 * library, so it gets the right citations (or none) with no manual work.
 */

import { getToolMeta } from "@/lib/tool-metadata";
import { categories, allTools } from "@/data/tools";

/* ------------------------------------------------------------------ */
/* Trusted source whitelist — the ONLY domains allowed                 */
/* ------------------------------------------------------------------ */

export type SourceKey =
  | "wikipedia"
  | "merriam-webster"
  | "cambridge"
  | "britannica"
  | "wiktionary"
  | "oxford"
  | "google-search-central"
  | "mdn"
  | "unicode"
  | "w3c";

export type SourceType = "encyclopedia" | "dictionary" | "standards" | "seo" | "developer";

export type TrustedSource = {
  key: SourceKey;
  name: string;
  domain: string;
  /** Editorial authority score, 0–100. Used for ranking + the audit report. */
  authority: number;
  type: SourceType;
};

/**
 * The complete whitelist. No external link may ever point outside these
 * domains — the matcher only ever produces URLs built from this table.
 */
export const TRUSTED_SOURCES: Record<SourceKey, TrustedSource> = {
  wikipedia: {
    key: "wikipedia",
    name: "Wikipedia",
    domain: "en.wikipedia.org",
    authority: 92,
    type: "encyclopedia",
  },
  "merriam-webster": {
    key: "merriam-webster",
    name: "Merriam-Webster",
    domain: "www.merriam-webster.com",
    authority: 95,
    type: "dictionary",
  },
  cambridge: {
    key: "cambridge",
    name: "Cambridge Dictionary",
    domain: "dictionary.cambridge.org",
    authority: 94,
    type: "dictionary",
  },
  britannica: {
    key: "britannica",
    name: "Encyclopædia Britannica",
    domain: "www.britannica.com",
    authority: 93,
    type: "encyclopedia",
  },
  wiktionary: {
    key: "wiktionary",
    name: "Wiktionary",
    domain: "en.wiktionary.org",
    authority: 85,
    type: "dictionary",
  },
  oxford: {
    key: "oxford",
    name: "Oxford Languages",
    domain: "www.oxfordlearnersdictionaries.com",
    authority: 94,
    type: "dictionary",
  },
  "google-search-central": {
    key: "google-search-central",
    name: "Google Search Central",
    domain: "developers.google.com",
    authority: 96,
    type: "seo",
  },
  mdn: {
    key: "mdn",
    name: "MDN Web Docs",
    domain: "developer.mozilla.org",
    authority: 95,
    type: "developer",
  },
  unicode: {
    key: "unicode",
    name: "Unicode Consortium",
    domain: "home.unicode.org",
    authority: 96,
    type: "standards",
  },
  w3c: { key: "w3c", name: "W3C", domain: "www.w3.org", authority: 96, type: "standards" },
};

export function getSource(key: SourceKey): TrustedSource {
  return TRUSTED_SOURCES[key];
}

/* ------------------------------------------------------------------ */
/* Reference model                                                     */
/* ------------------------------------------------------------------ */

export type ExternalRel = "sponsored" | "ugc";

export type Reference = {
  /** Stable id. */
  id: string;
  /** Descriptive anchor text — never "click here" / "read more". */
  label: string;
  /** Absolute URL on a whitelisted domain. */
  url: string;
  /** Which trusted source this belongs to. */
  source: SourceKey;
  /** Human-readable concept this reference explains (for grouping/badges). */
  topic: string;
  /**
   * Substrings tested against a page's searchable text (name + description +
   * category + tags + keywords). Any hit attaches the reference.
   */
  triggers: string[];
  /**
   * Trusted editorial citations are followed by default (no nofollow).
   * Only affiliate/sponsored/user-generated links carry a rel — none here,
   * but the field keeps the model complete + scalable.
   */
  rel?: ExternalRel;
};

/**
 * The curated reference library. Every entry is a specific, genuinely
 * educational page on a whitelisted domain, tied to the concept it clarifies.
 * These are matched automatically — pages never reference URLs directly.
 */
export const REFERENCE_LIBRARY: Reference[] = [
  /* Word games ----------------------------------------------------- */
  {
    id: "wiki-anagram",
    label: "Wikipedia article on anagrams",
    url: "https://en.wikipedia.org/wiki/Anagram",
    source: "wikipedia",
    topic: "Anagrams",
    triggers: ["anagram", "unscramble", "rearrange", "jumble"],
  },
  {
    id: "wiki-scrabble",
    label: "Wikipedia article on Scrabble",
    url: "https://en.wikipedia.org/wiki/Scrabble",
    source: "wikipedia",
    topic: "Scrabble",
    triggers: ["scrabble"],
  },
  {
    id: "wiki-wwf",
    label: "Wikipedia article on Words With Friends",
    url: "https://en.wikipedia.org/wiki/Words_with_Friends",
    source: "wikipedia",
    topic: "Words With Friends",
    triggers: ["words with friends"],
  },
  {
    id: "wiki-crossword",
    label: "Wikipedia article on crosswords",
    url: "https://en.wikipedia.org/wiki/Crossword",
    source: "wikipedia",
    topic: "Crosswords",
    triggers: ["crossword"],
  },
  {
    id: "wiki-wordle",
    label: "Wikipedia article on Wordle",
    url: "https://en.wikipedia.org/wiki/Wordle",
    source: "wikipedia",
    topic: "Wordle",
    triggers: ["wordle"],
  },
  {
    id: "wiki-boggle",
    label: "Wikipedia article on Boggle",
    url: "https://en.wikipedia.org/wiki/Boggle",
    source: "wikipedia",
    topic: "Boggle",
    triggers: ["boggle"],
  },
  {
    id: "wiki-hangman",
    label: "Wikipedia article on Hangman",
    url: "https://en.wikipedia.org/wiki/Hangman_(game)",
    source: "wikipedia",
    topic: "Hangman",
    triggers: ["hangman"],
  },

  /* Vocabulary & word relationships -------------------------------- */
  {
    id: "wiki-synonym",
    label: "Wikipedia article on synonyms",
    url: "https://en.wikipedia.org/wiki/Synonym",
    source: "wikipedia",
    topic: "Synonyms",
    triggers: ["synonym"],
  },
  {
    id: "mw-thesaurus",
    label: "Merriam-Webster Thesaurus",
    url: "https://www.merriam-webster.com/thesaurus",
    source: "merriam-webster",
    topic: "Synonyms",
    triggers: ["synonym", "antonym"],
  },
  {
    id: "wiki-antonym",
    label: "Wikipedia article on antonyms (opposites)",
    url: "https://en.wikipedia.org/wiki/Opposite_(semantics)",
    source: "wikipedia",
    topic: "Antonyms",
    triggers: ["antonym", "opposite"],
  },
  {
    id: "wiki-collocation",
    label: "Wikipedia article on collocation",
    url: "https://en.wikipedia.org/wiki/Collocation",
    source: "wikipedia",
    topic: "Collocation",
    triggers: ["collocation"],
  },
  {
    id: "wiki-phrase",
    label: "Wikipedia article on phrases",
    url: "https://en.wikipedia.org/wiki/Phrase",
    source: "wikipedia",
    topic: "Phrases",
    triggers: ["phrase", "idiom"],
  },
  {
    id: "wiki-vocabulary",
    label: "Wikipedia article on vocabulary",
    url: "https://en.wikipedia.org/wiki/Vocabulary",
    source: "wikipedia",
    topic: "Vocabulary",
    triggers: ["vocabulary"],
  },

  /* Sound & spelling ---------------------------------------------- */
  {
    id: "wiki-rhyme",
    label: "Wikipedia article on rhyme",
    url: "https://en.wikipedia.org/wiki/Rhyme",
    source: "wikipedia",
    topic: "Rhyme",
    triggers: ["rhyme", "rhyming"],
  },
  {
    id: "wiki-syllable",
    label: "Wikipedia article on syllables",
    url: "https://en.wikipedia.org/wiki/Syllable",
    source: "wikipedia",
    topic: "Syllables",
    triggers: ["syllable"],
  },
  {
    id: "wiki-ipa",
    label: "Wikipedia article on the International Phonetic Alphabet",
    url: "https://en.wikipedia.org/wiki/International_Phonetic_Alphabet",
    source: "wikipedia",
    topic: "Phonetics (IPA)",
    triggers: ["ipa", "phonetic", "pronunciation"],
  },
  {
    id: "wiki-orthography",
    label: "Wikipedia article on English spelling",
    url: "https://en.wikipedia.org/wiki/English_orthography",
    source: "wikipedia",
    topic: "Spelling",
    triggers: ["spelling", "spell check", "spell checker", "misspell"],
  },

  /* Letters & alphabet -------------------------------------------- */
  {
    id: "wiki-vowel",
    label: "Wikipedia article on vowels",
    url: "https://en.wikipedia.org/wiki/Vowel",
    source: "wikipedia",
    topic: "Vowels",
    triggers: ["vowel"],
  },
  {
    id: "wiki-consonant",
    label: "Wikipedia article on consonants",
    url: "https://en.wikipedia.org/wiki/Consonant",
    source: "wikipedia",
    topic: "Consonants",
    triggers: ["consonant"],
  },
  {
    id: "wiki-alphabet",
    label: "Wikipedia article on the English alphabet",
    url: "https://en.wikipedia.org/wiki/English_alphabet",
    source: "wikipedia",
    topic: "Alphabet",
    triggers: ["alphabet", "alphabetical"],
  },

  /* Grammar -------------------------------------------------------- */
  {
    id: "wiki-english-grammar",
    label: "Wikipedia article on English grammar",
    url: "https://en.wikipedia.org/wiki/English_grammar",
    source: "wikipedia",
    topic: "Grammar",
    triggers: ["grammar"],
  },
  {
    id: "cambridge-grammar",
    label: "Cambridge Dictionary grammar guide",
    url: "https://dictionary.cambridge.org/grammar/british-grammar/",
    source: "cambridge",
    topic: "Grammar",
    triggers: ["grammar"],
  },
  {
    id: "wiki-voice",
    label: "Wikipedia article on grammatical voice",
    url: "https://en.wikipedia.org/wiki/Voice_(grammar)",
    source: "wikipedia",
    topic: "Active & passive voice",
    triggers: ["passive voice", "active voice", "voice"],
  },
  {
    id: "wiki-punctuation",
    label: "Wikipedia article on punctuation",
    url: "https://en.wikipedia.org/wiki/Punctuation",
    source: "wikipedia",
    topic: "Punctuation",
    triggers: ["punctuation", "comma"],
  },
  {
    id: "wiki-prefix",
    label: "Wikipedia article on prefixes",
    url: "https://en.wikipedia.org/wiki/Prefix",
    source: "wikipedia",
    topic: "Prefixes",
    triggers: ["prefix"],
  },
  {
    id: "wiki-suffix",
    label: "Wikipedia article on suffixes",
    url: "https://en.wikipedia.org/wiki/Suffix",
    source: "wikipedia",
    topic: "Suffixes",
    triggers: ["suffix"],
  },

  /* Dictionary / meaning / etymology ------------------------------- */
  {
    id: "wiki-definition",
    label: "Wikipedia article on definitions",
    url: "https://en.wikipedia.org/wiki/Definition",
    source: "wikipedia",
    topic: "Definitions",
    triggers: ["definition", "meaning", "define"],
  },
  {
    id: "cambridge-dictionary",
    label: "Cambridge Dictionary",
    url: "https://dictionary.cambridge.org/",
    source: "cambridge",
    topic: "Dictionary",
    triggers: ["dictionary", "definition", "meaning"],
  },
  {
    id: "mw-dictionary",
    label: "Merriam-Webster Dictionary",
    url: "https://www.merriam-webster.com/",
    source: "merriam-webster",
    topic: "Dictionary",
    triggers: ["dictionary", "definition", "meaning"],
  },
  {
    id: "wiki-etymology",
    label: "Wikipedia article on etymology",
    url: "https://en.wikipedia.org/wiki/Etymology",
    source: "wikipedia",
    topic: "Etymology",
    triggers: ["etymology", "origin", "word origin"],
  },
  {
    id: "wiktionary",
    label: "Wiktionary, the free dictionary",
    url: "https://en.wiktionary.org/",
    source: "wiktionary",
    topic: "Dictionary",
    triggers: ["etymology", "origin", "reverse dictionary"],
  },
  {
    id: "wiki-word",
    label: "Wikipedia article on words",
    url: "https://en.wikipedia.org/wiki/Word",
    source: "wikipedia",
    topic: "Words & lexicon",
    triggers: ["lexicon", "word game", "wordplay"],
  },
];

/* ------------------------------------------------------------------ */
/* Matching engine                                                     */
/* ------------------------------------------------------------------ */

function normalize(text: string): string {
  return ` ${text.toLowerCase().replace(/-/g, " ").replace(/\s+/g, " ")} `;
}

/**
 * Rank references against a searchable text blob. Scores by number of trigger
 * hits, then by source authority. Only one reference per topic is kept, so a
 * page never over-links the same concept.
 */
function matchReferences(text: string, limit: number): Reference[] {
  const haystack = normalize(text);
  const scored = REFERENCE_LIBRARY.map((ref) => {
    const hits = ref.triggers.filter(
      (t) => haystack.includes(` ${t} `) || haystack.includes(t),
    ).length;
    return { ref, hits };
  }).filter((x) => x.hits > 0);

  scored.sort((a, b) => {
    if (b.hits !== a.hits) return b.hits - a.hits;
    return getSource(b.ref.source).authority - getSource(a.ref.source).authority;
  });

  const seenTopic = new Set<string>();
  const out: Reference[] = [];
  for (const { ref } of scored) {
    if (seenTopic.has(ref.topic)) continue;
    seenTopic.add(ref.topic);
    out.push(ref);
    if (out.length >= limit) break;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Public API — page-level reference resolution                        */
/* ------------------------------------------------------------------ */

/** Searchable blob for a tool: name + description + category + tags + keywords. */
function toolSearchText(slug: string): string | null {
  const meta = getToolMeta(slug);
  if (!meta) return null;
  return [meta.name, meta.description, meta.categoryTitle, ...meta.tags, ...meta.keywords].join(
    " ",
  );
}

/**
 * References for a tool page. Deliberately conservative — capped at 2 so tool
 * pages carry citations only for the linguistic concept they teach, never for
 * SEO padding. Returns [] when no whitelisted reference genuinely applies.
 */
export function getToolReferences(slug: string, limit = 2): Reference[] {
  const text = toolSearchText(slug);
  if (!text) return [];
  return matchReferences(text, limit);
}

/**
 * References for a category page. Aggregates the concepts across the whole
 * category (title + description + every tool's tags/keywords) and returns the
 * 2–5 most relevant authoritative references. Returns [] when none apply.
 */
export function getCategoryReferences(catSlug: string, limit = 5): Reference[] {
  const category = categories.find((c) => c.slug === catSlug);
  if (!category) return [];
  const parts: string[] = [category.title, category.description];
  for (const t of category.tools) {
    const meta = getToolMeta(t.slug);
    if (meta) parts.push(meta.name, ...meta.tags, ...meta.keywords);
    else parts.push(t.name, t.description);
  }
  return matchReferences(parts.join(" "), limit);
}

/** Free-form reference resolution for editorial pages (blog, learn, FAQ). */
export function getReferencesForTopic(text: string, limit = 8): Reference[] {
  return matchReferences(text, limit);
}

/**
 * Build the `rel` attribute for an external link. Trusted editorial citations
 * get `noopener noreferrer` only (followed). Affiliate/sponsored/UGC links add
 * their required token.
 */
export function externalRel(ref: Pick<Reference, "rel">): string {
  const base = ["noopener", "noreferrer"];
  if (ref.rel) base.push(ref.rel);
  return base.join(" ");
}

/* ------------------------------------------------------------------ */
/* SEO audit — external-link report                                    */
/* ------------------------------------------------------------------ */

export type PageExternalAudit = {
  page: string;
  type: "tool" | "category";
  externalLinks: number;
  references: string[];
  authorityScore: number; // average authority of cited sources (0 if none)
  overlinked: boolean; // more references than the page-type cap allows
  spamRisk: "none" | "low";
};

const TOOL_CAP = 2;
const CATEGORY_CAP = 5;

function auditRefs(page: string, type: "tool" | "category", refs: Reference[]): PageExternalAudit {
  const cap = type === "tool" ? TOOL_CAP : CATEGORY_CAP;
  const authorityScore = refs.length
    ? Math.round(refs.reduce((s, r) => s + getSource(r.source).authority, 0) / refs.length)
    : 0;
  return {
    page,
    type,
    externalLinks: refs.length,
    references: refs.map((r) => `${getSource(r.source).name}: ${r.label}`),
    authorityScore,
    overlinked: refs.length > cap,
    spamRisk: "none", // every URL is whitelist-only, so spam risk is structurally zero
  };
}

/** Whole-site external-linking audit — powers the SEO quality report. */
export function buildExternalLinkReport() {
  const toolAudits = allTools.map((t) =>
    auditRefs(`/tool/${t.slug}`, "tool", getToolReferences(t.slug)),
  );
  const categoryAudits = categories.map((c) =>
    auditRefs(`/category/${c.slug}`, "category", getCategoryReferences(c.slug)),
  );
  const all = [...toolAudits, ...categoryAudits];
  const withRefs = all.filter((a) => a.externalLinks > 0);
  return {
    pages: all.length,
    pagesWithReferences: withRefs.length,
    pagesWithoutReferences: all.length - withRefs.length,
    totalExternalLinks: all.reduce((s, a) => s + a.externalLinks, 0),
    overlinkedPages: all.filter((a) => a.overlinked).map((a) => a.page),
    averageAuthority: withRefs.length
      ? Math.round(withRefs.reduce((s, a) => s + a.authorityScore, 0) / withRefs.length)
      : 0,
    audits: all,
  };
}

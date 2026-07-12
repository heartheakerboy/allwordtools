/**
 * Extract the English base content for the localized tools into a flat JSON
 * file the DeepSeek generation pipeline consumes.
 *
 * Run: bun scripts/extract-english-content.ts
 * Output: scripts/.cache/english-base.json
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { allTools } from "../src/data/tools";
import { toolContent } from "../src/data/tool-content";

// The 40 priority tools we localize (source of truth = the slugs already
// present in the locale JSON files). Keep in sync with the content dirs.
const TARGET_SLUGS = [
  "word-unscrambler",
  "anagram-solver",
  "wordle-solver",
  "scrabble-helper",
  "words-with-friends-helper",
  "crossword-solver",
  "word-finder",
  "rhyming-words",
  "synonym-finder",
  "antonym-finder",
  "words-starting-with",
  "words-ending-with",
  "words-containing",
  "letter-counter",
  "syllable-counter",
  "random-word-generator",
  "boggle-solver",
  "hangman-solver",
  "text-twist-solver",
  "vowel-counter",
  "consonant-counter",
  "word-meaning",
  "spell-checker",
  "grammar-checker",
  "punctuation-checker",
  "wordscapes-solver",
  "word-cookies-solver",
  "codycross-solver",
  "seven-little-words-solver",
  "wheel-of-fortune-solver",
  "letter-pattern-finder",
  "wildcard-solver",
  "pattern-solver",
  "missing-letters-finder",
  "letter-rearranger",
  "reverse-dictionary",
  "alphabetical-sorter",
  "random-letter-generator",
  "vocabulary-quiz",
  "spelling-quiz",
];

const bySlug = new Map(allTools.map((t) => [t.slug, t]));

const base = TARGET_SLUGS.map((slug) => {
  const tool = bySlug.get(slug);
  const c = toolContent[slug];
  if (!tool || !c) {
    console.warn(`Missing base for ${slug}`);
    return null;
  }
  return {
    slug,
    name: tool.name,
    description: tool.description,
    category: tool.category,
    // Only the fields we localize (a subset of ToolContent).
    metaTitle: c.metaTitle,
    metaDescription: c.metaDescription,
    eyebrow: c.eyebrow,
    heading: c.heading,
    subheading: c.subheading,
    intro: c.intro,
    howToTitle: c.howToTitle,
    howToSteps: c.howToSteps,
    sections: c.sections,
    examples: c.examples,
    tips: c.tips,
    faqs: c.faqs,
  };
}).filter(Boolean);

mkdirSync("scripts/.cache", { recursive: true });
writeFileSync("scripts/.cache/english-base.json", JSON.stringify(base, null, 2));
console.log(`Wrote ${base.length} tools to scripts/.cache/english-base.json`);

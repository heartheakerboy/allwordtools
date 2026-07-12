/**
 * Word banks and helpers powering the Random Generators tools.
 * Everything runs client-side — no network, no dependencies.
 */

export function pickOne<T>(pool: readonly T[]): T {
  return pool[Math.floor(Math.random() * pool.length)];
}

export function pickMany<T>(pool: readonly T[], count: number): T[] {
  if (count >= pool.length) return shuffle([...pool]);
  const chosen = new Set<number>();
  const out: T[] = [];
  while (out.length < count) {
    const i = Math.floor(Math.random() * pool.length);
    if (!chosen.has(i)) {
      chosen.add(i);
      out.push(pool[i]);
    }
  }
  return out;
}

export function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
export const VOWELS = "AEIOU";
export const CONSONANTS = "BCDFGHJKLMNPQRSTVWXYZ";

export type LetterOptions = {
  count: number;
  set: "all" | "vowels" | "consonants";
  lowercase: boolean;
  unique: boolean;
};

export function generateLetters(opts: LetterOptions): string[] {
  const pool = opts.set === "vowels" ? VOWELS : opts.set === "consonants" ? CONSONANTS : UPPERCASE;
  const count = Math.max(1, Math.min(100, opts.count));
  let letters: string[] = [];
  if (opts.unique) {
    letters = pickMany(pool.split(""), Math.min(count, pool.length));
  } else {
    for (let i = 0; i < count; i++) letters.push(pickOne(pool.split("")));
  }
  return opts.lowercase ? letters.map((l) => l.toLowerCase()) : letters;
}

/* ---------- Verbs ---------- */

export const VERBS: string[] = [
  "accept",
  "achieve",
  "admire",
  "adopt",
  "advise",
  "amaze",
  "announce",
  "appreciate",
  "arrange",
  "arrive",
  "ask",
  "attack",
  "balance",
  "bake",
  "become",
  "begin",
  "believe",
  "belong",
  "bounce",
  "brighten",
  "build",
  "calculate",
  "capture",
  "celebrate",
  "challenge",
  "change",
  "cheer",
  "choose",
  "climb",
  "collect",
  "combine",
  "compare",
  "compete",
  "complete",
  "connect",
  "consider",
  "construct",
  "cook",
  "create",
  "cross",
  "cultivate",
  "dance",
  "decide",
  "decorate",
  "defend",
  "deliver",
  "describe",
  "design",
  "develop",
  "discover",
  "discuss",
  "dive",
  "draw",
  "dream",
  "drive",
  "earn",
  "educate",
  "embrace",
  "encourage",
  "enjoy",
  "escape",
  "examine",
  "exchange",
  "excite",
  "explain",
  "explore",
  "express",
  "fasten",
  "finish",
  "flourish",
  "fold",
  "follow",
  "forgive",
  "gather",
  "generate",
  "give",
  "glide",
  "grow",
  "guide",
  "hammer",
  "handle",
  "hurry",
  "identify",
  "ignite",
  "imagine",
  "improve",
  "include",
  "increase",
  "influence",
  "inspire",
  "invent",
  "investigate",
  "invite",
  "jump",
  "kick",
  "laugh",
  "launch",
  "lead",
  "learn",
  "listen",
  "manage",
  "measure",
  "mention",
  "mix",
  "modify",
  "motivate",
  "move",
  "navigate",
  "notice",
  "observe",
  "obtain",
  "offer",
  "organize",
  "paint",
  "participate",
  "perform",
  "persuade",
  "plan",
  "play",
  "practice",
  "prepare",
  "present",
  "preserve",
  "produce",
  "promise",
  "protect",
  "provide",
  "publish",
  "pursue",
  "question",
  "reach",
  "realize",
  "recognize",
  "recommend",
  "record",
  "reduce",
  "reflect",
  "relax",
  "remember",
  "remove",
  "repair",
  "replace",
  "reply",
  "report",
  "rescue",
  "research",
  "resolve",
  "respond",
  "restore",
  "reveal",
  "review",
  "reward",
  "sail",
  "scatter",
  "search",
  "select",
  "share",
  "shine",
  "sing",
  "sketch",
  "solve",
  "sparkle",
  "speak",
  "sprint",
  "stretch",
  "study",
  "succeed",
  "suggest",
  "support",
  "surprise",
  "survive",
  "swim",
  "teach",
  "throw",
  "transform",
  "translate",
  "travel",
  "treasure",
  "understand",
  "unite",
  "unlock",
  "value",
  "vanish",
  "visit",
  "volunteer",
  "wander",
  "welcome",
  "whisper",
  "wonder",
  "write",
];

export type VerbForm = "base" | "past" | "present" | "gerund" | "third";

const IRREGULAR: Record<string, { past: string; participle: string }> = {
  become: { past: "became", participle: "become" },
  begin: { past: "began", participle: "begun" },
  choose: { past: "chose", participle: "chosen" },
  draw: { past: "drew", participle: "drawn" },
  dream: { past: "dreamt", participle: "dreamt" },
  drive: { past: "drove", participle: "driven" },
  forgive: { past: "forgave", participle: "forgiven" },
  give: { past: "gave", participle: "given" },
  grow: { past: "grew", participle: "grown" },
  lead: { past: "led", participle: "led" },
  learn: { past: "learned", participle: "learned" },
  reach: { past: "reached", participle: "reached" },
  sing: { past: "sang", participle: "sung" },
  speak: { past: "spoke", participle: "spoken" },
  swim: { past: "swam", participle: "swum" },
  teach: { past: "taught", participle: "taught" },
  throw: { past: "threw", participle: "thrown" },
  understand: { past: "understood", participle: "understood" },
  write: { past: "wrote", participle: "written" },
};

function doubleFinal(verb: string): boolean {
  return /[^aeiou][aeiou][bcdfghjklmnpqrstvwxyz]$/.test(verb) && verb.length <= 5;
}

export function conjugate(verb: string, form: VerbForm): string {
  if (form === "base") return verb;
  const irr = IRREGULAR[verb];
  if (form === "third") {
    if (/(s|sh|ch|x|z|o)$/.test(verb)) return verb + "es";
    if (/[^aeiou]y$/.test(verb)) return verb.slice(0, -1) + "ies";
    return verb + "s";
  }
  if (form === "gerund") {
    if (verb.endsWith("ie")) return verb.slice(0, -2) + "ying";
    if (verb.endsWith("e") && !verb.endsWith("ee")) return verb.slice(0, -1) + "ing";
    if (doubleFinal(verb)) return verb + verb.slice(-1) + "ing";
    return verb + "ing";
  }
  // past
  if (irr) return irr.past;
  if (verb.endsWith("e")) return verb + "d";
  if (/[^aeiou]y$/.test(verb)) return verb.slice(0, -1) + "ied";
  if (doubleFinal(verb)) return verb + verb.slice(-1) + "ed";
  return verb + "ed";
}

/* ---------- Topics ---------- */

export const TOPIC_CATEGORIES = {
  general: [
    "The importance of lifelong learning",
    "How music shapes our emotions",
    "The future of remote work",
    "Why kindness matters more than ever",
    "The value of a good night's sleep",
    "How travel changes the way we think",
    "The power of daily habits",
    "Why we should read more books",
    "The art of listening well",
    "How curiosity drives innovation",
    "The role of failure in success",
    "Why gratitude improves happiness",
    "The impact of social media on friendships",
    "How to find balance in a busy life",
    "The magic of a well-told story",
  ],
  persuasive: [
    "Should schools start later in the morning?",
    "Is homework beneficial for students?",
    "Should public transport be free?",
    "Do video games improve problem-solving skills?",
    "Should plastic bags be banned everywhere?",
    "Is a four-day work week a good idea?",
    "Should students learn a second language from a young age?",
    "Do zoos help or harm animals?",
    "Should junk food advertising be restricted?",
    "Is space exploration worth the cost?",
    "Should social media have an age limit?",
    "Do exams truly measure intelligence?",
  ],
  creative: [
    "A door appears in a place it has never been before",
    "You wake up able to understand animals",
    "The last message on an old answering machine",
    "A town where it has rained for a hundred years",
    "You find a diary that writes itself",
    "The day gravity took a break",
    "A lighthouse keeper who collects lost letters",
    "Two strangers keep meeting in their dreams",
    "A map that leads to a place that no longer exists",
    "The clock in the square starts running backwards",
    "A photograph that changes every time you look at it",
    "The shop that only opens once every leap year",
  ],
  business: [
    "Building a brand people trust",
    "The rise of the subscription economy",
    "How small teams outpace large companies",
    "Customer experience as a competitive edge",
    "The ethics of artificial intelligence at work",
    "Turning data into better decisions",
    "Why company culture beats strategy",
    "Sustainable growth without burning out",
    "The future of e-commerce",
    "Leadership lessons from unexpected places",
    "Marketing to a distracted audience",
    "Innovation on a tight budget",
  ],
  science: [
    "How the brain forms memories",
    "The search for life beyond Earth",
    "Why sleep is essential for the body",
    "The science of climate change",
    "How vaccines train the immune system",
    "The mysteries of the deep ocean",
    "Renewable energy and the road ahead",
    "The physics of everyday objects",
    "How genetics shapes who we are",
    "The wonders of the human microbiome",
    "What black holes reveal about the universe",
    "The chemistry behind cooking",
  ],
} as const;

export type TopicCategory = keyof typeof TOPIC_CATEGORIES;

/* ---------- Sentences & paragraphs ---------- */

const SUBJECTS = [
  "The curious traveler",
  "A quiet librarian",
  "The old lighthouse keeper",
  "My neighbor's cat",
  "A young inventor",
  "The morning sun",
  "An ambitious student",
  "The tired detective",
  "A wandering musician",
  "The gentle giant",
  "Every honest gardener",
  "The restless ocean",
  "A hopeful painter",
  "The clever fox",
  "That familiar melody",
  "A distant mountain",
  "The patient teacher",
  "Our small town",
  "The daring explorer",
  "A single candle",
];

const VERB_PHRASES = [
  "discovered",
  "quietly admired",
  "carefully collected",
  "suddenly noticed",
  "gently carried",
  "playfully chased",
  "patiently studied",
  "boldly explored",
  "warmly welcomed",
  "slowly revealed",
  "eagerly awaited",
  "cleverly arranged",
  "brightly illuminated",
  "softly whispered about",
  "curiously examined",
  "happily celebrated",
  "thoughtfully described",
  "bravely faced",
];

const OBJECTS = [
  "a forgotten letter",
  "the shimmering horizon",
  "an unexpected friendship",
  "a hidden garden",
  "the ancient map",
  "a handful of stars",
  "the winding river",
  "an old wooden box",
  "the distant city lights",
  "a secret melody",
  "the first snowfall",
  "an untold story",
  "the golden afternoon",
  "a curious little bird",
  "the endless bookshelves",
  "a burst of color",
  "the fading footprints",
  "an open window",
  "the whispering trees",
  "a single perfect moment",
];

const ENDINGS = [
  "before the day slipped away.",
  "as the world kept spinning.",
  "without a single word.",
  "and everything felt possible.",
  "while the rain tapped softly outside.",
  "just as the lights flickered on.",
  "long after everyone had gone home.",
  "with a quiet, knowing smile.",
  "until the very last echo faded.",
  "and nothing was ever quite the same.",
  "beneath a sky full of promises.",
  "as if it had always been meant to be.",
];

export function generateSentence(): string {
  const s = `${pickOne(SUBJECTS)} ${pickOne(VERB_PHRASES)} ${pickOne(OBJECTS)} ${pickOne(ENDINGS)}`;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function generateSentences(count: number): string[] {
  const n = Math.max(1, Math.min(50, count));
  return Array.from({ length: n }, () => generateSentence());
}

export function generateParagraph(sentenceCount: number): string {
  const n = Math.max(2, Math.min(12, sentenceCount));
  return Array.from({ length: n }, () => generateSentence()).join(" ");
}

export function generateParagraphs(paragraphCount: number, sentencesEach: number): string[] {
  const n = Math.max(1, Math.min(20, paragraphCount));
  return Array.from({ length: n }, () => generateParagraph(sentencesEach));
}

/**
 * Offline question banks and quiz builders for the Word Quizzes category.
 * Everything runs client-side with no API calls, so the quizzes are fast,
 * free and always available. Questions are generated fresh on each attempt
 * with shuffled options and randomised distractors.
 */

export type QuizQuestion = {
  prompt: string;
  /** Optional secondary hint shown under the prompt. */
  hint?: string;
  options: string[];
  answer: string;
  explanation?: string;
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickDistractors(pool: readonly string[], exclude: string[], n: number): string[] {
  const seen = new Set(exclude.map((e) => e.toLowerCase()));
  const out: string[] = [];
  for (const item of shuffle(pool)) {
    if (out.length >= n) break;
    if (seen.has(item.toLowerCase())) continue;
    seen.add(item.toLowerCase());
    out.push(item);
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Vocabulary                                                         */
/* ------------------------------------------------------------------ */

export type VocabItem = { word: string; definition: string };

export const VOCAB: VocabItem[] = [
  { word: "abate", definition: "to become less intense or widespread" },
  { word: "benevolent", definition: "kind, generous and well-meaning" },
  { word: "candid", definition: "truthful, open and straightforward" },
  { word: "diligent", definition: "showing careful and persistent effort" },
  { word: "eloquent", definition: "fluent and persuasive in speaking or writing" },
  { word: "frugal", definition: "careful and sparing with money or resources" },
  { word: "gregarious", definition: "sociable and fond of the company of others" },
  { word: "hinder", definition: "to make an action slow or difficult" },
  { word: "impartial", definition: "treating all sides equally and fairly" },
  { word: "jovial", definition: "cheerful and full of good humour" },
  { word: "keen", definition: "eager, enthusiastic or sharply perceptive" },
  { word: "lucid", definition: "clear, easy to understand and rational" },
  { word: "meticulous", definition: "showing great attention to detail" },
  { word: "novel", definition: "new, original or unlike anything before" },
  { word: "obscure", definition: "not well known or hard to understand" },
  { word: "prudent", definition: "acting with care and good judgement" },
  { word: "quell", definition: "to put an end to, usually by force" },
  { word: "resilient", definition: "able to recover quickly from difficulty" },
  { word: "scrutinize", definition: "to examine closely and critically" },
  { word: "tenacious", definition: "holding firmly to a goal or belief" },
  { word: "ubiquitous", definition: "present or found everywhere" },
  { word: "verbose", definition: "using more words than are needed" },
  { word: "wary", definition: "cautious about possible dangers" },
  { word: "zealous", definition: "showing great energy and enthusiasm" },
  { word: "arduous", definition: "requiring a lot of hard, tiring effort" },
  { word: "brevity", definition: "the quality of being brief and concise" },
  { word: "cordial", definition: "warm, friendly and sincere" },
  { word: "deter", definition: "to discourage someone from doing something" },
  { word: "elated", definition: "extremely happy and excited" },
  { word: "futile", definition: "pointless and incapable of success" },
];

export function buildVocabQuestions(count = 8): QuizQuestion[] {
  const defs = VOCAB.map((v) => v.definition);
  return shuffle(VOCAB)
    .slice(0, count)
    .map((v) => {
      const distractors = pickDistractors(defs, [v.definition], 3);
      return {
        prompt: `What does “${v.word}” mean?`,
        options: shuffle([v.definition, ...distractors]),
        answer: v.definition,
        explanation: `“${v.word}” means ${v.definition}.`,
      };
    });
}

/* ------------------------------------------------------------------ */
/* Synonyms & Antonyms                                                */
/* ------------------------------------------------------------------ */

export type PairItem = { word: string; match: string };

export const SYNONYMS: PairItem[] = [
  { word: "happy", match: "joyful" },
  { word: "big", match: "enormous" },
  { word: "smart", match: "intelligent" },
  { word: "fast", match: "rapid" },
  { word: "angry", match: "furious" },
  { word: "tired", match: "exhausted" },
  { word: "brave", match: "courageous" },
  { word: "beautiful", match: "gorgeous" },
  { word: "quiet", match: "silent" },
  { word: "rich", match: "wealthy" },
  { word: "sad", match: "sorrowful" },
  { word: "strong", match: "powerful" },
  { word: "funny", match: "hilarious" },
  { word: "cold", match: "freezing" },
  { word: "easy", match: "simple" },
  { word: "old", match: "ancient" },
  { word: "clever", match: "cunning" },
  { word: "honest", match: "truthful" },
  { word: "calm", match: "serene" },
  { word: "hard", match: "difficult" },
];

export const ANTONYMS: PairItem[] = [
  { word: "happy", match: "sad" },
  { word: "big", match: "small" },
  { word: "fast", match: "slow" },
  { word: "hot", match: "cold" },
  { word: "light", match: "dark" },
  { word: "strong", match: "weak" },
  { word: "rich", match: "poor" },
  { word: "brave", match: "cowardly" },
  { word: "empty", match: "full" },
  { word: "early", match: "late" },
  { word: "ancient", match: "modern" },
  { word: "expand", match: "shrink" },
  { word: "generous", match: "stingy" },
  { word: "increase", match: "decrease" },
  { word: "victory", match: "defeat" },
  { word: "arrive", match: "depart" },
  { word: "accept", match: "reject" },
  { word: "smooth", match: "rough" },
  { word: "wise", match: "foolish" },
  { word: "praise", match: "criticize" },
];

function buildPairQuestions(items: PairItem[], label: string, count: number): QuizQuestion[] {
  const pool = items.map((i) => i.match);
  return shuffle(items)
    .slice(0, count)
    .map((i) => {
      const distractors = pickDistractors(pool, [i.match, i.word], 3);
      return {
        prompt: `Which word is ${label} of “${i.word}”?`,
        options: shuffle([i.match, ...distractors]),
        answer: i.match,
        explanation: `“${i.match}” is ${label} of “${i.word}”.`,
      };
    });
}

export const buildSynonymQuestions = (count = 8) =>
  buildPairQuestions(SYNONYMS, "a synonym", count);
export const buildAntonymQuestions = (count = 8) =>
  buildPairQuestions(ANTONYMS, "an antonym", count);

/* ------------------------------------------------------------------ */
/* Prefixes & Suffixes                                                */
/* ------------------------------------------------------------------ */

export type AffixItem = { affix: string; meaning: string; example: string };

export const PREFIXES: AffixItem[] = [
  { affix: "un-", meaning: "not / opposite of", example: "unhappy" },
  { affix: "re-", meaning: "again / back", example: "rewrite" },
  { affix: "pre-", meaning: "before", example: "preview" },
  { affix: "mis-", meaning: "wrongly / badly", example: "misspell" },
  { affix: "dis-", meaning: "not / apart from", example: "disagree" },
  { affix: "sub-", meaning: "under / below", example: "submarine" },
  { affix: "inter-", meaning: "between / among", example: "interact" },
  { affix: "trans-", meaning: "across / through", example: "transport" },
  { affix: "super-", meaning: "above / beyond", example: "superhuman" },
  { affix: "anti-", meaning: "against / opposing", example: "antivirus" },
  { affix: "auto-", meaning: "self", example: "automatic" },
  { affix: "bi-", meaning: "two / twice", example: "bicycle" },
  { affix: "tele-", meaning: "far / distant", example: "telephone" },
  { affix: "micro-", meaning: "small", example: "microscope" },
  { affix: "over-", meaning: "too much / above", example: "overload" },
  { affix: "under-", meaning: "too little / beneath", example: "underpaid" },
];

export const SUFFIXES: AffixItem[] = [
  { affix: "-less", meaning: "without", example: "hopeless" },
  { affix: "-ful", meaning: "full of", example: "joyful" },
  { affix: "-able", meaning: "capable of being", example: "readable" },
  { affix: "-ness", meaning: "state or quality of", example: "kindness" },
  { affix: "-ment", meaning: "action or result of", example: "movement" },
  { affix: "-tion", meaning: "act or process of", example: "creation" },
  { affix: "-ly", meaning: "in the manner of", example: "quickly" },
  { affix: "-er", meaning: "one who does", example: "teacher" },
  { affix: "-ist", meaning: "one who practises", example: "artist" },
  { affix: "-ism", meaning: "a belief or practice", example: "heroism" },
  { affix: "-ish", meaning: "having the quality of", example: "childish" },
  { affix: "-ous", meaning: "full of / having", example: "dangerous" },
  { affix: "-ify", meaning: "to make or become", example: "simplify" },
  { affix: "-ward", meaning: "in the direction of", example: "backward" },
  { affix: "-hood", meaning: "state or condition of", example: "childhood" },
  { affix: "-ship", meaning: "state or skill of", example: "friendship" },
];

function buildAffixQuestions(items: AffixItem[], kind: string, count: number): QuizQuestion[] {
  const pool = items.map((i) => i.meaning);
  return shuffle(items)
    .slice(0, count)
    .map((i) => {
      const distractors = pickDistractors(pool, [i.meaning], 3);
      return {
        prompt: `What does the ${kind} “${i.affix}” mean?`,
        hint: `Example: ${i.example}`,
        options: shuffle([i.meaning, ...distractors]),
        answer: i.meaning,
        explanation: `“${i.affix}” means “${i.meaning}”, as in ${i.example}.`,
      };
    });
}

export const buildPrefixQuestions = (count = 8) => buildAffixQuestions(PREFIXES, "prefix", count);
export const buildSuffixQuestions = (count = 8) => buildAffixQuestions(SUFFIXES, "suffix", count);

/* ------------------------------------------------------------------ */
/* Spelling                                                           */
/* ------------------------------------------------------------------ */

export type SpellItem = { correct: string; wrong: string[]; hint: string };

export const SPELLING: SpellItem[] = [
  {
    correct: "accommodate",
    wrong: ["accomodate", "acommodate", "accommadate"],
    hint: "to provide room or adapt to",
  },
  { correct: "definitely", wrong: ["definately", "definitly", "definetly"], hint: "without doubt" },
  { correct: "separate", wrong: ["seperate", "separete", "seperete"], hint: "to set apart" },
  {
    correct: "necessary",
    wrong: ["neccessary", "necesary", "neccesary"],
    hint: "required or essential",
  },
  {
    correct: "embarrass",
    wrong: ["embarass", "embarass", "embarras"],
    hint: "to cause to feel awkward",
  },
  {
    correct: "occurrence",
    wrong: ["occurence", "ocurrence", "occurrance"],
    hint: "an event or incident",
  },
  { correct: "rhythm", wrong: ["rythm", "rhythem", "rhytm"], hint: "a regular pattern of beats" },
  {
    correct: "conscience",
    wrong: ["concience", "conscence", "consciense"],
    hint: "sense of right and wrong",
  },
  {
    correct: "privilege",
    wrong: ["priviledge", "privelege", "privilage"],
    hint: "a special advantage",
  },
  {
    correct: "maintenance",
    wrong: ["maintainance", "maintenence", "maintanance"],
    hint: "the act of keeping in good order",
  },
  {
    correct: "recommend",
    wrong: ["reccommend", "recomend", "reccomend"],
    hint: "to advise or suggest",
  },
  {
    correct: "beginning",
    wrong: ["begining", "beginnning", "begginning"],
    hint: "the start of something",
  },
  { correct: "believe", wrong: ["beleive", "belive", "beleeve"], hint: "to accept as true" },
  {
    correct: "calendar",
    wrong: ["calender", "calandar", "calenndar"],
    hint: "a chart of days and months",
  },
  {
    correct: "government",
    wrong: ["goverment", "governement", "govenment"],
    hint: "the ruling body of a state",
  },
  {
    correct: "pronunciation",
    wrong: ["pronounciation", "pronunciaton", "prononciation"],
    hint: "the way a word is spoken",
  },
  {
    correct: "existence",
    wrong: ["existance", "existense", "exsistence"],
    hint: "the state of being",
  },
  { correct: "grateful", wrong: ["greatful", "gratefull", "gratful"], hint: "feeling thankful" },
  {
    correct: "mischievous",
    wrong: ["mischievious", "mischevous", "mischevious"],
    hint: "playfully causing trouble",
  },
  {
    correct: "possession",
    wrong: ["posession", "possesion", "possetion"],
    hint: "something owned",
  },
];

export function buildSpellingQuestions(count = 8): QuizQuestion[] {
  return shuffle(SPELLING)
    .slice(0, count)
    .map((s) => ({
      prompt: "Which spelling is correct?",
      hint: `Meaning: ${s.hint}`,
      options: shuffle([s.correct, ...s.wrong.slice(0, 3)]),
      answer: s.correct,
      explanation: `The correct spelling is “${s.correct}”.`,
    }));
}

/* ------------------------------------------------------------------ */
/* Word of the day                                                    */
/* ------------------------------------------------------------------ */

export type DailyEntry = {
  word: string;
  pos: string;
  ipa: string;
  definition: string;
  example: string;
};

export const WORD_BANK: DailyEntry[] = [
  {
    word: "serendipity",
    pos: "noun",
    ipa: "/ˌsɛr.ənˈdɪp.ɪ.ti/",
    definition: "the occurrence of happy events by chance",
    example: "Finding that book was pure serendipity.",
  },
  {
    word: "ephemeral",
    pos: "adjective",
    ipa: "/ɪˈfɛm.ər.əl/",
    definition: "lasting for a very short time",
    example: "The beauty of the sunset was ephemeral.",
  },
  {
    word: "petrichor",
    pos: "noun",
    ipa: "/ˈpɛt.rɪ.kɔːr/",
    definition: "the pleasant smell of rain on dry earth",
    example: "She loved the petrichor after the storm.",
  },
  {
    word: "eloquence",
    pos: "noun",
    ipa: "/ˈɛl.ə.kwəns/",
    definition: "fluent, persuasive and expressive speech",
    example: "His eloquence moved the entire room.",
  },
  {
    word: "resilience",
    pos: "noun",
    ipa: "/rɪˈzɪl.i.əns/",
    definition: "the capacity to recover quickly from difficulty",
    example: "Her resilience carried her through hard times.",
  },
  {
    word: "luminous",
    pos: "adjective",
    ipa: "/ˈluː.mɪ.nəs/",
    definition: "giving off or reflecting light; radiant",
    example: "The moon was luminous over the calm sea.",
  },
  {
    word: "quintessential",
    pos: "adjective",
    ipa: "/ˌkwɪn.tɪˈsɛn.ʃəl/",
    definition: "representing the most perfect example of a quality",
    example: "It was the quintessential summer afternoon.",
  },
  {
    word: "mellifluous",
    pos: "adjective",
    ipa: "/məˈlɪf.lu.əs/",
    definition: "sweet or musical; pleasant to hear",
    example: "Her mellifluous voice filled the hall.",
  },
  {
    word: "wanderlust",
    pos: "noun",
    ipa: "/ˈwɒn.də.lʌst/",
    definition: "a strong desire to travel and explore",
    example: "His wanderlust took him across three continents.",
  },
  {
    word: "solace",
    pos: "noun",
    ipa: "/ˈsɒl.əs/",
    definition: "comfort in a time of sadness or distress",
    example: "She found solace in music.",
  },
  {
    word: "ubiquitous",
    pos: "adjective",
    ipa: "/juːˈbɪk.wɪ.təs/",
    definition: "present or found everywhere",
    example: "Smartphones are now ubiquitous.",
  },
  {
    word: "nostalgia",
    pos: "noun",
    ipa: "/nɒsˈtæl.dʒə/",
    definition: "a wistful longing for the past",
    example: "Old songs filled him with nostalgia.",
  },
  {
    word: "tenacity",
    pos: "noun",
    ipa: "/təˈnæs.ɪ.ti/",
    definition: "persistence and firm determination",
    example: "Her tenacity won her the championship.",
  },
  {
    word: "effervescent",
    pos: "adjective",
    ipa: "/ˌɛf.əˈvɛs.ənt/",
    definition: "vivacious, bubbly and enthusiastic",
    example: "His effervescent personality lit up the party.",
  },
  {
    word: "halcyon",
    pos: "adjective",
    ipa: "/ˈhæl.si.ən/",
    definition: "denoting a peaceful and happy period",
    example: "They recalled the halcyon days of childhood.",
  },
  {
    word: "sonder",
    pos: "noun",
    ipa: "/ˈsɒn.dər/",
    definition: "the realisation that each passer-by has a life as vivid as your own",
    example: "A wave of sonder hit her on the busy street.",
  },
  {
    word: "verdant",
    pos: "adjective",
    ipa: "/ˈvɜː.dənt/",
    definition: "green with lush vegetation",
    example: "The valley was verdant after the rains.",
  },
  {
    word: "aplomb",
    pos: "noun",
    ipa: "/əˈplɒm/",
    definition: "self-confidence and poise in a demanding situation",
    example: "She handled the interview with aplomb.",
  },
  {
    word: "cascade",
    pos: "noun",
    ipa: "/kæsˈkeɪd/",
    definition: "a small waterfall or a flow of something",
    example: "A cascade of ideas followed the meeting.",
  },
  {
    word: "reverie",
    pos: "noun",
    ipa: "/ˈrɛv.ər.i/",
    definition: "a state of pleasant, dreamy thought",
    example: "He was lost in a reverie by the window.",
  },
  {
    word: "incandescent",
    pos: "adjective",
    ipa: "/ˌɪn.kænˈdɛs.ənt/",
    definition: "glowing with intense heat, light or emotion",
    example: "The stage glowed with incandescent light.",
  },
  {
    word: "ineffable",
    pos: "adjective",
    ipa: "/ɪnˈɛf.ə.bəl/",
    definition: "too great to be expressed in words",
    example: "The view gave her an ineffable joy.",
  },
  {
    word: "zephyr",
    pos: "noun",
    ipa: "/ˈzɛf.ər/",
    definition: "a soft, gentle breeze",
    example: "A warm zephyr drifted through the garden.",
  },
  {
    word: "elysian",
    pos: "adjective",
    ipa: "/ɪˈlɪʒ.ən/",
    definition: "beautiful, blissful or heavenly",
    example: "The meadow felt elysian at dawn.",
  },
];

/** Deterministic offset from a date (days since epoch) so the word is stable per day. */
function dayIndex(date = new Date()): number {
  const utc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor(utc / 86_400_000);
}

export function wordForDate(date = new Date()): DailyEntry {
  return WORD_BANK[((dayIndex(date) % WORD_BANK.length) + WORD_BANK.length) % WORD_BANK.length];
}

export function formatLongDate(date = new Date()): string {
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Word banks and helpers powering the literary & educational tools:
 * Alliteration Generator, Tongue Twister Generator, CVC Word Generator,
 * Sight Word Generator and Riddle Generator. Everything runs client-side —
 * no network, no dependencies.
 */

import { pickMany, pickOne, shuffle } from "@/lib/random-content";

export const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

/* ------------------------------------------------------------------ */
/* Alliteration                                                        */
/* ------------------------------------------------------------------ */

/** Adjectives grouped by first letter. */
const ALLIT_ADJ: Record<string, string[]> = {
  a: ["angry", "ancient", "amazing", "awkward", "agile", "adorable"],
  b: ["brave", "bright", "bold", "bouncy", "brilliant", "brisk", "bumbling"],
  c: ["curious", "clever", "cheerful", "clumsy", "calm", "colossal", "crafty"],
  d: ["daring", "dizzy", "dashing", "dreamy", "dainty", "dapper", "devious"],
  e: ["eager", "eerie", "elegant", "energetic", "enormous", "excited"],
  f: ["fierce", "fluffy", "fancy", "fearless", "friendly", "funny", "fabulous"],
  g: ["gentle", "glorious", "gloomy", "grumpy", "graceful", "giant", "glowing"],
  h: ["happy", "handsome", "hungry", "hairy", "heroic", "humble", "hasty"],
  i: ["icy", "idle", "important", "innocent", "itchy", "immense"],
  j: ["jolly", "jumpy", "jealous", "jagged", "jovial", "jazzy"],
  k: ["kind", "keen", "kooky", "knightly", "knowing"],
  l: ["lazy", "lively", "lovely", "loud", "little", "loyal", "lucky"],
  m: ["mighty", "merry", "moody", "massive", "mysterious", "muddy", "mad"],
  n: ["naughty", "nimble", "noble", "nifty", "nervous", "noisy"],
  o: ["odd", "orange", "obedient", "ordinary", "outrageous"],
  p: ["proud", "playful", "peculiar", "polite", "prickly", "purple", "puzzled"],
  q: ["quiet", "quick", "quirky", "quaint", "quivering"],
  r: ["rowdy", "royal", "rusty", "restless", "rapid", "ragged", "radiant"],
  s: ["silly", "sleepy", "sneaky", "shiny", "swift", "strong", "spooky", "sparkly"],
  t: ["tiny", "tough", "tricky", "twisted", "tidy", "terrible", "tremendous"],
  u: ["ugly", "unusual", "upset", "useful", "unruly"],
  v: ["vast", "vivid", "valiant", "vicious", "vain", "velvety"],
  w: ["wild", "wicked", "wobbly", "wise", "wandering", "wonderful", "witty"],
  x: ["xenial"],
  y: ["young", "yappy", "yellow", "yawning"],
  z: ["zany", "zealous", "zippy", "zonked"],
};

/** Animals / nouns grouped by first letter. */
const ALLIT_NOUN: Record<string, string[]> = {
  a: ["alligator", "ant", "ape", "antelope", "armadillo"],
  b: ["bear", "beetle", "buffalo", "badger", "bat", "butterfly"],
  c: ["cat", "cobra", "crocodile", "camel", "crab", "caterpillar"],
  d: ["dog", "dragon", "dolphin", "donkey", "duck", "deer"],
  e: ["eagle", "elephant", "eel", "emu"],
  f: ["fox", "frog", "ferret", "flamingo", "falcon", "fish"],
  g: ["goat", "goose", "gorilla", "gecko", "grasshopper"],
  h: ["horse", "hamster", "hedgehog", "hippo", "hawk", "hound"],
  i: ["iguana", "ibex", "impala", "insect"],
  j: ["jaguar", "jackal", "jellyfish", "jay"],
  k: ["kangaroo", "koala", "kitten", "kestrel"],
  l: ["lion", "lizard", "llama", "leopard", "lobster", "lemur"],
  m: ["monkey", "mouse", "moose", "mole", "moth", "meerkat"],
  n: ["newt", "nightingale", "narwhal"],
  o: ["otter", "owl", "octopus", "ostrich"],
  p: ["panda", "parrot", "penguin", "python", "pig", "puppy", "peacock"],
  q: ["quail", "quokka"],
  r: ["rabbit", "raccoon", "rat", "raven", "rhino", "robin"],
  s: ["snake", "spider", "shark", "seal", "squirrel", "swan", "sloth"],
  t: ["tiger", "toad", "turtle", "turkey", "tarantula"],
  u: ["urchin", "unicorn"],
  v: ["viper", "vulture", "vole"],
  w: ["wolf", "walrus", "weasel", "whale", "wombat"],
  x: ["xerus"],
  y: ["yak", "yeti"],
  z: ["zebra", "zebu"],
};

export function letterHasAlliteration(letter: string): boolean {
  const l = letter.toLowerCase();
  return Boolean(ALLIT_ADJ[l]?.length && ALLIT_NOUN[l]?.length);
}

const NAMES_BY_LETTER: Record<string, string[]> = {};
for (const name of [
  "Amy",
  "Ben",
  "Cara",
  "Dan",
  "Ella",
  "Finn",
  "Grace",
  "Henry",
  "Ivy",
  "Jack",
  "Kate",
  "Liam",
  "Mia",
  "Noah",
  "Olive",
  "Pete",
  "Quinn",
  "Rosa",
  "Sam",
  "Tom",
  "Uma",
  "Vera",
  "Will",
  "Xavi",
  "Yara",
  "Zoe",
]) {
  const l = name[0].toLowerCase();
  (NAMES_BY_LETTER[l] ??= []).push(name);
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Generate alliterative phrases for a chosen letter (or a random one). */
export function generateAlliteration(letter: string, count: number): string[] {
  const letters =
    letter && letterHasAlliteration(letter)
      ? [letter.toLowerCase()]
      : ALPHABET.filter(letterHasAlliteration);
  const out = new Set<string>();
  let guard = 0;
  while (out.size < count && guard < count * 40) {
    guard++;
    const l = pickOne(letters);
    const adj = ALLIT_ADJ[l];
    const noun = ALLIT_NOUN[l];
    if (!adj?.length || !noun?.length) continue;
    const roll = Math.random();
    if (roll < 0.35 && NAMES_BY_LETTER[l]?.length) {
      out.add(
        `${pickOne(NAMES_BY_LETTER[l])} the ${capitalize(pickOne(adj))} ${capitalize(pickOne(noun))}`,
      );
    } else if (roll < 0.7 && adj.length > 1) {
      const a1 = pickOne(adj);
      let a2 = pickOne(adj);
      if (a2 === a1) a2 = pickOne(adj);
      out.add(`The ${capitalize(a1)} ${a2} ${capitalize(pickOne(noun))}`);
    } else {
      out.add(`${capitalize(pickOne(adj))} ${capitalize(pickOne(noun))}`);
    }
  }
  return shuffle([...out]);
}

/* ------------------------------------------------------------------ */
/* Tongue twisters                                                     */
/* ------------------------------------------------------------------ */

/** Words grouped by first letter for stitching tongue twisters. */
const TT_SUBJECT: Record<string, string[]> = {
  b: ["Betty", "Bobby", "the baker", "big brown bears"],
  c: ["Carl", "the clumsy cook", "curious cats", "crazy crabs"],
  d: ["Danny", "the dizzy duck", "daring dogs", "dancing donkeys"],
  f: ["Fred", "the funny fox", "five frogs", "fuzzy ferrets"],
  g: ["Greg", "the greedy goose", "grumpy goats", "green grasshoppers"],
  m: ["Molly", "the merry mouse", "many monkeys", "muddy moles"],
  p: ["Peter", "the plump pig", "purple parrots", "playful puppies"],
  s: ["Sally", "the silly snake", "six snails", "sleepy squirrels"],
  t: ["Tommy", "the tiny toad", "twelve turtles", "tricky tigers"],
  w: ["Wendy", "the weary wolf", "wobbly walruses", "wild weasels"],
};
const TT_VERB: Record<string, string[]> = {
  b: ["baked", "bounced", "brought", "borrowed"],
  c: ["carried", "caught", "chased", "cooked", "chopped"],
  d: ["dropped", "dug", "drew", "dashed"],
  f: ["found", "fixed", "fried", "flipped"],
  g: ["grabbed", "gave", "gathered", "guarded"],
  m: ["made", "mixed", "moved", "munched"],
  p: ["packed", "picked", "pushed", "painted"],
  s: ["sold", "sorted", "sipped", "stacked", "squeezed"],
  t: ["tossed", "took", "tied", "tapped"],
  w: ["washed", "wove", "wanted", "watched"],
};
const TT_OBJECT: Record<string, string[]> = {
  b: ["big blue balloons", "buttered biscuits", "broken bottles"],
  c: ["crunchy carrots", "colourful crayons", "clever clocks"],
  d: ["dainty daisies", "dusty drums", "delicious donuts"],
  f: ["fresh figs", "fluffy feathers", "fancy forks"],
  g: ["golden grapes", "green gumballs", "giant gears"],
  m: ["mushy marshmallows", "magic marbles", "mighty muffins"],
  p: ["purple plums", "prickly pears", "perfect pancakes"],
  s: ["shiny seashells", "sweet strawberries", "six silk scarves"],
  t: ["tasty tomatoes", "twisted twigs", "ten tin trumpets"],
  w: ["wet walnuts", "wooden wagons", "warm waffles"],
};

const FAMOUS_TWISTERS = [
  "She sells seashells by the seashore.",
  "Peter Piper picked a peck of pickled peppers.",
  "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
  "Fuzzy Wuzzy was a bear, Fuzzy Wuzzy had no hair.",
  "Betty Botter bought some butter but she said the butter's bitter.",
  "Red lorry, yellow lorry, red lorry, yellow lorry.",
];

export function tongueTwisterLetters(): string[] {
  return Object.keys(TT_SUBJECT);
}

/** Generate tongue twisters for a chosen letter (or random). */
export function generateTongueTwisters(letter: string, count: number): string[] {
  const usable = tongueTwisterLetters();
  const letters = letter && usable.includes(letter.toLowerCase()) ? [letter.toLowerCase()] : usable;
  const out = new Set<string>();
  let guard = 0;
  while (out.size < count && guard < count * 50) {
    guard++;
    const l = pickOne(letters);
    const s = pickOne(TT_SUBJECT[l]);
    const v = pickOne(TT_VERB[l]);
    const o = pickOne(TT_OBJECT[l]);
    out.add(capitalize(`${s} ${v} ${o}.`));
  }
  return shuffle([...out]);
}

export function famousTongueTwisters(count: number): string[] {
  return pickMany(FAMOUS_TWISTERS, Math.min(count, FAMOUS_TWISTERS.length));
}

/* ------------------------------------------------------------------ */
/* CVC words (consonant–vowel–consonant, for phonics)                  */
/* ------------------------------------------------------------------ */

export const CVC_WORDS: Record<string, string[]> = {
  a: [
    "cat",
    "hat",
    "bat",
    "mat",
    "rat",
    "sat",
    "fat",
    "pat",
    "bag",
    "tag",
    "rag",
    "wag",
    "cap",
    "map",
    "tap",
    "nap",
    "lap",
    "can",
    "man",
    "pan",
    "ran",
    "fan",
    "van",
    "bad",
    "dad",
    "had",
    "mad",
    "sad",
    "jam",
    "ham",
  ],
  e: [
    "bed",
    "red",
    "led",
    "fed",
    "wed",
    "net",
    "jet",
    "pet",
    "vet",
    "wet",
    "get",
    "let",
    "set",
    "hen",
    "pen",
    "ten",
    "den",
    "men",
    "leg",
    "peg",
    "beg",
    "web",
    "gem",
    "hem",
    "pep",
  ],
  i: [
    "big",
    "dig",
    "fig",
    "pig",
    "wig",
    "bin",
    "fin",
    "pin",
    "win",
    "tin",
    "bit",
    "fit",
    "hit",
    "kit",
    "sit",
    "lip",
    "rip",
    "sip",
    "tip",
    "zip",
    "did",
    "hid",
    "lid",
    "kid",
    "fix",
    "mix",
    "six",
  ],
  o: [
    "dog",
    "log",
    "fog",
    "hog",
    "jog",
    "cot",
    "dot",
    "got",
    "hot",
    "lot",
    "not",
    "pot",
    "rot",
    "box",
    "fox",
    "cop",
    "hop",
    "mop",
    "pop",
    "top",
    "cod",
    "nod",
    "rod",
    "job",
    "mob",
    "sob",
  ],
  u: [
    "bug",
    "dug",
    "hug",
    "jug",
    "mug",
    "rug",
    "tug",
    "bun",
    "fun",
    "run",
    "sun",
    "cut",
    "gut",
    "hut",
    "nut",
    "cub",
    "rub",
    "tub",
    "cup",
    "pup",
    "bud",
    "mud",
    "gum",
    "hum",
    "bus",
  ],
};

export function generateCvcWords(vowel: string, count: number): string[] {
  const pool = vowel && CVC_WORDS[vowel] ? CVC_WORDS[vowel] : Object.values(CVC_WORDS).flat();
  const unique = [...new Set(pool)];
  return pickMany(unique, Math.min(count, unique.length));
}

/* ------------------------------------------------------------------ */
/* Sight words (Dolch high-frequency word lists)                       */
/* ------------------------------------------------------------------ */

export const SIGHT_WORDS: Record<string, string[]> = {
  "pre-k": [
    "a",
    "and",
    "away",
    "big",
    "blue",
    "can",
    "come",
    "down",
    "find",
    "for",
    "funny",
    "go",
    "help",
    "here",
    "I",
    "in",
    "is",
    "it",
    "jump",
    "little",
    "look",
    "make",
    "me",
    "my",
    "not",
    "one",
    "play",
    "red",
    "run",
    "said",
    "see",
    "the",
    "three",
    "to",
    "two",
    "up",
    "we",
    "where",
    "yellow",
    "you",
  ],
  kindergarten: [
    "all",
    "am",
    "are",
    "at",
    "ate",
    "be",
    "black",
    "brown",
    "but",
    "came",
    "did",
    "do",
    "eat",
    "four",
    "get",
    "good",
    "have",
    "he",
    "into",
    "like",
    "must",
    "new",
    "no",
    "now",
    "on",
    "our",
    "out",
    "please",
    "pretty",
    "ran",
    "ride",
    "saw",
    "say",
    "she",
    "so",
    "soon",
    "that",
    "there",
    "they",
    "this",
    "too",
    "under",
    "want",
    "was",
    "well",
    "went",
    "what",
    "white",
    "who",
    "will",
    "with",
    "yes",
  ],
  "first-grade": [
    "after",
    "again",
    "an",
    "any",
    "as",
    "ask",
    "by",
    "could",
    "every",
    "fly",
    "from",
    "give",
    "going",
    "had",
    "has",
    "her",
    "him",
    "his",
    "how",
    "just",
    "know",
    "let",
    "live",
    "may",
    "of",
    "old",
    "once",
    "open",
    "over",
    "put",
    "round",
    "some",
    "stop",
    "take",
    "thank",
    "them",
    "then",
    "think",
    "walk",
    "were",
    "when",
  ],
  "second-grade": [
    "always",
    "around",
    "because",
    "been",
    "before",
    "best",
    "both",
    "buy",
    "call",
    "cold",
    "does",
    "don't",
    "fast",
    "first",
    "five",
    "found",
    "gave",
    "goes",
    "green",
    "its",
    "made",
    "many",
    "off",
    "or",
    "pull",
    "read",
    "right",
    "sing",
    "sit",
    "sleep",
    "tell",
    "their",
    "these",
    "those",
    "upon",
    "us",
    "use",
    "very",
    "wash",
    "which",
    "why",
    "wish",
    "work",
    "would",
    "write",
    "your",
  ],
  "third-grade": [
    "about",
    "better",
    "bring",
    "carry",
    "clean",
    "cut",
    "done",
    "draw",
    "drink",
    "eight",
    "fall",
    "far",
    "full",
    "got",
    "grow",
    "hold",
    "hot",
    "hurt",
    "if",
    "keep",
    "kind",
    "laugh",
    "light",
    "long",
    "much",
    "myself",
    "never",
    "only",
    "own",
    "pick",
    "seven",
    "shall",
    "show",
    "six",
    "small",
    "start",
    "ten",
    "today",
    "together",
    "try",
    "warm",
  ],
};

export const SIGHT_LEVELS: { value: string; label: string }[] = [
  { value: "all", label: "All levels" },
  { value: "pre-k", label: "Pre-K" },
  { value: "kindergarten", label: "Kindergarten" },
  { value: "first-grade", label: "1st grade" },
  { value: "second-grade", label: "2nd grade" },
  { value: "third-grade", label: "3rd grade" },
];

export function generateSightWords(level: string, count: number): string[] {
  const pool =
    level && level !== "all" && SIGHT_WORDS[level]
      ? SIGHT_WORDS[level]
      : Object.values(SIGHT_WORDS).flat();
  const unique = [...new Set(pool)];
  return pickMany(unique, Math.min(count, unique.length));
}

/* ------------------------------------------------------------------ */
/* Riddles                                                             */
/* ------------------------------------------------------------------ */

export type Riddle = { question: string; answer: string };

const RIDDLES: Riddle[] = [
  { question: "What has keys but can't open locks?", answer: "A piano." },
  { question: "What has to be broken before you can use it?", answer: "An egg." },
  { question: "What has a neck but no head?", answer: "A bottle." },
  { question: "What has hands but cannot clap?", answer: "A clock." },
  { question: "What has an eye but cannot see?", answer: "A needle." },
  { question: "What gets wetter the more it dries?", answer: "A towel." },
  { question: "What can travel around the world while staying in a corner?", answer: "A stamp." },
  { question: "What has many teeth but cannot bite?", answer: "A comb." },
  { question: "What goes up but never comes down?", answer: "Your age." },
  { question: "What has a thumb and four fingers but is not alive?", answer: "A glove." },
  { question: "What has legs but doesn't walk?", answer: "A table." },
  { question: "What has one head, one foot and four legs?", answer: "A bed." },
  { question: "What can you catch but not throw?", answer: "A cold." },
  { question: "What has words but never speaks?", answer: "A book." },
  { question: "What runs but never walks?", answer: "Water (a river)." },
  { question: "What has a bark but no bite?", answer: "A tree." },
  { question: "What has a ring but no finger?", answer: "A telephone." },
  { question: "What has a bed but never sleeps?", answer: "A river." },
  { question: "What is full of holes but still holds water?", answer: "A sponge." },
  {
    question: "What has cities but no houses, forests but no trees, and water but no fish?",
    answer: "A map.",
  },
  { question: "What can fill a room but takes up no space?", answer: "Light." },
  { question: "The more you take, the more you leave behind. What am I?", answer: "Footsteps." },
  { question: "What has four wheels and flies?", answer: "A garbage truck." },
  { question: "What comes down but never goes up?", answer: "Rain." },
  { question: "What building has the most stories?", answer: "A library." },
  { question: "What kind of band never plays music?", answer: "A rubber band." },
  { question: "What has a face and two hands but no arms or legs?", answer: "A clock." },
  { question: "What word is spelled incorrectly in every dictionary?", answer: "Incorrectly." },
  { question: "What can you keep after giving it to someone?", answer: "Your word." },
  { question: "What invention lets you look right through a wall?", answer: "A window." },
  { question: "What has 88 keys but can't open a single door?", answer: "A piano." },
  { question: "What flies without wings?", answer: "Time." },
  { question: "What gets bigger the more you take away from it?", answer: "A hole." },
  { question: "What has branches but no fruit, trunk or leaves?", answer: "A bank." },
  { question: "What has a heart that doesn't beat?", answer: "An artichoke." },
  { question: "What can be cracked, made, told and played?", answer: "A joke." },
  { question: "I'm tall when I'm young and short when I'm old. What am I?", answer: "A candle." },
  { question: "What has many keys but can't open any doors?", answer: "A keyboard." },
  { question: "What goes through towns and hills but never moves?", answer: "A road." },
  {
    question: "What can you break, even if you never pick it up or touch it?",
    answer: "A promise.",
  },
];

export function generateRiddles(count: number): Riddle[] {
  return shuffle([...RIDDLES]).slice(0, Math.min(count, RIDDLES.length));
}

export const totalRiddles = RIDDLES.length;

/* ------------------------------------------------------------------ */
/* Assonance (shared vowel sounds)                                     */
/* ------------------------------------------------------------------ */

/** The sequence of vowel letters in a word — a simple assonance signature. */
export function vowelSignature(word: string): string {
  return word.toLowerCase().replace(/[^aeiou]/g, "");
}

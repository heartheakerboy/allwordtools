import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import {
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock,
  Home,
  Lightbulb,
  ListChecks,
  Share2,
  Sparkles,
  User,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ToolRelatedSections } from "@/components/site/ToolRelatedSections";
import { TrustedReferences } from "@/components/site/TrustedReferences";
import { DiscoverMore } from "@/components/site/DiscoverMore";
import { KeywordClusters, BottomCta } from "@/components/site/LinkSections";
import { WordUnscrambler } from "@/components/tools/WordUnscrambler";
import { AnagramSolver } from "@/components/tools/AnagramSolver";
import { WordFinder } from "@/components/tools/WordFinder";
import { WordleSolver } from "@/components/tools/WordleSolver";
import { CrosswordSolver } from "@/components/tools/CrosswordSolver";
import { WordsStartingWith } from "@/components/tools/WordsStartingWith";
import { WordsEndingWith } from "@/components/tools/WordsEndingWith";
import { WordsContaining } from "@/components/tools/WordsContaining";
import { LetterCounter } from "@/components/tools/LetterCounter";
import { LetterPatternFinder } from "@/components/tools/LetterPatternFinder";
import { SynonymFinder } from "@/components/tools/SynonymFinder";
import { AntonymFinder } from "@/components/tools/AntonymFinder";
import { RhymingWords } from "@/components/tools/RhymingWords";
import { SyllableCounter } from "@/components/tools/SyllableCounter";
import { RandomWordGenerator } from "@/components/tools/RandomWordGenerator";
import { ScrabbleHelper } from "@/components/tools/ScrabbleHelper";
import { WordsWithFriendsHelper } from "@/components/tools/WordsWithFriendsHelper";
import { BoggleSolver } from "@/components/tools/BoggleSolver";
import { HangmanSolver } from "@/components/tools/HangmanSolver";
import { TextTwistSolver } from "@/components/tools/TextTwistSolver";
import { PatternSolver } from "@/components/tools/PatternSolver";
import { WildcardSolver } from "@/components/tools/WildcardSolver";
import { MissingLettersFinder } from "@/components/tools/MissingLettersFinder";
import { LetterRearranger } from "@/components/tools/LetterRearranger";
import { ReverseDictionary } from "@/components/tools/ReverseDictionary";
import { LetterFrequencyAnalyzer } from "@/components/tools/LetterFrequencyAnalyzer";
import { VowelCounter } from "@/components/tools/VowelCounter";
import { ConsonantCounter } from "@/components/tools/ConsonantCounter";
import { RepeatedLetterFinder } from "@/components/tools/RepeatedLetterFinder";
import { AlphabeticalSorter } from "@/components/tools/AlphabeticalSorter";
import { Dictionary } from "@/components/tools/Dictionary";
import { WordMeaning } from "@/components/tools/WordMeaning";
import { Pronunciation } from "@/components/tools/Pronunciation";
import { IpaConverter } from "@/components/tools/IpaConverter";
import { WordOrigin } from "@/components/tools/WordOrigin";
import { SimilarWords } from "@/components/tools/SimilarWords";
import { OppositeWords } from "@/components/tools/OppositeWords";
import { CollocationFinder } from "@/components/tools/CollocationFinder";
import { ExampleSentences } from "@/components/tools/ExampleSentences";
import { PhrasesDictionary } from "@/components/tools/PhrasesDictionary";
import { PassiveVoiceChecker } from "@/components/tools/PassiveVoiceChecker";
import { ActiveVoiceConverter } from "@/components/tools/ActiveVoiceConverter";
import { GrammarChecker } from "@/components/tools/GrammarChecker";
import { SpellChecker } from "@/components/tools/SpellChecker";
import { PunctuationChecker } from "@/components/tools/PunctuationChecker";
import { WordCookiesSolver } from "@/components/tools/WordCookiesSolver";
import { WordscapesSolver } from "@/components/tools/WordscapesSolver";
import { CodyCrossSolver } from "@/components/tools/CodyCrossSolver";
import { SevenLittleWordsSolver } from "@/components/tools/SevenLittleWordsSolver";
import { WheelOfFortuneSolver } from "@/components/tools/WheelOfFortuneSolver";
import { RandomLetterGenerator } from "@/components/tools/RandomLetterGenerator";
import { RandomSentenceGenerator } from "@/components/tools/RandomSentenceGenerator";
import { RandomParagraphGenerator } from "@/components/tools/RandomParagraphGenerator";
import { RandomTopicGenerator } from "@/components/tools/RandomTopicGenerator";
import { RandomVerbGenerator } from "@/components/tools/RandomVerbGenerator";
import { DogNameGenerator } from "@/components/tools/DogNameGenerator";
import { CatNameGenerator } from "@/components/tools/CatNameGenerator";
import { TeamNameGenerator } from "@/components/tools/TeamNameGenerator";
import { GuildNameGenerator } from "@/components/tools/GuildNameGenerator";
import { ClanNameGenerator } from "@/components/tools/ClanNameGenerator";
import { CharacterNameGenerator } from "@/components/tools/CharacterNameGenerator";
import { VocabularyQuiz } from "@/components/tools/VocabularyQuiz";
import { DailyWord } from "@/components/tools/DailyWord";
import { WordOfTheDayTool } from "@/components/tools/WordOfTheDayTool";
import { SpellingQuiz } from "@/components/tools/SpellingQuiz";
import { SynonymQuiz } from "@/components/tools/SynonymQuiz";
import { AntonymQuiz } from "@/components/tools/AntonymQuiz";
import { PrefixQuiz } from "@/components/tools/PrefixQuiz";
import { SuffixQuiz } from "@/components/tools/SuffixQuiz";
import { AiWordExplainer } from "@/components/tools/AiWordExplainer";
import { AiSentenceGenerator } from "@/components/tools/AiSentenceGenerator";
import { AiExampleGenerator } from "@/components/tools/AiExampleGenerator";
import { AiStoryGenerator } from "@/components/tools/AiStoryGenerator";
import { AiPoemGenerator } from "@/components/tools/AiPoemGenerator";
import { AiVocabularyBuilder } from "@/components/tools/AiVocabularyBuilder";
import { AiQuizGenerator } from "@/components/tools/AiQuizGenerator";
import { AiFlashcards } from "@/components/tools/AiFlashcards";
import { AlliterationGenerator } from "@/components/tools/AlliterationGenerator";
import { AssonanceFinder } from "@/components/tools/AssonanceFinder";
import { TongueTwisterGenerator } from "@/components/tools/TongueTwisterGenerator";
import { CvcWordGenerator } from "@/components/tools/CvcWordGenerator";
import { SightWordGenerator } from "@/components/tools/SightWordGenerator";
import { WordLadderSolver } from "@/components/tools/WordLadderSolver";
import { StrandsSolver } from "@/components/tools/StrandsSolver";
import { RiddleGenerator } from "@/components/tools/RiddleGenerator";
import { DemonNameGenerator } from "@/components/tools/DemonNameGenerator";
import { AlienNameGenerator } from "@/components/tools/AlienNameGenerator";
import { WitchNameGenerator } from "@/components/tools/WitchNameGenerator";
import { KnightNameGenerator } from "@/components/tools/KnightNameGenerator";
import { VampireNameGenerator } from "@/components/tools/VampireNameGenerator";
import { RobotNameGenerator } from "@/components/tools/RobotNameGenerator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { allTools, categories, toolIcons, type Tool } from "@/data/tools";
import { toolContent } from "@/data/tool-content";
import { getToolReferences } from "@/lib/external-links";
import { buildLocaleHead, inLanguage } from "@/i18n/seo";
import { localePath } from "@/i18n/paths";
import { DEFAULT_LOCALE } from "@/i18n/locales";
import { mergeToolContent, type LocalizedToolContent } from "@/i18n/content";

const SITE = "AllWordTools.com";

function getTool(slug: string): Tool | undefined {
  return allTools.find((t) => t.slug === slug);
}
function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function toolHead(slug: string, locale: string, override?: LocalizedToolContent | null) {
  const tool = getTool(slug);
  const content = mergeToolContent(toolContent[slug], override);
  if (!tool) {
    return {
      meta: [{ title: `Tool not found — ${SITE}` }, { name: "robots", content: "noindex" }],
    };
  }
  const title = content?.metaTitle ?? `${tool.name} — ${SITE}`;
  const description = content?.metaDescription ?? tool.description;
  const path = `/tool/${slug}`;
  const url = localePath(locale, path);
  const home = localePath(locale, "/");
  const category = getCategory(tool.category);
  const { meta, links } = buildLocaleHead({ path, locale, title, description });

  return {
    meta,
    links,
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          inLanguage: inLanguage(locale),
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: home },
            ...(category
              ? [
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: category.title,
                    item: localePath(locale, `/category/${category.slug}`),
                  },
                ]
              : []),
            {
              "@type": "ListItem",
              position: category ? 3 : 2,
              name: tool.name,
              item: url,
            },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: tool.name,
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Web",
          description,
          inLanguage: inLanguage(locale),
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          publisher: { "@type": "Organization", name: SITE },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `Related tools to ${tool.name}`,
          itemListElement: (content?.related ?? [])
            .map((s) => getTool(s))
            .filter((t): t is Tool => Boolean(t))
            .map((t, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: t.name,
              url: localePath(locale, `/tool/${t.slug}`),
            })),
        }),
      },
      ...(content
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "HowTo",
                name: content.howToTitle,
                step: content.howToSteps.map((s, i) => ({
                  "@type": "HowToStep",
                  position: i + 1,
                  name: s.title,
                  text: s.detail,
                })),
              }),
            },
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: content.faqs.map((f) => ({
                  "@type": "Question",
                  name: f.question,
                  acceptedAnswer: { "@type": "Answer", text: f.answer },
                })),
              }),
            },
          ]
        : []),
    ],
  };
}

export const Route = createFileRoute("/tool/$tool")({
  loader: ({ params }) => {
    if (!getTool(params.tool)) throw notFound();
    return { slug: params.tool };
  },
  head: ({ params }) => toolHead(params.tool, DEFAULT_LOCALE),
  component: RootToolPage,
  notFoundComponent: ToolNotFound,
  errorComponent: ToolError,
});

function RootToolPage() {
  const { slug } = Route.useLoaderData();
  return <ToolPageView slug={slug} />;
}

export function ToolPageView({
  slug,
  contentOverride,
}: {
  slug: string;
  contentOverride?: LocalizedToolContent | null;
}) {
  const tool = getTool(slug)!;
  const content = mergeToolContent(toolContent[slug], contentOverride);
  const category = getCategory(tool.category);
  const Icon = toolIcons[slug] ?? Sparkles;
  const references = getToolReferences(slug);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero + tool */}
        <section className="gradient-hero border-b border-border/60">
          <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <nav aria-label="Breadcrumb" className="mb-7">
              <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
                <li>
                  <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground">
                    <Home className="h-3.5 w-3.5" /> Home
                  </Link>
                </li>
                {category && (
                  <>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <li>
                      <Link
                        to="/category/$category"
                        params={{ category: category.slug }}
                        className="hover:text-foreground"
                      >
                        {category.title}
                      </Link>
                    </li>
                  </>
                )}
                <ChevronRight className="h-3.5 w-3.5" />
                <li className="font-medium text-foreground">{tool.name}</li>
              </ol>
            </nav>

            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl gradient-ink text-primary-foreground shadow-lift">
                <Icon className="h-7 w-7" />
              </span>
              <div>
                <h1 className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-4xl">
                  {content?.heading ?? tool.name}
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground text-balance sm:text-lg">
                  {content?.subheading ?? tool.description}
                </p>
              </div>
            </div>

            {/* Meta row */}
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              {content && (
                <>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarClock className="h-3.5 w-3.5" /> Updated {content.updated}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> {content.readingMinutes} min read
                  </span>
                </>
              )}
              <ShareButton title={content?.metaTitle ?? tool.name} />
            </div>

            {/* Interactive tool */}
            <div className="mt-8">
              {slug === "word-unscrambler" ? (
                <WordUnscrambler />
              ) : slug === "anagram-solver" ? (
                <AnagramSolver />
              ) : slug === "word-finder" ? (
                <WordFinder />
              ) : slug === "wordle-solver" ? (
                <WordleSolver />
              ) : slug === "crossword-solver" ? (
                <CrosswordSolver />
              ) : slug === "words-starting-with" ? (
                <WordsStartingWith />
              ) : slug === "words-ending-with" ? (
                <WordsEndingWith />
              ) : slug === "words-containing" ? (
                <WordsContaining />
              ) : slug === "letter-counter" ? (
                <LetterCounter />
              ) : slug === "letter-pattern-finder" ? (
                <LetterPatternFinder />
              ) : slug === "synonym-finder" ? (
                <SynonymFinder />
              ) : slug === "antonym-finder" ? (
                <AntonymFinder />
              ) : slug === "rhyming-words" ? (
                <RhymingWords />
              ) : slug === "syllable-counter" ? (
                <SyllableCounter />
              ) : slug === "random-word-generator" ? (
                <RandomWordGenerator />
              ) : slug === "scrabble-helper" ? (
                <ScrabbleHelper />
              ) : slug === "words-with-friends-helper" ? (
                <WordsWithFriendsHelper />
              ) : slug === "boggle-solver" ? (
                <BoggleSolver />
              ) : slug === "hangman-solver" ? (
                <HangmanSolver />
              ) : slug === "text-twist-solver" ? (
                <TextTwistSolver />
              ) : slug === "pattern-solver" ? (
                <PatternSolver />
              ) : slug === "wildcard-solver" ? (
                <WildcardSolver />
              ) : slug === "missing-letters-finder" ? (
                <MissingLettersFinder />
              ) : slug === "letter-rearranger" ? (
                <LetterRearranger />
              ) : slug === "reverse-dictionary" ? (
                <ReverseDictionary />
              ) : slug === "letter-frequency-analyzer" ? (
                <LetterFrequencyAnalyzer />
              ) : slug === "vowel-counter" ? (
                <VowelCounter />
              ) : slug === "consonant-counter" ? (
                <ConsonantCounter />
              ) : slug === "repeated-letter-finder" ? (
                <RepeatedLetterFinder />
              ) : slug === "alphabetical-sorter" ? (
                <AlphabeticalSorter />
              ) : slug === "dictionary" ? (
                <Dictionary />
              ) : slug === "word-meaning" ? (
                <WordMeaning />
              ) : slug === "pronunciation" ? (
                <Pronunciation />
              ) : slug === "ipa-converter" ? (
                <IpaConverter />
              ) : slug === "word-origin" ? (
                <WordOrigin />
              ) : slug === "similar-words" ? (
                <SimilarWords />
              ) : slug === "opposite-words" ? (
                <OppositeWords />
              ) : slug === "collocation-finder" ? (
                <CollocationFinder />
              ) : slug === "example-sentences" ? (
                <ExampleSentences />
              ) : slug === "phrases-dictionary" ? (
                <PhrasesDictionary />
              ) : slug === "passive-voice-checker" ? (
                <PassiveVoiceChecker />
              ) : slug === "active-voice-converter" ? (
                <ActiveVoiceConverter />
              ) : slug === "grammar-checker" ? (
                <GrammarChecker />
              ) : slug === "spell-checker" ? (
                <SpellChecker />
              ) : slug === "punctuation-checker" ? (
                <PunctuationChecker />
              ) : slug === "word-cookies-solver" ? (
                <WordCookiesSolver />
              ) : slug === "wordscapes-solver" ? (
                <WordscapesSolver />
              ) : slug === "codycross-solver" ? (
                <CodyCrossSolver />
              ) : slug === "seven-little-words-solver" ? (
                <SevenLittleWordsSolver />
              ) : slug === "wheel-of-fortune-solver" ? (
                <WheelOfFortuneSolver />
              ) : slug === "random-letter-generator" ? (
                <RandomLetterGenerator />
              ) : slug === "random-sentence-generator" ? (
                <RandomSentenceGenerator />
              ) : slug === "random-paragraph-generator" ? (
                <RandomParagraphGenerator />
              ) : slug === "random-topic-generator" ? (
                <RandomTopicGenerator />
              ) : slug === "random-verb-generator" ? (
                <RandomVerbGenerator />
              ) : slug === "dog-name-generator" ? (
                <DogNameGenerator />
              ) : slug === "cat-name-generator" ? (
                <CatNameGenerator />
              ) : slug === "team-name-generator" ? (
                <TeamNameGenerator />
              ) : slug === "guild-name-generator" ? (
                <GuildNameGenerator />
              ) : slug === "clan-name-generator" ? (
                <ClanNameGenerator />
              ) : slug === "character-name-generator" ? (
                <CharacterNameGenerator />
              ) : slug === "vocabulary-quiz" ? (
                <VocabularyQuiz />
              ) : slug === "daily-word" ? (
                <DailyWord />
              ) : slug === "word-of-the-day" ? (
                <WordOfTheDayTool />
              ) : slug === "spelling-quiz" ? (
                <SpellingQuiz />
              ) : slug === "synonym-quiz" ? (
                <SynonymQuiz />
              ) : slug === "antonym-quiz" ? (
                <AntonymQuiz />
              ) : slug === "prefix-quiz" ? (
                <PrefixQuiz />
              ) : slug === "suffix-quiz" ? (
                <SuffixQuiz />
              ) : slug === "ai-word-explainer" ? (
                <AiWordExplainer />
              ) : slug === "ai-sentence-generator" ? (
                <AiSentenceGenerator />
              ) : slug === "ai-example-generator" ? (
                <AiExampleGenerator />
              ) : slug === "ai-story-generator" ? (
                <AiStoryGenerator />
              ) : slug === "ai-poem-generator" ? (
                <AiPoemGenerator />
              ) : slug === "ai-vocabulary-builder" ? (
                <AiVocabularyBuilder />
              ) : slug === "ai-quiz-generator" ? (
                <AiQuizGenerator />
              ) : slug === "ai-flashcards" ? (
                <AiFlashcards />
              ) : slug === "alliteration-generator" ? (
                <AlliterationGenerator />
              ) : slug === "assonance-finder" ? (
                <AssonanceFinder />
              ) : slug === "tongue-twister-generator" ? (
                <TongueTwisterGenerator />
              ) : slug === "cvc-word-generator" ? (
                <CvcWordGenerator />
              ) : slug === "sight-word-generator" ? (
                <SightWordGenerator />
              ) : slug === "word-ladder-solver" ? (
                <WordLadderSolver />
              ) : slug === "strands-solver" ? (
                <StrandsSolver />
              ) : slug === "riddle-generator" ? (
                <RiddleGenerator />
              ) : slug === "demon-name-generator" ? (
                <DemonNameGenerator />
              ) : slug === "alien-name-generator" ? (
                <AlienNameGenerator />
              ) : slug === "witch-name-generator" ? (
                <WitchNameGenerator />
              ) : slug === "knight-name-generator" ? (
                <KnightNameGenerator />
              ) : slug === "vampire-name-generator" ? (
                <VampireNameGenerator />
              ) : slug === "robot-name-generator" ? (
                <RobotNameGenerator />
              ) : (
                <div className="rounded-3xl border border-dashed border-border/70 bg-card p-8 text-center">
                  <Sparkles className="mx-auto h-8 w-8 text-honey" />
                  <h2 className="mt-3 font-display text-xl font-semibold">Tool coming soon</h2>
                  <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                    We're putting the finishing touches on the {tool.name}. In the meantime, try our
                    Word Unscrambler.
                  </p>
                  <Button asChild className="mt-5 rounded-full">
                    <Link to="/tool/$tool" params={{ tool: "word-unscrambler" }}>
                      Open Word Unscrambler
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {content && (
          <>
            {/* Intro */}
            <section
              className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8"
              aria-labelledby="about"
            >
              <h2
                id="about"
                className="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
              >
                About the {tool.name}
              </h2>
              <div className="mt-5 space-y-4">
                {content.intro.map((p, i) => (
                  <p key={i} className="text-base leading-relaxed text-muted-foreground">
                    {p}
                  </p>
                ))}
              </div>
            </section>

            {/* How to use */}
            <section className="bg-secondary/40 py-12" aria-labelledby="how-to">
              <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <h2
                  id="how-to"
                  className="flex items-center gap-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl"
                >
                  <ListChecks className="h-6 w-6 text-honey" /> {content.howToTitle}
                </h2>
                <ol className="mt-6 space-y-5">
                  {content.howToSteps.map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full gradient-honey text-sm font-bold text-honey-foreground">
                        {i + 1}
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-semibold">{step.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {step.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            {/* Long-form sections */}
            <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
              <div className="space-y-10">
                {content.sections.map((s) => (
                  <article key={s.heading}>
                    <h2 className="font-display text-2xl font-semibold tracking-tight">
                      {s.heading}
                    </h2>
                    <div className="mt-3 space-y-4">
                      {s.paragraphs.map((p, i) => (
                        <p key={i} className="text-base leading-relaxed text-muted-foreground">
                          {p}
                        </p>
                      ))}
                    </div>
                  </article>
                ))}
              </div>

              {/* Examples */}
              <div className="mt-12">
                <h2 className="font-display text-2xl font-semibold tracking-tight">Examples</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {content.examples.map((ex, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft"
                    >
                      <span className="text-xs font-semibold uppercase tracking-wider text-honey">
                        Input
                      </span>
                      <p className="mt-1 font-display text-lg font-semibold tracking-wide">
                        {ex.input}
                      </p>
                      <span className="mt-3 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Sample output
                      </span>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {ex.output}
                      </p>
                      <p className="mt-3 text-xs italic text-muted-foreground/80">{ex.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="mt-12 rounded-3xl border border-border/70 bg-card p-7 shadow-soft">
                <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
                  <Lightbulb className="h-5 w-5 text-honey" /> Pro tips
                </h2>
                <ul className="mt-4 space-y-3">
                  {content.tips.map((tip, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-honey" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* FAQ */}
            <section className="mx-auto max-w-3xl px-4 pb-4 sm:px-6 lg:px-8" aria-labelledby="faq">
              <span className="text-sm font-semibold uppercase tracking-wider text-honey">
                Questions & answers
              </span>
              <h2
                id="faq"
                className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl"
              >
                {tool.name} FAQs
              </h2>
              <Accordion type="single" collapsible className="mt-6 w-full">
                {content.faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border-border/70">
                    <AccordionTrigger className="text-left font-display text-base font-semibold">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Author */}
            <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
              <div className="flex items-center gap-4 rounded-2xl border border-border/70 bg-secondary/40 p-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full gradient-ink text-primary-foreground">
                  <User className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-display text-sm font-semibold">The AllWordTools.com Team</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    Word-game specialists and language enthusiasts building fast, accurate tools
                    that help millions of players find the right word. Last reviewed{" "}
                    {content.updated}.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Trusted external references — only when genuinely educational */}
        <TrustedReferences references={references} className="pt-2" />

        {/* Auto-generated internal linking: related, recommended, next/prev */}
        <ToolRelatedSections slug={slug} />

        {/* Contextual keyword clusters */}
        <KeywordClusters />

        {/* Sidebar-style discovery band */}
        <DiscoverMore excludeSlug={slug} />

        {/* Bottom CTA */}
        <BottomCta />
      </main>
      <Footer />
    </div>
  );
}

function ShareButton({ title }: { title: string }) {
  const share = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
  };
  return (
    <button
      onClick={share}
      className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/70 px-3 py-1 font-medium text-foreground transition-colors hover:border-honey/60"
    >
      <Share2 className="h-3.5 w-3.5" /> Share
    </button>
  );
}

export function ToolNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold">Tool not found</h1>
        <p className="mt-3 text-muted-foreground">
          We couldn't find that tool. Explore all of our word tools instead.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
      <Footer />
    </div>
  );
}

export function ToolError({ reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold">This page didn't load</h1>
        <p className="mt-3 text-muted-foreground">Something went wrong. Please try again.</p>
        <Button
          className="mt-6 rounded-full"
          onClick={() => {
            router.invalidate();
            reset();
          }}
        >
          Try again
        </Button>
      </div>
      <Footer />
    </div>
  );
}

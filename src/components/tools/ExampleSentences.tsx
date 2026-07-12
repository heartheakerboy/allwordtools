import { Quote } from "lucide-react";
import { DictionaryLookup } from "./dictionary/DictionaryLookup";

/**
 * Example Sentences — looks a word up in the live dictionary and pulls out
 * every example sentence it has, grouped by part of speech, so learners can
 * see the word used in real context.
 */
export function ExampleSentences() {
  return (
    <DictionaryLookup
      label="Enter a word"
      placeholder="e.g. resilient"
      action="Get examples"
      showAudio={false}
      hint="Type a word to see real example sentences showing how it's used, grouped by part of speech."
    >
      {(entries, term) => {
        const groups = entries
          .flatMap((entry) =>
            entry.meanings.map((m) => ({
              partOfSpeech: m.partOfSpeech,
              examples: m.definitions
                .map((d) => d.example)
                .filter((e): e is string => Boolean(e && e.trim())),
            })),
          )
          .filter((g) => g.examples.length > 0);

        if (groups.length === 0) {
          return (
            <p className="text-sm text-muted-foreground">
              The dictionary has no example sentences for &ldquo;{term}&rdquo;. Try a more common
              word, or use the Word Meaning tool for definitions.
            </p>
          );
        }

        return (
          <div className="space-y-7">
            {groups.map((g, gi) => (
              <div key={gi}>
                <h3 className="font-display text-lg font-semibold italic text-muted-foreground">
                  {g.partOfSpeech}
                </h3>
                <ul className="mt-3 space-y-3">
                  {g.examples.map((ex, ei) => (
                    <li
                      key={ei}
                      className="flex gap-3 rounded-2xl border border-border/60 bg-secondary/30 p-4"
                    >
                      <Quote className="mt-0.5 h-4 w-4 shrink-0 text-honey" />
                      <p className="leading-relaxed">{ex}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
      }}
    </DictionaryLookup>
  );
}

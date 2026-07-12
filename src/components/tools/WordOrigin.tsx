import { DictionaryLookup } from "./dictionary/DictionaryLookup";

export function WordOrigin() {
  return (
    <DictionaryLookup
      label="Enter a word"
      placeholder="e.g. quarantine"
      action="Trace origin"
      showAudio={false}
      hint="Type a word to trace its etymology — where it came from, the languages and roots it grew from, and how its meaning developed over time."
    >
      {(entries, term) => {
        const origin = entries.find((e) => e.origin && e.origin.trim().length > 0)?.origin;
        const partsOfSpeech = Array.from(
          new Set(entries.flatMap((e) => e.meanings.map((m) => m.partOfSpeech))),
        );
        return (
          <div className="space-y-6">
            {origin ? (
              <div>
                <h3 className="font-display text-lg font-semibold">Etymology</h3>
                <p className="mt-2 leading-relaxed">{origin}</p>
              </div>
            ) : (
              <p className="rounded-xl bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
                A detailed etymology isn&rsquo;t recorded for &ldquo;{term}&rdquo; in our dictionary
                source. Below is what we do know about how the word is used today.
              </p>
            )}

            {partsOfSpeech.length > 0 && (
              <div>
                <h3 className="font-display text-lg font-semibold">Used as</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {partsOfSpeech.map((p) => (
                    <span
                      key={p}
                      className="rounded-lg border border-border/70 bg-secondary/40 px-2.5 py-1 text-sm font-medium italic"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-display text-lg font-semibold">Modern meaning</h3>
              <ul className="mt-2 space-y-2">
                {entries.slice(0, 1).flatMap((e) =>
                  e.meanings.slice(0, 3).map((m, mi) => (
                    <li key={mi} className="text-sm leading-relaxed text-muted-foreground">
                      <span className="italic text-foreground">{m.partOfSpeech}:</span>{" "}
                      {m.definitions[0]?.definition}
                    </li>
                  )),
                )}
              </ul>
            </div>
          </div>
        );
      }}
    </DictionaryLookup>
  );
}

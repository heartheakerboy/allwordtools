import { DictionaryLookup } from "./dictionary/DictionaryLookup";

export function WordMeaning() {
  return (
    <DictionaryLookup
      label="Enter a word"
      placeholder="e.g. ephemeral"
      action="Get meaning"
      showAudio={false}
      hint="Type a word to read its meaning in plain English, grouped by part of speech with clear example sentences."
    >
      {(entries) => (
        <div className="space-y-7">
          {entries.map((entry, ei) =>
            entry.meanings.map((m, mi) => (
              <div key={`${ei}-${mi}`}>
                <h3 className="font-display text-lg font-semibold italic text-muted-foreground">
                  {m.partOfSpeech}
                </h3>
                <ol className="mt-3 space-y-4">
                  {m.definitions.map((d, di) => (
                    <li key={di} className="flex gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/60 text-xs font-semibold">
                        {di + 1}
                      </span>
                      <div className="space-y-1.5">
                        <p className="leading-relaxed">{d.definition}</p>
                        {d.example && (
                          <p className="text-sm italic text-muted-foreground">
                            &ldquo;{d.example}&rdquo;
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )),
          )}
        </div>
      )}
    </DictionaryLookup>
  );
}

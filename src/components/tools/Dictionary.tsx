import { Copy } from "lucide-react";
import { toast } from "sonner";
import { DictionaryLookup } from "./dictionary/DictionaryLookup";
import { firstPhoneticText } from "@/lib/dictionary";

const copy = (text: string) => {
  navigator.clipboard?.writeText(text);
  toast.success("Copied");
};

export function Dictionary() {
  return (
    <DictionaryLookup
      label="Enter a word"
      placeholder="e.g. serendipity"
      action="Look up"
      hint="Type any English word to see its pronunciation, parts of speech, full definitions, examples, synonyms and antonyms — all in one place."
    >
      {(entries) => {
        const ipa = firstPhoneticText(entries);
        return (
          <div className="space-y-7">
            {ipa && <p className="font-mono text-lg text-honey">{ipa}</p>}
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
                          {d.synonyms.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium text-foreground">Synonyms: </span>
                              {d.synonyms.slice(0, 8).join(", ")}
                            </p>
                          )}
                          {d.antonyms.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium text-foreground">Antonyms: </span>
                              {d.antonyms.slice(0, 8).join(", ")}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                  {(m.synonyms.length > 0 || m.antonyms.length > 0) && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {m.synonyms.slice(0, 12).map((s) => (
                        <button
                          key={s}
                          onClick={() => copy(s)}
                          className="rounded-lg border border-border/70 bg-secondary/40 px-2.5 py-1 text-xs font-medium transition-colors hover:border-honey/60 hover:bg-accent"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )),
            )}
          </div>
        );
      }}
    </DictionaryLookup>
  );
}

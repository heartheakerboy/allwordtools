import { Copy } from "lucide-react";
import { toast } from "sonner";
import { DictionaryLookup } from "./dictionary/DictionaryLookup";
import { allPhonetics } from "@/lib/dictionary";

export function IpaConverter() {
  return (
    <DictionaryLookup
      label="Enter an English word"
      placeholder="e.g. knowledge"
      action="Convert to IPA"
      showAudio={false}
      hint="Type an English word to convert it into its International Phonetic Alphabet (IPA) transcription — the standard way to write exactly how a word sounds."
    >
      {(entries, term) => {
        const texts = allPhonetics(entries)
          .map((p) => p.text)
          .filter((t): t is string => Boolean(t));
        const unique = Array.from(new Set(texts));
        return unique.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm font-medium text-muted-foreground">IPA transcription</p>
            <div className="flex flex-wrap gap-3">
              {unique.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    navigator.clipboard?.writeText(t);
                    toast.success(`Copied "${t}"`);
                  }}
                  title="Click to copy"
                  className="group inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-secondary/40 px-4 py-2.5 font-mono text-xl text-honey transition-colors hover:border-honey/60 hover:bg-accent"
                >
                  {t}
                  <Copy className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="rounded-xl bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
            No IPA transcription is available for &ldquo;{term}&rdquo; in the dictionary. Try a more
            common spelling or a related word.
          </p>
        );
      }}
    </DictionaryLookup>
  );
}

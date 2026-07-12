import { useState } from "react";
import { Copy, Loader2, Search, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchSynonyms, fetchAntonyms, fetchMeansLike, type RelatedWord } from "@/lib/datamuse";

type Mode = "synonyms" | "antonyms" | "similar";

const COPY = {
  synonyms: {
    label: "Find synonyms for",
    placeholder: "e.g. happy",
    cta: "Find synonyms",
    empty: "No synonyms found for that word. Check the spelling or try a related word.",
    heading: (n: number, w: string) => `${n} synonym${n === 1 ? "" : "s"} for "${w}"`,
    fetch: fetchSynonyms,
  },
  antonyms: {
    label: "Find antonyms for",
    placeholder: "e.g. happy",
    cta: "Find antonyms",
    empty:
      "No antonyms found for that word. Not every word has a direct opposite — try a different one.",
    heading: (n: number, w: string) => `${n} antonym${n === 1 ? "" : "s"} for "${w}"`,
    fetch: fetchAntonyms,
  },
  similar: {
    label: "Find similar words to",
    placeholder: "e.g. happy",
    cta: "Find similar words",
    empty: "No similar words found. Check the spelling or try a more common word.",
    heading: (n: number, w: string) => `${n} word${n === 1 ? "" : "s"} similar to "${w}"`,
    fetch: fetchMeansLike,
  },
} as const;

export function WordRelationTool({ mode }: { mode: Mode }) {
  const config = COPY[mode];
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<RelatedWord[] | null>(null);
  const [term, setTerm] = useState("");

  const run = async () => {
    const word = query.trim().toLowerCase();
    if (!word) {
      toast.error("Enter a word first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const rows = await config.fetch(word);
      setResults(rows);
      setTerm(word);
    } catch {
      setError("Couldn't reach the word service. Please check your connection and try again.");
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const copy = (w: string) => {
    navigator.clipboard?.writeText(w);
    toast.success(`Copied "${w}"`);
  };

  const reset = () => {
    setQuery("");
    setResults(null);
    setError(null);
    setTerm("");
  };

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-lift sm:p-7">
      <div className="space-y-1.5">
        <Label htmlFor="wr-query" className="text-xs font-semibold text-muted-foreground">
          {config.label}
        </Label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            id="wr-query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run()}
            placeholder={config.placeholder}
            autoComplete="off"
            spellCheck={false}
            className="rounded-xl sm:h-12 sm:text-base"
          />
          <Button
            onClick={run}
            disabled={loading}
            className="h-12 shrink-0 rounded-2xl px-8 text-base font-semibold"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Search className="mr-2 h-5 w-5" />
            )}
            {config.cta}
          </Button>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {results && (
        <div className="mt-7 border-t border-border/60 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
              <Sparkles className="h-5 w-5 text-honey" />
              {results.length > 0 ? config.heading(results.length, term) : "No results"}
            </h2>
            <Button variant="ghost" size="sm" onClick={reset} className="rounded-full">
              <X className="mr-1.5 h-4 w-4" /> Clear
            </Button>
          </div>

          {results.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">{config.empty}</p>
          ) : (
            <div className="mt-5 flex flex-wrap gap-2">
              {results.map((r) => (
                <button
                  key={r.word}
                  onClick={() => copy(r.word)}
                  title="Click to copy"
                  className="group inline-flex items-center gap-2 rounded-xl border border-border/70 bg-secondary/40 px-3 py-1.5 text-sm font-medium capitalize transition-colors hover:border-honey/60 hover:bg-accent"
                >
                  {r.word}
                  <Copy className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { Copy, Loader2, Search, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchMeansLike, type RelatedWord } from "@/lib/datamuse";

export function ReverseDictionary() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<RelatedWord[] | null>(null);
  const [term, setTerm] = useState("");

  const run = async () => {
    const phrase = query.trim();
    if (!phrase) {
      toast.error("Describe the word you're looking for.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const rows = await fetchMeansLike(phrase);
      setResults(rows);
      setTerm(phrase);
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
        <Label htmlFor="rd-query" className="text-xs font-semibold text-muted-foreground">
          Describe the word or concept
        </Label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            id="rd-query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run()}
            placeholder="e.g. a feeling of great happiness"
            autoComplete="off"
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
            Find words
          </Button>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Type a definition, description or a few related words, and the reverse dictionary returns
        the words that match the meaning — ranked from the closest fit.
      </p>

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
              {results.length > 0
                ? `${results.length} word${results.length === 1 ? "" : "s"} for "${term}"`
                : "No results"}
            </h2>
            <Button variant="ghost" size="sm" onClick={reset} className="rounded-full">
              <X className="mr-1.5 h-4 w-4" /> Clear
            </Button>
          </div>

          {results.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No words matched that description. Try rephrasing it or using simpler, more common
              terms.
            </p>
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

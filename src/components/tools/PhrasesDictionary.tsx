import { useState } from "react";
import { Copy, Loader2, Quote, Search, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchPredecessors, fetchFollowers } from "@/lib/datamuse";

type Phrase = { text: string; score: number };

/**
 * Phrases Dictionary — enter a word and discover the most common two-word
 * phrases and expressions built around it, ranked by how often they occur in
 * real English. Great for natural writing and vocabulary building.
 */
export function PhrasesDictionary() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phrases, setPhrases] = useState<Phrase[] | null>(null);
  const [term, setTerm] = useState("");

  const run = async () => {
    const word = query.trim().toLowerCase();
    if (!word) {
      toast.error("Enter a word first.");
      return;
    }
    if (/\s/.test(word)) {
      toast.error("Please enter a single word.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [before, after] = await Promise.all([fetchPredecessors(word), fetchFollowers(word)]);
      const combined: Phrase[] = [
        ...before.map((r) => ({ text: `${r.word} ${word}`, score: r.score })),
        ...after.map((r) => ({ text: `${word} ${r.word}`, score: r.score })),
      ]
        .sort((a, b) => b.score - a.score)
        .slice(0, 40);
      setPhrases(combined);
      setTerm(word);
    } catch {
      setError("Couldn't reach the word service. Please check your connection and try again.");
      setPhrases(null);
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
    setPhrases(null);
    setError(null);
    setTerm("");
  };

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-lift sm:p-7">
      <div className="space-y-1.5">
        <Label htmlFor="phr-query" className="text-xs font-semibold text-muted-foreground">
          Find phrases with
        </Label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            id="phr-query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run()}
            placeholder="e.g. time"
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
            Find phrases
          </Button>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Discover common phrases and expressions built around your word, ranked by how often they
        appear in real English.
      </p>

      {error && (
        <p className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {phrases && (
        <div className="mt-7 border-t border-border/60 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
              <Quote className="h-5 w-5 text-honey" />
              {phrases.length > 0
                ? `${phrases.length} phrase${phrases.length === 1 ? "" : "s"} with "${term}"`
                : "No phrases found"}
            </h2>
            <Button variant="ghost" size="sm" onClick={reset} className="rounded-full">
              <X className="mr-1.5 h-4 w-4" /> Clear
            </Button>
          </div>

          {phrases.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No common phrases found for that word. Try a more common word.
            </p>
          ) : (
            <div className="mt-5 flex flex-wrap gap-2">
              {phrases.map((p) => (
                <button
                  key={p.text}
                  onClick={() => copy(p.text)}
                  title="Click to copy"
                  className="group inline-flex items-center gap-2 rounded-xl border border-border/70 bg-secondary/40 px-3 py-1.5 text-sm font-medium transition-colors hover:border-honey/60 hover:bg-accent"
                >
                  {p.text}
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

import { useState } from "react";
import { Copy, Loader2, Music, Search, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchPerfectRhymes, fetchNearRhymes, type RelatedWord } from "@/lib/datamuse";

function groupBySyllables(words: RelatedWord[]) {
  const map = new Map<number, RelatedWord[]>();
  for (const w of words) {
    const key = w.numSyllables ?? 0;
    const arr = map.get(key) ?? [];
    arr.push(w);
    map.set(key, arr);
  }
  return [...map.entries()].sort((a, b) => a[0] - b[0]);
}

export function RhymingWords() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [perfect, setPerfect] = useState<RelatedWord[] | null>(null);
  const [near, setNear] = useState<RelatedWord[] | null>(null);
  const [term, setTerm] = useState("");

  const run = async () => {
    const word = query.trim().toLowerCase();
    if (!word) {
      toast.error("Enter a word to rhyme.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [p, n] = await Promise.all([fetchPerfectRhymes(word), fetchNearRhymes(word)]);
      setPerfect(p);
      setNear(n);
      setTerm(word);
    } catch {
      setError("Couldn't reach the rhyme service. Please check your connection and try again.");
      setPerfect(null);
      setNear(null);
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
    setPerfect(null);
    setNear(null);
    setError(null);
    setTerm("");
  };

  const hasResults = perfect !== null || near !== null;

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-lift sm:p-7">
      <div className="space-y-1.5">
        <Label htmlFor="rw-query" className="text-xs font-semibold text-muted-foreground">
          Find rhymes for
        </Label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            id="rw-query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run()}
            placeholder="e.g. love"
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
            Find rhymes
          </Button>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {hasResults && (
        <div className="mt-7 border-t border-border/60 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
              <Music className="h-5 w-5 text-honey" /> Rhymes for "{term}"
            </h2>
            <Button variant="ghost" size="sm" onClick={reset} className="rounded-full">
              <X className="mr-1.5 h-4 w-4" /> Clear
            </Button>
          </div>

          {(perfect?.length ?? 0) === 0 && (near?.length ?? 0) === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No rhymes found for that word. Check the spelling or try a more common word.
            </p>
          ) : (
            <div className="mt-6 space-y-8">
              {perfect && perfect.length > 0 && (
                <RhymeGroup title="Perfect rhymes" words={perfect} onCopy={copy} />
              )}
              {near && near.length > 0 && (
                <RhymeGroup title="Near rhymes" words={near} onCopy={copy} muted />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RhymeGroup({
  title,
  words,
  onCopy,
  muted,
}: {
  title: string;
  words: RelatedWord[];
  onCopy: (w: string) => void;
  muted?: boolean;
}) {
  const grouped = groupBySyllables(words);
  return (
    <div>
      <h3 className="flex items-center gap-2 font-display text-base font-semibold">
        <Sparkles className={`h-4 w-4 ${muted ? "text-muted-foreground" : "text-honey"}`} />
        {title}
        <span className="text-sm font-normal text-muted-foreground">({words.length})</span>
      </h3>
      <div className="mt-4 space-y-5">
        {grouped.map(([syllables, ws]) => (
          <div key={syllables}>
            {syllables > 0 && (
              <h4 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {syllables} syllable{syllables === 1 ? "" : "s"}{" "}
                <span className="ml-1 font-medium normal-case text-muted-foreground/70">
                  ({ws.length})
                </span>
              </h4>
            )}
            <div className="flex flex-wrap gap-2">
              {ws.map((r) => (
                <button
                  key={r.word}
                  onClick={() => onCopy(r.word)}
                  title="Click to copy"
                  className="group inline-flex items-center gap-2 rounded-xl border border-border/70 bg-secondary/40 px-3 py-1.5 text-sm font-medium capitalize transition-colors hover:border-honey/60 hover:bg-accent"
                >
                  {r.word}
                  <Copy className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import { Copy, Loader2, Search, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useDictionary } from "@/hooks/use-dictionary";
import { matchPattern, type WordMatch } from "@/lib/wordsearch";

function groupByLength(results: WordMatch[]) {
  const map = new Map<number, WordMatch[]>();
  for (const r of results) {
    const arr = map.get(r.length) ?? [];
    arr.push(r);
    map.set(r.length, arr);
  }
  return [...map.entries()].sort((a, b) => a[0] - b[0]);
}

export function WildcardSolver() {
  const { words, loading, error } = useDictionary();
  const [pattern, setPattern] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);

  const results = useMemo(() => {
    if (!words || submitted === null) return null;
    return matchPattern(submitted, words, 0, 800);
  }, [words, submitted]);

  const grouped = useMemo(() => (results ? groupByLength(results) : null), [results]);

  const handleSolve = () => {
    if (!pattern.trim()) {
      toast.error("Enter a wildcard pattern to search.");
      return;
    }
    setSubmitted(pattern);
  };

  const copy = (w: string) => {
    navigator.clipboard?.writeText(w);
    toast.success(`Copied "${w}"`);
  };

  const reset = () => {
    setPattern("");
    setSubmitted(null);
  };

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-lift sm:p-7">
      <div className="space-y-1.5">
        <Label htmlFor="ws-pattern" className="text-xs font-semibold text-muted-foreground">
          Wildcard pattern (? = one letter, * = any run of letters)
        </Label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            id="ws-pattern"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSolve()}
            placeholder="e.g. b*k, qu*, ?ing, c*t*n"
            autoComplete="off"
            spellCheck={false}
            className="rounded-xl font-mono tracking-wide sm:h-12 sm:text-base"
          />
          <Button
            onClick={handleSolve}
            disabled={loading}
            className="h-12 shrink-0 rounded-2xl px-8 text-base font-semibold"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Search className="mr-2 h-5 w-5" />
            )}
            Search wildcards
          </Button>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Use <code className="font-mono">?</code> for a single unknown letter and{" "}
        <code className="font-mono">*</code> for any number of letters (including none). Combine
        both with fixed letters for powerful searches.
      </p>

      {error && (
        <p className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Couldn't load the dictionary. Please refresh and try again.
        </p>
      )}

      {results && (
        <div className="mt-7 border-t border-border/60 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
              <Sparkles className="h-5 w-5 text-honey" />
              {results.length > 0
                ? `${results.length}${results.length >= 800 ? "+" : ""} match${results.length === 1 ? "" : "es"}`
                : "No matches found"}
            </h2>
            <Button variant="ghost" size="sm" onClick={reset} className="rounded-full">
              <X className="mr-1.5 h-4 w-4" /> Clear
            </Button>
          </div>

          {results.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No words match that wildcard pattern. Try widening it with an extra{" "}
              <code className="font-mono">*</code>.
            </p>
          ) : (
            <div className="mt-5 space-y-6">
              {grouped!.map(([len, ws]) => (
                <div key={len}>
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {len}-letter words{" "}
                    <span className="ml-1 font-medium normal-case text-muted-foreground/70">
                      ({ws.length})
                    </span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {ws.map((r) => (
                      <button
                        key={r.word}
                        onClick={() => copy(r.word)}
                        title={`${r.score} points — click to copy`}
                        className="group inline-flex items-center gap-2 rounded-xl border border-border/70 bg-secondary/40 px-3 py-1.5 text-sm font-medium capitalize transition-colors hover:border-honey/60 hover:bg-accent"
                      >
                        {r.word}
                        <Badge
                          variant="secondary"
                          className="h-5 border border-border/50 px-1.5 text-[11px] tabular-nums"
                        >
                          {r.score}
                        </Badge>
                        <Copy className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

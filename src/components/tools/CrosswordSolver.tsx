import { useMemo, useState } from "react";
import { Copy, Loader2, Puzzle, Search, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useDictionary } from "@/hooks/use-dictionary";
import { solveCrossword, type WordMatch } from "@/lib/wordsearch";

export function CrosswordSolver() {
  const { words, loading, error } = useDictionary();
  const [pattern, setPattern] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);

  const results = useMemo<WordMatch[] | null>(() => {
    if (!words || submitted === null) return null;
    return solveCrossword(submitted, words);
  }, [words, submitted]);

  const handleSolve = () => {
    const cleaned = pattern.trim();
    if (cleaned.replace(/[^a-z?_.]/gi, "").length < 1) {
      toast.error("Enter a pattern, using ? for unknown letters.");
      return;
    }
    setSubmitted(cleaned);
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
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Puzzle className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-honey" />
          <Input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSolve()}
            placeholder="Pattern, e.g. c?t or cr?ssw?rd"
            aria-label="Crossword pattern"
            autoCapitalize="none"
            autoComplete="off"
            spellCheck={false}
            className="h-14 rounded-2xl pl-12 pr-4 text-lg font-medium tracking-[0.2em]"
          />
        </div>
        <Button
          onClick={handleSolve}
          disabled={loading}
          className="h-14 rounded-2xl px-8 text-base font-semibold"
        >
          {loading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Search className="mr-2 h-5 w-5" />
          )}
          Solve
        </Button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Enter known letters and use <span className="font-semibold text-foreground">?</span>,{" "}
        <span className="font-semibold text-foreground">_</span> or{" "}
        <span className="font-semibold text-foreground">.</span> for each unknown square. The word
        length is taken from your pattern.
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
                ? `${results.length} match${results.length === 1 ? "" : "es"} found`
                : "No matches found"}
            </h2>
            <Button variant="ghost" size="sm" onClick={reset} className="rounded-full">
              <X className="mr-1.5 h-4 w-4" /> Clear
            </Button>
          </div>

          {results.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No words match that pattern. Double-check the length and known letters.
            </p>
          ) : (
            <div className="mt-5 flex flex-wrap gap-2">
              {results.map((r) => (
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
          )}
        </div>
      )}
    </div>
  );
}

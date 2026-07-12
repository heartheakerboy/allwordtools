import { useMemo, useState } from "react";
import { Copy, Lightbulb, Loader2, Search, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useDictionary } from "@/hooks/use-dictionary";
import { solveHangman, type HangmanSolution } from "@/lib/games";

export function HangmanSolver() {
  const { words, loading, error } = useDictionary();
  const [pattern, setPattern] = useState("");
  const [excluded, setExcluded] = useState("");
  const [submitted, setSubmitted] = useState<{ pattern: string; excluded: string } | null>(null);

  const solution: HangmanSolution | null = useMemo(() => {
    if (!words || !submitted) return null;
    return solveHangman(submitted.pattern, submitted.excluded, words, 400);
  }, [words, submitted]);

  const handleSolve = () => {
    const cleaned = pattern.toLowerCase().replace(/[^a-z_.?]/g, "");
    if (!cleaned) {
      toast.error("Enter the word pattern using _ for unknown letters.");
      return;
    }
    setSubmitted({ pattern, excluded });
  };

  const copyWord = (w: string) => {
    navigator.clipboard?.writeText(w);
    toast.success(`Copied "${w}"`);
  };

  const reset = () => {
    setPattern("");
    setExcluded("");
    setSubmitted(null);
  };

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-lift sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="hm-pattern" className="text-xs font-semibold text-muted-foreground">
            Known letters (use _ for blanks)
          </Label>
          <Input
            id="hm-pattern"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSolve()}
            placeholder="e.g. _pp_e"
            autoCapitalize="none"
            autoComplete="off"
            spellCheck={false}
            className="h-12 rounded-2xl text-lg font-medium tracking-[0.3em]"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hm-excluded" className="text-xs font-semibold text-muted-foreground">
            Wrong guesses (letters not in word)
          </Label>
          <Input
            id="hm-excluded"
            value={excluded}
            onChange={(e) => setExcluded(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSolve()}
            placeholder="e.g. rstn"
            autoCapitalize="none"
            autoComplete="off"
            spellCheck={false}
            className="h-12 rounded-2xl text-lg font-medium tracking-[0.3em]"
          />
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <Button
          onClick={handleSolve}
          disabled={loading}
          className="h-12 rounded-2xl px-8 text-base font-semibold"
        >
          {loading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Search className="mr-2 h-5 w-5" />
          )}
          Solve
        </Button>
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Couldn't load the dictionary. Please refresh and try again.
        </p>
      )}

      {solution && (
        <div className="mt-7 border-t border-border/60 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
              <Sparkles className="h-5 w-5 text-honey" />
              {solution.total > 0
                ? `${solution.total} possible word${solution.total === 1 ? "" : "s"}`
                : "No matches found"}
            </h2>
            <Button variant="ghost" size="sm" onClick={reset} className="rounded-full">
              <X className="mr-1.5 h-4 w-4" /> Clear
            </Button>
          </div>

          {solution.total === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No words fit that pattern. Check the length and your wrong-guess letters.
            </p>
          ) : (
            <>
              {solution.suggestions.length > 0 && (
                <div className="mt-5 rounded-2xl border border-border/70 bg-secondary/40 p-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <Lightbulb className="h-4 w-4 text-honey" /> Best letters to guess next
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {solution.suggestions.map((s) => (
                      <span
                        key={s.letter}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-border/70 bg-card px-3 py-1.5 text-sm font-semibold uppercase"
                      >
                        {s.letter}
                        <Badge
                          variant="secondary"
                          className="h-5 border border-border/50 px-1.5 text-[11px] tabular-nums"
                        >
                          {s.percent}%
                        </Badge>
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Percentages show how many possible words contain each letter.
                  </p>
                </div>
              )}

              <div className="mt-6">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Possible words{" "}
                  <span className="ml-1 font-medium normal-case text-muted-foreground/70">
                    (showing {solution.candidates.length})
                  </span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {solution.candidates.map((w) => (
                    <button
                      key={w}
                      onClick={() => copyWord(w)}
                      title="Click to copy"
                      className="group inline-flex items-center gap-2 rounded-xl border border-border/70 bg-secondary/40 px-3 py-1.5 text-sm font-medium capitalize transition-colors hover:border-honey/60 hover:bg-accent"
                    >
                      {w}
                      <Copy className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

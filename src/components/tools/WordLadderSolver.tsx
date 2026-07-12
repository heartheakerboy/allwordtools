import { useState } from "react";
import { ArrowRight, Loader2, MoveRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDictionary } from "@/hooks/use-dictionary";
import { solveWordLadder, type LadderResult } from "@/lib/word-ladder";

export function WordLadderSolver() {
  const { words, loading, error } = useDictionary();
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [result, setResult] = useState<LadderResult | null>(null);
  const [solving, setSolving] = useState(false);

  const run = () => {
    if (!words) return;
    setSolving(true);
    // Defer to next frame so the spinner can paint before the BFS runs.
    setTimeout(() => {
      const res = solveWordLadder(start, end, words);
      setResult(res);
      if (res.status === "invalid") toast.error(res.reason);
      setSolving(false);
    }, 20);
  };

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-lift sm:p-7">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <div className="space-y-1.5">
          <Label htmlFor="wl-start" className="text-xs font-semibold text-muted-foreground">
            Start word
          </Label>
          <Input
            id="wl-start"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            placeholder="e.g. cold"
            className="h-12 rounded-2xl"
          />
        </div>
        <MoveRight className="mx-auto hidden h-5 w-5 text-muted-foreground sm:mb-3.5 sm:block" />
        <div className="space-y-1.5">
          <Label htmlFor="wl-end" className="text-xs font-semibold text-muted-foreground">
            End word
          </Label>
          <Input
            id="wl-end"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run()}
            placeholder="e.g. warm"
            className="h-12 rounded-2xl"
          />
        </div>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        Find the shortest word ladder between two words of the same length, changing exactly one
        letter at each step — and every rung must be a real word.
      </p>

      <div className="mt-5">
        <Button
          onClick={run}
          disabled={loading || solving}
          className="h-12 rounded-2xl px-8 text-base font-semibold"
        >
          {loading || solving ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-5 w-5" />
          )}
          Solve ladder
        </Button>
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      {result && result.status === "found" && (
        <div className="mt-7 border-t border-border/60 pt-6">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
            <Sparkles className="h-5 w-5 text-honey" /> Solved in {result.ladder.length - 1} step
            {result.ladder.length - 1 === 1 ? "" : "s"}
          </h2>
          <ol className="mt-5 flex flex-wrap items-center gap-2">
            {result.ladder.map((word, i) => (
              <li key={`${word}-${i}`} className="flex items-center gap-2">
                <span className="rounded-xl border border-border/70 bg-secondary/40 px-4 py-2 text-sm font-semibold uppercase tracking-wide">
                  {word}
                </span>
                {i < result.ladder.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      {result && result.status === "no-path" && (
        <div className="mt-7 border-t border-border/60 pt-6">
          <p className="text-sm text-muted-foreground">
            No ladder found between these words. Try two words that are closer in spelling.
          </p>
        </div>
      )}
    </div>
  );
}

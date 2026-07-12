import { useMemo, useState } from "react";
import { Copy, Grid3x3, Loader2, Search, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useDictionary } from "@/hooks/use-dictionary";
import { solveBoggle, type BoggleResult } from "@/lib/games";

/**
 * Strands-style solver. The NYT Strands board is a 6-wide × 8-tall grid of
 * letters; answers are paths through adjacent (8-direction) letters. This
 * finds every valid dictionary word that can be traced through the grid,
 * longest first — a strong hint list for cracking the puzzle.
 */

const ROWS = 8;
const COLS = 6;

function emptyGrid(): string[] {
  return Array.from({ length: ROWS * COLS }, () => "");
}

function groupByLength(results: BoggleResult[]) {
  const map = new Map<number, string[]>();
  for (const r of results) {
    const arr = map.get(r.length) ?? [];
    arr.push(r.word);
    map.set(r.length, arr);
  }
  return [...map.entries()].sort((a, b) => b[0] - a[0]);
}

export function StrandsSolver() {
  const { words, loading, error } = useDictionary();
  const [cells, setCells] = useState<string[]>(() => emptyGrid());
  const [submitted, setSubmitted] = useState<string[][] | null>(null);

  const results = useMemo(() => {
    if (!words || !submitted) return null;
    // Strands answers are typically 4+ letters; cap to keep it readable.
    return solveBoggle(submitted, words, 4, 800);
  }, [words, submitted]);

  const grouped = useMemo(() => (results ? groupByLength(results) : null), [results]);

  const setCell = (i: number, value: string) => {
    const letter = value
      .replace(/[^a-zA-Z]/g, "")
      .slice(-1)
      .toLowerCase();
    setCells((prev) => {
      const next = [...prev];
      next[i] = letter;
      return next;
    });
  };

  const run = () => {
    if (cells.every((c) => c === "")) {
      toast.error("Fill in the grid first.");
      return;
    }
    const grid: string[][] = [];
    for (let r = 0; r < ROWS; r++) grid.push(cells.slice(r * COLS, r * COLS + COLS));
    setSubmitted(grid);
  };

  const clear = () => {
    setCells(emptyGrid());
    setSubmitted(null);
  };

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-lift sm:p-7">
      <Label className="text-xs font-semibold text-muted-foreground">
        Enter the 6 × 8 Strands board
      </Label>
      <div className="mt-3 flex justify-center">
        <div
          className="grid gap-1.5"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
        >
          {cells.map((c, i) => (
            <input
              key={i}
              value={c.toUpperCase()}
              onChange={(e) => setCell(i, e.target.value)}
              maxLength={1}
              inputMode="text"
              aria-label={`Cell ${i + 1}`}
              className="h-11 w-11 rounded-lg border border-input bg-background text-center text-lg font-semibold uppercase shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:h-12 sm:w-12"
            />
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        Type each letter of the board into the grid, then find every real word you can trace through
        touching letters — a powerful hint list for NYT Strands. Answers are 4+ letters, longest
        first.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button
          onClick={run}
          disabled={loading}
          className="h-12 rounded-2xl px-8 text-base font-semibold"
        >
          {loading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Search className="mr-2 h-5 w-5" />
          )}
          Find words
        </Button>
        <Button variant="outline" onClick={clear} className="h-12 rounded-2xl px-6">
          <X className="mr-2 h-4 w-4" /> Clear grid
        </Button>
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      {grouped && (
        <div className="mt-7 border-t border-border/60 pt-6">
          {grouped.length === 0 ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Grid3x3 className="h-4 w-4" /> No words found. Double-check the letters and try
              again.
            </p>
          ) : (
            <>
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
                <Sparkles className="h-5 w-5 text-honey" /> {results!.length} words found
              </h2>
              <div className="mt-5 space-y-6">
                {grouped.map(([len, list]) => (
                  <div key={len}>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {len} letters — {list.length}
                    </p>
                    <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
                      {list.map((word, i) => (
                        <button
                          key={`${word}-${i}`}
                          onClick={() => {
                            navigator.clipboard?.writeText(word);
                            toast.success(`Copied "${word}"`);
                          }}
                          title="Click to copy"
                          className="group inline-flex items-center justify-between gap-2 rounded-xl border border-border/70 bg-secondary/40 px-4 py-2.5 text-left text-sm font-medium transition-colors hover:border-honey/60 hover:bg-accent"
                        >
                          <span>{word}</span>
                          <Copy className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

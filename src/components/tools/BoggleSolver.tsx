import { useMemo, useState } from "react";
import { Copy, Loader2, Search, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useDictionary } from "@/hooks/use-dictionary";
import { solveBoggle, type BoggleResult } from "@/lib/games";

const SIZES = [3, 4, 5] as const;

function emptyGrid(size: number): string[] {
  return Array.from({ length: size * size }, () => "");
}

function groupByLength(results: BoggleResult[]) {
  const map = new Map<number, BoggleResult[]>();
  for (const r of results) {
    const arr = map.get(r.length) ?? [];
    arr.push(r);
    map.set(r.length, arr);
  }
  return [...map.entries()].sort((a, b) => b[0] - a[0]);
}

export function BoggleSolver() {
  const { words, loading, error } = useDictionary();
  const [size, setSize] = useState(4);
  const [cells, setCells] = useState<string[]>(() => emptyGrid(4));
  const [minLength, setMinLength] = useState(3);
  const [submitted, setSubmitted] = useState<{ grid: string[][]; minLength: number } | null>(null);

  const results = useMemo(() => {
    if (!words || !submitted) return null;
    return solveBoggle(submitted.grid, words, submitted.minLength, 600);
  }, [words, submitted]);

  const grouped = useMemo(() => (results ? groupByLength(results) : null), [results]);

  const changeSize = (n: number) => {
    setSize(n);
    setCells(emptyGrid(n));
    setSubmitted(null);
  };

  const setCell = (i: number, v: string) => {
    const value = v
      .toLowerCase()
      .replace(/[^a-z]/g, "")
      .slice(0, 2);
    setCells((prev) => prev.map((c, idx) => (idx === i ? value : c)));
  };

  const handleSolve = () => {
    if (cells.every((c) => c === "")) {
      toast.error("Fill in the board letters first.");
      return;
    }
    const grid: string[][] = [];
    for (let r = 0; r < size; r++) grid.push(cells.slice(r * size, r * size + size));
    setSubmitted({ grid, minLength });
  };

  const copyWord = (w: string) => {
    navigator.clipboard?.writeText(w);
    toast.success(`Copied "${w}"`);
  };

  const reset = () => {
    setCells(emptyGrid(size));
    setSubmitted(null);
  };

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-lift sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground">Board size</Label>
          <div className="flex gap-2">
            {SIZES.map((n) => (
              <button
                key={n}
                onClick={() => changeSize(n)}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                  size === n
                    ? "border-honey bg-honey/15 text-foreground"
                    : "border-border/70 bg-secondary/40 text-muted-foreground hover:border-honey/60"
                }`}
              >
                {n}×{n}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bg-min" className="text-xs font-semibold text-muted-foreground">
            Min word length
          </Label>
          <select
            id="bg-min"
            value={minLength}
            onChange={(e) => setMinLength(Number(e.target.value))}
            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {[3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n}+ letters
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
            width: "min(100%, 22rem)",
          }}
        >
          {cells.map((c, i) => (
            <input
              key={i}
              value={c}
              onChange={(e) => setCell(i, e.target.value)}
              maxLength={2}
              aria-label={`Board cell ${i + 1}`}
              autoCapitalize="characters"
              autoComplete="off"
              spellCheck={false}
              className="aspect-square w-full rounded-xl border border-border/70 bg-secondary/40 text-center text-xl font-bold uppercase tracking-wide text-foreground focus-visible:border-honey focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-honey"
            />
          ))}
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Tip: type <span className="font-semibold">qu</span> in a single cell for the Qu tile.
      </p>

      <div className="mt-5 flex justify-center">
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
          Solve board
        </Button>
      </div>

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
                ? `${results.length} word${results.length === 1 ? "" : "s"} found`
                : "No words found"}
            </h2>
            <Button variant="ghost" size="sm" onClick={reset} className="rounded-full">
              <X className="mr-1.5 h-4 w-4" /> Clear
            </Button>
          </div>

          {results.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No words can be traced on that board. Double-check the letters and try again.
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
                        onClick={() => copyWord(r.word)}
                        title={`${r.score} point${r.score === 1 ? "" : "s"} — click to copy`}
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

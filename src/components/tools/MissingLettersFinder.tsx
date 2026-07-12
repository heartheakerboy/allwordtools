import { useMemo, useState } from "react";
import { Copy, Loader2, Search, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useDictionary } from "@/hooks/use-dictionary";
import { solveCrossword } from "@/lib/wordsearch";

/** Normalise a raw pattern to fixed letters and `?` blanks. */
function normalise(pattern: string): string {
  return pattern
    .toLowerCase()
    .replace(/[_.\s*]/g, "?")
    .replace(/[^a-z?]/g, "");
}

export function MissingLettersFinder() {
  const { words, loading, error } = useDictionary();
  const [pattern, setPattern] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);

  const norm = submitted ? normalise(submitted) : "";

  const results = useMemo(() => {
    if (!words || submitted === null) return null;
    return solveCrossword(submitted, words, 500);
  }, [words, submitted]);

  const handleFind = () => {
    if (!pattern.trim()) {
      toast.error("Enter a word with blanks for the missing letters.");
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
        <Label htmlFor="ml-pattern" className="text-xs font-semibold text-muted-foreground">
          Word with blanks (use _ or ? for each missing letter)
        </Label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            id="ml-pattern"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFind()}
            placeholder="e.g. wo_d, _pp_e, ele_h_nt"
            autoComplete="off"
            spellCheck={false}
            className="rounded-xl font-mono tracking-widest sm:h-12 sm:text-base"
          />
          <Button
            onClick={handleFind}
            disabled={loading}
            className="h-12 shrink-0 rounded-2xl px-8 text-base font-semibold"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Search className="mr-2 h-5 w-5" />
            )}
            Fill the blanks
          </Button>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Type the letters you know and mark every gap with <code className="font-mono">_</code> or{" "}
        <code className="font-mono">?</code>. The finder shows every real word that fits, with the
        filled-in letters highlighted.
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
                ? `${results.length}${results.length >= 500 ? "+" : ""} possible word${results.length === 1 ? "" : "s"}`
                : "No words found"}
            </h2>
            <Button variant="ghost" size="sm" onClick={reset} className="rounded-full">
              <X className="mr-1.5 h-4 w-4" /> Clear
            </Button>
          </div>

          {results.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No words fill those blanks. Check the known letters and the number of gaps.
            </p>
          ) : (
            <div className="mt-5 flex flex-wrap gap-2">
              {results.map((r) => (
                <button
                  key={r.word}
                  onClick={() => copy(r.word)}
                  title={`${r.score} points — click to copy`}
                  className="group inline-flex items-center gap-1.5 rounded-xl border border-border/70 bg-secondary/40 px-3 py-1.5 text-sm font-medium transition-colors hover:border-honey/60 hover:bg-accent"
                >
                  <span className="font-mono tracking-wide">
                    {r.word.split("").map((ch, i) => {
                      const filled = norm[i] === "?";
                      return (
                        <span key={i} className={filled ? "font-bold text-honey" : "capitalize"}>
                          {ch}
                        </span>
                      );
                    })}
                  </span>
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

import { useState } from "react";
import { Copy, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateSightWords, SIGHT_LEVELS } from "@/lib/literary-content";

export function SightWordGenerator() {
  const [level, setLevel] = useState("all");
  const [count, setCount] = useState(12);
  const [results, setResults] = useState<string[] | null>(null);

  const generate = () => {
    setResults(generateSightWords(level, Math.max(1, Math.min(50, count))));
  };

  const copyAll = () => {
    if (!results?.length) return;
    navigator.clipboard?.writeText(results.join(" "));
    toast.success("All words copied");
  };

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-lift sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="sw-level" className="text-xs font-semibold text-muted-foreground">
            Grade level
          </Label>
          <select
            id="sw-level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {SIGHT_LEVELS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sw-count" className="text-xs font-semibold text-muted-foreground">
            How many words
          </Label>
          <Input
            id="sw-count"
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="rounded-xl"
          />
        </div>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        Generate high-frequency Dolch sight words by grade level — the words young readers should
        recognise instantly. Ideal for flashcards, spelling lists and reading practice.
      </p>

      <div className="mt-5">
        <Button onClick={generate} className="h-12 rounded-2xl px-8 text-base font-semibold">
          <Sparkles className="mr-2 h-5 w-5" /> Generate sight words
        </Button>
      </div>

      {results && results.length > 0 && (
        <div className="mt-7 border-t border-border/60 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
              <Sparkles className="h-5 w-5 text-honey" /> Your sight words
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyAll} className="rounded-full">
                <Copy className="mr-1.5 h-4 w-4" /> Copy all
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setResults(null)}
                className="rounded-full"
              >
                <X className="mr-1.5 h-4 w-4" /> Clear
              </Button>
            </div>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {results.map((word, i) => (
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
      )}
    </div>
  );
}

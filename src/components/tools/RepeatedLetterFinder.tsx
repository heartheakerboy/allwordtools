import { useMemo, useState } from "react";
import { Copy, Repeat2, Search, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type WordReport = {
  word: string;
  repeats: { letter: string; count: number }[];
};

function analyse(text: string) {
  const rawWords = text.toLowerCase().match(/[a-z]+/g) ?? [];
  const words = [...new Set(rawWords)];

  const perWord: WordReport[] = [];
  for (const word of words) {
    const counts: Record<string, number> = {};
    for (const ch of word) counts[ch] = (counts[ch] ?? 0) + 1;
    const repeats = Object.entries(counts)
      .filter(([, c]) => c > 1)
      .map(([letter, count]) => ({ letter, count }))
      .sort((a, b) => b.count - a.count || a.letter.localeCompare(b.letter));
    if (repeats.length) perWord.push({ word, repeats });
  }

  const overallCounts: Record<string, number> = {};
  for (const ch of text.toLowerCase()) {
    if (ch >= "a" && ch <= "z") overallCounts[ch] = (overallCounts[ch] ?? 0) + 1;
  }
  const overall = Object.entries(overallCounts)
    .filter(([, c]) => c > 1)
    .map(([letter, count]) => ({ letter, count }))
    .sort((a, b) => b.count - a.count || a.letter.localeCompare(b.letter));

  return { perWord, overall, wordCount: words.length };
}

export function RepeatedLetterFinder() {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);

  const result = useMemo(() => (submitted === null ? null : analyse(submitted)), [submitted]);

  const handleFind = () => {
    if (!text.trim()) {
      toast.error("Enter a word or some text to check for repeated letters.");
      return;
    }
    setSubmitted(text);
  };

  const reset = () => {
    setText("");
    setSubmitted(null);
  };

  const highlight = (word: string) => {
    const counts: Record<string, number> = {};
    for (const ch of word) counts[ch] = (counts[ch] ?? 0) + 1;
    return word.split("").map((ch, i) => (
      <span key={i} className={counts[ch] > 1 ? "font-bold text-honey" : ""}>
        {ch}
      </span>
    ));
  };

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-lift sm:p-7">
      <div className="space-y-1.5">
        <Label htmlFor="rl-text" className="text-xs font-semibold text-muted-foreground">
          Enter a word or phrase
        </Label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            id="rl-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFind()}
            placeholder="e.g. mississippi, bookkeeper"
            autoComplete="off"
            spellCheck={false}
            className="rounded-xl sm:h-12 sm:text-base"
          />
          <Button
            onClick={handleFind}
            className="h-12 shrink-0 rounded-2xl px-8 text-base font-semibold"
          >
            <Search className="mr-2 h-5 w-5" /> Find repeats
          </Button>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Enter a single word to see which letters repeat inside it, or a whole phrase to check every
        word at once.
      </p>

      {result && (
        <div className="mt-7 border-t border-border/60 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
              <Repeat2 className="h-5 w-5 text-honey" />
              {result.perWord.length > 0
                ? `${result.perWord.length} word${result.perWord.length === 1 ? "" : "s"} with repeated letters`
                : "No repeated letters found"}
            </h2>
            <Button variant="ghost" size="sm" onClick={reset} className="rounded-full">
              <X className="mr-1.5 h-4 w-4" /> Clear
            </Button>
          </div>

          {result.perWord.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Every letter in that text appears only once. Try a word like "balloon" or "success".
            </p>
          ) : (
            <div className="mt-5 space-y-4">
              {result.perWord.map((w) => (
                <div
                  key={w.word}
                  className="rounded-2xl border border-border/70 bg-secondary/40 p-4"
                >
                  <p className="font-mono text-lg tracking-wide capitalize">{highlight(w.word)}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {w.repeats.map((r) => (
                      <Badge
                        key={r.letter}
                        variant="secondary"
                        className="border border-border/50 px-2.5 py-1 text-sm capitalize"
                      >
                        <span className="font-bold text-honey uppercase">{r.letter}</span>
                        <span className="ml-1.5 text-muted-foreground">×{r.count}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {result.overall.length > 0 && result.wordCount > 1 && (
            <div className="mt-6 border-t border-border/60 pt-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Across the whole text
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard?.writeText(
                      result.overall.map((r) => `${r.letter.toUpperCase()} ×${r.count}`).join(", "),
                    );
                    toast.success("Repeated letters copied");
                  }}
                  className="rounded-full"
                >
                  <Copy className="mr-1.5 h-4 w-4" /> Copy
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.overall.map((r) => (
                  <Badge
                    key={r.letter}
                    variant="secondary"
                    className="border border-border/50 px-2.5 py-1 text-sm"
                  >
                    <span className="font-bold text-honey uppercase">{r.letter}</span>
                    <span className="ml-1.5 text-muted-foreground">×{r.count}</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

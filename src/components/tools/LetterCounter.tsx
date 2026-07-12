import { useMemo, useState } from "react";
import { Copy, Type, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Stats = {
  characters: number;
  charactersNoSpaces: number;
  letters: number;
  words: number;
  sentences: number;
  paragraphs: number;
  spaces: number;
  lines: number;
};

function analyse(text: string): { stats: Stats; frequency: [string, number][] } {
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const letters = (text.match(/[a-zA-Z]/g) ?? []).length;
  const spaces = (text.match(/ /g) ?? []).length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const sentences = (text.match(/[.!?]+(\s|$)/g) ?? []).length;
  const paragraphs = text.trim()
    ? text
        .trim()
        .split(/\n{2,}/)
        .filter(Boolean).length
    : 0;
  const lines = text ? text.split(/\n/).length : 0;

  const counts: Record<string, number> = {};
  for (const ch of text.toLowerCase()) {
    if (ch >= "a" && ch <= "z") counts[ch] = (counts[ch] ?? 0) + 1;
  }
  const frequency = Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  return {
    stats: { characters, charactersNoSpaces, letters, words, sentences, paragraphs, spaces, lines },
    frequency,
  };
}

const STAT_LABELS: { key: keyof Stats; label: string }[] = [
  { key: "characters", label: "Characters" },
  { key: "charactersNoSpaces", label: "No spaces" },
  { key: "letters", label: "Letters" },
  { key: "words", label: "Words" },
  { key: "sentences", label: "Sentences" },
  { key: "paragraphs", label: "Paragraphs" },
  { key: "spaces", label: "Spaces" },
  { key: "lines", label: "Lines" },
];

export function LetterCounter() {
  const [text, setText] = useState("");
  const { stats, frequency } = useMemo(() => analyse(text), [text]);
  const maxFreq = frequency.length ? frequency[0][1] : 0;

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-lift sm:p-7">
      <div className="space-y-1.5">
        <Label htmlFor="lc-text" className="text-xs font-semibold text-muted-foreground">
          Paste or type your text
        </Label>
        <Textarea
          id="lc-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste text here to count letters, words, characters and more…"
          className="min-h-40 rounded-xl text-base"
          spellCheck={false}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Button
          variant="outline"
          size="sm"
          disabled={!text}
          onClick={() => {
            navigator.clipboard?.writeText(text);
            toast.success("Text copied");
          }}
          className="rounded-full"
        >
          <Copy className="mr-1.5 h-4 w-4" /> Copy text
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={!text}
          onClick={() => setText("")}
          className="rounded-full"
        >
          <X className="mr-1.5 h-4 w-4" /> Clear
        </Button>
      </div>

      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STAT_LABELS.map(({ key, label }) => (
          <div
            key={key}
            className="rounded-2xl border border-border/70 bg-secondary/40 p-4 text-center"
          >
            <p className="font-display text-2xl font-semibold tabular-nums text-foreground">
              {stats[key].toLocaleString()}
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
          </div>
        ))}
      </div>

      {frequency.length > 0 && (
        <div className="mt-7 border-t border-border/60 pt-6">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
            <Type className="h-5 w-5 text-honey" /> Letter frequency
          </h2>
          <div className="mt-4 space-y-2">
            {frequency.map(([letter, count]) => (
              <div key={letter} className="flex items-center gap-3">
                <span className="w-5 text-sm font-semibold uppercase tabular-nums text-foreground">
                  {letter}
                </span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full gradient-honey"
                    style={{ width: `${maxFreq ? (count / maxFreq) * 100 : 0}%` }}
                  />
                </div>
                <span className="w-10 text-right text-sm tabular-nums text-muted-foreground">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

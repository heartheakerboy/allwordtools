import { useMemo, useState } from "react";
import { Copy, Hash, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { analyseSyllables } from "@/lib/syllables";

export function SyllableCounter() {
  const [text, setText] = useState("");
  const { words, totalSyllables, totalWords } = useMemo(() => analyseSyllables(text), [text]);

  const stats = [
    { label: "Syllables", value: totalSyllables },
    { label: "Words", value: totalWords },
    {
      label: "Avg / word",
      value: totalWords ? (totalSyllables / totalWords).toFixed(2) : "0",
    },
  ];

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-lift sm:p-7">
      <div className="space-y-1.5">
        <Label htmlFor="sc-text" className="text-xs font-semibold text-muted-foreground">
          Enter a word, line or verse
        </Label>
        <Textarea
          id="sc-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text to count syllables — perfect for haiku, lyrics and poetry…"
          className="min-h-32 rounded-xl text-base"
          spellCheck={false}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Button
          variant="outline"
          size="sm"
          disabled={!text}
          onClick={() => {
            navigator.clipboard?.writeText(String(totalSyllables));
            toast.success("Syllable count copied");
          }}
          className="rounded-full"
        >
          <Copy className="mr-1.5 h-4 w-4" /> Copy count
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

      <div className="mt-7 grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border/70 bg-secondary/40 p-4 text-center"
          >
            <p className="font-display text-2xl font-semibold tabular-nums text-foreground">
              {s.value}
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {words.length > 0 && (
        <div className="mt-7 border-t border-border/60 pt-6">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
            <Hash className="h-5 w-5 text-honey" /> Per-word breakdown
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {words.map((w, i) => (
              <span
                key={`${w.word}-${i}`}
                className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-secondary/40 px-3 py-1.5 text-sm font-medium lowercase"
              >
                {w.word}
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-md gradient-honey px-1.5 text-[11px] font-bold tabular-nums text-honey-foreground">
                  {w.syllables}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

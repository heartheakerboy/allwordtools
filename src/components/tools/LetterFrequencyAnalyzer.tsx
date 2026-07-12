import { useMemo, useState } from "react";
import { BarChart3, Copy, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function analyse(text: string) {
  const counts: Record<string, number> = {};
  let total = 0;
  for (const ch of text.toLowerCase()) {
    if (ch >= "a" && ch <= "z") {
      counts[ch] = (counts[ch] ?? 0) + 1;
      total += 1;
    }
  }
  const frequency = Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  return { frequency, total, unique: frequency.length };
}

export function LetterFrequencyAnalyzer() {
  const [text, setText] = useState("");
  const { frequency, total, unique } = useMemo(() => analyse(text), [text]);
  const maxFreq = frequency.length ? frequency[0][1] : 0;

  const copyReport = () => {
    const report = frequency
      .map(([l, c]) => `${l.toUpperCase()}\t${c}\t${((c / total) * 100).toFixed(1)}%`)
      .join("\n");
    navigator.clipboard?.writeText(report);
    toast.success("Frequency report copied");
  };

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-lift sm:p-7">
      <div className="space-y-1.5">
        <Label htmlFor="lfa-text" className="text-xs font-semibold text-muted-foreground">
          Paste or type your text
        </Label>
        <Textarea
          id="lfa-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste text here to analyse how often each letter appears…"
          className="min-h-40 rounded-xl text-base"
          spellCheck={false}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Button
          variant="outline"
          size="sm"
          disabled={!total}
          onClick={copyReport}
          className="rounded-full"
        >
          <Copy className="mr-1.5 h-4 w-4" /> Copy report
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
        <div className="rounded-2xl border border-border/70 bg-secondary/40 p-4 text-center">
          <p className="font-display text-2xl font-semibold tabular-nums">
            {total.toLocaleString()}
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Letters
          </p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-secondary/40 p-4 text-center">
          <p className="font-display text-2xl font-semibold tabular-nums">{unique}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Unique
          </p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-secondary/40 p-4 text-center">
          <p className="font-display text-2xl font-semibold tabular-nums capitalize">
            {frequency.length ? frequency[0][0] : "—"}
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Most common
          </p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-secondary/40 p-4 text-center">
          <p className="font-display text-2xl font-semibold tabular-nums capitalize">
            {26 - unique > 0 ? 26 - unique : 0}
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Unused
          </p>
        </div>
      </div>

      {frequency.length > 0 && (
        <div className="mt-7 border-t border-border/60 pt-6">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
            <BarChart3 className="h-5 w-5 text-honey" /> Letter frequency
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
                <span className="w-24 text-right text-sm tabular-nums text-muted-foreground">
                  {count} · {((count / total) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { useMemo, useState } from "react";
import { Copy, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const VOWELS = ["a", "e", "i", "o", "u"] as const;
const CONSONANTS = "bcdfghjklmnpqrstvwxyz".split("");

type Mode = "vowels" | "consonants";

function analyse(text: string, mode: Mode) {
  const targetSet = new Set<string>(mode === "vowels" ? VOWELS : CONSONANTS);
  const perLetter: Record<string, number> = {};
  let target = 0;
  let letters = 0;
  let yCount = 0;
  for (const ch of text.toLowerCase()) {
    if (ch >= "a" && ch <= "z") {
      letters += 1;
      if (ch === "y") yCount += 1;
      if (targetSet.has(ch)) {
        target += 1;
        perLetter[ch] = (perLetter[ch] ?? 0) + 1;
      }
    }
  }
  const order = mode === "vowels" ? [...VOWELS] : CONSONANTS;
  const breakdown = order
    .map((l) => [l, perLetter[l] ?? 0] as [string, number])
    .filter(([, c]) => c > 0)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const other = letters - target;
  return { target, other, letters, breakdown, yCount };
}

const COPY = {
  vowels: {
    label: "vowels",
    other: "Consonants",
    placeholder: "Paste or type text to count the vowels (a, e, i, o, u)…",
    note: "Vowels counted are a, e, i, o and u. The letter y is reported separately, since it can act as either.",
  },
  consonants: {
    label: "consonants",
    other: "Vowels",
    placeholder: "Paste or type text to count the consonants…",
    note: "Consonants are every letter except a, e, i, o and u. The letter y is counted as a consonant here.",
  },
} as const;

export function VowelConsonantCounter({ mode }: { mode: Mode }) {
  const [text, setText] = useState("");
  const { target, other, letters, breakdown, yCount } = useMemo(
    () => analyse(text, mode),
    [text, mode],
  );
  const config = COPY[mode];
  const maxFreq = breakdown.length ? breakdown[0][1] : 0;

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-lift sm:p-7">
      <div className="space-y-1.5">
        <Label htmlFor="vc-text" className="text-xs font-semibold text-muted-foreground">
          Paste or type your text
        </Label>
        <Textarea
          id="vc-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={config.placeholder}
          className="min-h-40 rounded-xl text-base"
          spellCheck={false}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Button
          variant="outline"
          size="sm"
          disabled={!letters}
          onClick={() => {
            navigator.clipboard?.writeText(String(target));
            toast.success(`Copied ${config.label} count`);
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

      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-honey/40 bg-honey/10 p-4 text-center">
          <p className="font-display text-2xl font-semibold tabular-nums text-foreground">
            {target.toLocaleString()}
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground capitalize">
            {config.label}
          </p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-secondary/40 p-4 text-center">
          <p className="font-display text-2xl font-semibold tabular-nums">
            {other.toLocaleString()}
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {config.other}
          </p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-secondary/40 p-4 text-center">
          <p className="font-display text-2xl font-semibold tabular-nums">
            {letters.toLocaleString()}
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Letters
          </p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-secondary/40 p-4 text-center">
          <p className="font-display text-2xl font-semibold tabular-nums">
            {letters ? `${((target / letters) * 100).toFixed(0)}%` : "0%"}
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground capitalize">
            {config.label} share
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        {config.note}
        {yCount > 0 && mode === "vowels"
          ? ` This text contains the letter y ${yCount} time${yCount === 1 ? "" : "s"}.`
          : ""}
      </p>

      {breakdown.length > 0 && (
        <div className="mt-6 border-t border-border/60 pt-6">
          <h2 className="font-display text-xl font-semibold capitalize">
            {config.label} breakdown
          </h2>
          <div className="mt-4 space-y-2">
            {breakdown.map(([letter, count]) => (
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
                  {count} · {target ? ((count / target) * 100).toFixed(1) : 0}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

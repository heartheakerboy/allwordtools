import { useState } from "react";
import { Copy, Dices, X, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AiGenerateButton } from "@/components/tools/ai/AiGenerateButton";
import { conjugate, pickMany, VERBS, type VerbForm } from "@/lib/random-content";

export function RandomVerbGenerator() {
  const [count, setCount] = useState(5);
  const [form, setForm] = useState<VerbForm>("base");
  const [results, setResults] = useState<string[] | null>(null);

  const generate = () => {
    const picks = pickMany(VERBS, Math.max(1, Math.min(50, count)));
    setResults(picks.map((v) => conjugate(v, form === "present" ? "base" : form)));
  };

  const copyOne = (v: string) => {
    navigator.clipboard?.writeText(v);
    toast.success(`Copied "${v}"`);
  };

  const copyAll = () => {
    if (!results?.length) return;
    navigator.clipboard?.writeText(results.join(", "));
    toast.success("All verbs copied");
  };

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-lift sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="rvg-count" className="text-xs font-semibold text-muted-foreground">
            How many verbs
          </Label>
          <Input
            id="rvg-count"
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rvg-form" className="text-xs font-semibold text-muted-foreground">
            Verb form
          </Label>
          <select
            id="rvg-form"
            value={form}
            onChange={(e) => setForm(e.target.value as VerbForm)}
            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="base">Base form (walk)</option>
            <option value="third">Third person (walks)</option>
            <option value="past">Past tense (walked)</option>
            <option value="gerund">-ing form (walking)</option>
          </select>
        </div>
      </div>

      <div className="mt-5">
        <Button onClick={generate} className="h-12 rounded-2xl px-8 text-base font-semibold">
          <Dices className="mr-2 h-5 w-5" /> Generate verbs
        </Button>
      </div>

      <AiGenerateButton
        instruction="Generate common English verbs. Return single verbs only, no definitions."
        count={count}
        onResults={setResults}
        themePlaceholder="Optional theme (e.g. action, cooking, movement)…"
      />

      {results && results.length > 0 && (
        <div className="mt-7 border-t border-border/60 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
              <Zap className="h-5 w-5 text-honey" /> Your random verbs
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
          <div className="mt-5 flex flex-wrap gap-2">
            {results.map((v, i) => (
              <button
                key={`${v}-${i}`}
                onClick={() => copyOne(v)}
                title="Click to copy"
                className="group inline-flex items-center gap-2 rounded-xl border border-border/70 bg-secondary/40 px-3 py-1.5 text-sm font-medium capitalize transition-colors hover:border-honey/60 hover:bg-accent"
              >
                {v}
                <Copy className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

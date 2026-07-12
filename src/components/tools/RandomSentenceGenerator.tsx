import { useState } from "react";
import { Copy, Dices, MessageSquareText, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AiGenerateButton } from "@/components/tools/ai/AiGenerateButton";
import { generateSentences } from "@/lib/random-content";

export function RandomSentenceGenerator() {
  const [count, setCount] = useState(3);
  const [results, setResults] = useState<string[] | null>(null);

  const generate = () => setResults(generateSentences(count));

  const copyOne = (s: string) => {
    navigator.clipboard?.writeText(s);
    toast.success("Sentence copied");
  };

  const copyAll = () => {
    if (!results?.length) return;
    navigator.clipboard?.writeText(results.join("\n"));
    toast.success("All sentences copied");
  };

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-lift sm:p-7">
      <div className="flex flex-wrap items-end gap-4">
        <div className="w-40 space-y-1.5">
          <Label htmlFor="rsg-count" className="text-xs font-semibold text-muted-foreground">
            How many sentences
          </Label>
          <Input
            id="rsg-count"
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="rounded-xl"
          />
        </div>
        <Button onClick={generate} className="h-12 rounded-2xl px-8 text-base font-semibold">
          <Dices className="mr-2 h-5 w-5" /> Generate sentences
        </Button>
      </div>

      <AiGenerateButton
        instruction="Generate original, grammatically correct example sentences."
        count={count}
        onResults={setResults}
        themePlaceholder="Optional topic (e.g. travel, science, past tense)…"
      />

      {results && results.length > 0 && (
        <div className="mt-7 border-t border-border/60 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
              <MessageSquareText className="h-5 w-5 text-honey" /> Your random sentences
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
          <ul className="mt-5 space-y-3">
            {results.map((s, i) => (
              <li
                key={`${i}-${s.slice(0, 8)}`}
                className="group flex items-start justify-between gap-3 rounded-xl border border-border/70 bg-secondary/40 px-4 py-3"
              >
                <span className="text-base leading-relaxed">{s}</span>
                <button
                  onClick={() => copyOne(s)}
                  title="Copy sentence"
                  className="mt-0.5 shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

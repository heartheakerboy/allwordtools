import { useState } from "react";
import { Copy, Dices, Lightbulb, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AiGenerateButton } from "@/components/tools/ai/AiGenerateButton";
import { pickMany, TOPIC_CATEGORIES, type TopicCategory } from "@/lib/random-content";

const CATEGORY_LABELS: Record<TopicCategory, string> = {
  general: "General discussion",
  persuasive: "Persuasive / debate",
  creative: "Creative writing prompts",
  business: "Business & marketing",
  science: "Science & technology",
};

export function RandomTopicGenerator() {
  const [category, setCategory] = useState<TopicCategory>("general");
  const [count, setCount] = useState(3);
  const [results, setResults] = useState<string[] | null>(null);

  const generate = () => {
    setResults(pickMany(TOPIC_CATEGORIES[category], count));
  };

  const copyOne = (t: string) => {
    navigator.clipboard?.writeText(t);
    toast.success("Topic copied");
  };

  const copyAll = () => {
    if (!results?.length) return;
    navigator.clipboard?.writeText(results.join("\n"));
    toast.success("All topics copied");
  };

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-lift sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="rtg-cat" className="text-xs font-semibold text-muted-foreground">
            Topic type
          </Label>
          <select
            id="rtg-cat"
            value={category}
            onChange={(e) => setCategory(e.target.value as TopicCategory)}
            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {(Object.keys(CATEGORY_LABELS) as TopicCategory[]).map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rtg-count" className="text-xs font-semibold text-muted-foreground">
            How many topics
          </Label>
          <Input
            id="rtg-count"
            type="number"
            min={1}
            max={12}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="rounded-xl"
          />
        </div>
      </div>

      <div className="mt-5">
        <Button onClick={generate} className="h-12 rounded-2xl px-8 text-base font-semibold">
          <Dices className="mr-2 h-5 w-5" /> Generate topics
        </Button>
      </div>

      <AiGenerateButton
        instruction={`Generate engaging ${CATEGORY_LABELS[category].toLowerCase()} topics or writing prompts.`}
        count={count}
        onResults={setResults}
        themePlaceholder="Optional focus (e.g. climate, history, sports)…"
      />

      {results && results.length > 0 && (
        <div className="mt-7 border-t border-border/60 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
              <Lightbulb className="h-5 w-5 text-honey" /> Your random topics
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
            {results.map((t, i) => (
              <li
                key={`${i}-${t.slice(0, 8)}`}
                className="group flex items-start justify-between gap-3 rounded-xl border border-border/70 bg-secondary/40 px-4 py-3"
              >
                <span className="text-base leading-relaxed">{t}</span>
                <button
                  onClick={() => copyOne(t)}
                  title="Copy topic"
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

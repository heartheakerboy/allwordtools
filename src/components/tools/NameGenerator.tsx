import { useState } from "react";
import { Copy, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AiGenerateButton } from "@/components/tools/ai/AiGenerateButton";
import { generateNames, type NameType } from "@/lib/name-content";

const AI_INSTRUCTIONS: Record<NameType, string> = {
  dog: "Generate memorable, appealing dog names.",
  cat: "Generate charming, characterful cat names.",
  team: "Generate catchy sports/esports team names.",
  guild: "Generate epic fantasy guild names for games.",
  clan: "Generate strong, cool clan names for games.",
  character: "Generate immersive character names (first and last) for stories and games.",
  demon: "Generate dark, menacing demon names for fantasy stories and games.",
  alien: "Generate exotic, otherworldly alien names for sci-fi stories and games.",
  witch:
    "Generate mystical witch names (first name plus surname or epithet) for stories and games.",
  knight: "Generate noble medieval knight names with titles for fantasy stories and games.",
  vampire: "Generate elegant, gothic vampire names for stories and games.",
  robot:
    "Generate cool robot and android names with model designations for sci-fi stories and games.",
};

type Props = {
  type: NameType;
  buttonLabel: string;
  resultsTitle: string;
  helpText: string;
  defaultCount?: number;
};

export function NameGenerator({
  type,
  buttonLabel,
  resultsTitle,
  helpText,
  defaultCount = 8,
}: Props) {
  const [count, setCount] = useState(defaultCount);
  const [results, setResults] = useState<string[] | null>(null);

  const generate = () => {
    const names = generateNames(type, count);
    if (names.length === 0) {
      toast.error("Couldn't generate names. Try again.");
      return;
    }
    setResults(names);
  };

  const copyOne = (name: string) => {
    navigator.clipboard?.writeText(name);
    toast.success(`Copied "${name}"`);
  };

  const copyAll = () => {
    if (!results?.length) return;
    navigator.clipboard?.writeText(results.join("\n"));
    toast.success("All names copied");
  };

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-lift sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="ng-count" className="text-xs font-semibold text-muted-foreground">
            How many names
          </Label>
          <Input
            id="ng-count"
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="rounded-xl"
          />
        </div>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">{helpText}</p>

      <div className="mt-5">
        <Button onClick={generate} className="h-12 rounded-2xl px-8 text-base font-semibold">
          <Sparkles className="mr-2 h-5 w-5" /> {buttonLabel}
        </Button>
      </div>

      <AiGenerateButton
        instruction={AI_INSTRUCTIONS[type]}
        count={count}
        onResults={setResults}
        themePlaceholder="Optional theme (e.g. cute, fierce, mythology)…"
      />

      {results && results.length > 0 && (
        <div className="mt-7 border-t border-border/60 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
              <Sparkles className="h-5 w-5 text-honey" /> {resultsTitle}
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
          <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((name, i) => (
              <button
                key={`${name}-${i}`}
                onClick={() => copyOne(name)}
                title="Click to copy"
                className="group inline-flex items-center justify-between gap-2 rounded-xl border border-border/70 bg-secondary/40 px-4 py-2.5 text-left text-sm font-medium transition-colors hover:border-honey/60 hover:bg-accent"
              >
                <span>{name}</span>
                <Copy className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

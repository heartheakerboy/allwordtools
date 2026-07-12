import { useState } from "react";
import { CaseUpper, Copy, Dices, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateLetters, type LetterOptions } from "@/lib/random-content";

export function RandomLetterGenerator() {
  const [count, setCount] = useState(1);
  const [set, setSet] = useState<LetterOptions["set"]>("all");
  const [lowercase, setLowercase] = useState(false);
  const [unique, setUnique] = useState(false);
  const [results, setResults] = useState<string[] | null>(null);

  const generate = () => {
    setResults(generateLetters({ count, set, lowercase, unique }));
  };

  const copyAll = () => {
    if (!results?.length) return;
    navigator.clipboard?.writeText(results.join(" "));
    toast.success("Letters copied");
  };

  const reset = () => {
    setCount(1);
    setSet("all");
    setLowercase(false);
    setUnique(false);
    setResults(null);
  };

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-lift sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="rlg-count" className="text-xs font-semibold text-muted-foreground">
            How many letters
          </Label>
          <Input
            id="rlg-count"
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rlg-set" className="text-xs font-semibold text-muted-foreground">
            Letter set
          </Label>
          <select
            id="rlg-set"
            value={set}
            onChange={(e) => setSet(e.target.value as LetterOptions["set"])}
            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="all">All letters (A–Z)</option>
            <option value="vowels">Vowels only</option>
            <option value="consonants">Consonants only</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-5">
        <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-muted-foreground">
          <input
            type="checkbox"
            checked={lowercase}
            onChange={(e) => setLowercase(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-honey"
          />
          Lowercase
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-muted-foreground">
          <input
            type="checkbox"
            checked={unique}
            onChange={(e) => setUnique(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-honey"
          />
          No repeats
        </label>
      </div>

      <div className="mt-5">
        <Button onClick={generate} className="h-12 rounded-2xl px-8 text-base font-semibold">
          <Dices className="mr-2 h-5 w-5" /> Generate letters
        </Button>
      </div>

      {results && results.length > 0 && (
        <div className="mt-7 border-t border-border/60 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
              <CaseUpper className="h-5 w-5 text-honey" /> Your random letters
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyAll} className="rounded-full">
                <Copy className="mr-1.5 h-4 w-4" /> Copy all
              </Button>
              <Button variant="ghost" size="sm" onClick={reset} className="rounded-full">
                <X className="mr-1.5 h-4 w-4" /> Clear
              </Button>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {results.map((l, i) => (
              <span
                key={`${l}-${i}`}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/70 bg-secondary/40 font-display text-xl font-bold"
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

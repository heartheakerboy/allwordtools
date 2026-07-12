import { useState } from "react";
import { Copy, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateTongueTwisters, tongueTwisterLetters } from "@/lib/literary-content";

export function TongueTwisterGenerator() {
  const [letter, setLetter] = useState("");
  const [count, setCount] = useState(6);
  const [results, setResults] = useState<string[] | null>(null);

  const generate = () => {
    const twisters = generateTongueTwisters(letter, Math.max(1, Math.min(30, count)));
    if (twisters.length === 0) {
      toast.error("Couldn't generate tongue twisters. Try again.");
      return;
    }
    setResults(twisters);
  };

  const copyAll = () => {
    if (!results?.length) return;
    navigator.clipboard?.writeText(results.join("\n"));
    toast.success("All tongue twisters copied");
  };

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-lift sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="tt-letter" className="text-xs font-semibold text-muted-foreground">
            Starting sound
          </Label>
          <select
            id="tt-letter"
            value={letter}
            onChange={(e) => setLetter(e.target.value)}
            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Random sound</option>
            {tongueTwisterLetters().map((l) => (
              <option key={l} value={l}>
                {l.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tt-count" className="text-xs font-semibold text-muted-foreground">
            How many
          </Label>
          <Input
            id="tt-count"
            type="number"
            min={1}
            max={30}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="rounded-xl"
          />
        </div>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        Generate original tongue twisters packed with repeated sounds — fun for speech practice,
        classrooms, warm-ups and games. Say them fast, three times!
      </p>

      <div className="mt-5">
        <Button onClick={generate} className="h-12 rounded-2xl px-8 text-base font-semibold">
          <Sparkles className="mr-2 h-5 w-5" /> Generate tongue twisters
        </Button>
      </div>

      {results && results.length > 0 && (
        <div className="mt-7 border-t border-border/60 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
              <Sparkles className="h-5 w-5 text-honey" /> Your tongue twisters
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
          <ul className="mt-5 grid gap-2">
            {results.map((phrase, i) => (
              <li key={`${phrase}-${i}`}>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(phrase);
                    toast.success("Copied");
                  }}
                  title="Click to copy"
                  className="group flex w-full items-center justify-between gap-2 rounded-xl border border-border/70 bg-secondary/40 px-4 py-3 text-left text-sm font-medium leading-relaxed transition-colors hover:border-honey/60 hover:bg-accent"
                >
                  <span>{phrase}</span>
                  <Copy className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

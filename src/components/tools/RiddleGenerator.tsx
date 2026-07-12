import { useState } from "react";
import { Eye, HelpCircle, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateRiddles, type Riddle } from "@/lib/literary-content";

export function RiddleGenerator() {
  const [count, setCount] = useState(5);
  const [results, setResults] = useState<Riddle[] | null>(null);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  const generate = () => {
    setResults(generateRiddles(Math.max(1, Math.min(20, count))));
    setRevealed(new Set());
  };

  const toggle = (i: number) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
      }
      return next;
    });
  };

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-lift sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="riddle-count" className="text-xs font-semibold text-muted-foreground">
            How many riddles
          </Label>
          <Input
            id="riddle-count"
            type="number"
            min={1}
            max={20}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="rounded-xl"
          />
        </div>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        Generate a fresh batch of brain-teasing riddles with hidden answers — perfect for parties,
        classrooms, quizzes and family fun. Tap a riddle to reveal its answer.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button onClick={generate} className="h-12 rounded-2xl px-8 text-base font-semibold">
          <Sparkles className="mr-2 h-5 w-5" /> Generate riddles
        </Button>
        {results && (
          <Button variant="outline" onClick={generate} className="h-12 rounded-2xl px-6">
            <RefreshCw className="mr-2 h-4 w-4" /> New batch
          </Button>
        )}
      </div>

      {results && results.length > 0 && (
        <div className="mt-7 space-y-3 border-t border-border/60 pt-6">
          {results.map((riddle, i) => (
            <div key={i} className="rounded-2xl border border-border/70 bg-secondary/40 p-4">
              <p className="flex items-start gap-2 text-sm font-medium leading-relaxed">
                <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-honey" />
                {riddle.question}
              </p>
              {revealed.has(i) ? (
                <p className="mt-3 rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-foreground">
                  {riddle.answer}
                </p>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggle(i)}
                  className="mt-2 rounded-full text-muted-foreground"
                >
                  <Eye className="mr-1.5 h-4 w-4" /> Reveal answer
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

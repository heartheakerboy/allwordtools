import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Layers3,
  Loader2,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { generateFlashcards, type AiFlashcard } from "@/lib/ai-tools.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AiFlashcards() {
  const run = useServerFn(generateFlashcards);
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(8);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<AiFlashcard[] | null>(null);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const canRun = topic.trim().length > 0 && !loading;

  async function handleRun() {
    if (!canRun) return;
    setLoading(true);
    setError(null);
    setCards(null);
    try {
      const res = await run({ data: { topic: topic.trim(), count } });
      setCards(res.cards);
      setIndex(0);
      setFlipped(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function go(dir: 1 | -1) {
    if (!cards) return;
    setFlipped(false);
    setIndex((i) => (i + dir + cards.length) % cards.length);
  }

  if (cards) {
    const card = cards[index];
    return (
      <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-lift sm:p-7">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span>
            Card {index + 1} of {cards.length}
          </span>
          <span className="capitalize">{topic.trim()}</span>
        </div>

        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          className="mt-3 flex min-h-56 w-full flex-col items-center justify-center rounded-2xl border border-border/70 bg-secondary/40 p-6 text-center transition-colors hover:border-honey/50"
        >
          <span className="mb-2 text-xs font-semibold uppercase tracking-wide text-honey">
            {flipped ? "Answer" : "Term"}
          </span>
          <span className="font-display text-xl font-semibold text-foreground sm:text-2xl">
            {flipped ? card.back : card.front}
          </span>
          <span className="mt-4 text-xs text-muted-foreground">Tap to flip</span>
        </button>

        <div className="mt-5 flex items-center justify-between gap-3">
          <Button variant="outline" onClick={() => go(-1)} className="rounded-full">
            <ChevronLeft className="mr-1 h-4 w-4" /> Prev
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setCards(null);
              setError(null);
            }}
            className="rounded-full"
          >
            <RotateCcw className="mr-1.5 h-4 w-4" /> New set
          </Button>
          <Button variant="outline" onClick={() => go(1)} className="rounded-full">
            Next <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-lift sm:p-7">
      <div className="space-y-1.5">
        <Label htmlFor="fc-topic" className="text-xs font-semibold text-muted-foreground">
          Flashcard topic
        </Label>
        <Input
          id="fc-topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. GRE vocabulary, Spanish verbs, biology terms"
          className="h-12 rounded-xl text-base"
          maxLength={200}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleRun();
          }}
        />
      </div>

      <div className="mt-4 space-y-1.5">
        <Label htmlFor="fc-count" className="text-xs font-semibold text-muted-foreground">
          Number of cards: {count}
        </Label>
        <input
          id="fc-count"
          type="range"
          min={4}
          max={16}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="w-full accent-honey"
        />
      </div>

      <Button onClick={handleRun} disabled={!canRun} className="mt-5 rounded-full">
        {loading ? (
          <>
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Building cards…
          </>
        ) : (
          <>
            <Layers3 className="mr-1.5 h-4 w-4" /> Generate flashcards
          </>
        )}
      </Button>

      {error && (
        <div className="mt-5 flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 text-honey" /> Powered by AI — flip through and study at
        your own pace.
      </p>
    </div>
  );
}

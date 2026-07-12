import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AlertCircle, FileQuestion, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { generateQuiz, type AiQuizQuestion } from "@/lib/ai-tools.functions";
import { QuizRunner } from "./quiz/QuizRunner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AiQuizGenerator() {
  const run = useServerFn(generateQuiz);
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(6);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<AiQuizQuestion[] | null>(null);

  const canRun = topic.trim().length > 0 && !loading;

  async function handleRun() {
    if (!canRun) return;
    setLoading(true);
    setError(null);
    setQuestions(null);
    try {
      const res = await run({ data: { topic: topic.trim(), count } });
      setQuestions(res.questions);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (questions) {
    return (
      <div className="space-y-4">
        <QuizRunner build={() => questions} icon={FileQuestion} subject={topic.trim()} />
        <Button
          variant="ghost"
          onClick={() => {
            setQuestions(null);
            setError(null);
          }}
          className="rounded-full"
        >
          <RotateCcw className="mr-1.5 h-4 w-4" /> New topic
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-lift sm:p-7">
      <div className="space-y-1.5">
        <Label htmlFor="quiz-topic" className="text-xs font-semibold text-muted-foreground">
          Quiz topic
        </Label>
        <Input
          id="quiz-topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. English idioms, world capitals, Greek mythology"
          className="h-12 rounded-xl text-base"
          maxLength={200}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleRun();
          }}
        />
      </div>

      <div className="mt-4 space-y-1.5">
        <Label htmlFor="quiz-count" className="text-xs font-semibold text-muted-foreground">
          Number of questions: {count}
        </Label>
        <input
          id="quiz-count"
          type="range"
          min={3}
          max={10}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="w-full accent-honey"
        />
      </div>

      <Button onClick={handleRun} disabled={!canRun} className="mt-5 rounded-full">
        {loading ? (
          <>
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Building quiz…
          </>
        ) : (
          <>
            <Sparkles className="mr-1.5 h-4 w-4" /> Generate quiz
          </>
        )}
      </Button>

      {error && (
        <div className="mt-5 flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

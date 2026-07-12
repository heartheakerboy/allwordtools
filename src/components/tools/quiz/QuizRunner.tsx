import { useMemo, useState } from "react";
import { Check, RotateCcw, X, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { QuizQuestion } from "@/lib/quiz-content";

type QuizRunnerProps = {
  /** Builds a fresh set of questions each time a quiz starts. */
  build: () => QuizQuestion[];
  icon: LucideIcon;
  /** Short label for the results screen, e.g. "vocabulary". */
  subject: string;
};

export function QuizRunner({ build, icon: Icon, subject }: QuizRunnerProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => build());
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = questions[index];
  const isLast = index === questions.length - 1;
  const progress = useMemo(
    () => Math.round((index / questions.length) * 100),
    [index, questions.length],
  );

  const restart = () => {
    setQuestions(build());
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  const choose = (option: string) => {
    if (selected) return;
    setSelected(option);
    if (option === current.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (isLast) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const message =
      pct === 100
        ? "Perfect score! 🏆"
        : pct >= 70
          ? "Great work! 🎉"
          : pct >= 40
            ? "Nice effort — keep practising."
            : "Keep going, you'll get there!";
    return (
      <div className="rounded-3xl border border-border/70 bg-card p-6 text-center shadow-lift sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-honey/15 text-honey">
          <Icon className="h-8 w-8" />
        </div>
        <h2 className="mt-5 font-display text-2xl font-semibold">Quiz complete</h2>
        <p className="mt-2 text-muted-foreground">{message}</p>
        <p className="mt-6 font-display text-5xl font-bold text-honey">
          {score}
          <span className="text-2xl text-muted-foreground">/{questions.length}</span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{pct}% correct</p>
        <Button onClick={restart} className="mt-7 h-12 rounded-2xl px-8 text-base font-semibold">
          <RotateCcw className="mr-2 h-5 w-5" /> Try another {subject} quiz
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-lift sm:p-7">
      <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
        <span>
          Question {index + 1} of {questions.length}
        </span>
        <span>Score {score}</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-honey transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <h2 className="mt-6 font-display text-xl font-semibold sm:text-2xl">{current.prompt}</h2>
      {current.hint && <p className="mt-1.5 text-sm text-muted-foreground">{current.hint}</p>}

      <div className="mt-5 grid gap-3">
        {current.options.map((option) => {
          const isAnswer = option === current.answer;
          const isPicked = option === selected;
          const state = !selected ? "idle" : isAnswer ? "correct" : isPicked ? "wrong" : "muted";
          return (
            <button
              key={option}
              onClick={() => choose(option)}
              disabled={!!selected}
              className={cn(
                "flex items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm font-medium transition-colors",
                state === "idle" &&
                  "border-border/70 bg-secondary/40 hover:border-honey/60 hover:bg-accent",
                state === "correct" &&
                  "border-emerald-500/60 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                state === "wrong" && "border-destructive/60 bg-destructive/10 text-destructive",
                state === "muted" && "border-border/50 bg-secondary/20 text-muted-foreground",
              )}
            >
              <span>{option}</span>
              {state === "correct" && <Check className="h-5 w-5 shrink-0" />}
              {state === "wrong" && <X className="h-5 w-5 shrink-0" />}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="mt-5 border-t border-border/60 pt-5">
          {current.explanation && (
            <p className="text-sm text-muted-foreground">{current.explanation}</p>
          )}
          <Button onClick={next} className="mt-4 h-11 rounded-2xl px-7 font-semibold">
            {isLast ? "See results" : "Next question"}
          </Button>
        </div>
      )}
    </div>
  );
}

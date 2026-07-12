import { SpellCheck2 } from "lucide-react";
import { QuizRunner } from "@/components/tools/quiz/QuizRunner";
import { buildSpellingQuestions } from "@/lib/quiz-content";

export function SpellingQuiz() {
  return (
    <QuizRunner build={() => buildSpellingQuestions(8)} icon={SpellCheck2} subject="spelling" />
  );
}

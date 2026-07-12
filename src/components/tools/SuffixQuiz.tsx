import { ListChecks } from "lucide-react";
import { QuizRunner } from "@/components/tools/quiz/QuizRunner";
import { buildSuffixQuestions } from "@/lib/quiz-content";

export function SuffixQuiz() {
  return <QuizRunner build={() => buildSuffixQuestions(8)} icon={ListChecks} subject="suffix" />;
}

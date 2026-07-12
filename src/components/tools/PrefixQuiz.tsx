import { NotebookPen } from "lucide-react";
import { QuizRunner } from "@/components/tools/quiz/QuizRunner";
import { buildPrefixQuestions } from "@/lib/quiz-content";

export function PrefixQuiz() {
  return <QuizRunner build={() => buildPrefixQuestions(8)} icon={NotebookPen} subject="prefix" />;
}

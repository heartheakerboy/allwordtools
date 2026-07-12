import { Equal } from "lucide-react";
import { QuizRunner } from "@/components/tools/quiz/QuizRunner";
import { buildSynonymQuestions } from "@/lib/quiz-content";

export function SynonymQuiz() {
  return <QuizRunner build={() => buildSynonymQuestions(8)} icon={Equal} subject="synonym" />;
}

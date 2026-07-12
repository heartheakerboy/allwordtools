import { Contrast } from "lucide-react";
import { QuizRunner } from "@/components/tools/quiz/QuizRunner";
import { buildAntonymQuestions } from "@/lib/quiz-content";

export function AntonymQuiz() {
  return <QuizRunner build={() => buildAntonymQuestions(8)} icon={Contrast} subject="antonym" />;
}

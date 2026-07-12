import { GraduationCap } from "lucide-react";
import { QuizRunner } from "@/components/tools/quiz/QuizRunner";
import { buildVocabQuestions } from "@/lib/quiz-content";

export function VocabularyQuiz() {
  return (
    <QuizRunner build={() => buildVocabQuestions(8)} icon={GraduationCap} subject="vocabulary" />
  );
}

import { NameGenerator } from "@/components/tools/NameGenerator";

export function VampireNameGenerator() {
  return (
    <NameGenerator
      type="vampire"
      buttonLabel="Generate vampire names"
      resultsTitle="Your vampire names"
      helpText="Generate elegant, gothic vampire names for stories, characters and games."
    />
  );
}

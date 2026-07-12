import { NameGenerator } from "@/components/tools/NameGenerator";

export function AlienNameGenerator() {
  return (
    <NameGenerator
      type="alien"
      buttonLabel="Generate alien names"
      resultsTitle="Your alien names"
      helpText="Generate exotic, otherworldly alien names for sci-fi stories, characters and games."
    />
  );
}

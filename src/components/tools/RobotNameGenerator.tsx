import { NameGenerator } from "@/components/tools/NameGenerator";

export function RobotNameGenerator() {
  return (
    <NameGenerator
      type="robot"
      buttonLabel="Generate robot names"
      resultsTitle="Your robot names"
      helpText="Generate cool robot and android names with model designations for sci-fi stories and games."
    />
  );
}

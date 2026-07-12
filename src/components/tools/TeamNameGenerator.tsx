import { NameGenerator } from "@/components/tools/NameGenerator";

export function TeamNameGenerator() {
  return (
    <NameGenerator
      type="team"
      buttonLabel="Generate team names"
      resultsTitle="Your team names"
      helpText="Bold, catchy team names for sports squads, quiz nights, esports and group projects."
    />
  );
}

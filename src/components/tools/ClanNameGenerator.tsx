import { NameGenerator } from "@/components/tools/NameGenerator";

export function ClanNameGenerator() {
  return (
    <NameGenerator
      type="clan"
      buttonLabel="Generate clan names"
      resultsTitle="Your clan names"
      helpText="Fierce clan names for shooters, strategy games and fantasy worlds — strong and memorable."
    />
  );
}

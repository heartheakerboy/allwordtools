import { NameGenerator } from "@/components/tools/NameGenerator";

export function GuildNameGenerator() {
  return (
    <NameGenerator
      type="guild"
      buttonLabel="Generate guild names"
      resultsTitle="Your guild names"
      helpText="Epic guild names for MMOs, RPGs and gaming communities — orders, legions and more."
    />
  );
}

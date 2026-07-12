import { NameGenerator } from "@/components/tools/NameGenerator";

export function CharacterNameGenerator() {
  return (
    <NameGenerator
      type="character"
      buttonLabel="Generate character names"
      resultsTitle="Your character names"
      helpText="Fantasy character names for novels, D&D campaigns, games and creative writing."
    />
  );
}

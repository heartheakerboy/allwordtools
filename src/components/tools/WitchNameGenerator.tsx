import { NameGenerator } from "@/components/tools/NameGenerator";

export function WitchNameGenerator() {
  return (
    <NameGenerator
      type="witch"
      buttonLabel="Generate witch names"
      resultsTitle="Your witch names"
      helpText="Summon mystical witch names with surnames and epithets — great for stories, games and Halloween."
    />
  );
}

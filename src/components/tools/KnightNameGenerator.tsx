import { NameGenerator } from "@/components/tools/NameGenerator";

export function KnightNameGenerator() {
  return (
    <NameGenerator
      type="knight"
      buttonLabel="Generate knight names"
      resultsTitle="Your knight names"
      helpText="Forge noble medieval knight names with heroic titles for fantasy stories, D&D and games."
    />
  );
}

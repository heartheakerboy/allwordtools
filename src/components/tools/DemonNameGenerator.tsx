import { NameGenerator } from "@/components/tools/NameGenerator";

export function DemonNameGenerator() {
  return (
    <NameGenerator
      type="demon"
      buttonLabel="Generate demon names"
      resultsTitle="Your demon names"
      helpText="Conjure dark, menacing demon names — perfect for fantasy stories, tabletop campaigns and games."
    />
  );
}

import { NameGenerator } from "@/components/tools/NameGenerator";

export function CatNameGenerator() {
  return (
    <NameGenerator
      type="cat"
      buttonLabel="Generate cat names"
      resultsTitle="Your cat names"
      helpText="Discover cat names for every personality — elegant, playful, foodie and mysterious."
    />
  );
}

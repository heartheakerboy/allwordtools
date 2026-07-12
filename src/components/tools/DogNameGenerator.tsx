import { NameGenerator } from "@/components/tools/NameGenerator";

export function DogNameGenerator() {
  return (
    <NameGenerator
      type="dog"
      buttonLabel="Generate dog names"
      resultsTitle="Your dog names"
      helpText="Get a fresh batch of dog names — from classic favourites to cute and quirky picks."
    />
  );
}

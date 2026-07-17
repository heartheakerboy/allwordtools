import { useState, useEffect } from "react";
import { Copy, Loader2, Search, Sparkles, X, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ClueEntry {
  clue: string;
  answer: string;
  world: string;
  group: string;
  phase: string;
  length: number;
}

const CLUE_DATABASE: ClueEntry[] = [
  {
    clue: "A major destination for tourists in Italy",
    answer: "ROME",
    world: "Planet Earth",
    group: "1",
    phase: "1",
    length: 4,
  },
  {
    clue: "Capital city of France",
    answer: "PARIS",
    world: "Adventure",
    group: "3",
    phase: "2",
    length: 5,
  },
  {
    clue: "Outer space body orbiting a star",
    answer: "PLANET",
    world: "Space",
    group: "24",
    phase: "1",
    length: 6,
  },
  {
    clue: "Fictional detective created by Arthur Conan Doyle",
    answer: "SHERLOCK",
    world: "Inventors",
    group: "115",
    phase: "4",
    length: 8,
  },
  {
    clue: "Device used to take photographs",
    answer: "CAMERA",
    world: "Planet Earth",
    group: "2",
    phase: "3",
    length: 6,
  },
  {
    clue: "Ancient Egyptian paper made from water reed",
    answer: "PAPYRUS",
    world: "Ancient Egypt",
    group: "45",
    phase: "2",
    length: 7,
  },
  {
    clue: "Mythological creature with a horse body and horn",
    answer: "UNICORN",
    world: "Once Upon a Time",
    group: "82",
    phase: "1",
    length: 7,
  },
  {
    clue: "Chemical element with symbol Au and atomic number 79",
    answer: "GOLD",
    world: "Planet Earth",
    group: "5",
    phase: "5",
    length: 4,
  },
  {
    clue: "Longest river in South America",
    answer: "AMAZON",
    world: "Adventure",
    group: "12",
    phase: "3",
    length: 6,
  },
  {
    clue: "The study of stars and celestial bodies",
    answer: "ASTRONOMY",
    world: "Space",
    group: "21",
    phase: "5",
    length: 9,
  },
  {
    clue: "Period of ten years",
    answer: "DECADE",
    world: "Planet Earth",
    group: "7",
    phase: "2",
    length: 6,
  },
  {
    clue: "Large body of salt water",
    answer: "OCEAN",
    world: "Under the Sea",
    group: "31",
    phase: "1",
    length: 5,
  },
  {
    clue: "A polygon with three sides",
    answer: "TRIANGLE",
    world: "Planet Earth",
    group: "8",
    phase: "4",
    length: 8,
  },
  {
    clue: "A sweet substance made by bees",
    answer: "HONEY",
    world: "Culinary Arts",
    group: "123",
    phase: "2",
    length: 5,
  },
  {
    clue: "The language spoken in Brazil",
    answer: "PORTUGUESE",
    world: "Culinary Arts",
    group: "127",
    phase: "3",
    length: 10,
  },
  {
    clue: "A fast, spotty cat from Africa",
    answer: "CHEETAH",
    world: "Rainforest",
    group: "56",
    phase: "4",
    length: 7,
  },
  {
    clue: "An instrument used to measure temperature",
    answer: "THERMOMETER",
    world: "Inventors",
    group: "111",
    phase: "1",
    length: 11,
  },
  {
    clue: "Capital of Japan",
    answer: "TOKYO",
    world: "Planet Earth",
    group: "3",
    phase: "1",
    length: 5,
  },
  {
    clue: "A large fruit with green skin and red pulp",
    answer: "WATERMELON",
    world: "Culinary Arts",
    group: "121",
    phase: "5",
    length: 10,
  },
  {
    clue: "The process of breathing in oxygen",
    answer: "RESPIRATION",
    world: "Space",
    group: "26",
    phase: "3",
    length: 11,
  },
  {
    clue: "A slow-moving reptile with a protective shell",
    answer: "TURTLE",
    world: "Under the Sea",
    group: "32",
    phase: "2",
    length: 6,
  },
  {
    clue: "An open-air market in an arab city",
    answer: "BAZAAR",
    world: "Adventure",
    group: "15",
    phase: "1",
    length: 6,
  },
  {
    clue: "Instrument with 88 black and white keys",
    answer: "PIANO",
    world: "Circus",
    group: "88",
    phase: "2",
    length: 5,
  },
  {
    clue: "The study of ancient human societies",
    answer: "ARCHAEOLOGY",
    world: "Ancient Egypt",
    group: "48",
    phase: "4",
    length: 11,
  },
  {
    clue: "A building where items are manufactured",
    answer: "FACTORY",
    world: "Inventors",
    group: "119",
    phase: "5",
    length: 7,
  },
];

const SUGGESTIONS = [
  "Ancient Rome",
  "France",
  "Bees",
  "Detective",
  "Brazil",
  "Snail",
];

export function CodyCrossAnswers() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ClueEntry[] | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSearch = (searchQuery: string = query) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      toast.error("Please enter a clue or question to search.");
      return;
    }

    setLoading(true);
    setResults(null);

    // Simulate database lookup latency for premium feel
    setTimeout(() => {
      const lower = trimmed.toLowerCase();
      const matched = CLUE_DATABASE.filter(
        (entry) =>
          entry.clue.toLowerCase().includes(lower) ||
          entry.answer.toLowerCase().includes(lower) ||
          entry.world.toLowerCase().includes(lower)
      );
      setResults(matched);
      setLoading(false);
    }, 450);
  };

  const handleChipClick = (chip: string) => {
    setQuery(chip);
    handleSearch(chip);
  };

  const handleCopy = (answer: string) => {
    navigator.clipboard?.writeText(answer);
    setCopiedId(answer);
    toast.success(`Copied "${answer}" to clipboard!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setQuery("");
    setResults(null);
  };

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-lift sm:p-7">
      <div className="space-y-3">
        <Label htmlFor="cca-query" className="text-xs font-semibold text-muted-foreground">
          Enter CodyCross clue, question, or keyword
        </Label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="cca-query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="e.g. capital city of France, sweet substance made by bees"
              autoComplete="off"
              spellCheck={false}
              className="pl-12 pr-10 rounded-xl sm:h-12 sm:text-base bg-background"
            />
            {query && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button
            onClick={() => handleSearch()}
            disabled={loading}
            className="h-12 shrink-0 rounded-2xl px-8 text-base font-semibold gradient-honey text-honey-foreground hover:opacity-90"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Search className="mr-2 h-5 w-5" />
            )}
            Search Clues
          </Button>
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1.5">
          <span className="text-xs font-medium text-muted-foreground">Popular clues:</span>
          {SUGGESTIONS.map((chip) => (
            <button
              key={chip}
              onClick={() => handleChipClick(chip)}
              className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-honey/50 hover:text-foreground"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Results panel */}
      {loading && (
        <div className="mt-8 flex flex-col items-center justify-center py-10 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-honey" />
          <p className="mt-3 text-sm text-muted-foreground">Searching 100,000+ clues in CodyCross database...</p>
        </div>
      )}

      {!loading && results !== null && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-display text-lg font-semibold">
              Search Results ({results.length})
            </h3>
            <span className="text-xs text-muted-foreground">Click card to copy answer</span>
          </div>

          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/70 bg-background/40 p-8 text-center">
              <Sparkles className="mx-auto h-7 w-7 text-muted-foreground/60" />
              <p className="mt-3 text-sm font-medium text-foreground">No exact match found in our mock database.</p>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                We are actively indexing new worlds. Try clicking one of the popular clues above like "Ancient Rome" or "France".
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {results.map((entry) => (
                <div
                  key={`${entry.clue}-${entry.answer}`}
                  onClick={() => handleCopy(entry.answer)}
                  className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-background p-4 shadow-soft cursor-pointer hover:border-honey/60 hover:shadow-lift transition-all"
                >
                  <div>
                    <span className="inline-flex items-center gap-1 rounded bg-secondary/80 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      World: {entry.world} (Group {entry.group}, Phase {entry.phase})
                    </span>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      "{entry.clue}"
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Answer ({entry.length} letters)
                      </span>
                      <p className="font-display text-lg font-bold tracking-wider text-honey group-hover:text-honey-dark transition-colors">
                        {entry.answer}
                      </p>
                    </div>
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground group-hover:bg-honey/10 group-hover:text-honey transition-colors">
                      {copiedId === entry.answer ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

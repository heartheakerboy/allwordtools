import { useMemo, useState } from "react";
import { Copy, Loader2, Search, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDictionary } from "@/hooks/use-dictionary";
import { vowelSignature } from "@/lib/literary-content";

/** Common-word bias: shorter words and more frequent letters rank higher. */
function commonScore(word: string): number {
  return -word.length;
}

export function AssonanceFinder() {
  const { words, loading, error } = useDictionary();
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);

  const results = useMemo(() => {
    if (!words || !submitted) return null;
    const target = submitted.trim().toLowerCase();
    const sig = vowelSignature(target);
    if (!sig) return [];
    const matches: string[] = [];
    for (const w of words) {
      if (w === target) continue;
      if (w.length < 3 || w.length > 9) continue;
      if (vowelSignature(w) === sig) matches.push(w);
    }
    return matches
      .sort((a, b) => commonScore(b) - commonScore(a) || a.localeCompare(b))
      .slice(0, 120);
  }, [words, submitted]);

  const run = () => {
    const clean = input.trim();
    if (!clean) {
      toast.error("Enter a word first.");
      return;
    }
    setSubmitted(clean);
  };

  const copyAll = () => {
    if (!results?.length) return;
    navigator.clipboard?.writeText(results.join(" "));
    toast.success("All words copied");
  };

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-lift sm:p-7">
      <div className="space-y-1.5">
        <Label htmlFor="asn-input" className="text-xs font-semibold text-muted-foreground">
          Enter a word
        </Label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            id="asn-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run()}
            placeholder="e.g. bright"
            className="h-12 rounded-2xl"
          />
          <Button
            onClick={run}
            disabled={loading}
            className="h-12 rounded-2xl px-8 text-base font-semibold"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Search className="mr-2 h-5 w-5" />
            )}
            Find assonance
          </Button>
        </div>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        Assonance is the repetition of vowel sounds. This finder returns words that share the same
        vowel pattern as your word — a handy shortcut for poetry, lyrics and creative writing.
      </p>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      {results && (
        <div className="mt-7 border-t border-border/60 pt-6">
          {results.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No matching words found. Try a shorter or more common word.
            </p>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
                  <Sparkles className="h-5 w-5 text-honey" /> Words with similar vowel sounds
                </h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyAll} className="rounded-full">
                    <Copy className="mr-1.5 h-4 w-4" /> Copy all
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSubmitted(null)}
                    className="rounded-full"
                  >
                    <X className="mr-1.5 h-4 w-4" /> Clear
                  </Button>
                </div>
              </div>
              <div className="mt-5 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {results.map((word, i) => (
                  <button
                    key={`${word}-${i}`}
                    onClick={() => {
                      navigator.clipboard?.writeText(word);
                      toast.success(`Copied "${word}"`);
                    }}
                    title="Click to copy"
                    className="group inline-flex items-center justify-between gap-2 rounded-xl border border-border/70 bg-secondary/40 px-4 py-2.5 text-left text-sm font-medium transition-colors hover:border-honey/60 hover:bg-accent"
                  >
                    <span>{word}</span>
                    <Copy className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { Copy, Loader2, Search, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  fetchPredecessors,
  fetchFollowers,
  fetchAssociated,
  type RelatedWord,
} from "@/lib/datamuse";

type Groups = {
  before: RelatedWord[];
  after: RelatedWord[];
  associated: RelatedWord[];
};

/**
 * Collocation Finder — surfaces the words that most commonly appear directly
 * before and after a word, plus statistically associated terms. Perfect for
 * writing natural-sounding English and learning real word partnerships.
 */
export function CollocationFinder() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<Groups | null>(null);
  const [term, setTerm] = useState("");

  const run = async () => {
    const word = query.trim().toLowerCase();
    if (!word) {
      toast.error("Enter a word first.");
      return;
    }
    if (/\s/.test(word)) {
      toast.error("Please enter a single word.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [before, after, associated] = await Promise.all([
        fetchPredecessors(word),
        fetchFollowers(word),
        fetchAssociated(word),
      ]);
      setGroups({
        before: before.slice(0, 24),
        after: after.slice(0, 24),
        associated: associated.slice(0, 24),
      });
      setTerm(word);
    } catch {
      setError("Couldn't reach the word service. Please check your connection and try again.");
      setGroups(null);
    } finally {
      setLoading(false);
    }
  };

  const copy = (w: string) => {
    navigator.clipboard?.writeText(w);
    toast.success(`Copied "${w}"`);
  };

  const reset = () => {
    setQuery("");
    setGroups(null);
    setError(null);
    setTerm("");
  };

  const hasResults =
    groups && (groups.before.length || groups.after.length || groups.associated.length);

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-lift sm:p-7">
      <div className="space-y-1.5">
        <Label htmlFor="col-query" className="text-xs font-semibold text-muted-foreground">
          Find collocations for
        </Label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            id="col-query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run()}
            placeholder="e.g. decision"
            autoComplete="off"
            spellCheck={false}
            className="rounded-xl sm:h-12 sm:text-base"
          />
          <Button
            onClick={run}
            disabled={loading}
            className="h-12 shrink-0 rounded-2xl px-8 text-base font-semibold"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Search className="mr-2 h-5 w-5" />
            )}
            Find collocations
          </Button>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        See which words most often come before and after your word, plus closely associated terms.
      </p>

      {error && (
        <p className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {groups && (
        <div className="mt-7 border-t border-border/60 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
              <Sparkles className="h-5 w-5 text-honey" />
              Collocations for &ldquo;{term}&rdquo;
            </h2>
            <Button variant="ghost" size="sm" onClick={reset} className="rounded-full">
              <X className="mr-1.5 h-4 w-4" /> Clear
            </Button>
          </div>

          {!hasResults ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No common collocations found for that word. Try a more common word.
            </p>
          ) : (
            <div className="mt-5 space-y-6">
              <ChipGroup
                title={`Comes before "${term}"`}
                subtitle={`word + ${term}`}
                items={groups.before}
                render={(w) => `${w} ${term}`}
                onCopy={copy}
              />
              <ChipGroup
                title={`Comes after "${term}"`}
                subtitle={`${term} + word`}
                items={groups.after}
                render={(w) => `${term} ${w}`}
                onCopy={copy}
              />
              <ChipGroup
                title="Closely associated"
                subtitle="topically related terms"
                items={groups.associated}
                render={(w) => w}
                onCopy={copy}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ChipGroup({
  title,
  subtitle,
  items,
  render,
  onCopy,
}: {
  title: string;
  subtitle: string;
  items: RelatedWord[];
  render: (word: string) => string;
  onCopy: (value: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="font-display text-sm font-semibold">{title}</h3>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((r) => {
          const value = render(r.word);
          return (
            <button
              key={r.word}
              onClick={() => onCopy(value)}
              title="Click to copy"
              className="group inline-flex items-center gap-2 rounded-xl border border-border/70 bg-secondary/40 px-3 py-1.5 text-sm font-medium transition-colors hover:border-honey/60 hover:bg-accent"
            >
              {value}
              <Copy className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

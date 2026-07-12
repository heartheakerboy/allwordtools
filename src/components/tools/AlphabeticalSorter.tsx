import { useMemo, useState } from "react";
import { ArrowDownAZ, Copy, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type SplitMode = "lines" | "words" | "commas";
type Order = "asc" | "desc";

function sortText(
  text: string,
  splitMode: SplitMode,
  order: Order,
  dedupe: boolean,
  ignoreCase: boolean,
): { items: string[]; joiner: string } {
  let items: string[];
  let joiner: string;
  if (splitMode === "lines") {
    items = text.split(/\r?\n/);
    joiner = "\n";
  } else if (splitMode === "commas") {
    items = text.split(",").map((s) => s.trim());
    joiner = ", ";
  } else {
    items = text.split(/\s+/);
    joiner = " ";
  }
  items = items.filter((s) => s.length > 0);

  if (dedupe) {
    const seen = new Set<string>();
    items = items.filter((s) => {
      const key = ignoreCase ? s.toLowerCase() : s;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  const collator = new Intl.Collator(undefined, {
    sensitivity: ignoreCase ? "base" : "variant",
    numeric: true,
  });
  items.sort((a, b) => collator.compare(a, b));
  if (order === "desc") items.reverse();

  return { items, joiner };
}

export function AlphabeticalSorter() {
  const [text, setText] = useState("");
  const [splitMode, setSplitMode] = useState<SplitMode>("lines");
  const [order, setOrder] = useState<Order>("asc");
  const [dedupe, setDedupe] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(true);

  const { items, joiner } = useMemo(
    () => sortText(text, splitMode, order, dedupe, ignoreCase),
    [text, splitMode, order, dedupe, ignoreCase],
  );
  const output = items.join(joiner);

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-lift sm:p-7">
      <div className="space-y-1.5">
        <Label htmlFor="as-text" className="text-xs font-semibold text-muted-foreground">
          Paste or type your list
        </Label>
        <Textarea
          id="as-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={"Enter items to sort, one per line…\nbanana\napple\ncherry"}
          className="min-h-40 rounded-xl text-base"
          spellCheck={false}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="as-split" className="text-xs font-semibold text-muted-foreground">
            Split items by
          </Label>
          <select
            id="as-split"
            value={splitMode}
            onChange={(e) => setSplitMode(e.target.value as SplitMode)}
            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="lines">New lines</option>
            <option value="words">Spaces (words)</option>
            <option value="commas">Commas</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="as-order" className="text-xs font-semibold text-muted-foreground">
            Order
          </Label>
          <select
            id="as-order"
            value={order}
            onChange={(e) => setOrder(e.target.value as Order)}
            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="asc">A → Z (ascending)</option>
            <option value="desc">Z → A (descending)</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-5">
        <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-muted-foreground">
          <input
            type="checkbox"
            checked={ignoreCase}
            onChange={(e) => setIgnoreCase(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-honey"
          />
          Ignore case
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-muted-foreground">
          <input
            type="checkbox"
            checked={dedupe}
            onChange={(e) => setDedupe(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-honey"
          />
          Remove duplicates
        </label>
      </div>

      {items.length > 0 && (
        <div className="mt-7 border-t border-border/60 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
              <ArrowDownAZ className="h-5 w-5 text-honey" />
              {items.length} sorted item{items.length === 1 ? "" : "s"}
            </h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard?.writeText(output);
                  toast.success("Sorted list copied");
                }}
                className="rounded-full"
              >
                <Copy className="mr-1.5 h-4 w-4" /> Copy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setText("")}
                className="rounded-full"
              >
                <X className="mr-1.5 h-4 w-4" /> Clear
              </Button>
            </div>
          </div>
          <Textarea
            readOnly
            value={output}
            className="mt-4 min-h-40 rounded-xl bg-secondary/40 text-base"
          />
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { Copy, Dices, Pilcrow, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AiGenerateButton } from "@/components/tools/ai/AiGenerateButton";
import { generateParagraphs } from "@/lib/random-content";

export function RandomParagraphGenerator() {
  const [paragraphs, setParagraphs] = useState(2);
  const [sentences, setSentences] = useState(4);
  const [results, setResults] = useState<string[] | null>(null);

  const generate = () => setResults(generateParagraphs(paragraphs, sentences));

  const copyAll = () => {
    if (!results?.length) return;
    navigator.clipboard?.writeText(results.join("\n\n"));
    toast.success("Paragraphs copied");
  };

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-lift sm:p-7">
      <div className="flex flex-wrap items-end gap-4">
        <div className="w-40 space-y-1.5">
          <Label htmlFor="rpg-paras" className="text-xs font-semibold text-muted-foreground">
            Paragraphs
          </Label>
          <Input
            id="rpg-paras"
            type="number"
            min={1}
            max={20}
            value={paragraphs}
            onChange={(e) => setParagraphs(Number(e.target.value))}
            className="rounded-xl"
          />
        </div>
        <div className="w-48 space-y-1.5">
          <Label htmlFor="rpg-sents" className="text-xs font-semibold text-muted-foreground">
            Sentences per paragraph
          </Label>
          <Input
            id="rpg-sents"
            type="number"
            min={2}
            max={12}
            value={sentences}
            onChange={(e) => setSentences(Number(e.target.value))}
            className="rounded-xl"
          />
        </div>
        <Button onClick={generate} className="h-12 rounded-2xl px-8 text-base font-semibold">
          <Dices className="mr-2 h-5 w-5" /> Generate paragraphs
        </Button>
      </div>

      <AiGenerateButton
        instruction="Generate well-formed, coherent paragraphs of natural prose. Each item is one full paragraph."
        count={paragraphs}
        onResults={setResults}
        themePlaceholder="Optional topic (e.g. nature, technology, a story)…"
      />

      {results && results.length > 0 && (
        <div className="mt-7 border-t border-border/60 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
              <Pilcrow className="h-5 w-5 text-honey" /> Your random paragraphs
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyAll} className="rounded-full">
                <Copy className="mr-1.5 h-4 w-4" /> Copy all
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setResults(null)}
                className="rounded-full"
              >
                <X className="mr-1.5 h-4 w-4" /> Clear
              </Button>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            {results.map((p, i) => (
              <p
                key={i}
                className="rounded-xl border border-border/70 bg-secondary/40 px-4 py-3 text-base leading-relaxed"
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

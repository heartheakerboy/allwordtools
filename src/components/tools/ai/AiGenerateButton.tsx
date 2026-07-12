import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateList } from "@/lib/ai-tools.functions";

type Props = {
  /** Instruction telling the AI what kind of items to produce. */
  instruction: string;
  /** How many items to request. */
  count: number;
  /** Called with the AI-generated items. */
  onResults: (items: string[]) => void;
  /** Placeholder for the optional theme input. */
  themePlaceholder?: string;
  /** Button label. */
  label?: string;
};

export function AiGenerateButton({
  instruction,
  count,
  onResults,
  themePlaceholder = "Optional theme (e.g. space, medieval, funny)…",
  label = "Create with AI",
}: Props) {
  const run = useServerFn(generateList);
  const [theme, setTheme] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await run({
        data: {
          instruction,
          theme: theme.trim() || undefined,
          count: Math.max(1, Math.min(50, count)),
        },
      });
      if (!res.items.length) {
        toast.error("The AI didn't return anything. Try again.");
        return;
      }
      onResults(res.items);
      toast.success("Created with AI ✨");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "AI request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 rounded-2xl border border-dashed border-honey/50 bg-honey/5 p-3 sm:p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) generate();
          }}
          placeholder={themePlaceholder}
          className="rounded-xl bg-background"
        />
        <Button
          onClick={generate}
          disabled={loading}
          variant="outline"
          className="h-11 shrink-0 rounded-xl border-honey/60 px-6 font-semibold text-honey hover:bg-honey/10 hover:text-honey"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {label}
        </Button>
      </div>
    </div>
  );
}

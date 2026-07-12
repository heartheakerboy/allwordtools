import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { toolIcons, type Tool } from "@/data/tools";
import { Badge } from "@/components/ui/badge";

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = toolIcons[tool.slug];
  return (
    <Link
      to="/tool/$tool"
      params={{ tool: tool.slug }}
      className="group relative flex flex-col rounded-2xl border border-border/70 bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-honey/50 hover:shadow-lift"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-colors group-hover:gradient-honey group-hover:text-honey-foreground">
          {Icon ? <Icon className="h-5 w-5" /> : null}
        </span>
        <div className="flex gap-1.5">
          {tool.isNew && (
            <Badge className="gradient-honey border-0 text-honey-foreground">New</Badge>
          )}
          {tool.isTrending && (
            <Badge variant="secondary" className="border border-border/60">
              Trending
            </Badge>
          )}
        </div>
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">{tool.name}</h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
        {tool.description}
      </p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-honey">
        Open tool
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

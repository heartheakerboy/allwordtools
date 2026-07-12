import { Link } from "@tanstack/react-router";
import { ArrowRight, Bot, Clock, Flame, Star } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { ToolCard } from "@/components/site/ToolCard";
import { getAiTools, getNewTools, getPopularTools, getTrendingTools } from "@/lib/internal-links";

/**
 * Homepage internal-linking showcase — surfaces Popular, Trending, New and
 * AI tools directly on the homepage so the deepest tool is reachable in two
 * clicks and every high-value page receives internal links.
 */
export function PopularToolsShowcase() {
  const popular = getPopularTools(4);
  const trending = getTrendingTools(6);
  const recent = getNewTools(6);
  const ai = getAiTools(6);

  const linkCls =
    "inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-honey";

  const groups = [
    { title: "Trending tools", icon: Flame, tools: trending },
    { title: "New tools", icon: Clock, tools: recent },
    { title: "AI tools", icon: Bot, tools: ai },
  ];

  return (
    <section
      aria-labelledby="popular-tools"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
    >
      <SectionHeading
        id="popular-tools"
        eyebrow="Most loved"
        title="Popular tools right now"
        description="The tools word lovers reach for most — plus what's trending, new and AI-powered."
        centered
      />

      {/* Popular tools as cards */}
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {popular.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

      {/* Trending / New / AI link columns */}
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {groups.map((group) => {
          const Icon = group.icon;
          return (
            <div
              key={group.title}
              className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft"
            >
              <h3 className="flex items-center gap-2 font-display text-base font-semibold">
                <Icon className="h-4 w-4 text-honey" /> {group.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {group.tools.map((t) => (
                  <li key={t.slug}>
                    <Link to="/tool/$tool" params={{ tool: t.slug }} className={linkCls}>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-honey/60" />
                      {t.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/tools"
          className="inline-flex items-center gap-1.5 rounded-full gradient-ink px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          <Star className="h-4 w-4" /> Browse all tools
        </Link>
        <Link
          to="/learn"
          className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-honey/60"
        >
          Visit the learning hub
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

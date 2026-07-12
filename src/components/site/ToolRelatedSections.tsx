import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { ToolCard } from "@/components/site/ToolCard";
import { ToolLinkList } from "@/components/site/ToolLinkList";
import { toolIcons } from "@/data/tools";
import {
  getNextPrevTool,
  getRecommendedNext,
  getRelatedTools,
  getSameCategoryTools,
  getToolCategory,
  getUsersAlsoUsed,
} from "@/lib/internal-links";

/**
 * Automatically-generated internal-linking sections for every tool page.
 * Given a slug, it derives Related Tools, a Recommended Next tool,
 * Previous/Next navigation, "Users Also Used" and "More In This Category"
 * — 15–30 relevant, descriptive internal links with zero manual wiring.
 */
export function ToolRelatedSections({ slug }: { slug: string }) {
  const category = getToolCategory(slug);
  const related = getRelatedTools(slug, 4);
  const usersAlsoUsed = getUsersAlsoUsed(slug, 6);
  const sameCategory = getSameCategoryTools(slug, 6);
  const recommended = getRecommendedNext(slug);
  const { prev, next } = getNextPrevTool(slug);
  const RecIcon = recommended ? (toolIcons[recommended.slug] ?? Sparkles) : Sparkles;

  return (
    <section className="border-t border-border/60 bg-secondary/30 py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Related tools (cards) */}
        {related.length > 0 && (
          <>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-sm font-semibold uppercase tracking-wider text-honey">
                  Keep exploring
                </span>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  Related tools
                </h2>
              </div>
              {category && (
                <Link
                  to="/category/$category"
                  params={{ category: category.slug }}
                  className="hidden items-center gap-1.5 text-sm font-medium text-honey hover:underline sm:inline-flex"
                >
                  All {category.title}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          </>
        )}

        {/* Recommended next tool */}
        {recommended && (
          <div className="mt-10 flex flex-col items-start gap-4 rounded-3xl border border-honey/40 bg-card p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gradient-honey text-honey-foreground">
                <RecIcon className="h-6 w-6" />
              </span>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-honey">
                  Recommended next
                </span>
                <p className="font-display text-lg font-semibold">{recommended.name}</p>
                <p className="text-sm text-muted-foreground">{recommended.description}</p>
              </div>
            </div>
            <Link
              to="/tool/$tool"
              params={{ tool: recommended.slug }}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full gradient-honey px-5 py-2.5 text-sm font-semibold text-honey-foreground shadow-soft transition-transform hover:-translate-y-0.5"
            >
              Open {recommended.name}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* Link columns: users also used + more in category */}
        <div className="mt-12 grid gap-10 sm:grid-cols-2">
          <ToolLinkList title="Users also used" tools={usersAlsoUsed} columns={1} />
          <ToolLinkList
            title={category ? `More ${category.title.toLowerCase()}` : "More tools"}
            tools={sameCategory}
            columns={1}
          />
        </div>

        {/* Previous / Next navigation */}
        {(prev || next) && (
          <div className="mt-12 grid gap-4 border-t border-border/60 pt-8 sm:grid-cols-2">
            {prev ? (
              <Link
                to="/tool/$tool"
                params={{ tool: prev.slug }}
                className="group flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-soft transition-all hover:border-honey/50"
              >
                <ArrowLeft className="h-4 w-4 text-honey transition-transform group-hover:-translate-x-1" />
                <span>
                  <span className="block text-xs uppercase tracking-wider text-muted-foreground">
                    Previous tool
                  </span>
                  <span className="font-display text-sm font-semibold">{prev.name}</span>
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                to="/tool/$tool"
                params={{ tool: next.slug }}
                className="group flex items-center justify-end gap-3 rounded-2xl border border-border/70 bg-card p-5 text-right shadow-soft transition-all hover:border-honey/50"
              >
                <span>
                  <span className="block text-xs uppercase tracking-wider text-muted-foreground">
                    Next tool
                  </span>
                  <span className="font-display text-sm font-semibold">{next.name}</span>
                </span>
                <ArrowRight className="h-4 w-4 text-honey transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

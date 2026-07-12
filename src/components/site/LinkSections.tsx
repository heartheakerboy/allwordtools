import { Link } from "@tanstack/react-router";
import { ArrowRight, Compass, Grid3x3, Sparkles } from "lucide-react";
import { keywordClusters } from "@/lib/internal-links";

/**
 * Contextual keyword-cluster links. Turns common search phrases into
 * descriptive internal links pointing at the closest matching tool —
 * strengthening topical authority without spammy anchors.
 */
export function KeywordClusters() {
  return (
    <section
      aria-labelledby="keyword-clusters"
      className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
    >
      <span className="text-sm font-semibold uppercase tracking-wider text-honey">
        Related searches
      </span>
      <h2
        id="keyword-clusters"
        className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl"
      >
        Explore related word searches
      </h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {keywordClusters.map((cluster) => (
          <div
            key={cluster.title}
            className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft"
          >
            <h3 className="font-display text-base font-semibold">{cluster.title}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {cluster.links.map((link) => (
                <li key={link.label}>
                  {link.kind === "tool" ? (
                    <Link
                      to="/tool/$tool"
                      params={{ tool: link.slug }}
                      className="inline-flex items-center rounded-full border border-border/60 bg-secondary/50 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-honey/60 hover:text-honey"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <Link
                      to="/category/$category"
                      params={{ category: link.slug }}
                      className="inline-flex items-center rounded-full border border-border/60 bg-secondary/50 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-honey/60 hover:text-honey"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Bottom call-to-action band shown at the end of every major page:
 * "Continue exploring" links to the all-tools hub, all categories and the
 * learning hub, ensuring outgoing links and zero dead ends.
 */
export function BottomCta() {
  return (
    <section
      aria-labelledby="continue-exploring"
      className="border-t border-border/60 bg-secondary/40 py-14"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-honey">
            Continue exploring
          </span>
          <h2
            id="continue-exploring"
            className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            More free word tools await
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            You may also like our full toolkit, every category and the learning hub — all free and
            no sign-up.
          </p>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          <Link
            to="/tools"
            className="group flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-honey/50 hover:shadow-lift"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gradient-ink text-primary-foreground">
              <Grid3x3 className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-display text-base font-semibold">All Word Tools</span>
              <span className="mt-1 block text-sm text-muted-foreground">
                Browse every free tool in one place
              </span>
              <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-honey">
                View all tools
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </span>
          </Link>

          <Link
            to="/"
            hash="browse-categories"
            className="group flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-honey/50 hover:shadow-lift"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gradient-ink text-primary-foreground">
              <Compass className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-display text-base font-semibold">Browse Categories</span>
              <span className="mt-1 block text-sm text-muted-foreground">
                Find tools grouped by what you need
              </span>
              <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-honey">
                Explore categories
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </span>
          </Link>

          <Link
            to="/learn"
            className="group flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-honey/50 hover:shadow-lift"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gradient-ink text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-display text-base font-semibold">Learning Hub</span>
              <span className="mt-1 block text-sm text-muted-foreground">
                Quizzes, word of the day and guides
              </span>
              <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-honey">
                Start learning
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

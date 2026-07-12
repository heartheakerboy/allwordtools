import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Flame, LayoutGrid, Search, Star } from "lucide-react";
import {
  getPopularTools,
  getRecentlyAddedTools,
  getTrendingTools,
  topSearchLinks,
  categories,
} from "@/lib/internal-links";

/**
 * The "sidebar" content — rendered as a responsive band so it works within
 * the existing single-column tool layout without a UI redesign. Surfaces
 * Popular Tools, Recently Added, Trending, Categories and Top Searches so
 * no tool page is ever an orphan.
 */
export function DiscoverMore({ excludeSlug }: { excludeSlug?: string }) {
  const popular = getPopularTools(6)
    .filter((t) => t.slug !== excludeSlug)
    .slice(0, 5);
  const recent = getRecentlyAddedTools(6)
    .filter((t) => t.slug !== excludeSlug)
    .slice(0, 5);
  const trending = getTrendingTools(6)
    .filter((t) => t.slug !== excludeSlug)
    .slice(0, 5);

  const linkCls =
    "inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-honey";

  return (
    <section
      aria-labelledby="discover-more"
      className="border-t border-border/60 bg-secondary/30 py-14"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <span className="text-sm font-semibold uppercase tracking-wider text-honey">
          Discover more
        </span>
        <h2
          id="discover-more"
          className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          Handy shortcuts across the site
        </h2>

        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Popular Tools */}
          <div>
            <h3 className="flex items-center gap-2 font-display text-sm font-semibold">
              <Star className="h-4 w-4 text-honey" /> Popular Tools
            </h3>
            <ul className="mt-3 space-y-2">
              {popular.map((t) => (
                <li key={t.slug}>
                  <Link to="/tool/$tool" params={{ tool: t.slug }} className={linkCls}>
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Recently Added */}
          <div>
            <h3 className="flex items-center gap-2 font-display text-sm font-semibold">
              <Clock className="h-4 w-4 text-honey" /> Recently Added
            </h3>
            <ul className="mt-3 space-y-2">
              {recent.map((t) => (
                <li key={t.slug}>
                  <Link to="/tool/$tool" params={{ tool: t.slug }} className={linkCls}>
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trending */}
          <div>
            <h3 className="flex items-center gap-2 font-display text-sm font-semibold">
              <Flame className="h-4 w-4 text-honey" /> Trending
            </h3>
            <ul className="mt-3 space-y-2">
              {trending.map((t) => (
                <li key={t.slug}>
                  <Link to="/tool/$tool" params={{ tool: t.slug }} className={linkCls}>
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="flex items-center gap-2 font-display text-sm font-semibold">
              <LayoutGrid className="h-4 w-4 text-honey" /> Categories
            </h3>
            <ul className="mt-3 space-y-2">
              {categories.slice(0, 5).map((c) => (
                <li key={c.slug}>
                  <Link to="/category/$category" params={{ category: c.slug }} className={linkCls}>
                    {c.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/tools" className="text-sm font-semibold text-honey hover:underline">
                  View all tools →
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Searches */}
          <div>
            <h3 className="flex items-center gap-2 font-display text-sm font-semibold">
              <Search className="h-4 w-4 text-honey" /> Top Searches
            </h3>
            <ul className="mt-3 space-y-2">
              {topSearchLinks.slice(0, 6).map((k) => (
                <li key={k.label}>
                  {k.kind === "tool" ? (
                    <Link to="/tool/$tool" params={{ tool: k.slug }} className={linkCls}>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-honey/60" />
                      {k.label}
                    </Link>
                  ) : (
                    <Link
                      to="/category/$category"
                      params={{ category: k.slug }}
                      className={linkCls}
                    >
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-honey/60" />
                      {k.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

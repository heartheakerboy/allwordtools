import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";

export type Crumb = {
  label: string;
  to?: string;
  params?: Record<string, string>;
};

/**
 * Accessible breadcrumb trail used across tool, category and content pages.
 * The final crumb is rendered as plain (current-page) text.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-7">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <li>
          <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground">
            <Home className="h-3.5 w-3.5" /> Home
          </Link>
        </li>
        {items.map((crumb, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5" />
              {isLast || !crumb.to ? (
                <span className="font-medium text-foreground">{crumb.label}</span>
              ) : (
                <Link
                  to={crumb.to as string}
                  params={crumb.params as never}
                  className="hover:text-foreground"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

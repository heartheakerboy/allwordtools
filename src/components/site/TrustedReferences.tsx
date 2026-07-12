import { BookMarked, ExternalLink, ShieldCheck } from "lucide-react";
import { externalRel, getSource, type Reference } from "@/lib/external-links";

/**
 * Trusted References section.
 *
 * Renders a small, editorial "References" box plus optional trust badges for
 * the authoritative sources actually cited on the page. It self-hides when no
 * references exist, so pages without genuine educational citations show
 * nothing at all — internal links always remain the priority.
 *
 * All external links carry target="_blank" and rel="noopener noreferrer"
 * (trusted editorial citations are followed; only affiliate/sponsored/UGC
 * links would add extra rel tokens, handled centrally by `externalRel`).
 */
export function TrustedReferences({
  references,
  className = "",
}: {
  references: Reference[];
  className?: string;
}) {
  if (!references.length) return null;

  // Unique sources actually used on this page → trust badges.
  const sourceKeys = [...new Set(references.map((r) => r.source))];

  return (
    <section
      aria-labelledby="references"
      className={`mx-auto max-w-3xl px-4 pb-12 sm:px-6 lg:px-8 ${className}`}
    >
      <div className="rounded-3xl border border-border/70 bg-secondary/40 p-6 shadow-soft sm:p-7">
        <div className="flex items-center gap-2">
          <BookMarked className="h-5 w-5 text-honey" />
          <h2 id="references" className="font-display text-lg font-semibold tracking-tight">
            References
          </h2>
        </div>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Authoritative sources used to explain the concepts on this page.
        </p>

        <ul className="mt-4 space-y-2.5">
          {references.map((ref) => {
            const source = getSource(ref.source);
            return (
              <li key={ref.id} className="flex items-start gap-2.5 text-sm leading-relaxed">
                <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-honey" />
                <span className="text-muted-foreground">
                  <a
                    href={ref.url}
                    target="_blank"
                    rel={externalRel(ref)}
                    className="font-medium text-foreground underline decoration-honey/40 underline-offset-2 transition-colors hover:text-honey"
                  >
                    {ref.label}
                  </a>
                  <span className="ml-1.5 text-xs text-muted-foreground/80">
                    — {source.name} · {ref.topic}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>

        {/* Trust badges — only the sources actually cited above */}
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-honey" /> Trusted references
          </span>
          {sourceKeys.map((key) => {
            const source = getSource(key);
            return (
              <span
                key={key}
                className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-card px-2.5 py-1 text-xs font-medium text-foreground"
                title={`${source.name} · authority ${source.authority}/100`}
              >
                {source.name}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}

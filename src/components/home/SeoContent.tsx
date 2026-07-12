import { seoContent } from "@/data/homepage-content";

export function SeoContent() {
  return (
    <section className="bg-secondary/40 py-16" aria-labelledby="learn-more">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <span className="text-sm font-semibold uppercase tracking-wider text-honey">
          The complete guide
        </span>
        <h2
          id="learn-more"
          className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          Everything you need to know about word tools
        </h2>

        <div className="mt-8 space-y-12">
          {seoContent.map((block) => (
            <article key={block.id} id={block.id}>
              <h3 className="font-display text-2xl font-semibold tracking-tight">
                {block.heading}
              </h3>
              <div className="mt-3 space-y-4">
                {block.paragraphs.map((p, i) => (
                  <p key={i} className="text-base leading-relaxed text-muted-foreground">
                    {p}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

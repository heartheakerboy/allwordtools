import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, Home, Lightbulb, Sparkles } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ToolCard } from "@/components/site/ToolCard";
import { DiscoverMore } from "@/components/site/DiscoverMore";
import { TrustedReferences } from "@/components/site/TrustedReferences";
import { KeywordClusters, BottomCta } from "@/components/site/LinkSections";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { categories, type Tool } from "@/data/tools";
import { categoryContent } from "@/data/category-content";
import { getCategoryReferences } from "@/lib/external-links";
import { buildLocaleHead, inLanguage } from "@/i18n/seo";
import { localePath } from "@/i18n/paths";
import { DEFAULT_LOCALE } from "@/i18n/locales";

const SITE = "AllWordTools.com";

function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function categoryHead(slug: string, locale: string) {
  const category = getCategory(slug);
  const content = categoryContent[slug];
  if (!category) {
    return {
      meta: [{ title: `Category not found — ${SITE}` }, { name: "robots", content: "noindex" }],
    };
  }
  const title = content?.metaTitle ?? `${category.title} — ${SITE}`;
  const description = content?.metaDescription ?? category.description;
  const path = `/category/${slug}`;
  const url = localePath(locale, path);
  const home = localePath(locale, "/");
  const { meta, links } = buildLocaleHead({ path, locale, title, description });
  return {
    meta,
    links,
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          inLanguage: inLanguage(locale),
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: home },
            { "@type": "ListItem", position: 2, name: category.title, item: url },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: category.title,
          description,
          url,
          inLanguage: inLanguage(locale),
          isPartOf: { "@type": "WebSite", name: SITE, url: home },
          mainEntity: {
            "@type": "ItemList",
            itemListElement: category.tools.map((t, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: t.name,
              url: localePath(locale, `/tool/${t.slug}`),
            })),
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: category.title,
          itemListElement: category.tools.map((t, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: t.name,
            description: t.description,
          })),
        }),
      },
      ...(content
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: content.faqs.map((f) => ({
                  "@type": "Question",
                  name: f.question,
                  acceptedAnswer: { "@type": "Answer", text: f.answer },
                })),
              }),
            },
          ]
        : []),
    ],
  };
}

export const Route = createFileRoute("/category/$category")({
  loader: ({ params }) => {
    // Return only serializable data — the category's `icon` is a React
    // component (function) and cannot cross the SSR dehydration boundary.
    if (!getCategory(params.category)) throw notFound();
    return { slug: params.category };
  },
  head: ({ params }) => categoryHead(params.category, DEFAULT_LOCALE),
  component: RootCategoryPage,
  notFoundComponent: CategoryNotFound,
  errorComponent: CategoryError,
});

function RootCategoryPage() {
  const { slug } = Route.useLoaderData();
  return <CategoryPageView slug={slug} />;
}

export function CategoryPageView({ slug }: { slug: string }) {
  const category = getCategory(slug)!;
  const content = categoryContent[slug];
  const Icon = category.icon;
  const related = categories.filter((c) => c.slug !== category.slug);
  const references = getCategoryReferences(slug);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="gradient-hero border-b border-border/60">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <li>
                  <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground">
                    <Home className="h-3.5 w-3.5" /> Home
                  </Link>
                </li>
                <ChevronRight className="h-3.5 w-3.5" />
                <li className="font-medium text-foreground">{category.title}</li>
              </ol>
            </nav>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5 text-honey" />
                  {category.tools.length} free tools in this category
                </span>
                <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl">
                  {content?.heading ?? category.title}
                </h1>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-balance">
                  {content?.subheading ?? category.description}
                </p>
              </div>
              <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl gradient-ink text-primary-foreground shadow-lift">
                <Icon className="h-10 w-10" />
              </span>
            </div>
          </div>
        </section>

        {/* Tools grid */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8" aria-labelledby="tools">
          <h2 id="tools" className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            {category.title} tools
          </h2>
          <p className="mt-2 text-muted-foreground">
            Pick a tool to get started — each one is fast, free and works on any device.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {category.tools.map((tool: Tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>

        {/* Long-form content */}
        {content && (
          <section className="bg-secondary/40 py-14" aria-labelledby="about">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <span className="text-sm font-semibold uppercase tracking-wider text-honey">
                {content.eyebrow}
              </span>
              <h2
                id="about"
                className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl"
              >
                About {category.title}
              </h2>
              <div className="mt-6 space-y-4">
                {content.intro.map((p, i) => (
                  <p key={i} className="text-base leading-relaxed text-muted-foreground">
                    {p}
                  </p>
                ))}
              </div>

              <div className="mt-10 space-y-10">
                {content.sections.map((s) => (
                  <article key={s.heading}>
                    <h3 className="font-display text-2xl font-semibold tracking-tight">
                      {s.heading}
                    </h3>
                    <div className="mt-3 space-y-4">
                      {s.paragraphs.map((p, i) => (
                        <p key={i} className="text-base leading-relaxed text-muted-foreground">
                          {p}
                        </p>
                      ))}
                    </div>
                  </article>
                ))}
              </div>

              {/* Tips */}
              <div className="mt-12 rounded-3xl border border-border/70 bg-card p-7 shadow-soft">
                <h3 className="flex items-center gap-2 font-display text-xl font-semibold">
                  <Lightbulb className="h-5 w-5 text-honey" /> Pro tips
                </h3>
                <ul className="mt-4 space-y-3">
                  {content.tips.map((tip, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full gradient-honey text-xs font-bold text-honey-foreground">
                        {i + 1}
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        {content && (
          <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8" aria-labelledby="faq">
            <span className="text-sm font-semibold uppercase tracking-wider text-honey">
              Questions & answers
            </span>
            <h2
              id="faq"
              className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              {category.title} FAQs
            </h2>
            <Accordion type="single" collapsible className="mt-6 w-full">
              {content.faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-border/70">
                  <AccordionTrigger className="text-left font-display text-base font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}

        {/* Related categories */}
        <section className="bg-secondary/40 py-14" aria-labelledby="related">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2
              id="related"
              className="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Explore more categories
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((cat) => {
                const CatIcon = cat.icon;
                return (
                  <Link
                    key={cat.slug}
                    to="/category/$category"
                    params={{ category: cat.slug }}
                    className="group flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-honey/50 hover:shadow-lift"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gradient-ink text-primary-foreground">
                      <CatIcon className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold">{cat.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {cat.tools.length} tools
                      </p>
                      <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-honey">
                        Browse
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Trusted external references — educational sources for this category */}
        <TrustedReferences references={references} className="py-4" />

        {/* Contextual keyword clusters */}
        <KeywordClusters />

        {/* Sidebar-style discovery band */}
        <DiscoverMore />

        {/* Bottom CTA */}
        <BottomCta />
      </main>
      <Footer />
    </div>
  );
}

export function CategoryNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold">Category not found</h1>
        <p className="mt-3 text-muted-foreground">
          We couldn't find that category. Explore all of our word tools instead.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
      <Footer />
    </div>
  );
}

export function CategoryError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold">This page didn't load</h1>
        <p className="mt-3 text-muted-foreground">Something went wrong. Please try again.</p>
        <Button
          className="mt-6 rounded-full"
          onClick={() => {
            router.invalidate();
            reset();
          }}
        >
          Try again
        </Button>
      </div>
      <Footer />
    </div>
  );
}

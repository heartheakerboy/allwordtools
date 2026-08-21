import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays } from "lucide-react";
import { PageLayout } from "@/components/site/PageLayout";
import { buildLocaleHead } from "@/i18n/seo";
import { DEFAULT_LOCALE } from "@/i18n/locales";

const SITE = "AllWordTools.com";
export const TITLE = `Blog — Word Game Tips, Vocabulary & Writing Guides — ${SITE}`;
export const DESCRIPTION =
  "Tips, strategies and guides for word games, vocabulary building and better writing from the AllWordTools team. New articles coming soon.";

type Post = {
  title: string;
  excerpt: string;
  category: string;
} & ({ kind: "tool"; slug: string } | { kind: "category"; slug: string } | { kind: "learn" });

const posts: Post[] = [
  {
    title: "How to win at Wordle every day",
    excerpt: "The best starting words, letter strategies and how a solver narrows the answer fast.",
    category: "Word Games",
    kind: "tool",
    slug: "wordle-solver",
  },
  {
    title: "Score more in Scrabble & Words With Friends",
    excerpt: "Use high-value tiles, bonus squares and two-letter words to rack up points.",
    category: "Word Games",
    kind: "tool",
    slug: "scrabble-helper",
  },
  {
    title: "Build your vocabulary the smart way",
    excerpt: "Daily words, quizzes and AI flashcards that make new words stick.",
    category: "Learning",
    kind: "learn",
  },
  {
    title: "Active vs passive voice, explained",
    excerpt: "When each one works, and how to convert between them for clearer writing.",
    category: "Writing",
    kind: "tool",
    slug: "active-voice-converter",
  },
  {
    title: "Unscramble anything: anagrams & jumbles",
    excerpt: "How word unscramblers work and how to find every valid word from your letters.",
    category: "Solvers",
    kind: "tool",
    slug: "word-unscrambler",
  },
  {
    title: "Writing with AI: sentences, stories & poems",
    excerpt: "Get inspired with AI tools that draft examples, stories and poems in seconds.",
    category: "AI",
    kind: "category",
    slug: "ai-tools",
  },
];

export const Route = createFileRoute("/blog")({
  head: () =>
    buildLocaleHead({
      path: "/blog",
      locale: DEFAULT_LOCALE,
      title: TITLE,
      description: DESCRIPTION,
    }),
  component: BlogPage,
});

export function BlogPage() {
  return (
    <PageLayout
      crumb="Blog"
      title="The AllWordTools Blog"
      intro="Tips, strategies and guides for word games, vocabulary and writing. Full articles are on the way — meanwhile, jump into the tools each guide is about."
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.title} post={post} />
        ))}
      </div>
    </PageLayout>
  );
}

function PostCard({ post }: { post: Post }) {
  const inner = (
    <>
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
        <CalendarDays className="h-3.5 w-3.5" /> {post.category}
      </span>
      <h2 className="mt-4 font-display text-xl font-semibold tracking-tight group-hover:text-honey">
        {post.title}
      </h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-honey">
        Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </>
  );
  const className =
    "group flex flex-col rounded-3xl border border-border/70 bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift";

  if (post.kind === "tool") {
    return (
      <Link to="/tool/$tool" params={{ tool: post.slug }} className={className}>
        {inner}
      </Link>
    );
  }
  if (post.kind === "category") {
    return (
      <Link to="/category/$category" params={{ category: post.slug }} className={className}>
        {inner}
      </Link>
    );
  }
  return (
    <Link to="/learn" className={className}>
      {inner}
    </Link>
  );
}

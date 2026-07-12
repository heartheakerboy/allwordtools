// Localized category page (e.g. /es/category/word-games). Reuses the English
// category UI with a fully locale-aware SEO head (canonical + hreflang).
import { createFileRoute, notFound } from "@tanstack/react-router";
import { categories } from "@/data/tools";
import {
  CategoryPageView,
  CategoryNotFound,
  CategoryError,
  categoryHead,
} from "./category.$category";

export const Route = createFileRoute("/$locale/category/$category")({
  loader: ({ params }) => {
    if (!categories.some((c) => c.slug === params.category)) throw notFound();
    return { slug: params.category };
  },
  head: ({ params }) => categoryHead(params.category, params.locale),
  component: LocaleCategoryPage,
  notFoundComponent: CategoryNotFound,
  errorComponent: CategoryError,
});

function LocaleCategoryPage() {
  const { slug } = Route.useLoaderData();
  return <CategoryPageView slug={slug} />;
}

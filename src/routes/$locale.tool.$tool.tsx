// Localized tool page (e.g. /es/tool/word-unscrambler). Reuses the English
// tool UI but sources native, market-researched content (meta, FAQs, intro,
// how-to, examples) for the active locale, with English fallback per field.
import { createFileRoute, notFound } from "@tanstack/react-router";
import { allTools } from "@/data/tools";
import { getLocalizedTool } from "@/i18n/content";
import { ToolPageView, ToolNotFound, ToolError, toolHead } from "./tool.$tool";

export const Route = createFileRoute("/$locale/tool/$tool")({
  loader: async ({ params }) => {
    if (!allTools.some((t) => t.slug === params.tool)) throw notFound();
    const override = await getLocalizedTool(params.tool, params.locale);
    return { slug: params.tool, override };
  },
  head: ({ params, loaderData }) =>
    toolHead(params.tool, params.locale, loaderData?.override ?? undefined),
  component: LocaleToolPage,
  notFoundComponent: ToolNotFound,
  errorComponent: ToolError,
});

function LocaleToolPage() {
  const { slug, override } = Route.useLoaderData();
  return <ToolPageView slug={slug} contentOverride={override ?? undefined} />;
}

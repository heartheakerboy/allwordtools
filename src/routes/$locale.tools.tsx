import { createFileRoute } from "@tanstack/react-router";
import { buildLocaleHead } from "@/i18n/seo";
import { ToolsPage, TITLE, DESCRIPTION } from "./tools";

export const Route = createFileRoute("/$locale/tools")({
  head: ({ params }) =>
    buildLocaleHead({
      path: "/tools",
      locale: params.locale,
      title: TITLE,
      description: DESCRIPTION,
    }),
  component: ToolsPage,
});

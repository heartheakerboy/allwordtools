import { createFileRoute } from "@tanstack/react-router";
import { buildLocaleHead } from "@/i18n/seo";
import { BlogPage, TITLE, DESCRIPTION } from "./blog.index";

export const Route = createFileRoute("/$locale/blog/")({
  head: ({ params }) =>
    buildLocaleHead({
      path: "/blog",
      locale: params.locale,
      title: TITLE,
      description: DESCRIPTION,
    }),
  component: BlogPage,
});

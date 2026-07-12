import { createFileRoute } from "@tanstack/react-router";
import { buildLocaleHead } from "@/i18n/seo";
import { LearnPage, TITLE, DESCRIPTION } from "./learn";

export const Route = createFileRoute("/$locale/learn")({
  head: ({ params }) =>
    buildLocaleHead({
      path: "/learn",
      locale: params.locale,
      title: TITLE,
      description: DESCRIPTION,
    }),
  component: LearnPage,
});

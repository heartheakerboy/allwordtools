import { createFileRoute } from "@tanstack/react-router";
import { legalHead } from "@/lib/legal-seo";
import { AboutPage } from "./about";

export const Route = createFileRoute("/$locale/about")({
  head: ({ params }) =>
    legalHead({
      title: "About",
      description:
        "AllWordTools brings hundreds of free word game solvers and English language tools together in one fast, beautifully organised place.",
      path: "/about",
      crumb: "About",
      locale: params.locale,
    }),
  component: AboutPage,
});

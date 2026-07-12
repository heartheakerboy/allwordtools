import { createFileRoute } from "@tanstack/react-router";
import { legalHead } from "@/lib/legal-seo";
import { TermsPage } from "./terms";

export const Route = createFileRoute("/$locale/terms")({
  head: ({ params }) =>
    legalHead({
      title: "Terms & Conditions",
      description:
        "The terms for using AllWordTools. Our free word tools are provided as-is for personal and educational use.",
      path: "/terms",
      crumb: "Terms & Conditions",
      locale: params.locale,
    }),
  component: TermsPage,
});

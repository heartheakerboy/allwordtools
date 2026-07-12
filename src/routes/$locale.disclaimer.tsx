import { createFileRoute } from "@tanstack/react-router";
import { legalHead } from "@/lib/legal-seo";
import { DisclaimerPage } from "./disclaimer";

export const Route = createFileRoute("/$locale/disclaimer")({
  head: ({ params }) =>
    legalHead({
      title: "Disclaimer",
      description:
        "AllWordTools is provided for educational purposes only. Read our disclaimer on tool accuracy, AI content, advertising and affiliate links.",
      path: "/disclaimer",
      crumb: "Disclaimer",
      locale: params.locale,
    }),
  component: DisclaimerPage,
});

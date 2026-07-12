import { createFileRoute } from "@tanstack/react-router";
import { legalHead } from "@/lib/legal-seo";
import { DmcaPage } from "./dmca";

export const Route = createFileRoute("/$locale/dmca")({
  head: ({ params }) =>
    legalHead({
      title: "DMCA Policy",
      description:
        "How to submit a copyright infringement notice or counter-notice for content on AllWordTools.com.",
      path: "/dmca",
      crumb: "DMCA",
      locale: params.locale,
    }),
  component: DmcaPage,
});

import { createFileRoute } from "@tanstack/react-router";
import { legalHead } from "@/lib/legal-seo";
import { PrivacyPage } from "./privacy";

export const Route = createFileRoute("/$locale/privacy")({
  head: ({ params }) =>
    legalHead({
      title: "Privacy Policy",
      description:
        "How AllWordTools collects, uses and protects your data. Most tools run in your browser and no account is required.",
      path: "/privacy",
      crumb: "Privacy Policy",
      locale: params.locale,
    }),
  component: PrivacyPage,
});

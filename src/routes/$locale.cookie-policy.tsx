import { createFileRoute } from "@tanstack/react-router";
import { legalHead } from "@/lib/legal-seo";
import { CookiePolicyPage } from "./cookie-policy";

export const Route = createFileRoute("/$locale/cookie-policy")({
  head: ({ params }) =>
    legalHead({
      title: "Cookie Policy",
      description:
        "What cookies AllWordTools uses, why we use them, how long they last, and how you can manage or disable them.",
      path: "/cookie-policy",
      crumb: "Cookie Policy",
      locale: params.locale,
    }),
  component: CookiePolicyPage,
});

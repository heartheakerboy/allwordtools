import { createFileRoute } from "@tanstack/react-router";
import { legalHead } from "@/lib/legal-seo";
import { ContactPage } from "./contact";

export const Route = createFileRoute("/$locale/contact")({
  head: ({ params }) =>
    legalHead({
      title: "Contact",
      description:
        "Get in touch with the AllWordTools team. Send feedback, report a bug, suggest a tool or make a privacy request.",
      path: "/contact",
      crumb: "Contact",
      locale: params.locale,
    }),
  component: ContactPage,
});

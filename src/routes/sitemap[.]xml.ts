import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { enabledLocales } from "@/i18n/locales";

// TODO: replace with your project URL once a project name or custom domain is set.
const BASE_URL = "";

// Sitemap index: one child sitemap per enabled language.
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const lastmod = new Date().toISOString().slice(0, 10);
        const sitemaps = enabledLocales()
          .map((l) =>
            [
              `  <sitemap>`,
              `    <loc>${BASE_URL}/sitemap/${l.code}</loc>`,
              `    <lastmod>${lastmod}</lastmod>`,
              `  </sitemap>`,
            ].join("\n"),
          )
          .join("\n");

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          sitemaps,
          `</sitemapindex>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});

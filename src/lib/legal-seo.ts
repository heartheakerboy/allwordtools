/**
 * SEO head builder for legal / company pages.
 * Produces title, description, canonical + hreflang alternates, Open Graph,
 * Twitter Card, plus BreadcrumbList and WebPage JSON-LD schema.
 *
 * Locale-aware: pass `locale` for a prefixed page (e.g. "es") and the canonical,
 * og:url and hreflang alternates are generated for that language. English (the
 * default) is served at the root with no prefix.
 */
import { buildLocaleHead, inLanguage } from "@/i18n/seo";
import { localePath } from "@/i18n/paths";
import { DEFAULT_LOCALE } from "@/i18n/locales";

const SITE = "AllWordTools.com";

export function legalHead({
  title,
  description,
  path,
  crumb,
  locale = DEFAULT_LOCALE,
}: {
  title: string;
  description: string;
  path: string;
  crumb: string;
  locale?: string;
}) {
  const fullTitle = `${title} — ${SITE}`;
  const { meta, links } = buildLocaleHead({ path, locale, title: fullTitle, description });
  const home = localePath(locale, "/");
  const url = localePath(locale, path);

  return {
    meta,
    links,
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          inLanguage: inLanguage(locale),
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: home },
            { "@type": "ListItem", position: 2, name: crumb, item: url },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: fullTitle,
          description,
          url,
          inLanguage: inLanguage(locale),
          isPartOf: { "@type": "WebSite", name: SITE, url: home },
        }),
      },
    ],
  };
}

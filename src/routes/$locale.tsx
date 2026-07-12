// ============================================================================
// /$locale — layout route for every non-default (prefixed) language.
//
// • beforeLoad validates the locale (unknown / disabled / default -> notFound).
//   English is served at the root WITHOUT a prefix, so /en is intentionally 404.
// • loader lazy-loads + caches the locale's dictionary (SSR-correct).
// • component nests an I18nProvider with the active language and applies text
//   direction (RTL/LTR) to the subtree + <html> for a11y and correct layout.
// ============================================================================

import { useEffect } from "react";
import { createFileRoute, Link, notFound, Outlet } from "@tanstack/react-router";
import { I18nProvider } from "@/i18n/I18nProvider";
import { getDictionary, enDictionary } from "@/i18n/getDictionary";
import { DEFAULT_LOCALE, getDirection, getLocale, isRtl } from "@/i18n/locales";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/$locale")({
  beforeLoad: ({ params }) => {
    const cfg = getLocale(params.locale);
    // Unknown, disabled, or the default locale (which lives at the root) -> 404.
    if (!cfg || !cfg.enabled || cfg.code === DEFAULT_LOCALE) {
      throw notFound();
    }
  },
  head: ({ params }) => ({
    // Automatically load an Arabic-capable webfont for RTL languages.
    links: isRtl(params.locale)
      ? [
          {
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap",
          },
        ]
      : [],
  }),
  loader: async ({ params }) => {
    const dictionary = await getDictionary(params.locale);
    return { locale: params.locale, dictionary };
  },
  component: LocaleLayout,
  notFoundComponent: LocaleNotFound,
});

// Rendered for unknown locales or unmatched localized paths. Wraps its own
// English I18nProvider so the shared Header/Footer (which call useI18n) work
// even when the layout provider above did not mount (locale rejected in
// beforeLoad).
function LocaleNotFound() {
  return (
    <I18nProvider locale={DEFAULT_LOCALE} dictionary={enDictionary}>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
          <h1 className="font-display text-3xl font-semibold">Page not found</h1>
          <p className="mt-3 text-muted-foreground">
            We couldn't find that page. Explore our word tools instead.
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link to="/">Back to home</Link>
          </Button>
        </div>
        <Footer />
      </div>
    </I18nProvider>
  );
}

function LocaleLayout() {
  const { locale, dictionary } = Route.useLoaderData();
  const dir = getDirection(locale);

  // Keep the document element in sync for screen readers + global CSS.
  useEffect(() => {
    const el = document.documentElement;
    const prevLang = el.lang;
    const prevDir = el.dir;
    el.lang = locale;
    el.dir = dir;
    return () => {
      el.lang = prevLang || DEFAULT_LOCALE;
      el.dir = prevDir || "ltr";
    };
  }, [locale, dir]);

  return (
    <I18nProvider locale={locale} dictionary={dictionary}>
      {/* dir on the wrapper guarantees correct direction even before hydration. */}
      <div
        dir={dir}
        lang={locale}
        data-rtl={isRtl(locale) ? "true" : undefined}
        style={
          isRtl(locale)
            ? { fontFamily: "'Noto Naskh Arabic', 'Plus Jakarta Sans', system-ui, sans-serif" }
            : undefined
        }
      >
        <Outlet />
      </div>
    </I18nProvider>
  );
}

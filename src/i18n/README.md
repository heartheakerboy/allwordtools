# Internationalization (i18n) Architecture

Enterprise multi-language foundation for AllWordTools. Designed to scale from
1 to 50+ languages and hundreds of thousands of SEO pages **without codebase
changes** — adding a language is a data operation, not an engineering one.

> Stack note: this project runs on **TanStack Start** (file-based routing +
> `head()` + server routes), not Next.js. The i18n _strategy_ matches the
> standard App-Router approach; the implementation is TanStack-native.

## URL model

The default language (**English**) is served WITHOUT a prefix; every other
enabled locale lives under its code — the Google-recommended pattern:

```
en  ->  /            /tool/word-unscrambler     /category/word-games
es  ->  /es          /es/tool/word-unscrambler  /es/category/word-games
ar  ->  /ar          /ar/tool/word-unscrambler  (RTL)
```

`/en` is intentionally a 404 (no duplicate content) — hreflang maps English to
the root + `x-default`.

## Folder structure

```
src/i18n/
  locales.ts            # Registry: THE source of truth for every language
  getDictionary.ts      # Lazy + cached dictionary loader (English bundled)
  I18nProvider.tsx      # React context + useI18n(): t(), dir, Intl formatters
  detectLocale.ts       # Browser detection + persistence (never forces redirects)
  paths.ts              # localePath(), stripLocale(), switchLocalePath(), slugs
  seo.ts                # buildLocaleHead(): hreflang, canonical, og, JSON-LD lang
  content.ts            # Localized content overrides (CMS-ready seam)
  dictionaries/
    en.json es.json hi.json ar.json   # UI strings, one file per language

src/routes/
  $locale.tsx           # Locale layout: validate, load dict, RTL, provider
  $locale.index.tsx     # Localized homepage (reuses home sections)
  sitemap[.]xml.ts      # Sitemap INDEX (one child per locale)
  sitemap/$locale.ts    # Per-locale sitemap with per-URL hreflang alternates

src/components/site/LanguageSwitcher.tsx   # Premium searchable switcher
```

## Adding a new language (zero code changes)

1. In `src/i18n/locales.ts`, set the locale's `enabled: true` (or add an entry).
2. Add `src/i18n/dictionaries/<code>.json` (copy `en.json`, translate values).
3. Register its loader in `getDictionary.ts` `LOADERS` (one line).

That's it. The switcher, hreflang, per-locale sitemap, RTL/fonts, and routing
all pick it up automatically.

## Translation model

- All UI strings live in `dictionaries/*.json`, never hardcoded in components.
- `useI18n().t("nav.home")` resolves the active locale, falls back to English
  for any missing key, and interpolates `{vars}` (e.g. `t("nav.viewAll", { count })`).
- English is the canonical key set.

## Localized content (FAQs, meta, intros, examples)

`src/i18n/content.ts` merges per-locale overrides over the English base with
automatic fallback. A future admin panel / headless CMS writes into these maps
(`TOOL_OVERRIDES`, `CATEGORY_OVERRIDES`) — no code change to localize content.
Content is localized, never machine word-for-word.

## SEO

`buildLocaleHead()` emits, per page, per locale:

- self-referencing `canonical` + `og:url`,
- `hreflang` alternates for every enabled locale + `x-default` → English,
- localized `og:locale` (+ `og:locale:alternate`), title, description, Twitter,
- JSON-LD with `inLanguage`.

Sitemaps: `/sitemap.xml` is an index pointing at `/sitemap/<locale>`, each of
which lists that locale's URLs with `xhtml:link` hreflang alternates.
`public/robots.txt` advertises the index. Paths are relative (no domain yet) so
they resolve correctly once a custom domain is attached.

## RTL, fonts, accessibility

- `locales.ts` marks each language `ltr`/`rtl`. The `$locale` layout sets
  `dir`/`lang` on both the subtree wrapper (SSR-correct) and `<html>` (a11y),
  and auto-loads an Arabic-capable webfont (Noto Naskh Arabic) for RTL.
- Tailwind logical utilities handle most mirroring automatically.

## Detection & switching

- Detection order: saved preference (cookie/localStorage) → browser languages
  → English. Detection NEVER force-redirects; it only informs the switcher.
- The switcher supports search, native names, flags, pinned + recently-used,
  persists the choice, and navigates to the same page in the new locale.

## Performance

- English dictionary is bundled (instant SSR + default site); every other
  locale is `import()`-ed on demand and cached — no page ships more than one
  language's strings.

## Roadmap (built on this foundation, no architecture change)

- Localized long-form content per tool/category (human or AI-generated) via
  `content.ts`.
- Localized slugs via `LOCALIZED_SLUGS` in `paths.ts`.
- Locale-prefixed variants of the remaining page types (tool, category, legal,
  blog) follow the exact pattern of `$locale.index.tsx`.
- Admin panel / CMS writing dictionaries + content overrides at runtime.

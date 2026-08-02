---
category: "content/post-management"
tags: ["posts", "routing", "urls", "seo"]
published_at: "2026-08-14T09:00:00.000Z"
---


Routing and URLs
================

Every post on the public site has a canonical URL — the single
"official" address search engines index and readers bookmark.
Multi-locale sites have one canonical URL per locale (`/cs/…`,
`/en/…`, `/de/…`), each derived from the article's title in that
language. This article covers how those URLs are generated, how you
can override them, how the platform keeps translations in sync
with routes, and how to recover from broken or missing routes.

## The one-URL-per-locale rule

For every article and every locale it is translated to, there is
one canonical route. That means:

- A three-locale organisation with a hundred articles has three
  hundred canonical routes.
- A single-locale organisation with a hundred articles has a
  hundred canonical routes.
- An article deleted (soft-deleted) still has its routes in
  place — they return "not found" for anonymous readers but can
  be resurrected on restore.

Canonical means: the URL that appears in the `<link rel="canonical">`
tag on the article page, in the sitemap, in the RSS feed, in
OpenGraph metadata, and in the public API response. Non-canonical
routes (redirects from renamed slugs, alternative aliases) can
also exist, but every article has exactly one canonical route per
locale.

## Automatic slug generation

When you save a translation of an article for the first time, the
platform generates a URL slug automatically from the title:

- Lowercase the title.
- Strip diacritics (`ě → e`, `ř → r`, `ý → y`, `ç → c`).
- Replace spaces and punctuation with hyphens.
- Collapse multiple hyphens.
- Trim trailing or leading hyphens.

For a Czech article titled `Jak založit objednávku přes API`, the
Czech slug becomes `jak-zalozit-objednavku-pres-api`. Its English
translation `How to create an order via the API` becomes
`how-to-create-an-order-via-the-api`. Each slug is per-locale — you
never share a slug across languages.

The generated slug is then combined with a locale prefix to form
the full URL:

    /cs/jak-zalozit-objednavku-pres-api
    /en/how-to-create-an-order-via-the-api

## Uniqueness

Slugs must be unique per (organisation, locale). If a generated
slug collides with an existing one, the platform appends a numeric
suffix (`-2`, `-3`, …) until a free slug is found. This is silent
— you can end up with `how-to-create-an-order-via-the-api-2` when
you didn't intend to. Check the URL after saving a new post and
override if the suffix looks wrong.

## Manual slug editing

You can override the auto-generated slug in the post detail →
**Routing** section (available in some site themes) or via the
category-specific slug settings. Manual edits follow the same
rules as auto-generated slugs (lowercase, hyphen-separated,
ASCII-only), but you can choose the exact wording.

**Important:** changing a slug rewrites the canonical URL. Anyone
who bookmarked or externally linked to the old URL will land on
a "not found" page unless the platform has a redirect from the
old slug to the new. Redirects are auto-created for a rename, but
only when done through the admin — bulk editing via the [Git
workflow](/post-git-workflow) does not currently generate
redirects for slug changes.

Rename slugs sparingly, and only when the SEO or usability
benefit outweighs the redirect cost.

## Locale prefixes

The public site inserts the locale prefix (`/cs/`, `/en/`, …)
automatically. You do not include it in the slug itself. When you
share an article internally, always share the full locale-prefixed
URL — omitting the prefix causes the site to guess the reader's
locale, which may not match what the sharer intended.

For the reader's browsing experience, the site attempts to serve
the article in their preferred locale (from their session or
browser settings), falling back to the primary locale if the
requested translation is missing.

## Translation flow interaction

Whenever the auto-translate flow creates a new translation for a
target locale (see [Translations](/post-translations)), it also
creates the canonical route for that locale if one does not exist.
You do not have to do anything — the two operations happen
together.

Two failure modes are worth knowing about:

- **Route without a translation** — orphan route. Left behind
  when a translation is deleted from the DB but the route
  survives. Harmless in isolation, but the slug is now
  reserved and cannot be reused by a new post.
- **Translation without a route** — the article has a translation
  row but the canonical route was never created (usually because
  an older bulk-import script wrote the content but skipped
  routing, or a translate run crashed after saving content but
  before creating the route). The translation is not reachable
  from the public site.

The **Translations** tab on `/post` surfaces both cases in the
per-locale table: **Routes** shows how many canonical routes
exist for the locale; **Orphan routes** highlights the count of
routes without a matching translation.

## The `fix-routes` action

To heal broken routes for existing translations, use the **Fix
routes** button on the Translations tab, or run `post fix-routes`
in the admin terminal.

The command:

1. Scans every post in the organisation.
2. For each translation that exists but has no canonical route,
   generates a slug from that translation's title and creates the
   route.
3. Skips articles where every existing translation already has a
   route (idempotent).
4. Reports what it created in a summary table.

Cheap operation — no AI calls, purely a metadata pass — safe to
run whenever you suspect route drift. See
[Translations](/post-translations) for the full terminal command
model.

## Categories in URLs

Categories are addressed separately from articles. A category's
URL is `/{locale}/category/{category-slug}` — for example
`/cs/category/sales`. Articles do NOT include their category in
the URL — the article URL is `/{locale}/{article-slug}` with the
category served purely as taxonomy metadata.

Moving an article between categories does not change its URL. If
you rename a category, only the category-page URL changes, not
the article URLs of its members.

See [Post categories](/post-categories) for the category URL
lifecycle.

## RSS and sitemap

Every canonical route is included in:

- **The XML sitemap** at `/sitemap.xml` — one entry per (post,
  locale) combination. Search engines use this to discover
  articles. Regenerated automatically on every save.
- **The RSS feed** at `/rss` or `/{locale}/rss` — items sorted by
  publication date, respecting visibility (private, unlisted,
  and subscribe-only posts are excluded).
- **Category-specific RSS** at `/{locale}/category/{slug}/rss` —
  same shape as the site-wide RSS but filtered to one category.

Non-canonical URLs (redirects, aliases) are not included in
either — search engines follow the redirect and index the
canonical.

## SEO considerations

The URL matters for SEO. A few guidelines:

- **Keep slugs short.** 40–70 characters is a healthy range. Very
  long slugs (`the-comprehensive-and-detailed-guide-to-what-you-
  should-know-about-…`) are trimmed by search engines in
  results.
- **Include the primary keyword.** The slug is one of many
  ranking signals; putting the article's main topic in it helps.
- **Avoid stopwords when they add no meaning.** `article-about-x`
  is better as `x`.
- **Do NOT rename slugs after publication** unless the SEO benefit
  is clear. The redirect preserves link equity, but there is
  always some loss when the URL changes.

## What is exposed to integrators

The public API returns:

- **`code`** on the post — the URL slug portion (without locale
  prefix). Use this when constructing URLs client-side.
- **`canonicalUrl`** on the post detail — the fully-qualified URL
  as it appears on the public site, including the locale prefix.
- **`routes`** on the post detail — the full per-locale route
  table, so an integrator building a language-switcher can point
  at the equivalent article in every locale.

See [API integration](/post-api-integration).

## Tips

- **Watch out for silent numeric suffixes.** After creating a new
  post with a common title, open the article page or the API to
  confirm the URL is what you expected. `-2`, `-3`, `-4` in the
  slug means an older article claimed the plain slug.
- **Do not include the locale in your slug** — the platform adds
  it. A slug like `en-how-to-do-x` produces the double-prefixed
  URL `/en/en-how-to-do-x`.
- **Redirect chains kill SEO.** If you rename a slug, then rename
  it again, the second rename creates a chain (`old-1 → old-2 →
  current`). Search engines follow one hop willingly and two hops
  reluctantly. Flatten manually if you can — repoint the older
  redirect to the current slug directly.
- **Route heal is idempotent** — running `post fix-routes` when
  nothing is broken is a no-op. Do not hesitate to run it after
  any bulk operation (Git import, translate run, category
  restructure) as a hygiene check.

## Related

- [Post management overview](/post-management)
- [Translations](/post-translations) — the route generator that
  runs during auto-translate.
- [Post categories](/post-categories) — for category URL
  lifecycle.
- [Post editor](/post-editor)
- [API integration](/post-api-integration) — for how routes are
  exposed to integrators.
- [Git workflow](/post-git-workflow) — for bulk edit implications
  on routing.

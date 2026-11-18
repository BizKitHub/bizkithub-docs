---
id: "JO5C15Y6Vo75f4o2"
category: "content/post-management"
tags:
  - "posts"
  - "search"
  - "fulltext"
published_at: "2026-08-02T17:11:10.179Z"
---


Search
======

The article grid on `/post` has a search field at the top of the toolbar. Typing in it filters the grid live to articles matching the query — matching against the article title, body content, and perex simultaneously, without regard to accent characters, and across any of the currently-selected language.

The same search machinery powers the public site's search box (when enabled by the theme) and the search parameter on the public API. Understanding how it behaves helps you write more findable articles and helps operators diagnose "why doesn't my search find this post?" questions.

## What it searches

Every search query is matched against three fields at once, per article:

- The article **title**.
- The article **body content**.
- The article **perex** (short summary).

Matches in any of the three count as a hit. There is no per-field scoring in the admin grid — an article whose title contains the query and an article whose body contains the query both appear. The public site's search may weight matches differently depending on the theme.

## Accent-insensitive matching

The search collapses accented characters to their base form before comparing. Searching for `cesta` matches articles containing `cesta`, `česta`, `čéstá`, and so on. This works both ways: searching `česta` matches articles containing `cesta`.

Practical implications:

- Czech and Slovak content is easily searchable by readers who type without diacritics (mobile keyboards, non-native speakers).

- Product names with intentional accents (`Renée`) are still findable when typed as `renee`.

- The matching applies uniformly across every language in the organisation.

## Substring, not word-boundary

The search matches substrings, not whole words. Searching for `ana` returns articles containing `banana`, `analyst`, `plánování`, and so on. This is deliberate — it catches partial words as the reader is still typing, and works for compound words that vary in form across languages.

The trade-off is that very short queries produce a lot of noise. Consider three or more characters as a healthy minimum. The search input does not filter until at least a couple of characters are typed.

## Multi-word queries

A query with multiple words (space-separated) is treated as multiple substrings that must ALL match. `order api` returns articles that contain both `order` AND `api` somewhere in title, body, or perex — not necessarily adjacent.

This lets you combine terms to narrow: `payment gateway stripe` finds only articles that touch all three topics. Ordering does not matter.

## Language scope

The search matches against the currently-selected content language in the admin. If you have Czech and English translations for an article, searching in the Czech grid matches only the Czech content, and searching in the English grid matches only the English content.

To search across all languages, use the API with an unspecified locale parameter — it searches every language and returns any article with a matching translation in any locale.

## The grid's fulltext filter

In the admin grid, the search field is one of several filters combined together. Type into the search field and it narrows the current view; combine with the status, visibility, tag, and missing-translation filters to arrive at a specific slice.

The filter operates in real time. As you type, the grid re-fetches matching results with a short debounce so a typing burst does not overload the server.

## API-side search

The public API exposes the same search primitive through the `filterFulltextQuery` parameter on `/api/v1/post/list`. Supply a query string and receive articles that match on title, body, or perex in the requested locale. See [API integration](/api-integration) for the endpoint contract.

## What is NOT searched

- **Tags** — searching for a tag code does not find articles carrying that tag. Use the tag filter instead.

- **Categories** — same. Use the category filter or the category URL.

- **Authors** — searching for an author's name does not find their articles. Filter by author instead (available on the API).

- **Comments** — comments live on their own tab and are not part of the article search.

- **Attachment filenames** — the search does not open attached files. Only text you have entered into the article body, perex, or title is indexed.

- **Custom metadata** — the key–value list on the post is not searched.

If you want an attribute like a tag, author, or category to be searchable via the search field, add it into the article body or perex explicitly.

## Writing findable articles

- **The title is your strongest search signal.** The public search ranks a word in the title above the same word anywhere else, followed by section headings. Include the words a reader would actually type, and give sections descriptive headings so deep links land well.

- **Use the perex for synonyms.** The primary keyword goes in the title, but a variant phrasing in the perex catches searchers using different vocabulary. "Migrating from Stripe to GoPay" in the title, "payment gateway migration" in the perex.

- **Do not stuff keywords.** Repeated mentions in the body add only a small, capped bonus. Piling keywords into the body barely moves an article up the results and makes it annoying to read; a clear title and section headings work far better.

- **Search-test your own articles after publication.** Search for the words a reader would use and check that your article appears. If not, adjust the title or perex to include them.

## Public-site search

The public site's search box and the public search endpoint (`/api/v1/post/search`) share one engine. The admin grid filter described above stays a plain substring filter; the public search is a relevance-ranked search built for readers:

- Searches the visitor's locale, excludes private, unlisted and archived posts, and respects the subscribe-only rule.
- **Word-prefix matching.** Each word of the query must start a word in the article: `invoic` finds "invoices", but `api` does not match "kapitola". Accents and letter case are ignored.
- **Inflection.** Czech and English word forms used in your content are matched together: `faktury` also finds "faktura" and "fakturu", `invoices` finds "invoice".
- **Ranking.** A word in the title counts most, then a section heading, the category or a tag, the perex, and finally the body. Articles containing every word come first; a short title made of the query words (the topic's overview page) wins.
- **Typo correction.** A word that appears nowhere in your content is corrected to the closest word that does (`vouchr` → "voucher"). The response reports it in `didYouMean`, and `autoCorrected: true` when the results already use the correction.
- **Other languages.** When nothing matches in the requested locale, the search looks at the other translations and returns the matching articles in the requested language where a translation exists (`crossLocale: true`).
- **Section deep links.** When the words occur in one section of a long article, the hit carries `section` (heading and anchor id) and the snippet is cut from that section.
- **Filtering and paging.** `mainCategory` restricts the search to a category and its subcategories, `facets` lists the categories of all matches with counts, and `offset` with `limit` pages through the results.

Organisations with a very large archive (over roughly 1,500 article translations) use a simpler substring search without typo correction, sections or facets.

## Tips

- **Use quotes for exact-order phrases.** Some public-site themes support quoted queries (`"exact phrase"`) that treat the whole string as one substring. The admin grid does not — quotes are treated as literal characters, which usually returns zero hits.

- **Search from the RSS feed.** If a reader arrives via RSS with a specific phrase they want to find more articles about, share the search URL (`?q=phrase`) directly.

- **Combine with the tag filter.** Fulltext search on a category page or tag page produces a much shorter, more relevant result set than site-wide search. Deep-link both filters together.

## Related

- [Post management overview](/post-management-overview)
- [Post editor](/post-editor)
- [Post categories](/post-category-overview) — for taxonomy-based filtering that complements search.

- [Tags](/tags)
- [API integration](/api-integration)

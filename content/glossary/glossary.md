---
code: "glossary-overview"
category: "content"
tags: ["type-overview", "glossary", "api"]
published_at: "2026-11-24T00:00:00.000Z"
---


Glossary
========

The **Glossary** module keeps a dictionary of terms with their definitions, abbreviations, aliases and links between related terms. You write the terms once in the administration, and your website reads them through the public API to build an A to Z glossary, category pages, a "term of the day" block and links between related entries.

Each term can have its own wording in every language of your organisation, and each translation gets its own URL slug automatically. Terms are either **Public** (served to your website) or **Private** (kept in the administration only, for example while you are still writing them).

## When you would use it

- Publish a glossary of industry terms on your website, for example a cyber-security dictionary with entries such as `AES`, `TLS` or `Phishing`.
- Explain abbreviations used in your products, contracts or documentation in one central place.
- Show a random term on the homepage and avoid repeating the same term in one visitor session.
- Group terms into categories such as *Cryptography* or *Network security* and render a category tree in the website navigation.
- Prepare new terms as private drafts and publish them once the definitions are reviewed.

## Where to find it in the admin

Open **Glossary** in the main menu of the administration. The page has two tabs: **Terms** and **Categories**.

## Core concepts

### Term

A term is one entry in the glossary. Each language version of a term holds:

| Field | Meaning |
|---|---|
| **Term** | The main label as it should appear in this language. Required. |
| **Abbreviation** | The short form, if any, for example `TLS`. Optional. |
| **Definitions** | One or more definition texts. Each definition can have an optional **Source**, for example the field it comes from or a related term. |
| **Aliases** | Alternative names for the same thing. They are not separate terms; they help search. |
| **Cross references** | Free-text pointers to other terms. When the text matches an existing term, the platform links it automatically. |
| **Notes** | Supplementary text shown after the definitions, written in Markdown. Use it to explain when the term applies, or for a longer article about the term. |
| **SEO title** and **SEO description** | Search-engine metadata for the term page. |

Settings shared by all languages are **Visibility**, **Category**, **Pinned** and **Code**. **Code** is an optional identifier for importers, for example the slug of the term in the default language. **Pinned** terms are listed first in the administration.

### Visibility and publication

| Visibility | Effect |
|---|---|
| `Public` | The term is served by the public API and appears in the sitemap feed. |
| `Private` | The term exists only in the administration. The public API never returns it. |

When a term becomes public for the first time, or switches from private to public, the platform stamps the publication date with the current time. Switching a term back to private clears the publication date.

### Category

Categories form a tree: each category can have a **Parent category**. A category has a **Name**, a **Description**, an **SEO description**, an **Order** that sets its position among siblings, and an **Active** switch. Only active categories are served by the public API. Deleting a category moves its terms to *no category*; the terms themselves are kept.

### URL slugs

When you save a term, the platform generates a canonical URL slug from the term text for each language of your organisation. The term detail lists them under **URL slugs**, for example `[en] public-key-infrastructure`. Your website uses the slug to load a term, and the API returns the slugs of all languages so the website can link translations to each other.

## Creating a term

1. Open **Glossary** and click **New term**.
2. Fill in **Term**, optionally the **Abbreviation**, choose the **Visibility** and the **Category**, and confirm with **Create term**.
3. In the term detail, add one or more definitions with **Add definition**.
4. Add **Aliases** and **Cross references** if the term has alternative names or closely related entries.
5. Write **Notes** if the term needs more explanation than the definitions provide.
6. Click **Save term**.

To translate a term, open its detail and click **Add translation**, then pick a language. A new tab, for example `DE locale`, opens with empty fields. Translations are written by hand; the glossary does not translate terms automatically. In the term list, the **Translations** column shows which languages a term has, and the **Definitions** column shows how many definitions it has in the active language. A term with zero definitions is usually still work in progress.

## Deleting and restoring a term

**Delete term** removes the term from the public site and from the list, but keeps it in the trash. Open a deleted term and click **Restore term** to bring it back with all its translations, definitions and links.

## How related terms are chosen

The public term detail includes up to 50 related terms. The platform combines three signals, in this priority:

1. **Cross references.** Terms the source term points at, and terms that point at the source term.
2. **Same category.** Other public terms in the same category.
3. **Sibling category.** Terms in categories that share the same parent.

A term without a category gets only cross-referenced related terms. To link two terms explicitly, add a cross reference on either of them; the link works in both directions.

## Using the glossary on your website

Your website reads the glossary through the public API with an [API key](/api-key-overview). Every endpoint takes a `locale` parameter and returns only public, published terms. All endpoints are listed in the [API explorer](/swagger).

| Endpoint | Purpose |
|---|---|
| `GET /api/v1/glossary/list` | Paginated term list. Filters: `search` (term, abbreviation and notes, accent-insensitive), `categoryId` or `categorySlug`, `letter`. `sort` is `alphabetical` (default), `newest` or `updated`. `limit` defaults to 50, maximum 500. |
| `GET /api/v1/glossary/detail` | One term by `slug`, with definitions, aliases, cross references, notes as Markdown and as HTML, slugs in all languages, the category and related terms. |
| `GET /api/v1/glossary/alphabet` | One row per starting letter with the number of terms. Accented letters are folded and digits are grouped under `#`. |
| `GET /api/v1/glossary/random` | One random term with a definition preview of up to 240 characters. Pass `exclude=id1,id2` to skip terms already shown. |
| `GET /api/v1/glossary/related` | Terms linked to a term by cross references, with `direction` set to `outgoing`, `incoming` or `both`. `limit` defaults to 20, maximum 100. |
| `GET /api/v1/glossary/category/list` | Flat list of active categories with `parentId` and the number of public terms. |
| `GET /api/v1/glossary/category/tree` | The same categories arranged as a nested tree. |
| `GET /api/v1/glossary/category/detail` | One category by `slug`, with its breadcrumb and a page of its terms. Subcategories are not merged in. |
| `GET /api/v1/glossary/sitemap` | Every public term and category URL with its last modification date, for your `sitemap.xml`. |

### Example: an A to Z page

Load the letter bar first, then the terms for the selected letter:

```bash
curl "https://api.bizkithub.com/api/v1/glossary/alphabet?apiKey=YOUR_API_KEY&locale=en"
```

```json
{
  "items": [
    { "letter": "A", "termCount": 14 },
    { "letter": "B", "termCount": 6 },
    { "letter": "#", "termCount": 2 }
  ]
}
```

```bash
curl "https://api.bizkithub.com/api/v1/glossary/list?apiKey=YOUR_API_KEY&locale=en&letter=A&limit=50"
```

Each item carries the `slug` for the requested language, so you can link to the term page without another request.

### Example: a term that does not exist

When the slug does not match a public term in the requested language, the detail endpoint returns HTTP 200 with an error envelope:

```json
{ "state": "error", "message": "Glossary term \"aes-256\" was not found.", "code": 200, "hint": null }
```

Return a 404 page on your website in this case. The same envelope is returned by `random` when the language has no public terms, and by `category/detail` for an unknown category slug.

## Related

- [Posts](/post-management-overview): long-form articles that can link to glossary terms.
- [Markdown](/markdown-overview): the syntax used in term notes.
- [API keys](/api-key-overview): the key your website uses to read the glossary.

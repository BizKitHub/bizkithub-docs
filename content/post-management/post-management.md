---
id: "d4i21CrECN9V2yKs"
category: "content/post-management"
tags:
  - "posts"
  - "overview"
  - "content"
published_at: "2026-04-07T15:18:08.877Z"
---


Post management
===============

The **Posts** module is where an organisation writes and administers its long-form content — blog articles, help pages, product write-ups, release notes, and anything else that is authored once and read many times. It lives at `/post` in the admin dashboard and behaves as the editorial hub: you land there to write a new article, to check what needs translating, to moderate reader comments, or to reorganise the category tree that navigates the public site.

This overview article describes what the module contains, how the sub-tabs are organised, and where to go next depending on what you are trying to do. Every deeper topic — the editor itself, translations, versioning, imports, the public API — has its own focused article you can jump to from the links throughout this page.

## What the module does

At the highest level, the Posts module gives an editorial team three things:

1. **A place to write and publish articles.** Rich-text authoring with

markdown, images, attachments, per-locale versions, scheduled publication, and a lightweight history of every save.

2. **A place to organise them.** Category tree, tags, main author +

contributors, main image, SEO metadata, reader-facing URLs.

3. **A place to operate on them at scale.** Bulk publish or delete,

automatic translation across every enabled language, GitHub-backed import/export of the whole content library, and admin analytics on how many articles are translated, stale, or missing per locale.

Everything on the public website — the article page, the category archive, the RSS feed, the sitemap, the search index — is populated from what you enter here. The public REST API also exposes the same posts under `/api/v1/post/*` for integrators who want to embed the content in another product.

## Where to find it

Open the admin dashboard and click **Content → Posts** in the left navigation. The module opens with five tabs across the top:

| Tab | Purpose |
| ---------------- | -------------------------------------------------------------------------- |
| **Posts** | The article grid — list, filter, search, open, or edit individual posts. |
| **Categories** | Manage the hierarchical category tree used to organise articles. |
| **Tags** | Manage the flat colour-coded tag library. |
| **Comments** | Cross-post view of every reader comment for moderation. |
| **Translations** | Admin analytics for multi-locale coverage, plus one-click repair tooling. |

You can also open a single post directly at `/post/{postId}` — every row in the grid links to that URL.

## The article grid at a glance

The **Posts** tab is the starting point for most work. It renders every article in the organisation with:

- **Thumbnail** of the main image (or a placeholder if none is set).
- **Title** with the star indicator for featured articles, plus the

colour-coded tags assigned to the post.

- **Status pill** (draft, scheduled, published, private, archived) with

the underlying visibility (public, private, unlisted, subscribe).

- **Main category** (linked to the category detail).
- **Main author.**
- **Word count** with reading time on hover.
- **Comments count.**
- **Views** with a rolling-window trend arrow (green = up, red = down,

neutral = flat) — see [Views and analytics](/post-views-and-analytics).

- **Reader rating** (1–5 star average) when the post has any feedback.
- **SEO health score** (0–100 pill) derived from title length, presence

of a perex, presence of a main image, and content length.

- **Publication date** and **last-edited date**, both relative

("3 days ago").

- **Per-locale badges** for every language enabled on the organisation

— green = fresh translation, amber = stale, grey = missing. See [Translations](/post-translations).

Filters at the top let you narrow by status, visibility, whether the post has a main image, tag, missing translation, and post kind. The grid auto-refreshes every 60 seconds so a collaborating team sees changes without reloading.

Right-clicking a row exposes an **Automatic translation** action (when the organisation has more than one locale enabled) and a **Delete** / **Restore** action. Selecting multiple rows shows a bulk-action bar — publish, unpublish, delete — see [Bulk actions](/post-bulk-actions).

## The four right-column actions

The top-right corner of the module carries four actions:

- **Import from Git** — pull a whole set of articles from a GitHub

repository. See [Git workflow](/post-git-workflow).

- **Export to Git** — download every article as a zip of markdown

files. Same article.

- **AI-suggested topics** — ask the platform to propose new article

ideas based on the current category coverage and what your competitors are publishing. See [AI tools](/post-ai-tools).

- **Add** — open the create-post modal. See [Post editor](/post-editor).

## What each tab does

### Posts

The article grid, described above. Most day-to-day editorial work happens here.

### Categories

The category tree with list and tree views. Rich-enough to describe in [its own article](/post-categories) — creating, moving, activating, deactivating, deleting categories; multilingual category names; the rules for parent-child integrity; and how AI-assisted categorisation reads the category descriptions.

### Tags

A flat library of colour-coded chips you can attach to any post. Tags cross-cut the category tree — a post lives in exactly one main category but can carry many tags. See [Tags](/post-tags) for tag creation, colour picking, per-locale labels, and how tags feed the grid filter.

### Comments

A cross-post moderation table. Every reader comment across every post is listed with the author name, email, comment text, target post, and date. Right-click to delete or restore. See [Comments and moderation](/post-comments).

### Translations

Analytics + tooling for multi-locale content. Shows how many articles are fully translated / partially translated / untranslated, per-locale coverage (fresh, stale, missing, orphaned routes), history coverage, and one-click actions to run bulk translation or route repair through the admin terminal. This tab is the operator's map of "what needs fixing across the whole organisation". Detailed in [Translations](/post-translations).

## The post detail page

Opening a post from the grid lands on `/post/{postId}` with four tabs:

- **Content** — the main editor. Title, perex, body, SEO fields, and

a right sidebar with status controls, category, authors, publication date, tags, custom metadata, view chart, and per-locale translation status. See [Post editor](/post-editor).

- **Gallery** — image library for the post, main-image selection,

ordering, lightbox preview, and AI image generation from the reference library. See [Gallery and images](/post-gallery-and-images).

- **Attachments** — file uploads that stay attached to the post (PDFs,

spreadsheets, downloadables). See [Attachments](/post-attachments).

- **History** — full revision log per (post, locale) with content

diffs, blob storage, restore-from-version, and the coalesce window that collapses same-author edit bursts. See [History and versioning](/post-history-and-versioning).

The header of the detail page also carries two direct actions:

- **Fact-check** — run the AI fact-checker on the article body.

See [AI tools](/post-ai-tools).

- **Export to PDF** — download the current post as an A4 PDF.

See [PDF export](/post-pdf-export).

## What lives outside this module but is related

Several adjacent modules touch what the Posts module produces. If you are looking for something and cannot find it here, check:

- **Categories** — [Post categories](/post-categories).
- **Public URLs and routing** — the slugs, canonical URLs, and per-locale

routing rules are covered in [Routing and URLs](/post-routing-and-urls).

- **Reader search on the public site** — indexed from the post body;

see [Search](/post-search).

- **Reader-facing feedback** — the 1–5 star rating widget at the bottom

of every article; see [Reader feedback](/post-reader-feedback).

- **Public REST API** — for integrators embedding content in another

product; see [API integration](/post-api-integration).

- **What's new / release notes** — those are just posts of a particular

kind; the module is the same, only the intent differs.

## Where to go next

- **Writing your first article?** Start with [Post editor](/post-editor).
- **Publishing schedule and visibility rules?**

[Visibility and lifecycle](/post-visibility-and-lifecycle).

- **Multi-language content?** [Translations](/post-translations) —

the single most feature-rich subtopic of this module.

- **Rolling back a bad edit?** [History and versioning](/post-history-and-versioning).
- **Bulk operations?** [Bulk actions](/post-bulk-actions).
- **Integrating from an external product?** [API integration](/post-api-integration).
- **Diagnosing missing translations or broken URLs?**

[Translations](/post-translations) and [Routing and URLs](/post-routing-and-urls).

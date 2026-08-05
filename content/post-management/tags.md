---
id: "1vm7Hi745ts1I5EK"
category: "content/post-management"
tags:
  - "posts"
  - "tags"
  - "taxonomy"
published_at: "2026-08-02T17:11:10.179Z"
---


Tags
====

Tags are colour-coded labels you can attach to any post. Unlike categories — where each article lives in exactly one branch of a tree — tags are flat, unlimited, and cross-cutting. A single article can carry as many tags as makes sense, and the same tag can appear on articles across every category.

Tags exist to let readers and editors filter articles by an attribute that does not fit the category tree. "Beta" cuts across categories; "sponsored" cuts across categories; "recipe" or "case-study" or "deprecated" all describe the *nature* of an article rather than its place in the taxonomy.

## Where to find them

Two places:

- **Post editor** — the sidebar has a **Tags** section on every post

where you assign or remove tags for that specific article.

- **Tags tab** on `/post` — the shared library where every tag in the

organisation is defined, coloured, and edited.

Editing a tag's label or colour in the library propagates to every post it is attached to. Removing a tag from the library removes it from every post at once (with a confirmation asking whether you're sure).

## Anatomy of a tag

Every tag has:

- **Code** — a URL-safe short identifier (lowercase, hyphens). Used

in URLs and filter parameters, and as a stable machine-readable identifier. The code is unique per organisation and rarely changes after creation.

- **Label** — the human-readable display name shown as the chip

text. Per-locale — you can have a Czech label, an English label, and so on. The active locale of the reader determines which label is shown.

- **Colour** — the background colour of the chip. Free-form hex

(`#e11d48`, `#3b82f6`, …); the platform picks a readable text colour automatically.

- **Internal flag** — when set, the tag appears only in the admin

and never on the public site. Use for internal editorial workflow labels like "needs review" or "author draft" that should not leak to readers.

- **Active flag** — inactive tags are hidden from the picker in the

post editor, but stay on any post they were already attached to. Use to retire a tag without losing history.

## Creating a tag

Two flows:

### From the Tags tab

Click **Add tag** in the Tags tab toolbar. A modal asks for the code, label, colour, and the internal flag. Save and the tag appears in the library immediately, ready to be attached to posts.

### Inline from the post editor

In the post editor's sidebar, click **+ Add tag** and then **+ New tag**. Fill in code, label, colour, save — the tag is created and attached to the current post in one action. This is the fastest way to introduce a tag that only became necessary while writing a specific article.

## Assigning tags to a post

In the post editor sidebar, the Tags section shows current tags as coloured chips with an ✕ button, plus an **+ Add tag** button. Click **+ Add tag** to open a searchable picker of the library; type to filter, click to attach. Click ✕ on a chip to detach.

Changes save inline — you do not have to click the main **Save** button to persist tag changes. Adding or removing a tag is a discrete action that lands immediately.

## Filtering the article grid by tag

The article grid on `/post` has a **Tag** filter in the toolbar. It lists every active tag in the library; picking one narrows the grid to articles carrying that tag. Combined with other filters (status, visibility, main image, missing translation, kind), the tag filter is the standard way to find articles by a cross-cutting attribute without scrolling through hundreds of rows.

## Public exposure

Tags marked **internal** are stripped from the public API and never appear on the public site.

For non-internal tags:

- **Article page** — the tags appear as a row of chips beneath the

title, matching the admin colours.

- **Category pages** — filter by tag via a query parameter or a

visible chip strip, depending on the site theme.

- **API** — the `/api/v1/post/*` responses include every non-internal

tag with its code, localised label, and colour.

- **RSS feed** — categorises each item by its non-internal tags.

See [API integration](/post-api-integration) for the exact response shape.

## Colours and design

Colours are meaningful. A tag scheme becomes noise fast if every tag is a random rainbow colour. Two guidelines:

- **Group by intent.** Reserve red for warnings ("deprecated",

"legal"), amber for editorial workflow ("draft", "needs review"), green for positive labels ("featured", "recommended"), grey for neutral labels ("guide", "reference"), and pick one theme colour for a series of related tags.

- **Fewer bright colours.** Two or three saturated colours (for

what matters) against many muted colours (for regular tags) reads better than a full-saturation carnival.

The colour picker accepts any hex string. Contrast against the tag text is calculated automatically — you can pick any background without worrying about legibility.

## Per-locale labels

For multi-locale organisations, each tag can carry a different label per language. Open the tag in the Tags tab, use the language switcher inside the modal, and edit the label for the current language.

The **code** is language-neutral (typed once, never translated). Labels are what readers see; codes are what filters, URLs, and integrations use.

If a locale is missing a label, the reader sees the organisation's primary-locale label as a fallback. Filling in translations for every locale gives a fully-localised chip strip on every language version of the public site.

## Retiring a tag

Two options depending on whether you want existing usages to disappear or stay:

- **Deactivate** — the tag stays attached to every post that carries

it, but is hidden from the post-editor picker (no more posts will be tagged with it). Perfect for "stop tagging new content with this label, but keep the historical taxonomy honest".

- **Delete** — the tag is removed from the library AND detached

from every post. A confirmation shows the number of affected articles. There is no undo.

Deleting is destructive by design — it exists for tags that were created by mistake and have no editorial value. For anything that was ever meaningful, prefer deactivation.

## Bulk tagging

There is no bulk-tag operation in the article grid. To attach the same tag to many articles, either:

- Filter to the relevant subset, open each in turn, and add the

tag via the sidebar (fast for a handful of articles).

- Use the [Git workflow](/post-git-workflow) — export, edit the

`tags:` frontmatter across many files, import back. Suitable for hundreds of articles at once.

## Tips

- **Codes are forever.** A code appears in URLs, filter parameters,

and integrations. Renaming a code breaks external links. Pick a well-formed code the first time.

- **Do not use tags for what belongs in categories.** A tag scheme

that ends up as a hierarchy in disguise ("technology", "technology →software", "technology→software→ai") is a category tree fighting to escape. Move it to the [Post categories](/post-categories) tree.

- **Deactivate before deleting.** If you are not sure whether a tag

is used, deactivate for a month, watch that nothing depends on it, then delete.

- **Do not proliferate.** Every tag you add is one more choice for

the reader. Twenty well-chosen tags almost always beat two hundred fuzzy ones.

## Related

- [Post editor](/post-editor)
- [Post categories](/post-categories) — for the hierarchical

taxonomy that tags complement.

- [Post management overview](/post-management)
- [API integration](/post-api-integration)
- [Git workflow](/post-git-workflow) — for bulk tag operations.

# INSTRUCTIONS — Editing Posts in this Repository

> **Two files, two concerns.** This file covers the **mechanics** — file
> format, frontmatter fields, the `id` invariant, round-trip semantics
> with the platform. For **content authoring** — voice, structure, what
> to write, what to avoid, section templates, coverage goals — read
> [`AUTHORING.md`](./AUTHORING.md). Read both before you write your first
> article; keep both open while you write.

## For humans

- Every post is a single `.md` file with a YAML frontmatter header, followed
  by two blank lines, then the title as a level-1 heading (underlined with
  `====`), then one blank line, then the Markdown body.
- The `id` frontmatter field is the immutable identifier the platform uses
  to match this file with its database row. **Do not change it.** If `id`
  is missing, the import will treat the file as a brand-new post and assign
  it a fresh identifier.
- The `code` field is the public URL slug and the idempotency key for
  external integrations. Change it to rename the route.
- The `category` field is a slash-separated path of category slugs (the same
  slugs that appear in the directory layout). Move a post between categories
  by updating this field, not by moving the file.
- The directory containing a file is a purely human-friendly organisation
  aid. It is ignored by the importer. You may reorganise directories any way
  you want without affecting the database.
- The title lives directly under the frontmatter as the underlined H1 — that
  is where the post title is edited. Do not add a `title:` field back into
  the frontmatter; it would be redundant with the H1 and ignored on import.

## For AI agents

When editing or creating posts programmatically:

1. **Read [`AUTHORING.md`](./AUTHORING.md) first.** It defines the writing
   contract — audience, voice, structure, section templates, confidentiality
   rules (no internal identifiers), coverage goals, anti-patterns. This
   file is only about the mechanical shape of the frontmatter and the
   round-trip.
2. Preserve the frontmatter block verbatim except for the fields you are
   changing. In particular, never remove or alter the `id` field.
3. When creating a new post, omit the `id` field (do not invent one). The
   import pipeline will assign a canonical identifier and write it back on
   the next round-trip export.
4. Use YAML flow strings (double-quoted, with standard JSON escapes) for any
   string that contains special characters. The exporter already emits values
   in this shape.
5. The body of the file is authored in the primary locale of the organisation
   (declared once in `README.md`, not per-file). Translations to other
   locales are re-derived from the primary locale on import — do not
   hand-translate here.
6. Media (images, attachments) is not exported. Reference existing media by
   its absolute HTTPS URL, exactly as the platform emits it. New media must
   be uploaded via the admin UI before it can be referenced from here.

## The `DOC:` workflow — capturing documentation during development

The user often needs to jot down a documentation-worthy fact in the middle of
unrelated work — a new field, a subtle constraint, an edge case that only
became clear after debugging. Instead of context-switching to open the right
article, decide the category, translate to English and match the house voice,
the user prefixes a short natural-language note with `DOC:` and the agent
handles the entire pipeline from raw note to committed article.

### Invocation

- User writes `DOC: <note in any language>` at the **start** of a prompt.
  A `DOC:` in the middle of a message is not a trigger.
- The note may be a sentence or a paragraph. It is the *intent to document*,
  not the final text.
- Multiple `DOC:` messages in one conversation = multiple independent
  documentation entries, potentially multiple commits.

### The pipeline, in order

1. **Strip internal context from the note.** Discard file paths, function
   names, PR references, table/column names, ticket IDs, "we just decided",
   "TODO", and any other conversational artifacts. Extract only the facts a
   public reader needs. If nothing publishable survives the strip, say so
   and stop — do not write a placeholder article.
2. **Rewrite in the docs voice.** The note is the raw intent; the article
   body is authored in English, in the voice contract defined by
   [`AUTHORING.md`](./AUTHORING.md) §§ 9–10. Translate and rewrite in one
   pass. **Never store the original note verbatim** — no HTML comments, no
   sibling files, no shadow frontmatter fields. This repo round-trips to a
   public docs site; anything committed may be published.
3. **Locate the right home for the content.** Run these checks in order,
   pick the first that fires:
   - **UPDATE an existing article** — `grep -Ri` the topic across the repo.
     If a clear primary hit exists in the exact matching module, and the
     addition keeps the article under ~2000 words, extend that article
     (add a subsection, extend a table, add a callout, refresh an outdated
     paragraph).
   - **CREATE a new article** — if no article covers this specific
     responsibility, or adding to any existing article would push it past
     ~2000 words, or the audience differs materially from the closest
     candidate (developer API vs. operator dashboard). Place it at
     `{department}/{module}/{article-slug}.md`; **omit `id`** in the
     frontmatter (the importer assigns one on the next round-trip).
   - **UPDATE multiple articles + cross-link** — if the fact applies to
     two orthogonal modules equally. Update the primary article in full,
     add a short one-paragraph cross-reference to each secondary article
     with a link back to the primary. Never spread the same fact across
     three or more articles as insurance.
4. **Apply the change** following every rule in `AUTHORING.md` — H1 shape,
   frontmatter fields, category path, link format (`/slug`, no `.md`, no
   `./`), § 16 review checklist, § 17 anti-patterns.
5. **Commit + push, or ask first.**
   - **Small change → automatic `git commit && git push` in `bizkithub-docs/`.**
     Small = extending a section, adding a sentence or a callout, fixing a
     paragraph, adding a link, editing a bullet list; anywhere from 1 to
     ~30 lines changed across at most 2 existing files, no structural
     change. Commit message format:
     `docs({category-slug-or-module}): <imperative one-line summary>`.
   - **Large change → summarise the plan, wait for approval, then commit +
     push once confirmed.** Large = creating a new article, rewriting
     >~200 lines, moving an article between categories, splitting or
     merging articles, removing content, or touching more than 3 files in
     one invocation.
   - **Auto-push is deliberate** for the small-change branch. The docs
     repo has no CI-gated deploy (the docs site reads the DB and the
     importer runs on the operator's schedule); committing without pushing
     would leave the note stranded on local disk.
6. **Only `bizkithub-docs/` is in scope.** If the note also implies a code
   change in `core` / `admin` / `frontend` / `docs`, flag it in the reply
   and stop — code changes follow the normal commit rules under a separate
   task.

### Update vs. new page — decision aid

| Signal in the note or in existing articles                                          | Suggests                                        |
| ----------------------------------------------------------------------------------- | ----------------------------------------------- |
| Topic name already appears in an existing article's H2 or H3                        | UPDATE that article                             |
| Note is a corollary, edge case, or refinement of a documented feature               | UPDATE (add a subsection or extend a table)     |
| An article's `## Related` section links to this concept as "coming soon"            | UPDATE (fill in the promised article by creating it) |
| Note is about a new module or a new top-level capability                            | CREATE new article                              |
| Existing article would exceed ~2000 words after the addition                        | CREATE new article and cross-link               |
| Audience differs from the closest article (dev API vs. operator dashboard)          | CREATE new article; keep audiences separated (AUTHORING § 8) |
| Note applies to two independent modules equally                                     | UPDATE both (primary in full, secondary with a short cross-reference) |
| No article, no obvious module — the topic feels orphaned                            | Ask the user which department to file it under before creating |

### What the agent must NOT do

- **Never store the raw source note.** Only the final English prose lives in
  the file. No `<!-- ORIGINAL: ... -->` comments, no frontmatter shadow
  fields, no sibling `.notes.md` files.
- **Never invent facts to fill a gap.** If the note is missing a piece the
  article needs (a limit value, a state name, an error code), omit that
  piece from the article or ask the user — do not guess.
- **Never hand-translate to `cs`, `de`, `pl`, `sk`.** Those locales are
  re-derived from the English source on import; see AUTHORING § 14.
- **Never touch the `id` field.** Preserve frontmatter verbatim except the
  fields you intentionally change; omit `id` only when creating a
  brand-new post.
- **Never commit anything outside `bizkithub-docs/` under the `DOC:`
  workflow.** The workflow is scoped to this repo only.

### When the note is ambiguous

If the note could reasonably land in two different articles or under two
different categories and no dominant primary hit exists, ask the user in
the reply — one question, offering the two candidates and your
recommendation. Do not silently pick one at random.

## Frontmatter fields

The frontmatter is deliberately minimal — only the fields that either
identify the post or are natural to edit from a text-editor context. Anything
missing (visibility, SEO overrides, perex, timestamps other than
`published_at`) stays under the admin's authority and is not touched by the
importer.

| Field           | Meaning                                                          |
| --------------- | ---------------------------------------------------------------- |
| `id`            | Immutable post identifier (16-char). **Never modify.**           |
| `code`          | Optional external integration code (unique per organisation).    |
| `category`      | Slash-separated category path (matches directory layout).        |
| `tags`          | Array of tag codes.                                              |
| `published_at`  | ISO date of first publication (null for drafts).                 |

The title lives directly under the frontmatter as the underlined H1 — that
is the single source of truth for the post title. The rest of the file is
the Markdown body in the primary locale.

## Round-tripping

An import is a full upsert against the primary locale. On conflict, the file
on disk wins — the database row is overwritten to match. Files removed from
the repository do NOT delete database rows; they simply become orphaned until
an operator explicitly opts into deletion. Fields that are not present in the
frontmatter (visibility, perex, meta_title, meta_description, etc.) are left
untouched in the database.

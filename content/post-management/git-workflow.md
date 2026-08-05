---
id: "rY0HqzP24Q9E9T4y"
category: "content/post-management"
tags:
  - "posts"
  - "git"
  - "import"
  - "export"
  - "markdown"
published_at: "2026-08-02T17:11:10.179Z"
---


Git workflow
============

Every post in the module can be exported as a Markdown file with a YAML frontmatter header, and a repository of such files can be imported back to populate an organisation's content. The full round- trip means you can edit content in a text editor, review changes as Git diffs, propose edits via pull requests, and script bulk changes across hundreds of articles with a text-processing tool of your choice.

This article covers the two directions (import and export), the Markdown file format, how the round-trip handles identity and conflicts, and the practical use cases where a Git-backed workflow outperforms the admin UI.

## When to use the Git workflow

Editorial workflows that suit Git:

- **Multi-person collaboration on the source of truth.** Reviewers

comment on line-level diffs before an article ships. Rejected edits are visible.

- **Bulk tagging or category reshuffles.** A single script edits

every `.md` file, one re-import lands the whole change.

- **Migration from another CMS.** Convert the source system's

export to the platform's Markdown format once, import, done.

- **Content backup.** A Git repository of every article is a

human-readable, version-controlled backup.

- **Prompt engineering.** The full corpus in one repo is a

natural source for AI-assisted editorial workflows outside the platform.

Editorial workflows that do NOT suit Git:

- **Single-article live editing.** The admin editor with real-time

save is faster and offers live previews.

- **Media management.** Images and attachments are not

round-tripped — the Git workflow only handles text.

- **Comments and reader feedback.** Reader-generated content is

not exported.

- **Fast experimentation.** The round-trip has some latency;

changes take a moment to propagate. For interactive editing, stay in the admin.

## Export

Click **Export to Git** in the top-right corner of `/post`. The platform:

1. Assembles every post in the organisation as a Markdown file

with a YAML frontmatter header.

2. Organises the files into folders that mirror the category

tree at the moment of export.

3. Adds a `README.md` (summary of the export — date, primary

locale, post count, category count).

4. Adds an `INSTRUCTIONS.md` (the mechanical rules for editing

the export).

5. Zips the whole set and offers it as a download.

The export is a snapshot. Once downloaded, it does not auto-refresh with subsequent admin changes — a new export produces a new zip.

### What is in each file

Each `.md` file has the shape:

```
---
id: "aBcDeFgH12345678"
code: "orders-cancel-api"
category: "sales/orders"
tags: ["orders", "api", "cancellation"]
published_at: "2026-08-14T09:00:00.000Z"
---


Cancelling an order via the API
===============================

(article body in Markdown, primary locale only)
```

Frontmatter fields:

- `id` — the immutable identifier tying this file to its

database record. Never edit.

- `code` — the URL slug and external integration key.
- `category` — slash-separated slug path in the category tree.
- `tags` — array of tag codes.
- `published_at` — ISO-formatted publication timestamp, or null

for drafts.

The title lives directly under the frontmatter as an underlined H1 (`===` underline). It is NOT a frontmatter field.

### What is NOT in the export

- **Translations** — only the primary-locale body. Other locales

live in the database and are re-derived from the primary locale on import via the auto-translate pipeline.

- **Media and attachments** — images and files stay in blob

storage. Markdown bodies reference them by absolute HTTPS URL, so the URLs still resolve; the binary data is not in the zip.

- **Comments and reader ratings** — reader-generated content is

not exportable.

- **View counts and history** — analytics and version log stay

in the database.

The export is optimised for content editing, not full-fidelity backup.

## Import

The **Import from Git** button in the top-right corner of `/post` opens a modal:

1. Enter the URL of a public GitHub repository containing

`.md` files with the platform's frontmatter shape.

2. Optionally, specify a branch (defaults to whatever the URL

points at, or the repository's default branch).

3. Click **Import**.

The platform downloads the repository as a tarball, walks every `.md` file, and:

- **Matches** each file to an existing post by `id` in the

frontmatter. If matched, upsert (update the DB record from the file).

- **Creates** a new post for files without an `id` in the

frontmatter, assigning a fresh identifier that is written back on the next export.

- **Falls back** to matching by `code` when `id` is absent,

reducing accidental duplication when re-importing from an older export.

- **Skips** files without an H1 title, files without a body,

and files whose `category` field points at a non-existent category — each skipped file is reported per-file in the result summary.

- **Aborts** the whole import only if two files in the repo

carry the same frontmatter `id` (an ambiguous import that would silently double-write one post).

After import, the result modal shows:

- **Created** — new posts written.
- **Updated** — existing posts modified.
- **Unchanged** — files that matched an existing post

byte-for-byte (nothing to write).

- **Skipped** — files rejected for one of the reasons above,

with the reason per file.

## Round-trip semantics

The import always writes only the primary-locale body. Other locales in the database are marked stale (they now reference a source snapshot that has been overwritten). Running the auto-translate flow after import refreshes every locale to match the new source. See [Translations](/post-translations) for the mechanics.

### Removing an article

Deleting a file from the repository does NOT delete the corresponding post in the database. The post remains as an "orphaned" record until you explicitly delete it through the admin. Reason for the asymmetry: it is much easier to accidentally delete a file from a repository than to accidentally delete an article in the admin, and the consequence of the former should not be silent data loss.

To bulk-delete articles, use the admin bulk-delete on the grid, not file removal.

### Fields not present in frontmatter

Frontmatter carries `id`, `code`, `category`, `tags`, and `published_at`. Everything else — visibility, perex, meta title, meta description, main image, custom metadata, authors — stays under admin authority and is NOT overwritten by the import.

That means an import can update body content without disturbing the admin-managed settings. If you want to change visibility across many articles, use bulk actions in the admin — the import cannot do it.

## Typical workflows

### Content backup

1. Click **Export to Git** on `/post`.
2. Save the zip to backup storage.
3. Repeat monthly (or after major editorial work).

### Bulk tag reassignment

1. Export.
2. Unzip.
3. Run a script that reads every `.md`, edits the `tags:`

frontmatter, and writes back.

4. Commit the result to a Git repository.
5. Click **Import from Git**, enter the repo URL.
6. Review the "updated" count in the result modal.

### Multi-person editorial review

1. Export.
2. Commit the export to a shared Git repository.
3. Editors work in feature branches, opening pull requests

with proposed edits.

4. Reviewers comment on the diff, request changes.
5. Approved PRs are merged to the main branch.
6. The main branch is imported back to the platform.

### CMS migration

1. Convert the source CMS's export to the platform's

frontmatter shape (a one-off script).

2. Push to a Git repository.
3. Import once.
4. Fix any skipped files reported in the result modal.
5. Run auto-translate to populate all locales.
6. Run route-fix to ensure every translation has a canonical

URL (see [Routing and URLs](/post-routing-and-urls)).

## Constraints and caveats

- **Public GitHub repos only.** Import fetches over HTTPS

without authentication.

- **Whole-repo import.** The import walks the entire tree —

you cannot import a single file. Use branches for staged imports.

- **No image import.** Media stays in blob storage. Referencing

images in Markdown bodies works via absolute URL only.

- **The directory tree in the repo is cosmetic.** The

authoritative category is the `category:` frontmatter field. Moving a file between directories does not move the post between categories.

- **File names are cosmetic.** The authoritative identifier is

the `id` field. Renaming a file does not rename the post.

- **Slug changes need extra care.** Editing the `code:` field

changes the URL slug on next import. There is no automatic redirect from the old slug — external links break. Prefer admin-side rename for slug changes so redirects are created.

## Related

- [Post management overview](/post-management)
- [Post editor](/post-editor) — the admin alternative for

single-article editing.

- [Bulk actions](/post-bulk-actions) — the admin alternative

for at-scale visibility changes.

- [Translations](/post-translations) — what happens to

translations after an import.

- [Routing and URLs](/post-routing-and-urls) — implications of

slug changes.

# INSTRUCTIONS — Editing Posts in this Repository

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

1. Preserve the frontmatter block verbatim except for the fields you are
   changing. In particular, never remove or alter the `id` field.
2. When creating a new post, omit the `id` field (do not invent one). The
   import pipeline will assign a canonical identifier and write it back on
   the next round-trip export.
3. Use YAML flow strings (double-quoted, with standard JSON escapes) for any
   string that contains special characters. The exporter already emits values
   in this shape.
4. The body of the file is authored in the primary locale of the organisation
   (declared once in `README.md`, not per-file). Translations to other
   locales are re-derived from the primary locale on import — do not
   hand-translate here.
5. Media (images, attachments) is not exported. Reference existing media by
   its absolute HTTPS URL, exactly as the platform emits it. New media must
   be uploaded via the admin UI before it can be referenced from here.

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

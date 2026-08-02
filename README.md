# Bizkithub documentation — Posts (Markdown Export)

This repository contains a Markdown snapshot of the posts stored in BizKitHub
for the organisation **Bizkithub documentation**. It was generated from the admin UI and is
intended as the seed for a Git-backed content workflow.

## Snapshot

- Generated: 2026-08-01T13:16:07.366Z
- Primary locale: `en`
- Exported posts: 78
- Exported categories: 91

## Layout

Directories mirror the category tree of the organisation at the time of
export. Uncategorised posts live under `_uncategorized/`. Filenames are
slugified from the post title. Neither the directory nor the filename is
authoritative — the sole source-of-truth identifier is the `id` field in
each file's YAML frontmatter (a 16-character external identifier). Renaming
or moving a file is safe: it will not create a duplicate, and future imports
will re-associate the file with its post by `id`.

## What the snapshot contains

Only the primary-locale content is present. Translations to other locales are
kept in the database and are refreshed on import. Media attachments (images,
files) are NOT exported — they live in blob storage and are referenced by
absolute HTTPS URLs inside the Markdown body.

## Contributor workflow

Two files govern how content lands in this repository:

- [`INSTRUCTIONS.md`](./INSTRUCTIONS.md) — mechanics. File format, frontmatter
  fields, the `id` invariant, round-trip semantics. Short.
- [`AUTHORING.md`](./AUTHORING.md) — content. Who the docs are for, how to
  structure an article, what to write, what to never write (internal
  identifiers), voice and tone, section templates, coverage goal,
  anti-patterns. Long — but every section earns its space.

Read both before you edit or create your first article. Human or AI agent —
same guide, same rules.

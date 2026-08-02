---
id: "rtYLYMwbHUtPthtd"
category: "content/post-management"
tags:
  - "posts"
  - "history"
  - "versioning"
  - "audit"
published_at: "2026-08-02T00:00:00.000Z"
---


History and versioning
======================

Every save of a post is captured as an immutable snapshot. Snapshots
form a per-language version log you can browse, diff, and restore
from — a safety net for editorial teams and an audit trail for
compliance. This article describes what gets recorded, when snapshots
collapse to keep the log tidy, how to view diffs, how restore works,
and how translations interact with the version system.

## What is a version

A version is a captured state of one language of one article at a
specific moment. It records:

- **Who** — the author who saved it (the member's contact identity).
- **When** — the timestamp of the save.
- **What** — the title and full body content at the moment of the
  save.
- **Locale** — which language of the article this snapshot belongs
  to. Every language of an article has its own independent version
  stream.
- **Optional commit message** — a short human-readable note
  describing the change. Auto-saves may omit this; explicit
  restore-from-version and translate operations add descriptive
  messages ("Restored from earlier version", "Auto-translate (initial)",
  "Auto-translate (refresh)").

The body content is stored in blob storage; the version row records
a reference plus a content fingerprint. That means large articles do
not blow up the version log's storage footprint and title-only edits
can reuse the previous body's blob rather than uploading a duplicate.

## Where to see it

Open any post from `/post` → the post detail page has a **History**
tab. It lists every recorded version for the currently-selected
language, newest first:

| Column        | Meaning                                                     |
| ------------- | ----------------------------------------------------------- |
| **Version**   | Public 16-character version handle (used in the URL).       |
| **Title**     | Title at that version. Truncated in the table.              |
| **Size**      | Byte size of the body at that version.                      |
| **Author**    | Who saved it. Empty for anonymous system snapshots (rare).  |
| **Commit**    | The commit message if one was recorded.                     |
| **When**      | Relative timestamp ("2 days ago"), with the full moment on hover. |

Clicking a row opens the version detail modal — see below.

Version streams are per-language. To review the version history of
a translation, first switch the content language in the header (or
via the URL locale parameter). The History tab then shows that
locale's stream.

## The three save behaviours

Every time you click **Save** on the content tab, the platform makes
one of three decisions:

### 1. No-op (identical to the last version)

If the title and the body byte-for-byte match the previous version
for this (article, language), no new version is recorded. The
previous version is returned as-is. Prevents rapid-fire saves from
polluting the version log with duplicates.

You will see this if you open an article, click Save without
changing anything, and check the History tab — no new row.

### 2. Coalesce with the recent version

If the previous version for this (article, language) was saved by
the same author within a coalesce window (default 10 minutes), the
platform updates that existing version in place with the new
content — same version handle, new body, new title, updated
timestamp.

The rationale: an editor working on an article typically saves many
times over a few minutes (autosave-like behaviour). Coalescing
keeps the version log meaningful ("what changed in this session?")
rather than turning it into a keystroke recorder.

- The coalesce window is 10 minutes by default.
- Coalesce only fires for the **same author** — Alice's edit at 12:00
  and Bob's edit at 12:05 always land as two distinct versions so
  the attribution stays honest.
- Coalescing works even when the previous body was completely
  different — the same version row is reused. This is important
  because the platform treats a coalesced update as "the same
  editing session, evolving state". The previous body is discarded.
- When coalesce happens, downstream translations of this source
  version are automatically marked stale — see the [Translations
  interaction](#translations-interaction) section below.

### 3. New version

If neither of the above applies (different author, past the coalesce
window, or the first save of a new article), a new version row is
recorded. The body is checked against previous versions: if the
same content already exists in another version for this (article,
language), the new row reuses that body's storage reference instead
of uploading again. Otherwise the body is uploaded fresh.

## Diff view

Clicking a version in the History tab opens the diff modal with
three parts:

- **Header** — version handle, author, timestamp, size, commit
  message.
- **Title diff** — side-by-side comparison of the version's title
  against the current title, with added and removed segments
  highlighted.
- **Content diff** — the same for the body, with unchanged regions
  shown as context and edits highlighted inline.

The diff is against the current live version by default. There is
also a compare-across-versions view — pick any two versions from the
list and the modal renders their diff.

The diff view is read-only. It exists to answer "what changed?" —
restoring is a separate explicit action.

## Restore from version

From the version detail modal you can click **Restore this version**.
Confirmation is required, because restore is a destructive-feeling
operation even though it is fully reversible.

Restore semantics:

- The current title and content are replaced by the selected
  version's title and content.
- A **new** version is recorded on top, with the commit message
  "Restored from earlier version". The version log therefore never
  loses history — you can undo the restore by restoring the version
  before the restore.
- Coalesce does not apply to restores. A restore always lands as a
  fresh version regardless of author or timing.
- Every translation of this article is marked stale (the source
  changed), and the sidebar's auto-translate button appears if not
  already visible.

## Translations interaction

Every version is per-language, so:

- Editing the primary-language body produces a new primary-language
  version. Existing translations become stale (their reference now
  points at an older primary-language version).
- Editing a translation directly produces a new version in that
  target language's stream. The primary-language stream is not
  touched.
- Auto-translate produces a new version in each target-language
  stream that received a translation. Each translation version is
  stamped so the dashboard knows it is fresh.

See [Translations](/post-translations) for the full staleness
model and the tools to keep translations in sync as versions
accumulate.

### Why coalesce interacts with staleness

There is one subtle interaction. When a coalesce updates an existing
primary-language version in place (same version handle, new body),
any translations that reference that version handle would silently
believe they are still fresh — the handle is unchanged. To keep the
freshness model honest, the platform explicitly marks every
translation that referenced the coalesced version as stale as soon
as the coalesce happens. On the next auto-translate run, those
translations are regenerated from the current source.

You do not have to do anything about this — it is automatic. The
outcome is that after a save-and-coalesce, the dashboard shows the
same amber (stale) badges as it would after a fresh new-version
save.

## How much history is kept

There is no automatic pruning. Every version ever saved is retained
indefinitely — the storage footprint is small because bodies dedupe
by content fingerprint, and version rows themselves are cheap.

If you need to reduce the version log for a specific post (rare —
mostly a compliance need), contact support for a manual cleanup.
There is no admin-facing pruning action, deliberately, because
version loss is not undoable.

## What is NOT versioned

The version log covers the title and body. It does not track
changes to:

- Category assignment.
- Tag assignments.
- Author list.
- Visibility, publication date, deletion.
- Main image, gallery images, attachments.
- Custom metadata (the key–value list).
- SEO meta title and meta description.

These fields are edited independently and there is no rollback for
them. If you assign the wrong category, the fix is to reassign — the
history log will not show the mistake. Editorial teams should be
aware of this asymmetry and use the version log for content changes
specifically.

## URL structure and sharing

Every version has a stable 16-character public handle. The URL for
a specific version is:

    /post/{postId}/history/{versionHandle}

You can share this URL with a colleague to point at a specific
snapshot. Restore-from-URL is not currently supported — restores go
through the modal in the admin UI.

## Version log for a deleted post

Deleting a post does not remove its version history. The versions
remain in place and are visible again when the post is restored.
This is a deliberate choice — undoing a delete is common enough
that losing history alongside would defeat the purpose of soft
delete.

## Related

- [Post editor](/post-editor) — where saves happen.
- [Post management overview](/post-management)
- [Translations](/post-translations) — how versions interact with
  per-language freshness.
- [Visibility and lifecycle](/post-visibility-and-lifecycle) — the
  soft-delete + restore semantics that preserve version history.

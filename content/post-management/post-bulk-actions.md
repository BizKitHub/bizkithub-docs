---
category: "content/post-management"
tags: ["posts", "bulk", "operations"]
published_at: "2026-08-02T09:59:43.000Z"
---


Bulk actions
============

Editorial teams routinely need to change something across many
posts at once — publish a batch of scheduled announcements, hide
a set of outdated articles, prune obsolete drafts. The Posts
module supports three bulk operations directly from the article
grid, executed atomically with a confirmation prompt for
destructive actions.

This article covers the three bulk operations, how to select the
target set, what happens during and after the operation, and the
practical limits.

## The bulk-action bar

Every row in the article grid on `/post` has a checkbox on the
left. Selecting one or more rows exposes a bulk-action bar
above the table with three actions:

- **Publish** — set visibility to `public` on every selected
  post.
- **Unpublish** — set visibility to `private` on every selected
  post.
- **Delete** — soft-delete every selected post.

The bar also shows how many posts are currently selected and a
**Clear selection** link to deselect all.

## Selecting posts

Selection strategies:

- **Individual** — tick the checkbox on each row you want.
- **All-visible** — the checkbox in the table header selects
  every row currently rendered on the page.
- **All-matching** — after selecting all-visible, some grids
  offer an "also select the N other rows matching this filter"
  extension. Selecting all-matching is the way to operate on a
  filtered subset that spans more than one page.

Filtering before selecting is the most common pattern:

- Filter to `draft` status, select all, click **Delete** to
  clean up abandoned drafts.
- Filter to a specific tag (a campaign identifier), select all,
  click **Publish** to launch the campaign at once.
- Filter to `unlisted`, select all, click **Publish** to
  promote a batch of pre-launched articles.

## Bulk publish

Publishing in bulk sets each selected post's visibility to
`public`. The publication date is not touched:

- Posts that already had a publication date in the past → now
  live.
- Posts that had a publication date in the future → still
  `scheduled`; they will auto-flip to `published` at their date.
- Posts that had no publication date → the platform assigns the
  current moment as the publication date, and they go live
  immediately.

The action fires atomically per post — every post's visibility
change is a discrete write; a failure on one post does not
abort the whole batch. The result toast tells you how many
succeeded and how many were already public (nothing changed).

Use for coordinated launches — a set of related articles that
must all go live at once.

## Bulk unpublish

The mirror of bulk publish. Sets each selected post's
visibility to `private`. The publication date is preserved so
the archive history of "when was this first live" stays honest
(see [Visibility and lifecycle](/post-visibility-and-lifecycle)
for how the `private` status differs from `draft`).

Common uses:

- A pricing change means every existing pricing article is
  now inaccurate; unpublish the whole set until each is
  updated.
- A legal review is pending across a batch of articles; take
  them offline collectively until cleared.
- A category is being retired; unpublish every article in it
  before deleting the category.

Bulk unpublish does NOT delete — it hides. The articles remain
editable in the admin and can be republished individually or in
another bulk operation later.

## Bulk delete

Soft-deletes every selected post. A confirmation dialog appears
first — bulk delete is the most destructive of the three actions
and the confirmation is mandatory.

After confirmation:

- Every selected post moves to `archived` status.
- The grid re-renders without them (unless the "show archived"
  filter is active).
- Their canonical URLs return "not found" for anonymous
  readers.
- All version history, comments, gallery images, attachments,
  and translations are preserved.

**Restoration is one-at-a-time.** There is no bulk-restore
action. If you accidentally bulk-delete a large batch, restoring
each individually is the only path. Reason for the asymmetry:
bulk deletion is common (spring cleaning) but bulk restoration
is rare and lends itself to accidental "undo an intentional
delete" mistakes.

## Practical limits

Bulk operations are executed sequentially — each post is
updated in turn. Practical implications:

- **Small batches (up to a few dozen)** — near-instantaneous.
- **Larger batches (hundreds)** — take a noticeable moment; the
  UI shows a progress indicator and blocks the grid until the
  operation completes.
- **Very large batches (thousands)** — supported but slow. If
  you need to operate on every article in a large
  organisation, consider using the [Git
  workflow](/post-git-workflow) instead: export, edit
  frontmatter across every file with a script, re-import. The
  Git flow is designed for at-scale batch changes.

There is no hard cap on the number of posts in a single bulk
operation, but selecting a thousand posts at once and clicking
delete is a slow way to accomplish what a script would do in
seconds.

## What is NOT a bulk operation

Several common operations are single-post only:

- **Bulk tag assignment** — no bulk-tag action. To tag many
  articles with the same tag, either open each individually or
  use the Git workflow.
- **Bulk category reassignment** — no bulk-category action. Same
  workarounds.
- **Bulk translation** — this is the exception: there IS a bulk
  translation flow, but it lives on the **Translations** tab
  (and in the admin terminal) rather than on the article grid.
  See [Translations](/post-translations).
- **Bulk restore** — one at a time.
- **Bulk export** — not per-selection; the Git export always
  exports every article in the organisation.

## Audit trail

Every bulk operation writes an audit entry per post to the
organisation's activity log, recording:

- Which member performed the bulk action.
- Which post was affected.
- What the change was (published, unpublished, deleted).
- The timestamp.

The log preserves who did what and when — useful for
after-the-fact review if a bulk action turns out to have been
wrong.

## Tips

- **Filter first, select second.** Selecting rows manually is
  fine for small changes; for anything larger, get to the
  filtered subset first and then use "select all matching".
- **Test on a small subset before going wide.** If you are about
  to bulk-delete a hundred articles, do one first and confirm
  the outcome is what you expect.
- **Bulk delete is reversible one at a time**, so a small
  mistake is recoverable. A hundred-post mistake, however, is
  a hundred right-clicks to fix.
- **Coordinate with translations.** A bulk publish of ten
  articles that only exist in the primary locale will surface
  ten new missing translations on the Translations dashboard.
  Consider running an auto-translate pass after the bulk
  publish so the launch is fully multilingual.

## Related

- [Post management overview](/post-management)
- [Visibility and lifecycle](/post-visibility-and-lifecycle)
- [Translations](/post-translations) — for bulk translate.
- [Git workflow](/post-git-workflow) — for larger-scale batch
  operations.

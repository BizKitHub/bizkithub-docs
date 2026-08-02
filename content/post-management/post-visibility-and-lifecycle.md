---
category: "content/post-management"
tags: ["posts", "publishing", "scheduling", "visibility"]
published_at: "2026-08-14T09:00:00.000Z"
---


Visibility and lifecycle
========================

Every article passes through a small number of well-defined states
between the moment an editor creates it and the moment it either goes
live to readers or is retired. The platform separates two independent
dimensions — the **visibility** you set explicitly, and the **status**
that the platform derives from that visibility combined with the
publication date and deletion timestamp. Understanding how the two
interact is the difference between "why is this scheduled post still
in draft?" and "of course it is — the date is in the past."

This article covers the four visibility values, the five derived
statuses, the state matrix between them, the scheduling model, the
soft-delete + restore flow, and the post kind that determines whether
an article is a regular blog post or an internal branch document.

## The two dimensions

**Visibility** is what an editor sets in the sidebar dropdown:

- `public` — anyone can read the article on the public site.
- `private` — nobody outside the admin can read the article.
- `unlisted` — hidden from category pages, feeds, sitemap, and
  internal search, but readable by anyone with the direct URL.
- `subscribe` — visible only to authenticated subscribers.

**Status** is the label the grid, badges, and admin UI use to describe
the article's current state. It is derived from `(visibility,
publication_date, deleted_date)`:

- `draft` — never been live; visibility `private` with no publication
  date set.
- `scheduled` — publication date is in the future and visibility is
  `public`. Auto-flips to `published` at that timestamp.
- `published` — currently live to whichever audience the visibility
  permits.
- `private` — was live at some point (publication date is set) but has
  since been flipped to `private`. Effectively "unpublished but
  historically remembered".
- `archived` — soft-deleted. Not visible anywhere on the public site;
  still restorable from the admin.

The distinction matters because you rarely set the status directly —
you set visibility (and optionally the date) and the platform computes
the status. The four quick-action buttons in the sidebar (Publish now,
Schedule, Make draft, Unpublish) are shortcuts that set the underlying
visibility + date combinations for you.

## The state matrix

The table below covers every reachable combination.

| Visibility  | Publication date       | Deletion date  | Derived status | Meaning                                              |
| ----------- | ---------------------- | -------------- | -------------- | ---------------------------------------------------- |
| `private`   | Unset                  | Unset          | `draft`        | Brand new or reverted-to-draft. Never was live.      |
| `public`    | In the future          | Unset          | `scheduled`    | Will auto-go-live at that moment.                    |
| `public`    | Now or in the past     | Unset          | `published`    | Live right now.                                      |
| `unlisted`  | Now or in the past     | Unset          | `published`    | Live to direct-URL visitors only.                    |
| `subscribe` | Now or in the past     | Unset          | `published`    | Live to authenticated subscribers only.              |
| `private`   | Set (in the past)      | Unset          | `private`      | Was live; deliberately taken down. Date preserved.   |
| Any         | Any                    | Set            | `archived`     | Soft-deleted. Not on the public site.                |

Two nuances:

- **Deletion trumps visibility.** An article with a deletion timestamp
  is `archived` regardless of what visibility or publication date is
  set.
- **Publication date in the future with `private` visibility** is
  effectively a `draft` — the future date is ignored until visibility
  becomes `public`.

## Visibility values in detail

### `public`

Standard live publication. The article appears on the category page,
in the site-wide RSS feed, in the XML sitemap for search engines, and
in the public REST API (`/api/v1/post/*`). Anonymous readers can open
the URL and read the whole article.

Use `public` for anything you want indexed and shared.

### `private`

Not on the public site. The URL returns a "not found" response for
non-admins. Not in the sitemap, not in the RSS feed, not in the public
API. Still fully editable from the admin.

`private` is the working state — brand-new drafts and articles you
have taken back for revision both live here.

### `unlisted`

The article is readable by anyone who has the direct URL, but it does
not appear in any listing surface: no category archive, no sitemap,
no RSS, no search index, no `/api/v1/post/list` result. Use for:

- **Test drives** — you want a stakeholder to preview the article
  before it goes public, without committing to a full launch.
- **Internal-only reference pages** that need to be linkable from
  documentation elsewhere but should not be discoverable.
- **Beta articles** that are ready to publish but need a stealth
  launch first.

`unlisted` is the fine-grained middle ground between `public` and
`private`.

### `subscribe`

The article is behind a subscriber wall. Anonymous readers see a
"subscribe to read" gate; authenticated subscribers see the article
in full. Not in the public sitemap or RSS, but is in the API for
subscribers presenting a valid session.

`subscribe` requires the subscription module to be enabled on the
organisation. If it is not, treat it as equivalent to `private`.

## Derived statuses in detail

### `draft`

The default for any brand-new article. Nothing has been decided about
when or how it should be published; you are still writing.

- **Grid indicator:** grey pill.
- **Public exposure:** none.
- **API exposure:** none.
- **Editable:** yes.

### `scheduled`

You want the article to go live at a specific future moment, but not
yet. The sidebar shows a scheduled pill in amber with the exact
publication date. The public site does not surface the article until
the date is reached, at which point it flips to `published`
automatically — no manual re-save required.

Scheduling is useful for:

- **Coordinated launches** — a product announcement that must go live
  at the same moment as an email campaign.
- **Off-hours publication** — an article ready today but meant to
  appear at Monday 09:00 for weekday readers.
- **Time-zone alignment** — the platform stores timestamps in UTC but
  the picker accepts your local time and converts.

To schedule: pick a future date/time in the publication-date field
and set visibility to `public`. Or use the sidebar's **Schedule**
button, which sets both in one click with a default of "one hour from
now, rounded up to the next 5-minute mark".

### `published`

Currently live. The pill is green. The article is on the public site
according to its visibility (see the table above — `unlisted` and
`subscribe` also count as `published`, but each restricts the audience
differently).

### `private` (as a status)

The article was live at some point and has since been taken down.
Distinct from `draft` because the publication date is preserved — you
can see when it was first published, and the deletion is a deliberate
"take offline" action rather than a "never really launched" state.

Use when you want to withdraw an article temporarily (e.g. a
correction is pending, sensitive information was spotted). Restore by
flipping visibility back to `public`.

### `archived`

Soft-deleted. The article is invisible on the public site, invisible
in the standard grid view, and does not appear in the public API. In
the admin it still exists — it shows up in the grid marked with a red
"Deleted" label if you toggle the "show archived" filter, and can be
restored from the row context menu.

The article is not physically removed. Its ID, external ID, canonical
URL history, comments, and version history all remain intact. A
restore returns everything to the state it was in at deletion.

## Scheduling

Scheduling is available for any post with `public` visibility. The
scheduling flow:

1. In the sidebar, set **Publication date** to the desired future
   moment.
2. Set **Visibility** to `public` (or use the **Schedule** quick
   action, which does both at once).
3. Save.

The article is now `scheduled`. The pill shows the target date.

At the moment the date is reached, the platform re-evaluates the
status on the next read and flips to `published` — no admin action
needed, no re-save, no re-publish. Existing scheduled articles are
also re-evaluated whenever anyone loads the grid or the article page.

### Changing a scheduled date

Just update the field and save. The article stays `scheduled` and the
new date is honoured.

### Cancelling a scheduled publication

Click **Make draft** in the sidebar quick actions. This clears the
publication date and sets visibility to `private`; the article
reverts to `draft`.

If you want to keep the historical publication date but take the
article out of the schedule for now, click **Unpublish** instead
(sets visibility to `private` but keeps the date). The article
becomes `private` (as a status) rather than `draft`.

### Scheduling caveats

- **Timezones**: the date picker uses your admin locale's timezone.
  Storage is in UTC. Confirm by hovering the date pill in the grid —
  it shows both.
- **Very short windows**: scheduling less than a minute in the future
  behaves the same as publishing now, because the read-time
  evaluation might happen after the scheduled moment.
- **No pre-publication preview URL**: to preview a scheduled article
  before it goes live, set it to `unlisted` first, share the URL with
  reviewers, then flip to `public` with the scheduled date once
  approved.

## Soft-delete and restore

Deleting an article does not remove it from the database. Instead, the
deletion date is stamped, and the article moves to the `archived`
status. This preserves:

- **Every previous version** in the history log.
- **Every reader comment** and moderation decision.
- **Every canonical URL** that ever pointed to the article, so
  redirects can be resurrected.
- **Every metadata entry** and integration reference.

### Deleting a post

Two paths:

- **From the sidebar** on the post detail page — the **Delete** button
  at the bottom, with a confirmation dialog.
- **From the row context menu** in the grid — right-click a row →
  Delete, with the same confirmation.

The confirmation dialog is deliberate; there is no undo-toast. Once
you confirm, the article moves to `archived` immediately and
disappears from the standard grid view.

### Restoring a deleted post

From the article grid, filter to include archived posts (there is a
toggle in the filter bar). Right-click the archived row and choose
**Restore**. The confirmation asks whether you're sure; on
confirmation, the deletion date is cleared and the article returns to
its previous status (whatever `visibility` + `publication date`
combination it had before the delete).

### Bulk delete and bulk restore

The multi-select bulk-action bar supports bulk delete but not bulk
restore. Restore one at a time. See
[Bulk actions](/post-bulk-actions).

### Hard delete

There is no hard-delete button in the standard admin. Deletion is
always reversible. For legal-obligation removals (GDPR-style right to
erasure), contact the platform's support flow — the operation is done
manually and audited.

## Post kinds

Every post carries a **kind** — a discriminator that separates regular
blog articles from other content that lives in the same underlying
storage. Kinds currently in use:

- `post` — the default. Regular blog article; appears in the grid, on
  the public site, in the RSS feed, in the sitemap, in the API.
- `branch` — a branch-owned document. Used for internal per-location
  content that shouldn't appear in the main blog feed. The grid
  filters these out by default; select "branch only" from the kind
  filter to see them.

The kind is set at creation and rarely changes. If you find yourself
wanting to change a kind, it usually means the post was created in
the wrong module — most editors will never need to touch this.

## Combined workflow — from creation to retirement

The typical article lifecycle:

1. **Create** — editor clicks **Add**, writes a draft. Visibility
   defaults to `private`, no date. Status: `draft`.
2. **Edit** — editor works on the article across multiple sessions.
   Status stays `draft`.
3. **Schedule** — editor sets a future date and flips visibility to
   `public`. Status: `scheduled`.
4. **Auto-publish** — the scheduled moment arrives, the platform
   flips the article to `published` automatically.
5. **Live** — readers arrive, comments appear, views tick up.
6. **Withdraw** (optional) — editor spots an issue, clicks
   **Unpublish**. Visibility becomes `private`, date preserved.
   Status: `private`.
7. **Re-publish** (optional) — editor flips visibility back to
   `public`. Status: `published` again.
8. **Retire** — years later, the article is genuinely obsolete.
   Editor clicks **Delete**. Status: `archived`. The URL now returns
   a "not found" for anonymous readers.
9. **Restore** (rare, but always possible) — the article is undeleted
   from the archived filter. Original visibility and date are
   preserved.

## Related

- [Post management overview](/post-management)
- [Post editor](/post-editor)
- [Bulk actions](/post-bulk-actions)
- [Routing and URLs](/post-routing-and-urls) — for how visibility
  affects canonical URL generation.
- [API integration](/post-api-integration) — for how visibility
  filters the public API responses.

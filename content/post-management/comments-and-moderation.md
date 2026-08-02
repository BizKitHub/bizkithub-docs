---
id: "L4A7MK08O316Loie"
category: "content/post-management"
tags:
  - "posts"
  - "comments"
  - "moderation"
published_at: "2026-08-02T00:00:00.000Z"
---


Comments and moderation
=======================

Every published article can accept reader comments — free-text
responses submitted from the article page, optionally in reply to
another comment, moderated from the admin. The Posts module
includes a dedicated **Comments** tab that aggregates every
comment across every article in one moderation table, so an
operator can review, delete, or restore comments without hopping
between individual post detail pages.

This article covers the comment submission flow from the reader's
perspective, the moderation surface in the admin, the delete +
restore semantics, and how comments interact with visibility and
translation.

## The reader flow

At the bottom of every published article on the public site,
below the body and any attachments, sits a comments section. Its
structure depends on the site theme, but typically:

- A **comment form** with a name field, an email field, and a
  free-text comment field. Some themes require the visitor to
  log in first; others accept anonymous submissions with
  captcha protection.
- A **thread of existing comments**, sorted chronologically or
  by "most liked" depending on theme.
- A **reply button** on each comment that opens a nested reply
  form.

On submission, the comment lands immediately in the article's
comment thread (or, on organisations with pre-moderation
enabled, waits in a review queue — check with your theme
configuration).

The commenter's email address is captured but not shown publicly;
it is used only for platform-level notifications (e.g. "your
comment received a reply") and admin-side moderation.

## The Comments tab in the admin

Click **Comments** in the tabs across the top of `/post`. The
tab shows a cross-post table of every comment in the
organisation:

| Column         | Content                                                   |
| -------------- | --------------------------------------------------------- |
| **Post**       | The title of the article being commented on. Clickable — links to the post detail. |
| **Author**     | The commenter's display name.                             |
| **Email**      | The commenter's email address.                            |
| **Content**    | The comment body. Truncated in the row; hover to see full. |
| **Status**     | Active or deleted.                                        |
| **Date**       | Relative timestamp of submission.                         |

The table is paginated, filterable by status (active vs deleted),
searchable by any of the content fields, and sortable by date.

## Moderating a single comment

Right-click any comment row (or click the row's ⋮ menu) and
choose an action:

- **Delete** — soft-deletes the comment. A confirmation dialog
  appears; on confirm the comment is removed from the public
  thread and marked deleted in the admin. It remains in the
  database and can be restored.
- **Restore** — for a comment previously deleted, restores it to
  the public thread.

There is no edit-comment action. If a comment has substantive
content that needs correction, delete it and (optionally) contact
the commenter via the recorded email to invite a re-submission.

## Bulk moderation

Multiple comments can be selected via checkboxes on each row (if
your theme supports bulk actions in the comments tab). The
bulk-action bar exposes:

- **Bulk delete** — soft-delete every selected comment in one
  operation.

Bulk restore is not currently a distinct action; restore one at a
time.

## Comment visibility and the article

Comments respect the article's visibility:

- **Public article** — comments are visible to any reader.
- **Private / unlisted article** — the comment form is present on
  the article page, but the comments are visible only to whoever
  can also see the article. Since unlisted articles are readable
  by anyone with the URL, treat unlisted comments as "URL-secret,
  not private".
- **Subscribe-only article** — the comment form is subscriber-only;
  anonymous readers see the article gated. Comments made are
  visible to other subscribers.
- **Archived article** — the article is not visible to readers,
  so its comments are not visible either. Comments survive the
  archive and are visible again if the article is restored.

## Comment translation

Comments are NOT translated. They stay in whatever language the
commenter submitted them. Multi-locale articles show the same
comment thread regardless of which language the reader is on;
the comments themselves are unchanged.

This is deliberate — reader voice matters as-is. Auto-translating
a commenter's Czech comment into English would introduce errors
the commenter never wrote and never approved.

## What deletion actually does

**Soft-delete, not hard-delete.** A deleted comment:

- Disappears from the public article page immediately.
- Is marked as deleted in the admin table with a red badge.
- Its author, email, content, and thread position are all
  preserved.
- Can be restored to the public thread with one right-click.

There is no admin action for hard-delete. If a comment must be
permanently expunged (typically for legal reasons — GDPR right to
erasure, defamation, illegal content), contact the platform's
support flow. The hard-delete operation is audited.

## Notifications

Depending on organisation settings, the following events may
trigger notifications:

- **New comment submitted** — an email to the article's main
  author, giving them the option to reply directly.
- **Reply to your comment** — an email to the original commenter
  (using the email they submitted with) letting them know
  someone responded.
- **Comment flagged as spam** — an email to configured
  moderators.

Notification preferences are managed in the organisation's
communication settings — outside the Posts module.

## Spam and abuse

The platform applies basic anti-spam heuristics before a comment
lands (typical honeypots, rate limits, user-agent checks). What
survives shows up in the admin table as normal comments. Two
practical steps:

- **Set up moderator notifications** so a suspicious comment
  reaches you promptly rather than waiting for a scan.
- **Delete decisively.** A deleted comment is fully reversible;
  err on the side of removing anything that reads like spam or
  abuse. The commenter is not notified of the deletion.

For persistent abuse from a specific email or IP, contact
support for a platform-level block.

## Public API exposure

The public API exposes:

- **`commentsCount`** on the article list and detail — the
  number of active (non-deleted) comments.
- **`/api/v1/post/{id}/comments`** — the full comment thread for
  an article, in chronological order, with author name (but not
  email — email is admin-only).

Integrators building custom article renderers can use this to
present a comments section outside the platform's own theme.
See [API integration](/post-api-integration).

## Tips

- **Reply from your admin identity, not from the anonymous
  form.** If your main author account is set up, log in via the
  reply link in the notification email and post as your named
  self. Anonymous replies from an editor read poorly.
- **Delete spam quickly.** A single unreplied spam comment
  attracts more spam; the platform's heuristics work better
  when the visible thread is clean.
- **Do not delete disagreement.** A reader who disagrees with an
  article and says so politely is a signal of engagement.
  Delete only when the comment is spam, abuse, or otherwise
  policy-violating — not when it makes the editor
  uncomfortable.
- **Consider closing very old articles' comments.** Once a
  post is a few years old, drive-by spam outweighs new
  legitimate discussion. Some themes let you close comments
  per-post; check your configuration.

## Related

- [Post management overview](/post-management)
- [Post editor](/post-editor)
- [Reader feedback](/post-reader-feedback) — the star-rating
  companion.
- [Visibility and lifecycle](/post-visibility-and-lifecycle) —
  how article visibility affects comment visibility.
- [API integration](/post-api-integration)

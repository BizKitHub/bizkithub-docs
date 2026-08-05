---
id: "nP2Ntxc77HPUxY90"
category: "content/post-management"
tags:
  - "posts"
  - "authors"
  - "attribution"
published_at: "2026-08-02T17:10:52.383Z"
---


Authors and attribution
=======================

Every post has at least one author and can have many. The first author in the list is the **main author** — the person prominently credited on the public article page and in the article grid. All other authors are **co-authors**, credited equally in the byline but without being highlighted as the primary voice.

Authors are managed as contacts, which means the same person can show up as an author on posts, as a customer on orders, as a recipient of transactional email, and so on. There is no separate "author" entity to maintain — the author list on a post is just a list of people from the organisation's contact database.

## Where to set them

On any post's detail page, the sidebar's **Post authors** section carries the current author list. Each author is a card with the person's name, ordering handles, and a remove button.

To add an author, click the search box and start typing a name. Matching contacts appear in a dropdown; click to add. To remove an author, click the ✕ next to their card. To reorder — for example, to change who is the main author — drag the cards up or down.

The initial author on a newly-created post is the admin member who clicked **Add**. You can change this after creation like any other author.

## What the main author does

The main author (first in the list) is used by:

- **The public article page** — the byline shows the main author's

name and, when available, their profile photo. Co-authors appear in smaller text or as "and N others" links.

- **The article grid in the admin** — the Main Author column

displays this person, linked to their contact detail. Filtering by author in the grid narrows to articles where they are the main author.

- **RSS feed** — the `<author>` tag of each item is the main

author's email address.

- **OpenGraph meta tags** — the article's `article:author` tag

points at the main author.

- **API responses** — the `mainAuthorId` field returns the main

author's external identifier.

Everyone in the list, main or co-author, appears in the full byline. But the main author is the "face" of the article.

## Multiple authors

Common cases for multiple authors:

- **Co-written articles** — two people contributed equally. Add

both; the first-added is the main author by default (drag to reorder if the split-billing needs a different order).

- **Editorial + expert** — a subject-matter expert wrote the

first draft, an editor polished it. Credit both.

- **Legal / compliance signoffs** — some organisations attribute

the compliance reviewer as a co-author.

There is no maximum. Practically, more than three or four authors on one article becomes hard to read in the byline; consider grouping under a team name (a contact set up for the team) instead.

## Reassigning the main author

Drag the desired person to the top of the author cards. Save. The public article page updates on the next render. External links that referenced the old main author's profile page continue to work — they just no longer land on articles where that person is now a co-author.

Reassigning the main author does not touch article history — the version log tracks only the title and body content. Author changes are not versioned; if you need to prove attribution as of a specific date, keep a note in the article's custom metadata.

## Author profiles on the public site

When a reader clicks an author's name on the public article page, they land on the author's profile page — a chronological list of every non-internal post that person has authored (main or co). Whether this page exists depends on the site theme; some organisations enable it, some suppress it in favour of team pages.

The author profile shows:

- The person's name and, when available, a photo, short bio, and

external links (LinkedIn, personal site, etc.).

- Every non-internal post they have authored, most recent first.
- Optionally, tags they most frequently write about.

Editing an author's profile happens in the contact detail — not here. The Posts module only decides who is credited on which article.

## Contacts vs users

A subtlety worth calling out: authors are **contacts**, not **admin users**. Every admin member has a linked contact (that is how the byline works when the writer is a team member), but many contacts are not admin members — they might be external contributors, guest authors, or historical people with no active admin session.

You can attribute an article to a contact who has never logged in. Just search for their name in the author picker; if they exist as a contact, they can be an author. To create a contact for a new external contributor without inviting them to the admin, use the Contacts module → **Add contact**.

## API and integrations

The public API exposes author information as follows:

- **`mainAuthorId`** — the external identifier of the main author.
- **`mainAuthorName`** — the display name of the main author.
- **`authorIds`** — the full ordered list of author external

identifiers on the article detail endpoint. The order matches the admin's ordering.

Author details (photo, bio, external links) are fetched separately via the contacts endpoint. See [API integration](/post-api-integration).

## Tips

- **Keep contact records tidy.** The byline is only as good as the

contact's name and photo. Filling in a photo on the contact is the single biggest improvement to how the public article page looks.

- **Attribute honestly.** If an intern wrote the draft, an editor

polished it, and a lawyer signed off, three-way co-authorship is the right answer. Under-attribution is a compliance risk and an editorial-team retention risk.

- **Prefer real people over "Editorial team"** for articles that

have an actual author. A named byline is more trustworthy to readers. Reserve team-level attribution for genuinely team-authored pieces like release notes.

- **When an author leaves the organisation**, keep their contact

active if you still want their historical bylines linked. Delete or archive the contact only if you also want to strip attribution (which is a rare and destructive choice — historical bylines are usually preserved).

## Related

- [Post editor](/post-editor)
- [Post management overview](/post-management)
- [Post categories](/post-categories) — for the taxonomy authors

fit into.

- [API integration](/post-api-integration) — for how bylines are

surfaced to integrators.

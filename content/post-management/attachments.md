---
id: "5Rt8C6u8oCel3ixj"
category: "content/post-management"
tags:
  - "posts"
  - "attachments"
  - "downloads"
published_at: "2026-08-02T00:00:00.000Z"
---


Attachments
===========

Every post can carry attached files alongside its body — PDFs,
spreadsheets, presentations, ZIP bundles, or any other file readers
might want to download. Attachments live on their own tab in the
post detail and are exposed on the public article page as a
downloads section under the article body.

Attachments complement, rather than replace, the gallery. Use the
gallery for images intended to be shown inline in the article; use
attachments for files intended to be downloaded.

## Where to find them

Open any post from `/post` → the detail page has an **Attachments**
tab next to Gallery. The tab shows every file currently attached to
the post as a table with filename, size, MIME type, upload
timestamp, and a download button.

Below the table is an upload area — drop or browse to attach a new
file.

## Uploading

Two paths, both work the same:

- **Drag and drop** one or many files onto the upload area.
- **Click to browse** and select from the file picker.

Every file uploads in parallel with a per-file progress bar. When
the upload finishes, the file appears in the attachments table with
a download URL ready to share.

There is no format restriction. PDFs, Word documents, Excel
spreadsheets, PowerPoint decks, images, audio, video, ZIP archives
— everything is accepted. The file's original extension and MIME
type are preserved.

## Size limits

Practically, expect a per-file cap in the low tens of megabytes.
The exact number depends on your subscription tier; large uploads
(video, high-resolution photo bundles) may be rejected with an
error toast. For assets larger than that, host the file externally
(cloud storage, a CDN) and link to it from the article body
instead of attaching.

Total attachment size across all posts counts against the
organisation's storage quota, visible in the account settings.

## The downloads section on the public site

For posts with any attachments, the public article page renders a
**Downloads** section at the bottom of the body. Each attachment
appears as a card with:

- The **filename**.
- The **file size**, formatted for readability (`2.3 MB`, `450 KB`).
- The **file type**, inferred from the extension and MIME type
  (PDF, Excel, ZIP, …), with a matching icon.
- A **download button** that triggers a browser download.

The order in the section is the order shown in the admin tab.
Currently attachments are ordered by upload date (newest first);
no drag-to-reorder is supported.

## Removing an attachment

Each row in the attachments table has a **Delete** button. Confirm,
and the attachment is removed from the post and the file is
scheduled for deletion from storage.

Removing an attachment does not affect the public article page
except that the corresponding card disappears from the Downloads
section on the next page render. If a reader had already opened the
download URL in a tab, that specific download may still complete
for a short grace period.

## Linking to an attachment inline

To reference an attachment from within the article body (rather
than only from the Downloads section), copy the attachment's URL
from the table and paste it into the body as a standard markdown
link:

    See the [tariff overview PDF](https://…) for the full breakdown.

The link opens the file in the reader's browser — most browsers
will preview PDFs and images inline and trigger a download for
other types.

## Attachments vs gallery

Choose based on how the file is meant to be consumed:

- **Gallery** — for images intended to be viewed inline in the
  article body or in the lightbox reader. The reader looks at the
  image; downloading is possible but incidental.
- **Attachments** — for files intended to be downloaded. The
  reader takes the file away; viewing inline is possible but
  incidental.

If you have a diagram illustrating a point in the article, put it
in the gallery. If you have a spreadsheet supporting the article's
claims, attach it.

## Public exposure and API

Every non-internal attachment appears in:

- **The article's public detail page** under Downloads.
- **The public API** — the `/api/v1/post/detail` response includes
  an `attachments` array with every attachment's filename, size,
  MIME type, upload date, and downloadable URL. Integrations can
  render their own downloads section.
- **NOT the RSS feed** — attachments are not enclosures. The RSS
  feed's `<enclosure>` tag is reserved for a single main media
  file (typically a podcast episode) rather than a general
  downloads section.

See [API integration](/post-api-integration).

## Access control

Attachments inherit the post's visibility:

- **Public post** — attachments are downloadable by anyone. The
  file URLs are stable but not secret; sharing a URL bypasses the
  admin.
- **Private / unlisted post** — attachments are technically
  downloadable by anyone who knows the URL, but the URL itself is
  effectively secret because the post is not linked from anywhere
  public. Treat unlisted URLs as unlisted, not private.
- **Subscribe-only post** — attachments are guarded by the
  subscriber wall. Anonymous requests receive a redirect to the
  subscribe page.
- **Archived (deleted) post** — attachments are inaccessible from
  the public URL. If the post is restored, the attachments become
  accessible again unchanged.

For genuinely confidential files, do not attach them to a
`public` post. The storage URLs are stable and shareable; there is
no per-request access token.

## Tips

- **Rename files before upload.** The filename is what readers
  see in the download card and what their browser saves to. A file
  called `Untitled-2 (final)(v3).xlsx` looks unprofessional; rename
  to `product-pricing-2026-q3.xlsx` before you drop it on the
  upload area.
- **Prefer PDF over Word** for shared documents. Word documents
  render inconsistently across viewers and can trigger safety
  warnings in some browsers. PDFs preview reliably.
- **ZIP related files together** if there are many. Ten discrete
  attachments produce a cluttered Downloads section; one ZIP with
  ten files inside is often better.
- **Keep attachments up to date.** An attached spreadsheet or PDF
  is a snapshot of what you meant at upload time. Update the file
  by uploading a fresh version and deleting the stale one — do NOT
  edit the file externally and re-upload with the same name
  assuming it will replace, because it will not (upload creates a
  new record every time).

## Related

- [Post editor](/post-editor)
- [Gallery and images](/post-gallery-and-images)
- [Post management overview](/post-management)
- [Visibility and lifecycle](/post-visibility-and-lifecycle) —
  attachment access follows post visibility.
- [API integration](/post-api-integration)

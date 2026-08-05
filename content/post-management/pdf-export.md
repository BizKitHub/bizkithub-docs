---
id: "CA18TnUFnOT01x8L"
category: "content/post-management"
tags:
  - "posts"
  - "pdf"
  - "export"
published_at: "2026-08-02T17:11:10.179Z"
---


PDF export
==========

Any post can be exported as a printable A4 PDF from the post detail page. The export renders the article as a self-contained document — title, perex, main image, metadata, HTML body, and a reference identifier at the footer — suitable for printing, sharing outside the platform, or archiving.

This article covers what the PDF contains, how it differs from the public article page, when to use it, and the caveats worth knowing.

## Where to find it

Open any post from `/post` → the post detail page has an **Export as PDF** button in the sidebar footer (next to the Delete button). Click and the PDF opens in a new browser tab via the browser's native PDF viewer, ready to save, print, or share.

The generated PDF is not persisted to storage — every click produces a fresh render from the current article content. That means the PDF always reflects the latest edits with no cache lag.

## What is included

The PDF layout, top to bottom:

- **Header** with the organisation's name and (if configured)

logo. Same visual identity as the public site.

- **Article title** as a large heading.
- **Perex** as an italic paragraph below the title.
- **Metadata line** — main author, publication date, main

category, word count / reading time.

- **Main image** if the post has one — rendered at document

width.

- **Body content** — the full article body, formatted as HTML

and rendered with print-friendly typography. All inline images and gallery embeds are rendered.

- **Reference identifier** at the footer — the article's

external identifier, so a reader with the printed page can find the source post in the admin later.

The PDF is styled for printability: black text on white background, generous margins, page breaks that avoid orphan lines.

## What is NOT included

- **Attachments** are NOT embedded. The Downloads section on

the public article page does not appear in the PDF; only the article body is exported. If you want the PDF and the attached files together, download each separately.

- **Comments and reader ratings** are NOT included. The PDF is

the article, not the whole page.

- **Related-post suggestions** and other admin-side navigation

are NOT included.

- **Interactive elements** (video players, embedded forms) are

rendered as their static markup only — a video player renders as its preview image, not as a playable element.

## Locale selection

The PDF is generated in the currently-selected content locale of the article detail. To export the Czech version of a post, switch the content locale to `cs` before clicking Export; to export the English version, switch to `en` first. Each locale produces its own PDF with the corresponding title and body.

Labels within the PDF (author, publication date, reading time) are also translated to match the article's locale — an English export uses English labels, a Czech export uses Czech.

## Filename

The downloaded file is named `post-{externalId}.pdf` — for example, `post-XxnF99hw5Ll9GdRK.pdf`. This is deliberate — the external identifier is a stable, unique reference back to the article in the admin. If you rename the file for sharing, consider keeping the identifier somewhere in the filename or metadata so the source is traceable.

## When to use PDF export

Practical scenarios:

- **Compliance / audit archival** — you need a snapshot of the

article as it appeared on a specific date, signed and archived off-platform.

- **Physical distribution** — printing the article for

in-person events, mail-outs, waiting-room reading, or training materials.

- **Sharing with someone who does not use the platform** — a

reviewer or stakeholder without admin access can read the PDF and comment via any PDF annotation tool.

- **Handout companion to a presentation** — attach the PDF

alongside slides.

- **Offline reading** — a PDF works anywhere; a live article

page does not.

Less useful scenarios (use the public article URL instead):

- **Sharing with someone who could read the live page.** The

URL is dynamic, always up to date, and offers comments and interaction.

- **SEO** — PDFs are indexed by some search engines but rank

weakly compared to HTML.

## Print quality

The PDF is optimised for A4 paper (297 × 210 mm). Printing on US Letter works but the margins will be slightly narrower on the sides.

For long articles (10+ pages), the automatic page-break logic attempts to keep headings with their following paragraph and avoid orphan lines. Very complex layouts (nested tables, side-by-side images) may not paginate ideally — check the preview before printing.

## Bulk PDF export

There is no bulk-export-to-PDF action. Each PDF is generated per-post on demand. If you need PDFs of a hundred articles, open each in turn.

For at-scale archival, prefer the [Git workflow](/post-git-workflow) export — it produces a zip of Markdown files, which can be converted to PDFs off-platform using any Markdown-to-PDF toolchain if PDF specifically is required.

## Caveats

- **Fonts** — the PDF uses standard web-safe fonts. Very

specific typographic identities (custom fonts loaded from the public site's CSS) may not render in the PDF.

- **Dark-mode** — the PDF is always light-mode (black on

white). The public site's dark-mode variant does not affect the export.

- **Very large articles** — articles with hundreds of embedded

images produce large PDF files (tens of megabytes). Trim the gallery before exporting if size is a concern.

- **HTML that assumes JavaScript** — dynamic components

(interactive charts, embedded widgets that require JavaScript) render as static placeholders in the PDF.

## Tips

- **Export the locale you're going to share.** A reviewer who

reads Czech should get the Czech PDF, not the English one.

- **Preview before printing bulk.** Open one PDF, check the

layout, then generate the rest. Small styling issues (a main image that renders too large, an unfortunate page break) are easier to spot when you have one to look at first.

- **Keep the external identifier visible.** The footer

identifier is the fastest way for someone reading the PDF to find the source article in the admin later. Do not crop it out when redesigning the PDF for external distribution.

## Related

- [Post management overview](/post-management)
- [Post editor](/post-editor)
- [Gallery and images](/post-gallery-and-images)
- [Git workflow](/post-git-workflow) — for at-scale Markdown

export as an alternative to per-post PDF.

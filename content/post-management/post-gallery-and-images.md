---
category: "content/post-management"
tags: ["posts", "images", "gallery", "ai"]
published_at: "2026-08-14T09:00:00.000Z"
---


Gallery and images
==================

Every post can carry a gallery of images alongside its text body. One
of them is designated as the **main image** and drives the article's
thumbnail in the grid, the hero image on the public article page, and
the social-media card served to Facebook, LinkedIn, X, or any other
platform that reads OpenGraph metadata. The rest of the gallery is
available for embedding inline in the article body or displaying as a
lightbox for readers.

The gallery lives on its own tab on the post detail page. This
article covers the manual upload flow, the AI generation flow (backed
by the organisation-wide reference-image library), main-image
selection, ordering, deletion, and how gallery images are exposed to
the public site and API.

## Where to find it

Open any post from `/post` → the detail page has a **Gallery** tab
right next to the Content tab. The tab shows every image attached to
the post as a thumbnail grid, with the main image marked with a star.
Below the grid is an upload field and, when the organisation has
configured a reference-image library, an AI generation form.

## Uploading images manually

Two paths:

- **Drop a file** into the upload area. Supports one or many files at
  once; every dropped file is uploaded in parallel.
- **Click to browse** — the standard file picker opens.

Accepted formats: PNG, JPEG, WebP, GIF. Anything else is rejected
with an error toast.

Every uploaded image is stored, thumbnailed for the grid, and given a
public URL that appears in the details panel when you click the
image. You can copy the URL and paste it into the article body to
embed the image inline.

There is no size cap enforced client-side, but very large files (>10
MB) will noticeably slow the reader's page load. If you are uploading
photographs, consider resizing to a display-appropriate width (1600
pixels wide covers every device) before upload.

## Selecting the main image

Click any thumbnail and choose **Set as main image**. The star
indicator moves to that image; the previous main image (if any) is
demoted back to a normal gallery image.

The main image is what gets used for:

- The **thumbnail** in the admin article grid.
- The **hero image** at the top of the public article page.
- The **OpenGraph og:image** tag emitted when the article URL is
  shared to social media. Facebook, LinkedIn, X, and every messenger
  app read this tag to build a rich-preview card.
- The **fallback** for RSS-feed items and API responses that expose
  a single article-summary image.

A post can have zero main images. In that case the grid shows a
placeholder icon, the public hero renders as text-only, and the
OpenGraph tag is omitted. The SEO health-score pill penalises
posts without a main image.

## Reordering images

Click and drag a thumbnail to a new position. The new order persists
immediately without a save button. The order matters for:

- The **lightbox navigation** — readers who click one image can page
  through the gallery in the order you set.
- The **public API response** — the gallery array is returned in the
  order you set.
- **AI-generated moodboards** — if the reference-image library uses
  gallery images from an existing post, the order acts as a
  priority.

## Removing images

Click a thumbnail and choose **Delete**. A confirmation appears; on
confirm the image is removed from the gallery and the underlying
file is scheduled for deletion from storage.

**Caveat:** if the deleted image was the main image, the post is
left without a main image and the star must be manually re-assigned
to a different image (or left empty). The platform does not
auto-promote another gallery image, deliberately, so an accidental
main-image deletion is easier to notice and correct.

## The lightbox

Clicking an image thumbnail (outside of the admin) opens the lightbox
— a full-screen viewer with next/previous navigation, keyboard
shortcuts (arrow keys and Escape), and a close button. The lightbox
respects the gallery order.

The lightbox is a feature of the public site's article renderer, not
the admin. It appears automatically when a reader clicks an inline
gallery image on the article page. Inside the admin, clicking a
thumbnail opens the same lightbox for preview purposes.

## AI-generated images

If the organisation has set up a reference-image library (managed
under `/settings/posts`), a **Generate with AI** form appears at the
bottom of the Gallery tab.

The generation flow:

1. **Prompt** — describe what you want. "A minimalist illustration of
   a laptop with a coffee cup on a wooden desk, warm morning light".
2. **Aspect ratio** — one of `3:2` (default), `16:9`, `4:3`, `1:1`,
   `9:16`. Match the aspect to where the image will be used — `16:9`
   for hero images, `1:1` for social cards, `3:2` for general
   illustration.
3. **Style intent** — carried by the reference-image library (see
   below); the images you activate in the library act as a
   moodboard steering the model toward a consistent visual style.

Click **Generate**. The AI produces an image within a few seconds.
Preview it, and if you like it click **Add to gallery** — the image
is uploaded to the post's storage and appears in the thumbnail grid
just like a manually uploaded one. You can regenerate as many times
as you want; each attempt is a discrete generation call, so
generating five variations and keeping the best is a common flow.

### The reference-image library

The reference-image library is an organisation-wide setting that
controls the visual style of every AI-generated image. It sits at
`/settings/posts` and contains:

- A **mood prompt** — free text describing the overall aesthetic:
  "Minimalist, muted colours, natural light, no people". This
  prompt is appended to every generation request.
- A **reference image set** — up to a few dozen images you upload.
  Marking them **active** signals the model to treat them as visual
  examples. Inactive images stay in the library but do not
  influence generation.
- **Default aspect ratio** — the aspect used when a per-post
  generation form does not specify one.

The library is one-per-organisation. Everyone generating images for
any post uses the same moodboard, which keeps the site's visual
identity consistent even when many authors are contributing.

If no active reference images exist, the "Generate" button on the
post gallery is disabled with a hint to visit the library setup.

## Embedding gallery images in the article body

Uploading an image to the gallery does not automatically insert it
into the article body. To embed:

1. Open the image in the Gallery tab.
2. Copy the URL from the details panel.
3. Switch to the Content tab.
4. Paste the URL into the markdown editor inside an image tag:

    ![Alt text describing the image](https://…)

The image will render inline both in the editor preview and on the
public article page.

You can also embed the same gallery image multiple times in the
article body — it is just a URL reference; the storage backs many
references cheaply.

## Alt text

The markdown syntax `![alt text](url)` includes an alt-text field.
**Fill it in every time.** Alt text is used by:

- **Screen readers** for visually impaired visitors.
- **Search engines** as an indexing signal.
- **Image loading fallbacks** when a browser cannot render the
  image.

An empty alt (`![](url)`) is a strong accessibility signal for
"decorative image, ignore" — do not use it unless the image is
genuinely decorative.

## What is exposed on the public site and API

- **Main image URL** — exposed in article summaries (grid pages, RSS,
  API `mainImageUrl` field, OpenGraph tag).
- **Gallery** — exposed in the article detail (article page,
  API `gallery` field), in the order set by the admin.

The public API returns absolute HTTPS URLs; embedding an article in
another product typically just uses those URLs directly. See
[API integration](/post-api-integration).

## Storage and lifecycle

Every uploaded image is stored in blob storage. Storage lifecycle:

- **Upload** — new file, live immediately.
- **Delete** — the gallery entry is removed. The underlying blob may
  remain in storage for a grace period before physical deletion, so a
  deleted-then-restored gallery entry may still resolve.
- **Post deletion** — soft-deleting the post does not delete gallery
  images. The images remain and are visible again when the post is
  restored.

There is no admin-side "download all gallery images" — for a backup
of one post's images, use the [PDF export](/post-pdf-export) which
embeds all images inline in the exported PDF, or use the [Git
export](/post-git-workflow) which references every image URL in the
markdown body.

## Tips

- **Set the main image early.** SEO health, grid thumbnails, and
  social cards all depend on it. The article looks incomplete on
  every listing without one.
- **Reuse images across posts.** Every gallery is per-post storage,
  but the URL of an image uploaded to one post's gallery can be
  referenced from another post's body. This is common for
  organisation logos, disclaimer badges, or a signature graphic.
- **Trim your reference-image library.** Ten actively curated
  reference images produce better generation than fifty
  half-hearted ones. Deactivate rather than delete when in doubt.
- **Aspect ratios matter for social sharing.** LinkedIn and
  Facebook prefer 1.91:1 (close to 16:9); Twitter/X prefers
  16:9 wide or 1:1 square. Generate at the right ratio for the
  first-place-you-share it.
- **Photograph over stock illustration** when the article is a case
  study or a story. Stock illustrations start to feel generic when
  every article uses them.

## Related

- [Post editor](/post-editor)
- [Post management overview](/post-management)
- [Attachments](/post-attachments) — for non-image files (PDFs,
  spreadsheets, downloadables) that also live with the post but are
  not gallery images.
- [AI tools](/post-ai-tools) — for the full picture of AI-assisted
  authoring across the module.
- [PDF export](/post-pdf-export)
- [API integration](/post-api-integration)

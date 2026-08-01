---
id: "HX5Du5QX2ES2i5Gp"
code: "docs-migration-logo"
category: "content/logo"
tags: []
published_at: "2026-07-26T18:33:17.168Z"
---


Logo
====

## Logo variants

The BizKitHub logo comes in two variants that share the same shape but invert their contrast.

| Variant | Use on | Download |
|---------|--------|----------|
| Light logo | Dark headers, gradient hero sections, video overlays | `https://cdn.bizkithub.com/images/bkh-logo/bkh-light.svg` |
| Dark logo | Light backgrounds, print, documents | `https://cdn.bizkithub.com/images/bkh-logo/bkh-dark.svg` |

Both files are SVG. Downstream tooling can rasterise them to PNG at any size without loss.

## Size specifications

| Context | Rendered size | CSS class |
|---------|---------------|-----------|
| Navigation header | 150 × 32 px | `h-8 w-auto` |
| Footer | 188 × 40 px | `h-10 w-auto` |
| Hero section | 470 × 100 px | `h-24 w-auto` |

Keep the intrinsic aspect ratio; do not stretch or squash the logo.

## Clear space

Preserve a clear space around the logo equal to the height of the "B" mark. Do not place other logos, dense imagery or text inside that area.

## Brand colours used by the logo

| Token | Hex | Usage in the mark |
|-------|------|-------------------|
| Primary | `#ec6c50` | Accent stroke |
| Ink | `#1d2125` | Wordmark on light backgrounds |
| White | `#ffffff` | Wordmark on dark backgrounds |

## What not to do

- Do not recolour the logo outside the brand palette.
- Do not apply drop shadows, glows or outer strokes.
- Do not rotate or skew.
- Do not embed the logo inside another shape (circle, square, badge) unless a partner requires it, in which case use the light variant on a solid brand background.

## Attribution

Third parties writing about BizKitHub may use the light or dark logo without prior approval, as long as it links to `https://bizkithub.com` and stays within these guidelines.

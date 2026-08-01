---
id: "doRgJnQolmcx6G24"
code: "docs-migration-pdf-generator"
category: "developers/pdf-generator"
tags: []
published_at: "2026-07-26T18:33:24.538Z"
---


PDF Generator
=============

## Endpoint

```
POST https://pdf.bizkithub.com/generator
```

Send the HTML as the request body (`text/html` or plain text). Query parameters control paper size, margins and pagination mode.

## Query parameters

| Parameter | Type | Behaviour |
|-----------|------|-----------|
| `content` | string | HTML content. Usually sent as the POST body; may be provided as `?content=` for GET requests. |
| `format` | string | Standard paper format (A4, Letter, …). Used when `width` is not set. Default is A4. |
| `width` | string | Custom page width as a CSS length (`80mm`, `210mm`, `800px`). Overrides `format` and makes the page size explicit. |
| `height` | string | Custom page height (CSS length). Used only in fixed-size mode. If `width` is set and `fitHeight` is off, height defaults to A4 height (297mm). |
| `autoHeight` | boolean | Switches from zero margins to print-safe margins that apply consistently across pages. Improves page breaks and prevents clipping at page edges. |
| `margin` | string | Overrides margin size when `autoHeight=true`. Accepts CSS shorthand (1–4 values), e.g. `12mm 10mm` or `2mm`. |
| `fitHeight` | boolean | Receipt mode: generates a single-page PDF whose height is derived from the rendered content. Best combined with `width` (e.g. 80 mm). |
| `uuid` | string | Optional identifier stored in the PDF metadata keywords. |
| `author` | string | Optional author label included in the PDF metadata (Author, Creator, Producer). |

**Defaults.** Without `autoHeight`, margins are zero. With `autoHeight=true`, sensible print margins are applied — A4-style for standard pages, smaller margins for narrow receipt widths. Use `margin` to override.

## How the sizing combines

1. **Paper sizing priority.** If `width` is provided, it becomes the primary sizing input and overrides `format`. If `height` is also provided, the page size is fully explicit.
2. **Margins.** Margins are zero by default; `autoHeight=true` enables print-safe margins that apply consistently across pages.
3. **Receipt mode.** With `fitHeight=true`, the output is a single page whose height is derived from the rendered content — best used with a fixed `width`.

## Examples

Default (zero margins) — full-bleed, content controls its own padding:

```
POST https://pdf.bizkithub.com/generator
```

A4 with print-safe margins — recommended for multi-page documents:

```
POST https://pdf.bizkithub.com/generator?autoHeight=true
```

Narrow paginated page:

```
POST https://pdf.bizkithub.com/generator?autoHeight=true&width=80mm
```

Receipt mode — single page, auto height:

```
POST https://pdf.bizkithub.com/generator?autoHeight=true&fitHeight=true&width=80mm&margin=2mm
```

Custom label / ticket sizing:

```
POST https://pdf.bizkithub.com/generator?autoHeight=true&width=100mm&height=150mm&margin=4mm
```

## JavaScript helper

```js
async function generatePDF(html, opts = {}) {
  const params = new URLSearchParams();
  if (opts.autoHeight) params.set('autoHeight', 'true');
  if (opts.width) params.set('width', opts.width);
  if (opts.fitHeight) params.set('fitHeight', 'true');
  if (opts.margin) params.set('margin', opts.margin);

  const response = await fetch(`https://pdf.bizkithub.com/generator?${params}`, {
    method: 'POST',
    headers: { 'Content-Type': 'text/html' },
    body: html,
  });
  if (!response.ok) throw new Error('PDF generation failed');
  return response.blob();
}
```

## Notes

- In multi-page mode, keep the HTML layout print-friendly — avoid fixed-height containers around long content.
- For receipts in `fitHeight` mode, let text wrap naturally rather than forcing widths on child elements.

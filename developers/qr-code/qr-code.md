---
id: "g39960L0J53ZPHXW"
code: "docs-migration-qr-code"
category: "developers/qr-code"
tags: []
published_at: "2026-07-26T18:33:23.035Z"
---


QR Code
=======

## Endpoint

```
GET https://cdn.bizkithub.com/qr
```

No authentication is required. The response is a PNG image with the appropriate `Content-Type: image/png` header.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | string | Yes | The text or URL to encode. |
| `size` | integer | No | Output size in pixels. Default 200, maximum 1000. |

## Examples

Basic QR code:

```
GET https://cdn.bizkithub.com/qr?text=Hello%20World
```

Larger QR code for a URL:

```
GET https://cdn.bizkithub.com/qr?text=https://bizkithub.com&size=400
```

vCard contact:

```
GET https://cdn.bizkithub.com/qr?text=BEGIN:VCARD%0AVERSION:3.0%0AFN:John%20Doe%0AORG:BizKitHub%0ATEL:+1234567890%0AEND:VCARD&size=300
```

## JavaScript helper

```js
function buildQrUrl(text, size = 200) {
  const params = new URLSearchParams({ text, size: String(size) });
  return `https://cdn.bizkithub.com/qr?${params}`;
}

document.getElementById('qr-image').src = buildQrUrl('https://bizkithub.com', 400);
```

## Response

- `Content-Type: image/png`
- Body: PNG binary data.

## Limits

| Metric | Value |
|--------|-------|
| Requests per hour per IP | 1 000 |
| Maximum output size | 1000 × 1000 px |
| Maximum text length | 2 000 characters |

## Error responses

| Status | Meaning |
|--------|---------|
| 400 | Missing or invalid parameters (for example missing `text`). |
| 429 | Rate limit exceeded — retry after a short delay. |

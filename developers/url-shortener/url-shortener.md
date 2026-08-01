---
id: "7i09nK55nMi63A2f"
code: "docs-migration-url-shortener"
category: "developers/url-shortener"
tags: []
published_at: "2026-07-26T18:33:25.949Z"
---


URL Shortener
=============

## Endpoint

```
GET https://xhp.cz/api/shorten
```

Returns a JSON response with the short URL, the resolved code, and the timestamp.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | string | Yes | The URL to shorten. Must include `http://` or `https://`. |
| `custom` | string | No | Custom short code (3–20 characters, alphanumeric only). |

## Examples

Basic shortening with an auto-generated code:

```
GET https://xhp.cz/api/shorten?url=https://bizkithub.com
```

Response:

```json
{
  "success": true,
  "data": {
    "short_url": "https://xhp.cz/abc123",
    "original_url": "https://bizkithub.com",
    "short_code": "abc123",
    "created_at": "2025-01-15T10:30:00Z"
  }
}
```

Custom short code:

```
GET https://xhp.cz/api/shorten?url=https://bizkithub.com&custom=bizkithub
```

Response:

```json
{
  "success": true,
  "data": {
    "short_url": "https://xhp.cz/bizkithub",
    "original_url": "https://bizkithub.com",
    "short_code": "bizkithub",
    "created_at": "2025-01-15T10:30:00Z"
  }
}
```

## Analytics

Every short URL automatically records:

- Total clicks and unique visitors.
- Geographic location (country, city).
- Referrer websites.
- Click timestamps and patterns.

Analytics for a short code are exposed on two endpoints:

| Where | URL |
|-------|-----|
| Browser dashboard | `https://xhp.cz/{code}+` |
| JSON API | `https://xhp.cz/api/stats/{code}` |

## JavaScript helper

```js
async function shortenURL(originalUrl, customCode = null) {
  const params = new URLSearchParams({ url: originalUrl });
  if (customCode) params.append('custom', customCode);
  const response = await fetch(`https://xhp.cz/api/shorten?${params}`);
  const data = await response.json();
  if (!data.success) throw new Error(data.error ?? 'Failed to shorten URL');
  return data.data.short_url;
}

async function getAnalytics(shortCode) {
  const response = await fetch(`https://xhp.cz/api/stats/${shortCode}`);
  return response.json();
}
```

## Limits

| Metric | Value |
|--------|-------|
| URLs per hour per IP | 500 |
| Click tracking | Unlimited |
| URL expiration | Never |
| Analytics access | Free |

## Error responses

| Status | Meaning |
|--------|---------|
| 400 | Invalid URL format or missing parameters. |
| 409 | The custom short code already exists. |
| 429 | Rate limit exceeded — retry after a short delay. |

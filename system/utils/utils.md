---
id: "Mi5YMEv74567FHtK"
code: "docs-migration-utils"
category: "system/utils"
tags: []
published_at: "2026-07-26T18:33:21.550Z"
---


Utils
=====

## Overview

BizKitHub exposes a small set of stateless HTTP utilities that any application can call without authentication. They are free to use within their published rate limits and are hosted on the same infrastructure as the main API.

## Available utilities

| Utility | Endpoint | Purpose |
|---------|----------|---------|
| [QR code generator](/qr-code) | `https://cdn.bizkithub.com/qr` | Encode any text or URL into a PNG QR code. |
| [PDF generator](/pdf-generator) | `https://pdf.bizkithub.com/generator` | Render HTML into a downloadable PDF. |
| [URL shortener](/url-shortener) | `https://xhp.cz/api/shorten` | Create short redirect URLs with click analytics. |

## Internal normalisation utilities

Beyond the network-facing utilities above, the platform ships a family of **stateless text normalisers** that are applied internally before any user-authored text is persisted. They are not accessible as endpoints — they are documented so integrators know what shape their input will land in after ingestion, and so operators can reason about the canonical form of stored fields (search matching, deduplication, exports).

- [String normalisation](/string-normalisation) — the full family of text normalisers: slug generation, ASCII transliteration, HTML sanitisation, human-label conversion, description formatting for storefront rendering, and secret masking.
- [Phone normalisation](/phone-normalisation) — canonical `+<prefix> <value>` storage format and the invariants every stored phone number satisfies.

## Common properties

- **No authentication** required for basic usage.
- **HTTPS only** — plain HTTP requests are rejected.
- **Global CDN** distribution keeps latency low from most regions.
- **Rate limits** are per-IP; see each utility for its specific quota.

## When to use these

The utilities are designed for one-off tooling: generating a receipt PDF from a server, encoding a booking reference into a QR code, or handing out a short tracking URL. They are not intended as a replacement for a full CMS, print-server or analytics stack.

## Support and status

Availability is reported on the BizKitHub status page. Feature requests and bug reports can be submitted through the standard support channel.

---
id: "w0d9gJQ6f0hzgWOD"
code: "docs-migration-color"
category: "content/color"
tags: []
published_at: "2026-07-26T18:33:13.549Z"
---


Color
=====

## Brand palette

The BizKitHub visual identity is built around a warm orange primary, a near-black ink for text, and a neutral canvas of very light greys. The palette is intentionally small so that product surfaces stay coherent across web, e-mail and PDF.

| Token | Hex | Purpose |
|-------|------|---------|
| Primary | `#ec6c50` | Calls-to-action, highlights, accent |
| Primary soft | `#fbeeeb` | Tinted background for primary blocks |
| Ink | `#1d2125` | Body text, headings, navigation |
| Canvas | `#f9fafb` | Page background |
| Surface | `#fcfcfd` | Cards, panels, tables |
| Border | `#e5e7eb` | Dividers and outlines |

## Semantic colours

Semantic colours communicate state and are preserved across the whole platform so their meaning does not shift between screens.

| Token | Hex | Meaning |
|-------|------|---------|
| Success | `#10b981` | Positive state, "ok", healthy |
| Warning | `#f59e0b` | Attention required, degraded |
| Error | `#ef4444` | Failure, blocked action |
| Info | `#3b82f6` | Neutral notice |

## HTTP method colours

For API reference and log surfaces, HTTP verbs use a fixed colour map so developers can scan a request list quickly.

| Method | Colour |
|--------|--------|
| GET | Emerald |
| POST | Amber |
| PUT | Blue |
| PATCH | Purple |
| DELETE | Rose |

## HTTP status families

- **2xx** — emerald, success.
- **3xx** — blue, redirection.
- **4xx** — amber, client error.
- **5xx** — rose, server error.

## Usage guidelines

- Use the primary colour sparingly, primarily for the single most important action on a screen.
- Maintain a minimum contrast ratio of 4.5:1 for body text and 3:1 for large text.
- Do not introduce new brand hues without updating this reference first.
- Dark surfaces (embedded terminals, code blocks) intentionally keep a fixed near-black background regardless of surrounding theme.

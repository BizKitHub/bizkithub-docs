---
category: "system/utils"
tags: []
published_at: "2026-08-01T00:00:00.000Z"
---


String normalisation
====================

Before any user-authored text is persisted, the platform runs it through a **normalisation** pipeline. The pipeline cleans up common inconsistencies — duplicated whitespace, awkward line breaks, unusual capitalisation, unsafe HTML — so that downstream consumers (search, exports, e-mail templates, invoices, feeds) receive predictable input regardless of how sloppy the original entry was.

Normalisation is context-sensitive. A slug destined for a URL is normalised very differently from a rich description destined for a product page. This article documents the individual normalisers, when to use each, and what invariants each one guarantees on its output.

Every normaliser is covered by automated tests. If you find an input that the platform normalises incorrectly, please report it — the fix is almost always "add a test case and adjust the transform" rather than a design change.

## `toAscii`

Converts an arbitrary text string into the ASCII character set — letters of the English alphabet, digits, hyphens, spaces and a small set of documented special symbols. Diacritics are stripped, non-Latin scripts are transliterated where possible, and remaining unrepresentable characters are removed.

Example: `příliš žluťoučký kůň úpěl ďábelské ódy` becomes `prilis zlutoucky kun upel dabelske ody`.

Use it whenever downstream consumers require pure ASCII — legacy protocols, filename generation, some search backends.

## `toSlug`

Converts an arbitrary string into a URL-safe slug. Internally builds on `toAscii` and then replaces whitespace and special characters with hyphens. Where a special character has a natural word equivalent, the character is expanded to that word before slugification to preserve meaning for SEO.

Examples: `Joolz Aer+` becomes `joolz-aer-plus`; `Project Review: Q1 & Q2` becomes `project-review-q1-and-q2`; `Привет, мир!` becomes `priviet-mir`.

Guarantees on the output:

- Contains only lowercase letters of the English alphabet, digits and hyphens. No whitespace, no punctuation.
- Consecutive hyphens are collapsed into one. The slug never begins or ends with a hyphen.
- A defined subset of special characters is expanded to English words (`+` → `plus`, `&` → `and`, …) rather than dropped, for SEO friendliness.
- Emoji and other characters without a URL-safe equivalent are removed.
- Non-Latin scripts (Cyrillic, Greek, etc.) are transliterated.
- Output length is capped at 64 characters by default; the limit is configurable.

## `convertHtmlToText`

Strips HTML markup and returns a safe, plain-text representation of the input. Where a tag has a natural text equivalent, that equivalent is substituted — `<br>` becomes a newline, list items are prefixed with a marker, and so on. Use it to derive a plain-text snippet from rich HTML for search indexing, e-mail plain-text parts, or truncated previews.

## `htmlSpecialCharsDecode`

Decodes HTML entities back into their native characters. Typically used when parsing scraped headings, links or descriptions that contain non-breaking spaces, angle brackets or other characters that are escaped in HTML for transport.

## `camelCaseToHumanLabel`

Converts a camelCase identifier into a human-readable label — a space is inserted before each capital letter, and the resulting string's capitalisation is normalised.

Examples: `date` becomes `Date`; `ToBankName` becomes `To bank name`.

Use it to derive default UI labels from technical property names when a hand-authored label is not available.

## `castValueToScalar`

Converts a scalar string into its most specific scalar type. Useful for parsing routing parameters or URL query values where the underlying type is not known ahead of time.

Examples: `'test'` stays as the string `'test'`; `'123'` becomes the number `123`; `'true'` becomes the boolean `true`.

## `compressHtml`

Compresses arbitrary HTML into a compact, semantically-equivalent form. Whitespace between tags is normalised, HTML comments and non-content markup are dropped, and the output is minimised without changing the rendered result.

The compressor operates on tokens; it does not validate document structure. Use it to shrink stored HTML templates or archived e-mail bodies where transport size matters and no downstream consumer relies on cosmetic formatting.

## `firstUpper`

Uppercases the first character of a string, if that character has an uppercase form. Digits and symbols pass through untouched. Useful when composing sentences from user-entered fragments that may or may not start with a capital.

## `foldLine`

Normalises multi-line strings by trimming whitespace at the start and end of each line and prefixing every non-first line with a single space of indentation. The main use case is generating ICS (iCalendar) files, whose fold rules require exactly this pattern.

## `formatDescriptionForFrontend`

The heaviest normaliser — a universal formatter for user-authored descriptions destined for public rendering on the merchant's storefront. Users are famously imprecise: they mix formatting styles, forget non-breaking spaces, misuse heading levels, produce inconsistent indentation, paste HTML fragments into markdown editors and markdown fragments into HTML editors, and generally give the platform a very rough draft of what they meant.

`formatDescriptionForFrontend` tries very hard to interpret whatever the user wrote and to render it into a clean, safe HTML document that a storefront can display without further processing. Bare text blocks are wrapped in `<p>` tags even when the user forgot to. Dangerous constructs (script tags, event handlers) are removed. Locale-specific typographic details (Czech quotes, non-breaking spaces before short words) are inserted where appropriate.

The return type is `TrustedHTML` — the platform vouches for the safety of the output and it can be inserted into a rendered page without additional sanitisation. The preferred input dialect is markdown, but the function also accepts plain text, HTML, and free mixtures of the two.

## `formatSecretMask`

Masks a sensitive string, revealing only the first N characters and never disclosing the total length of the original. Default is four visible characters.

Used for displaying values that must be at least partially visible so a human can check "yes, this is the one" — bank account numbers, security tokens, API-key fingerprints — without exposing enough of the value to be useful to an attacker.

## `normalizeString`

The gentlest normaliser: safe, generic formatting fixes that can be applied to any string. Trims outer whitespace, collapses duplicate whitespace, normalises line endings. Use it as a catch-all before persisting free-form user input where no more specific normaliser applies.

## Related articles

- [Utils](/utils) — index of the platform's stateless utilities.
- [Phone normalisation](/phone-normalisation) — dedicated normalisation rules for phone numbers.

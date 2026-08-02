---
category: "content/post-management"
tags: ["posts", "api", "integration", "developers"]
published_at: "2026-08-02T09:59:43.000Z"
---


API integration
===============

Every post authored in the Posts module is exposed to external
integrators through the public REST API under `/api/v1/post/*`.
The API is stable, versioned, documented via Swagger, and
authenticated with a per-organisation API key. Integrators can
list, search, and read individual articles; retrieve per-locale
translations; consume feed and RSS endpoints; and read reader
comments — everything the public site does, available for
building custom front-ends, mobile apps, or content-aggregation
tools.

This article covers the endpoints, authentication, the response
shapes, common integration patterns, and the guarantees around
compatibility over time.

## Authentication

Every request needs a valid API key. See the
[API key](/docs-migration-api-key) article for how keys are
issued, formatted, rotated, and passed on the request. The
short version:

- Include the key as `apiKey` in the query string or JSON body.
- Every response respects the organisation scope of the key —
  you never see posts from another organisation, even if you
  know their identifier.
- Rate limits apply per key tier.

The rest of this article assumes a valid `apiKey` is included on
every call shown.

## Endpoints

### `GET /api/v1/post/list`

List posts belonging to the calling organisation.

**Query parameters:**

- `locale` — the locale to return the post's title, body, and
  perex in. Defaults to the organisation's primary locale.
- `mainCategoryCode` — filter to posts whose main category has
  this code. Optional.
- `status` — filter by computed status (`draft`, `scheduled`,
  `published`, `private`, `archived`). Optional.
- `visibility` — filter by raw visibility (`public`, `private`,
  `unlisted`, `subscribe`). Optional.
- `hasMainImage` — `"true"` or `"false"` to filter by whether
  a main image is set. Optional.
- `missingTranslation` — `"true"` to filter to posts missing at
  least one enabled locale. Optional.
- `tagCode` — filter to posts carrying the tag with this code.
- `kind` — `post`, `branch`, or `all`. Defaults to `post`.
- `orderBy` — `<field>:<asc|desc>`, e.g. `publishedDate:desc`.
  Fields: `publishedDate`, `updatedDate`, `insertedDate`,
  `title`, `wordCount`, `commentsCount`, `viewsCount`,
  `ratingAverage`.
- Standard pagination — `page`, `limit` (or the datagrid-envelope
  equivalents).
- `filterFulltextQuery` — free-text search across title, body,
  and perex.

**Response:** an object with `items` (an array of post summaries)
and `itemCount` (the total matching count before pagination).

Each item includes:

- `id` — the article's external identifier (stable, unique per
  organisation).
- `title` — up to 140 characters, truncated with an ellipsis.
- `mainCategoryId`, `mainCategoryName`.
- `mainAuthorId`, `mainAuthorName`.
- `publishedDate`, `insertedDate`, `updatedDate`.
- `visibility`, `status`.
- `mainImageUrl`.
- `isStar`, `isDeleted`.
- `wordCount`, `readingTimeMinutes`.
- `hasPerex`.
- `tags` — array of `{ id, name, code, color }`.
- `translatedLocales` — array of locale codes for which a
  translation exists.
- `staleLocales` — subset of `translatedLocales` whose reference
  is out of date.
- `viewsCount`.
- `viewsRecentDelta`, `viewsPriorDelta` — for the trend arrow.
- `ratingAverage`, `ratingCount`.
- `commentsCount`.

### `GET /api/v1/post/detail`

Full detail for a single post.

**Query parameters:**

- `id` — the post's external identifier. Required.
- `locale` — the locale to return content in. Defaults to
  primary.

**Response:** the article summary above plus:

- `content` — the full HTML body in the requested locale.
- `perex` — the article's short summary.
- `metaTitle`, `metaDescription` — SEO fields.
- `authorIds` — the ordered list of every author's external
  identifier.
- `attachments` — array of `{ id, filename, downloadUrl, size,
  contentType, insertedDate }`.
- `translatedLocales`, `staleLocales` — same semantics as on
  list.

### `GET /api/v1/post/{externalId}/comments`

Every comment on the given post, in chronological order.
Author names and comment text are included; commenter emails are
NOT (email is admin-only).

### `GET /api/v1/post/feed`

Convenience endpoint returning the most recent published posts
in a shape optimised for feed consumers — the same fields as
`list` but sorted by publication date descending and always
excluding private, unlisted, subscribe-only, and archived
posts.

### `GET /api/v1/post/rss`

RSS 2.0 XML feed of the most recent published posts. Suitable
for direct consumption by feed readers. Locale is picked via
`locale` query parameter (or defaults to primary).

Per-category variants are available at
`/api/v1/post/category/{categoryCode}/rss`.

## Visibility filtering

The API respects post visibility strictly:

- **`public`** — always returned.
- **`unlisted`** — returned on detail requests when the caller
  supplies the specific `id`, but NOT included in `list` or
  `feed` responses. This matches the behaviour of the public
  site.
- **`subscribe`** — only returned to authenticated subscribers.
  Anonymous integrator requests receive a gated response.
- **`private`** — never returned on any endpoint. Editable only
  through the admin.
- **`archived`** (deleted) — never returned. To surface deleted
  posts for a specific integration, use the admin surface, not
  this API.

## Locale handling

For every content-returning endpoint, the `locale` query
parameter picks which language's title, body, perex, and meta
fields are returned. Behaviour:

- **Requested locale exists** — return it.
- **Requested locale is missing** — fall back to the
  organisation's primary locale.
- **Neither** — an empty response for the content fields (rare;
  only when the post has no translations at all).

The response always tells you which locale was actually served
via the `translatedLocales` field, so a caller can detect
fallback and react.

## Rate limits

Every API key has a tier (Production, Development, System — see
[API key](/docs-migration-api-key) for the tiers). Requests
above the tier's per-minute quota receive an HTTP 429 with a
`Retry-After` header. Well-behaved integrations should
implement exponential backoff on 429.

Public read endpoints are cached edge-side for a short interval
(seconds); repeated identical requests within that window
return cached responses that do not count against the quota as
aggressively.

## Errors

Standard shape for every error response:

```json
{
  "error": {
    "code": "post_not_found",
    "message": "Post 'aBcDeFgH12345678' was not found in this organisation.",
    "details": {}
  }
}
```

Common error codes on the post endpoints:

- `post_not_found` — the requested `id` does not exist or the
  key does not have access.
- `invalid_locale` — the locale parameter is not a supported
  locale code.
- `rate_limit_exceeded` — too many requests; wait for
  `Retry-After` seconds before retrying.
- `unauthorised` — API key missing, malformed, or invalid.
- `forbidden` — the endpoint is not enabled for the caller's
  tier.

## View counting

Every `detail` request (and, depending on the integration
theme, every `list` request) increments the article's view
counter. See [Views and analytics](/post-views-and-analytics)
for the buffering behaviour.

Integrations that want to fetch article data without
inflating the view counter (e.g. for internal migration
tooling, editorial dashboards) should include the
`countAsView=false` query parameter. This is respected on
`detail` and suppresses the counter increment.

## Common integration patterns

### Embedding an article in another product

1. Call `/detail` with the target `id` and desired `locale`.
2. Render `title`, `perex`, `mainImageUrl`, and `content`
   (the HTML body) inside your own theme.
3. Optionally show `mainAuthorName`, `publishedDate`,
   `readingTimeMinutes` for byline context.

### A syndicated site aggregating multiple organisations

1. For each source organisation, use its API key.
2. Call `/feed` on each to get recent posts.
3. Merge, dedupe (using the `id` per source), sort, render.

### A mobile app browsing the article catalogue

1. Call `/list` with pagination and the current visitor's
   locale.
2. Render the list; on tap, call `/detail`.
3. Cache aggressively on the client — the article `id`
   uniquely identifies a version, and any change bumps
   `updatedDate` which the client can use as a cache-buster.

### Building a custom search interface

1. Call `/list` with `filterFulltextQuery` and locale.
2. Render results, highlighting the query terms in the
   returned `title` and `perex`.

## Compatibility guarantees

The `/api/v1/post/*` endpoints are covered by the platform's
public API stability policy:

- **Additive changes** (new fields, new optional parameters,
  new endpoints) can appear at any time and are not
  breaking.
- **Behavioural changes** (removing a field, renaming a field,
  changing the shape of an existing response) require a new
  major version — `/api/v2/*` — and the `v1` endpoints remain
  available for the announced deprecation window (typically at
  least a year).
- **Deprecation announcements** appear in the platform's
  release notes; integrations should subscribe to those.

## Where the OpenAPI spec lives

The full machine-readable OpenAPI spec is available at
`https://docs.bizkithub.com/api` — every endpoint is
documented there with its request parameters, response shape,
error codes, and inline examples. The Swagger explorer on the
docs site lets you try a call live from your browser using your
own API key.

## Related

- [API key](/docs-migration-api-key) — how authentication works.
- [Post management overview](/post-management) — the admin
  surface the API mirrors.
- [Translations](/post-translations) — for how locale
  parameter interacts with translation freshness.
- [Views and analytics](/post-views-and-analytics)
- [Comments and moderation](/post-comments) — for how comment
  data is exposed.
- [Reader feedback](/post-reader-feedback) — for the rating
  fields on the API.

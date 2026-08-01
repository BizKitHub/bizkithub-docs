---
id: "36TmKi8eO45b4dIi"
category: "sales/products"
tags: []
published_at: "2026-08-01T00:00:00.000Z"
---


Product feed API
================

The product feed is the read endpoint that powers any many-item product listing on a merchant's storefront — the front page, a category page, search results, or a comparison-engine export. It returns a page of products with the fields a listing needs to render (name, price, thumbnail, availability, main category) without the full detail payload. Callers can hit the feed on every page view; the platform serves it from an internally cached snapshot refreshed on every catalog change, so it is cheap to call at high frequency.

A **product** in the platform is broader than "an item with a price": it can be physical goods, a digital download, a virtual gift, an add-on service, a calendar-bound event (tickets, classes, camps), or a non-sellable directory entry (a trainer in a gym, a room in a venue). All of them live in the same virtual **product catalog** and are surfaced by this endpoint.

For the admin-side counterpart — how products are created, priced and grouped from the administration — see the [Products](/products) article. This document is the developer contract for the feed endpoint. For a single-product detail response, see the [Product detail API](/product-detail).

## Endpoint

```
GET https://api.bizkithub.com/product/v1/feed
```

Authentication is via the standard `apiKey` parameter (see the [API key](/api-key) article).

## Query parameters

All parameters are optional; if none are supplied the feed returns every product in the organisation, in the platform's default order.

| Property | Type | Meaning |
|----------|------|---------|
| `query` | `string` | Full-text search term. Matched against product name, code and description. |
| `category` | `string` | Category code the products must belong to. Defaults to all categories. |
| `page` | `number` | 1-based page number for large result sets. Defaults to `1`. |
| `limit` | `number` | Maximum number of items per page. Defaults to `32`. |

## Response

```ts
export type ProductId = `${string}`;

export type PublicProductFeedResponse = {
  count: number;
  items: ProductFeedItem[];
};

export type ProductFeedItem = {
  id: ProductId;
  name: string;
  slug: string;
  shortDescription?: TrustedHTML;
  mainImageUrl?: string;
  mainCategory?: { code: string; name: string };
  price: number;
  position: number;
  active: boolean;
  soldOut: boolean;
  warehouseAllQuantity?: number;
  warehouseLimit?: number;
  customFields: Record<string, string>;
  event?: PublicProductEventResponse;
};
```

Each item in the feed is a compact representation intended for listing UI. Follow the item's `slug` to the [Product detail API](/product-detail) endpoint when the caller needs the full detail — long description, gallery, variants, physical dimensions, and all other rich fields.

## Ordering

The result list is deterministically ordered. **Non-sold-out** items are always shown first, and within that partition items are sorted by their manually assigned **position**. Sold-out items are placed after available items.

The order is stable across calls. Two consecutive requests with the same parameters return items in the same slots even if unrelated products in the catalog have been edited in the meantime. This is important for SEO: a listing page whose product order changes every hour looks unstable to search engines and dilutes backlinks that point at specific list positions.

## Freshness

The feed items are served from a cached snapshot refreshed on every catalog change (name, price, images, category assignment, variants, custom fields). Volatile operational fields — availability, sold-out flag, deletion flag — are enriched at read time from the live database, so the response is always a consistent snapshot of marketing data plus real-time operational state. No manual cache invalidation is needed; a merchant edit is visible on the next call.

## Related articles

- [Product detail API](/product-detail) — the companion endpoint for a single product's full payload.
- [Product variants](/product-variants) — how variants are modelled and referenced.
- [Products](/products) — administration guide.
- [Product categories](/product-categories) — hierarchy of categories that the feed filters by.
- [Order create API](/order-create) — placing an order referencing a product from the feed.
- [API key](/api-key) — how to authenticate the request.

---
category: "developers/product-catalog-api"
tags: []
published_at: "2026-08-01T00:00:00.000Z"
---


Product catalog API
===================

The product catalog API exposes the same catalog that powers the merchant's e-shop as a pair of stable, high-throughput read endpoints: a **feed** for browsing many products at once, and a **detail** for rendering the page of a single product. Both are designed to be called on every page view of a public storefront without special caching on the caller's side — the platform serves them from an internally cached snapshot that is refreshed on every catalog change, so responses stay fast even when the underlying data model is complex.

A product in the platform is broader than "an item with a price". It represents anything the merchant sells, presents or exposes to a visitor: physical goods, digital downloads, virtual gifts, add-on services, calendar-bound events (tickets, classes, camps), even non-sellable directory entries such as trainers in a gym. Products live in a virtual **product catalog** (also called the feed) and can be grouped into categories; each product belongs to any number of categories with at most one designated as its **main** category, used for breadcrumbs and product-comparison-engine exports.

For the admin-side counterpart — how products are created, priced and grouped from the administration — see the [Products](/products) article. This document is the developer contract.

## Feed endpoint

```
GET https://api.bizkithub.com/product/v1/feed
```

Use the feed to render a product listing — the front page of an e-shop, a category page, search results, a comparison-engine export. The feed is optimised for many-item responses and is safe to call frequently.

### Query parameters

All parameters are optional; if none are supplied the feed returns every product in the organisation, in the platform's default order.

| Property | Type | Meaning |
|----------|------|---------|
| `query` | `string` | Full-text search term. Matched against product name, code and description. |
| `category` | `string` | Category code the products must belong to. Defaults to all categories. |
| `page` | `number` | 1-based page number for large result sets. Defaults to `1`. |
| `limit` | `number` | Maximum number of items per page. Defaults to `32`. |

### Response

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

The result list is deterministically ordered. **Non-sold-out** items are always shown first, and within that partition items are sorted by their manually assigned **position**. The order is stable across calls, so links to a specific product's slot on the listing do not drift due to unrelated catalog updates — this is important for SEO because a listing page whose product order changes every hour looks unstable to search engines.

The feed items themselves are served from a cached snapshot that the platform refreshes on every catalog change. Volatile fields — availability, sold-out flag, deletion flag and other operational states — are enriched at read time from the live database, so what you receive is a consistent snapshot of the marketing data plus real-time operational state.

## Detail endpoint

```
GET https://api.bizkithub.com/product/v1/detail?slug=xxx
```

Use the detail endpoint to render a single product page. The `slug` query parameter is required and must match the canonical product slug (unique within the organisation).

If the slug does not resolve to a visible product, the endpoint returns the platform error `PUBLIC_PRODUCT_DOES_NOT_EXIST`. A product is considered non-visible if it is inactive, soft-deleted, or the slug simply does not exist.

### Response

```ts
export type ProductId = `${string}`;
export type ProductVariantId = `${string}`;

export type PublicProductDetailResponse = {
  id: ProductId;
  code: ProductId;
  name: string;
  slug: string;
  shortDescription: TrustedHTML;
  longDescription: TrustedHTML;
  mainImageUrl?: string;
  galleryItems: PublicProductGalleryItem[];
  isVariantProduct: boolean;
  variantItems: PublicProductDetailVariantItem[];
  active: boolean;
  b2b: boolean;
  showInFeed: boolean;
  soldOut: boolean;
  mainCategory?: { code: string; name: string };
  categoryItems: { code: string; name: string }[];
  brandId?: number;
  price: number;
  standardPricePercentage?: number;
  vat?: number;
  sizeWidthMm?: number;
  sizeHeightMm?: number;
  sizeDepthMm?: number;
  weightGrams?: number;
  warehouseAllQuantity?: number;
  warehouseLimit?: number;
  event?: PublicProductEventResponse;
  customFields: Record<string, string>;
  lastUpdate: Date;
};

export type PublicProductEventResponse = {
  id: string;
  startTime: Date;
  endTime: Date;
  isAllDay: boolean;
  isBlocking: boolean;
  title: string;
  description?: string;
  agenda?: string;
  url?: string;
  locationTitle?: string;
};

export type PublicProductDetailVariantItem = {
  id: ProductVariantId;
  code: string;
  name: string;
  ean?: string;
  price: number;
  warehouseAllQuantity?: number;
};

export type PublicProductGalleryItem = {
  type: 'image' | 'video';
  id: number;
  url: string;
  title?: string;
  tag?: string;
};
```

Just as with the feed, the detail response is served from a cached snapshot. This is the reason the endpoint returns a rich, deeply nested payload in a single call rather than requiring multiple hops — gallery, variants, categories, event data and custom fields are all resolved server-side into one JSON. The endpoint is designed to be hit on every product page view; there is no need to add caching in front of it beyond your own edge cache if you want to reduce round-trip latency.

### PublicProductDetailResponse fields

| Property | Type | Meaning |
|----------|------|---------|
| `id` | `ProductId` | External product identifier, typically identical to `code`. |
| `code` | `ProductId` | Merchant-defined product code. |
| `name` | `string` | Human-readable product name. Usually the page title. |
| `slug` | `string` | URL slug of the product; forms part of the detail-page URL. |
| `shortDescription` | `TrustedHTML` | Short description as safe HTML. |
| `longDescription` | `TrustedHTML` | Long description as safe HTML. |
| `mainImageUrl` | `string` | Absolute URL of the main image (original file). |
| `galleryItems` | `PublicProductGalleryItem[]` | Uploaded gallery items — images and videos. |
| `isVariantProduct` | `boolean` | Whether the product has variants; a variant must be chosen at purchase. |
| `variantItems` | `PublicProductDetailVariantItem[]` | Available variants. |
| `active` | `boolean` | Whether the product is active. |
| `b2b` | `boolean` | Whether the product is restricted to verified business customers. |
| `showInFeed` | `boolean` | Whether the product is exported to product-comparison-engine feeds. |
| `soldOut` | `boolean` | Whether the product is flagged as sold out. |
| `mainCategory` | `{ code, name }` | Main category (used for breadcrumbs and comparison-engine categorisation). |
| `categoryItems` | `{ code, name }[]` | All categories this product belongs to. |
| `brandId` | `number` | Primary brand identifier. |
| `price` | `number` | Base price in the merchant's default currency, VAT included. |
| `standardPricePercentage` | `number` | Reference-price marker used for showing crossed-out list prices. |
| `vat` | `number` | Base VAT rate. |
| `sizeWidthMm` / `sizeHeightMm` / `sizeDepthMm` | `number` | Physical dimensions in millimetres. |
| `weightGrams` | `number` | Weight in grams. |
| `warehouseAllQuantity` | `number` | Aggregate stock across all warehouses. |
| `warehouseLimit` | `number` | Maximum stockable or sellable quantity (useful for ticketed events). |
| `event` | `PublicProductEventResponse` | Event data when the product is tied to a physical event (concert, camp, class). |
| `customFields` | `Record<string, string>` | Merchant-defined key–value metadata. |
| `lastUpdate` | `Date` | Timestamp of the last cached-snapshot refresh for this product. |

### PublicProductEventResponse fields

| Property | Type | Meaning |
|----------|------|---------|
| `id` | `string` | Public event identifier. |
| `startTime` | `Date` | Event start. |
| `endTime` | `Date` | Event end. |
| `isAllDay` | `boolean` | Whether the event covers the entire day. |
| `isBlocking` | `boolean` | Whether the event blocks its calendar slot as a binding reservation. |
| `title` | `string` | Event title. |
| `description` | `string` | Free-text description. |
| `agenda` | `string` | Detailed programme or schedule. |
| `url` | `string` | External URL for extra information. |
| `locationTitle` | `string` | Human-readable venue label. |

### PublicProductDetailVariantItem fields

| Property | Type | Meaning |
|----------|------|---------|
| `id` | `ProductVariantId` | Variant identifier (relation hash). |
| `code` | `string` | Merchant-defined variant code. |
| `name` | `string` | Human-readable variant name. |
| `ean` | `string` | EAN barcode of the variant. |
| `price` | `number` | Variant price in the merchant's default currency. |
| `warehouseAllQuantity` | `number` | Aggregate variant stock across all warehouses. |

### PublicProductGalleryItem fields

| Property | Type | Meaning |
|----------|------|---------|
| `type` | `'image' \| 'video'` | Media type. |
| `id` | `number` | Media identifier. |
| `url` | `string` | Absolute URL of the original file. |
| `title` | `string` | Optional caption. |
| `tag` | `string` | Optional system tag used for cross-referencing images (e.g. `main`, `back`, `packaging`). |

## Working with variants

Variants exist so a merchant can sell multiple versions of the same underlying product without maintaining a separate product record for each combination. Classic examples are T-shirts in several sizes and colours, or a phone offered with several storage capacities. Each variant carries its own identifier, its own price (either an absolute override or a delta on top of the parent product), and its own stock.

When a variant product ships in a multi-dimensional space — say size × colour — the merchant must create (or generate) a variant record for every legal combination. A product available in three colours and three sizes therefore has nine variants. Illegal combinations (a colour that is not produced in a particular size) are marked as inactive rather than deleted, so historical order lines that reference them can still be resolved.

### Variant fields visible on the detail response

The detail endpoint exposes only the fields necessary to render a variant picker and to place an order. Every variant carries `id`, `code`, `name`, optional `ean`, `price` and `warehouseAllQuantity`. The parent product's `isVariantProduct` flag is set to `true` when at least one active variant exists; the storefront must then require the customer to pick a variant before adding to cart.

Prices on variants are always **final** — VAT included. All variants of one product share the parent product's tax rate, so no per-variant VAT is exposed.

### Ordering a specific variant

When placing an order for a variant product through the [order-create API](/order-create-api), pass the variant's `code` in the line item's `variantCode` field alongside the parent product's `productCode`. Both codes are required — the platform validates that the two are consistent and that the variant is active. If you omit `variantCode` on a variant product, the order-create call is rejected.

## Multilingual content

Product responses are returned in the locale requested via the API key's configuration or via the request's language negotiation. Missing translations fall back to the organisation's default language according to the organisation's fallback rules, so callers never receive an empty description for a product that does exist.

## Caching and freshness guarantees

Both the feed and the detail endpoints are backed by an internal **cached snapshot** — a JSON representation that the platform refreshes automatically on every catalog change (name, price, images, category assignment, variants, custom fields). At request time the snapshot is enriched with the currently live operational fields (availability, sold-out state, deletion flag). This design gives you low, stable latency on the endpoints that matter most for storefront rendering.

You do not need to trigger the snapshot refresh manually. If a merchant edits a product from the administration or via API, the refresh happens as part of the write and completes before the next read returns the new snapshot.

## Related articles

- [Products](/products) — the administration guide describing how products, variants and categories are managed.
- [Product categories](/product-categories) — hierarchy of categories that feed items are filtered by.
- [Order create API](/order-create-api) — how to place an order referencing a product or a variant.
- [API key](/api-key) — how to authenticate feed and detail requests.

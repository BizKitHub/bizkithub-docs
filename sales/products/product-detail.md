---
category: "sales/products"
tags: []
published_at: "2026-08-01T00:00:00.000Z"
---


Product detail API
==================

The product detail endpoint returns the complete public payload of a single product — everything a storefront needs to render a product page in one call: name, short and long description, gallery, variants, physical dimensions, category assignment, event data, and custom fields. It is the companion to the [Product feed API](/product-feed), which returns compact list items suitable for browse pages.

The endpoint is designed to be hit on every product page view. The response is served from an internally cached snapshot that is refreshed on every catalog change, so it stays fast even under high traffic and even when the underlying data model is complex.

## Endpoint

```
GET https://api.bizkithub.com/product/v1/detail?slug=xxx
```

The `slug` query parameter is required and must match the canonical product slug (unique within the organisation). Authentication is via the standard `apiKey` parameter (see the [API key](/api-key) article).

If the slug does not resolve to a visible product, the endpoint returns the platform error `PUBLIC_PRODUCT_DOES_NOT_EXIST`. A product is considered non-visible if it is inactive, soft-deleted, or the slug simply does not exist.

## Response

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

The response deliberately returns a rich, deeply nested payload in a single call rather than requiring multiple hops. Gallery, variants, categories, event data and custom fields are all resolved server-side into one JSON so the storefront needs one round-trip to render the page.

## PublicProductDetailResponse fields

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
| `variantItems` | `PublicProductDetailVariantItem[]` | Available variants. See [Product variants](/product-variants). |
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

## PublicProductEventResponse fields

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

## PublicProductGalleryItem fields

| Property | Type | Meaning |
|----------|------|---------|
| `type` | `'image' \| 'video'` | Media type. |
| `id` | `number` | Media identifier. |
| `url` | `string` | Absolute URL of the original file. |
| `title` | `string` | Optional caption. |
| `tag` | `string` | Optional system tag used for cross-referencing images (e.g. `main`, `back`, `packaging`). |

## Multilingual content

Responses are returned in the locale requested via the API key's configuration or via the request's language negotiation. Missing translations fall back to the organisation's default language according to the organisation's fallback rules, so callers never receive an empty description for a product that does exist.

## Freshness

The detail response is served from a cached snapshot refreshed on every catalog change. Volatile operational fields (availability, sold-out flag, deletion flag) are enriched at read time from the live database. There is no need to invalidate manually; a merchant edit is visible on the next call.

## Related articles

- [Product feed API](/product-feed) — the companion endpoint for many-item listings.
- [Product variants](/product-variants) — how variants are modelled and referenced.
- [Products](/products) — administration guide.
- [Order create API](/order-create) — placing an order referencing this product.
- [API key](/api-key) — how to authenticate the request.

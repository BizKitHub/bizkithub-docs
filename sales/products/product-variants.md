---
id: "uM6Hp83wtJW1g1dg"
category: "sales/products"
tags: []
published_at: "2026-08-01T00:00:00.000Z"
---


Product variants
================

Variants let a merchant sell multiple versions of the same underlying product without maintaining a separate product record for every combination. Classic examples: T-shirts in several sizes and colours, phones offered with several storage capacities, coffee subscriptions with different grinds. Each variant is treated as a **separate stock-keeping unit** with its own identifier, its own price and its own stock, but shares the parent product's marketing copy, gallery, categories and tax rate.

This article documents the variant data model as exposed through the public API — how variants are shaped in responses, how prices work, and how to reference a specific variant when placing an order. For the administration-side view — creating variants, editing prices, marking a combination as inactive — see the [Products](/product-overview) article.

## Variant space

A variant product can be defined in a multi-dimensional space: size × colour, size × colour × material, and so on. Every legal combination becomes one variant record. A product available in three colours and three sizes therefore has nine variants; add a third dimension with two values and the count grows to eighteen.

Combinations that are not produced (a colour that is not manufactured in a particular size) are marked as **inactive** rather than deleted. Historical orders that reference an inactive variant still resolve correctly, and no data is lost when a merchant retires part of the range.

## Where variants appear on API responses

### On the [product feed](/product-feed-api)

The feed exposes only enough information to render a listing item. Variant-level detail is not returned in feed responses — the storefront should either show the parent product with a generic "select variant" affordance and defer the picker to the detail page, or fetch the detail explicitly when it needs per-variant data.

### On the [product detail](/product-detail-api)

The detail response carries the parent product plus a `variantItems` array with one entry per active variant. It also sets the parent product's `isVariantProduct` flag to `true` when at least one active variant exists. When that flag is set, a storefront must require the shopper to pick a variant before adding to cart.

Each variant entry has the shape:

```ts
export type PublicProductDetailVariantItem = {
  id: ProductVariantId;
  code: string;
  name: string;
  ean?: string;
  price: number;
  warehouseAllQuantity?: number;
};
```

## Fields

| Property | Type | Meaning |
|----------|------|---------|
| `id` | `ProductVariantId` | Variant identifier (relation hash). |
| `code` | `string` | Merchant-defined variant code, unique within the parent product. Used when placing an order. |
| `name` | `string` | Human-readable variant name (e.g. `Red · Large`). |
| `ean` | `string` | EAN barcode of the variant, when available. |
| `price` | `number` | Final variant price in the merchant's default currency (VAT included). |
| `warehouseAllQuantity` | `number` | Aggregate variant stock across all warehouses. |

## Pricing

Variant prices are always **final** — VAT included. The parent product's `vat` rate applies to every variant; a variant cannot override the tax rate.

Internally the merchant may enter the variant price either as an **absolute value** (which fully replaces the parent product's price) or as a **surcharge** on top of the parent price (useful for "same shirt but XXL costs €2 more"). The public API always returns the resolved final price regardless of how the merchant configured it — you do not need to compose the two on the caller's side.

## Ordering a specific variant

When placing an order for a variant product through the [order create API](/order-create-api), the line item must reference both the parent product and the specific variant:

```json
{
  "productCode": "T-SHIRT-BASIC",
  "variantCode": "T-SHIRT-BASIC-RED-L",
  "count": 1
}
```

The platform validates that:

- `productCode` refers to an existing product,
- `variantCode` refers to an active variant of that product,
- the two references are consistent.

If the parent product has variants (`isVariantProduct: true` on the detail response) and the order line omits `variantCode`, the order-create call is **rejected**. This is a design choice — silently defaulting a variant would let a storefront bug ship the wrong SKU to the buyer.

## Related articles

- [Products](/product-overview) — administration guide covering variant creation and editing.
- [Product feed API](/product-feed-api) — many-item listings.
- [Product detail API](/product-detail-api) — the endpoint that surfaces `variantItems`.
- [Order create API](/order-create-api) — how to place an order that references a variant.

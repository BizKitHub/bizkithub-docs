---
category: "sales/orders"
tags: []
published_at: "2026-08-01T00:00:00.000Z"
---


Order create API
================

The order-create endpoint is the single entry point through which every external system — an e-shop storefront, a point-of-sale terminal, a mobile app, a booking widget, a partner integration — records a purchase in BizKitHub. It is intentionally the same endpoint whether the checkout produces a €5 digital download or a subscription with a twelve-month schedule; the flexibility lives in the payload, not in a matrix of specialised endpoints. Every field beyond the customer and a list of items is optional and inferred from the organisation's default configuration when omitted, so integrators can start with a minimal call and grow into the full contract as their business logic hardens.

This article documents the public request and response shapes, the fields you can set, and the exact sequence of operations the platform performs on your behalf while creating the order. It is the developer-oriented counterpart to the [Orders](/orders) admin guide, which describes how the resulting record is then managed from the administration.

## Endpoint

```
POST https://api.bizkithub.com/api/v1/order/create
```

Authentication is via the standard `apiKey` parameter (see the [API key](/api-key) article). No other headers are required beyond `Content-Type: application/json`.

## Minimum viable payload

The smallest legal call carries a customer identified by their e-mail address plus a list of items — each item minimally a human-readable label and a price in the default currency of the organisation. Everything else can be omitted, in which case the platform substitutes the sensible defaults defined in your order configuration (order group, workflow entry state, expiration policy, currency).

```ts
export type CreateOrderRequest = {
  customer: { email: string };
  items: { label: string; price: number }[];
};
```

The e-mail address is always required because it is the anchor by which the platform pairs the incoming order with an existing customer profile — or creates a new one if the address is being seen for the first time. Any additional customer fields you supply are merged into the profile using the platform's quality-scoring heuristics (see [Contacts](/contacts) for the merge rules).

## Complete payload

The order-create endpoint understands a substantially richer payload than the minimum. All extra fields are optional and each carries a specific systemic meaning; they exist to let you express the whole business intent in a single call rather than requiring follow-up patches from the admin.

```ts
export type CreateOrderRequest = {
  customer: Customer;
  items: OrderItem[];
  orderGroupId?: string;
  locale?: string;
  currency?: string;
  sale?: number;
  paymentMethod?: PaymentMethod;
  deliveryPrice?: number;
  paymentPrice?: number;
  expirationDate?: string;
  internalNotice?: string;
  publicNotice?: string;
  tags?: OrderTagList;
  returnUrl?: string;
  notificationUrl?: string;
};

export type PaymentMethod = "credits" | "money";

export type TagValue = string | number | boolean | null;
export type OrderTagList = Record<string, TagValue | TagValue[]>;

export type OrderItem = {
  label: string;
  price: number;
  vat?: number;
  count?: number;
  sale?: number;
  unit?: string;
  productCode?: string;
  variantCode?: string;
  eventCode?: string;
  creditAmount?: number;
};

export type Customer = {
  email: string;
  name?: string;
  phone?: string;
  companyName?: string;
  companyRegistrationNumber?: string;
  taxIdentificationNumber?: string;
  streetAddress?: string;
  city?: string;
  cityPart?: string;
  stateRegion?: string;
  postalCode?: string;
  country?: string;
  newsletter?: boolean;
  primaryLocale?: string;
};

export type OrderNumber = `${string}`;

export type PublicOrderCreateResponse = {
  orderNumber: OrderNumber;
  hash: string;
  links: {
    orderPageLink: string;
    payLink: string;
  };
};
```

### CreateOrderRequest fields

| Property | Type | Meaning |
|----------|------|---------|
| `customer` | `Customer` | Identity and contact details of the buyer. Populated either from a checkout form or from an existing customer profile. |
| `items` | `OrderItem[]` | Line items of the order. May be empty. Defines the total price. |
| `orderGroupId` | `string` | Code of the order group (e-shop, POS, booking, subscription, …). When omitted, the organisation's default group is used. |
| `locale` | `string` | Language of the order — applied to customer notifications, e-mail templates, invoices, payment-gateway pages. |
| `currency` | `string` | ISO currency code, e.g. `CZK`, `EUR`. An order carries exactly one currency; mixing is not allowed. |
| `sale` | `number` | Absolute discount on the order total, expressed in the order currency. |
| `paymentMethod` | `PaymentMethod` | Preferred payment method — either `money` or `credits`. |
| `deliveryPrice` | `number` | Shipping cost in the order currency. |
| `paymentPrice` | `number` | Payment-method surcharge (e.g. cash-on-delivery fee). |
| `expirationDate` | `string` | ISO datetime by which the order must be paid; unpaid orders past this point are automatically cancelled. |
| `internalNotice` | `string` | Note visible only to the admin operator. |
| `publicNotice` | `string` | Note supplied by the customer, visible in the order detail and on documents. |
| `tags` | `OrderTagList` | Arbitrary key–value tags for later filtering. Up to 200 tags per order. |
| `returnUrl` | `string` | Where to redirect the customer after payment completes at the gateway. |
| `notificationUrl` | `string` | Webhook URL called on every state change of the order. |

### OrderItem fields

| Property | Type | Meaning |
|----------|------|---------|
| `label` | `string` | Human-readable line description. Always stored, regardless of whether the item is linked to a product. |
| `price` | `number` | Final sale price of one unit (VAT included) in the order currency. |
| `vat` | `number` | Base VAT rate. Ignored if the organisation is not registered for VAT. |
| `count` | `number` | Quantity of the item. Defaults to `1`. |
| `sale` | `number` | Absolute discount per unit, in the order currency. |
| `unit` | `string` | Unit of measure (e.g. `cm`, `l`, `g`) when the item is not counted in pieces. |
| `productCode` | `string` | Unique product code from your catalog. Establishes a link to the product record and updates stock and reservations. |
| `variantCode` | `string` | Unique variant code — required when the referenced product has variants. |
| `eventCode` | `string` | Unique code of a calendar event the item represents (booking, class, ticket, …). |
| `creditAmount` | `number` | Amount of customer credit to top up if the order is paid. |

### Customer fields

Any customer field beyond `email` is optional. What you supply is compared against the existing profile using an internal quality score, and only genuinely better values (more complete, more recently verified, more specific) overwrite what the platform already knows. This is why you can safely re-send the same customer on every order without corrupting a hand-corrected profile.

When the customer represents a company, populate `companyName` together with `companyRegistrationNumber` and `taxIdentificationNumber`. If both a company and a personal name are present, the platform treats the company as the invoicing entity and the personal name as the acting representative.

### Response

```ts
export type PublicOrderCreateResponse = {
  orderNumber: OrderNumber;
  hash: string;
  links: {
    orderPageLink: string;
    payLink: string;
  };
};
```

| Property | Type | Meaning |
|----------|------|---------|
| `orderNumber` | `OrderNumber` | Actual order number assigned within the chosen order group. |
| `hash` | `string` | External order identifier (32-character opaque string), suitable for URLs. |
| `links.orderPageLink` | `string` | URL of the customer-facing order detail page on the BizKitHub platform. |
| `links.payLink` | `string` | URL of the payment gateway; where you send the customer to complete payment. |

The `hash` is the stable public handle for the order. Store it on your side if you need to reference the order later without holding the sequential `orderNumber`.

## Order creation pipeline

When the request arrives, the platform executes a deterministic sequence of steps. Every step either succeeds or aborts the whole call — there is no partial order in the database. Understanding this pipeline helps when you debug why a specific integration case does not behave as you expected.

1. **Input validation.** The request body is validated against the schema documented above. Malformed payloads are rejected with a documented error code before any side effect.
2. **Order-group resolution.** The `orderGroupId` you supplied — or the organisation's default — is resolved. The group determines the numbering series, the allowed workflow states, the invoicing entity and the default expiration policy.
3. **Workflow entry state.** The initial state of the new order is derived from the group's workflow configuration.
4. **Customer profile lookup or creation.** The `customer.email` is normalised and looked up in the organisation's contact database. If it exists, the profile is loaded; if not, a new profile is created. Any new fields supplied in the request that the profile does not have yet are merged in.
5. **Access-control checks.** The customer is inspected for organisation-level bans, fraud flags, and other blocking policies. A blocked customer causes the order to be rejected here.
6. **Newsletter subscription.** If the customer opted in (`customer.newsletter: true`), they are added to the organisation's newsletter list.
7. **Order-number assignment.** A new unique order number is allocated within the target group's numbering series.
8. **Default value assembly.** Any optional order fields not supplied by the caller are filled with the group's defaults.
9. **Persistence attempt.** The row is inserted into the order storage. On rare number-collision failures the platform retries up to twenty times with a randomised 10–200 ms back-off before surfacing the error to the caller.
10. **Internal and external identifiers.** Both the internal (numeric) and external (opaque hash) identifiers are assigned to the newly persisted order.
11. **Base logging.** An audit-log entry recording the creation is written; further state changes append to the same log.
12. **Workflow state recording.** The initial state is stored, and the state-history log is opened.
13. **Line items.** Each `OrderItem` is persisted, together with the resolved product, variant, calendar-event and credit links where applicable.
14. **Credit-debt handling.** If the customer has a negative credit balance, an extra order item is automatically appended so the debt is settled together with the order.
15. **Total-price calculation.** The order total is computed from the items, the customer's available credits and the preferred payment method.
16. **Total written.** The calculated total is persisted onto the order row.
17. **Automatic credit payment.** If the order can be settled entirely from the customer's credit balance, the credits are deducted immediately and a corresponding order item is added for the credit application.
18. **Confirmation e-mail.** A creation notification is enqueued to the customer using the organisation's default template for this event, routed through the platform e-mailer (see the [E-mailer](/e-mailer) article).
19. **Zero-total short-circuit.** If the final total is zero (typically because the whole order was paid in credits), the order is immediately marked as paid and the paid-order workflow — including its notifications — is executed.
20. **Expiration scheduling.** If `expirationDate` was set and the order is unpaid, a background job is scheduled to cancel the order at that time if payment does not arrive first.
21. **Tag writing.** Any `tags` supplied on the request are stored against the new order.
22. **Response.** The `PublicOrderCreateResponse` is returned to the caller.

The whole pipeline is idempotent from the caller's perspective in the sense that a second, materially identical request will produce a second, distinct order — order creation is not deduplicated by content. If you need at-most-once semantics for a specific integration, generate a stable idempotency key on your side and store it in the order's `tags` before checking whether the previous submission already succeeded.

## Currency, price and rounding

The order currency is decided first, and every subsequent monetary value in the request is interpreted in that currency. An order cannot mix currencies. Different orders can each carry a different currency without restriction; the choice of currency for a specific order is entirely at the caller's discretion.

Prices submitted on line items are always **final** sale prices — VAT included where applicable. The `vat` field describes the applicable rate for record-keeping and downstream invoicing, but it does not modify the `price` value. Discounts (`sale` on the request or per item) are expressed as absolute amounts in the order currency, never as percentages.

## Anonymous orders

An order without a real customer — typical for physical point-of-sale checkouts — is routed to the organisation's built-in **anonymous customer** account. See [Contacts](/contacts) for the semantics of that account, including why it cannot be deleted and how it interacts with e-mail delivery.

## Webhooks and return URLs

Two optional URLs let you close the loop between the platform and your system without polling. `notificationUrl` is a server-to-server webhook: the platform posts a small state-change payload to it every time the order's state changes, including the initial creation and the final paid/cancelled transition. `returnUrl` is the browser-visible URL the payment gateway redirects the shopper to once they finish paying — this is where you show a "thank you" page.

If both URLs are supplied, you receive the state change on both channels. The webhook is the authoritative signal; the browser return URL is a UX convenience and can be missed if the shopper closes the tab before the redirect completes.

## Related articles

- [Orders](/orders) — the administration guide describing what happens to the order after creation.
- [Order workflow](/order-workflow) — how order states, transitions and automated actions are modelled.
- [API key](/api-key) — how to authenticate this request.
- [Error codes](/error-codes) — how to interpret error responses from this endpoint.

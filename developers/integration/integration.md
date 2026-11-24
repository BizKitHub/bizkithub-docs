---
id: "w2u8rb9yShcVqH29"
category: "developers/integration"
tags: ["type-overview", "api", "integrations"]
published_at: "2026-07-24T19:26:32.541Z"
---


Integrations
============

BizKitHub connects to outside services in two ways. **Built-in connectors** link the platform to payment gateways, your bank, carriers, public registries and devices; you switch them on in the administration and enter your own credentials, with no code. **Your own integrations** use the public REST API and webhooks to connect your e-shop, website, ERP or any other system.

This page lists both, so you can see what works out of the box and what you build yourself.

## Built-in connectors

<table>
<thead>
<tr><th>Area</th><th>Connector</th><th>What it does</th><th>Read more</th></tr>
</thead>
<tbody>
<tr><td>Payments</td><td>GoPay, Comgate, Stripe</td><td>Online card and bank payments for orders, payment status updates, recurring payments (Stripe).</td><td><a href="/payment-gateway-overview">Payment gateways</a></td></tr>
<tr><td>Banking</td><td>Fio banka</td><td>Downloads account transactions with a read-only token and pairs incoming payments with orders and invoices.</td><td><a href="/bank-transaction-overview">Bank transactions</a></td></tr>
<tr><td>Shipping</td><td>Zásilkovna, GLS</td><td>Creates shipments and labels, tracks parcels and updates the order. Other carriers can be saved but cannot create shipments yet.</td><td><a href="/shipments-and-carriers">Shipments and carriers</a></td></tr>
<tr><td>Company data</td><td>Czech company registry</td><td>Fills in a company's name, address and VAT details from its company ID.</td><td><a href="/company-registry">Company registry</a></td></tr>
<tr><td>Product data</td><td>XML product feeds, Shoptet export</td><td>Imports and regularly updates products from a feed; exports your catalogue to comparison sites.</td><td><a href="/product-overview">Products</a>, <a href="/product-feed-api">Product feed API</a></td></tr>
<tr><td>Smart locks</td><td>TTLock</td><td>Issues door codes tied to reservations, opens doors remotely, monitors battery and events.</td><td><a href="/iot-lock-overview">Smart locks</a></td></tr>
<tr><td>Content</td><td>RSS feeds</td><td>Reads external news sources for the newsroom and your website.</td><td><a href="/rss-feed-overview">RSS feeds</a></td></tr>
<tr><td>E-mail</td><td>Sending and receiving</td><td>Sends transactional e-mails and newsletters from your domain; receives replies and tickets.</td><td><a href="/emailer-overview">E-mail</a></td></tr>
</tbody>
</table>

Credentials for payment gateways, the bank and carriers belong to your organisation. They are stored per organisation and used only for its own requests.

## Your own integrations

### REST API

Every public endpoint lives under `https://api.bizkithub.com/api/v1/` and is authenticated with your organisation's [API key](/api-key-overview), passed as the `apiKey` parameter in the query string or the JSON body. Requests and responses are JSON. The [API explorer](/swagger) lists every endpoint with its parameters and response schema.

Common starting points:

<table>
<thead>
<tr><th>Goal</th><th>Endpoints</th><th>Read more</th></tr>
</thead>
<tbody>
<tr><td>Show products on your website</td><td><code>/api/v1/product/feed</code>, <code>/api/v1/product/detail</code>, <code>/api/v1/product-category/tree</code></td><td><a href="/product-feed-api">Product feed API</a></td></tr>
<tr><td>Take orders and payments</td><td><code>/api/v1/shop/order/create</code>, <code>/api/v1/shop/order/create-payment</code></td><td><a href="/order-create-api">Creating orders via the API</a></td></tr>
<tr><td>Sync orders to an ERP</td><td><code>/api/v1/shop/order/list</code>, <code>/api/v1/shop/order/detail-full</code>, <code>/api/v1/shop/order/set-status</code></td><td><a href="/workflow-automation">Workflow automation</a></td></tr>
<tr><td>Publish articles and a glossary</td><td><code>/api/v1/post/*</code>, <code>/api/v1/glossary/*</code></td><td><a href="/post-management-overview">Posts</a></td></tr>
<tr><td>Bookings and events</td><td><code>/api/v1/calendar/*</code></td><td><a href="/calendar-overview">Calendar</a></td></tr>
<tr><td>Read the books</td><td><code>/api/v1/ledger/*</code></td><td><a href="/accounting-overview">Accounting</a></td></tr>
</tbody>
</table>

### Webhooks and notifications

Instead of polling, let BizKitHub call you:

- **[Webhooks](/webhooks)** send signed events about shipments to an HTTPS endpoint you register under **Settings → Webhooks**.
- **`notificationUrl`** on an order is called whenever that order's state changes, including payment.

### Typical integration types

- **Headless e-shop.** Your storefront renders products from the API and sends orders back; BizKitHub handles customers, payments, invoices and shipping. Start with the [E-shop quickstart](/eshop-quickstart-overview).
- **ERP or accounting sync.** A scheduled job reads new orders and paid invoices and writes status changes back.
- **Website content.** Your site reads posts, categories and glossary terms from the API, so editors work in one place.

## Before you go live

- Keep the API key on your server. Never put it in browser code or a mobile app bundle.
- Use a development key while you build and a production key in production.
- Handle errors by their `errorCode` (see [API error codes](/errors)) and respect [rate limits](/rate-limiting-overview).
- Verify the signature of every webhook and ignore deliveries you have already processed.
- Process personal data of customers in line with your own GDPR obligations; see [Security](/security-overview).

## Related

- [API quickstart](/api-quickstart)
- [Architecture](/architecture-overview)
- [Webhooks](/webhooks)
- [Support](/support-overview)

---
id: "igyi3OAhqVoYab5Y"
category: "platform/architecture"
tags: ["type-concept"]
published_at: "2026-07-24T19:26:42.501Z"
---


Architecture
============

BizKitHub is one platform for running a business: CRM, e-commerce, payments, invoicing and accounting, communication and automation share one data model instead of being glued together from separate products. This article explains how the platform is organised, from the point of view of someone who uses it or integrates with it.

## One organisation, one data set

Everything in BizKitHub belongs to an **organisation**: a company, a shop, a club or any other entity you run. An organisation has members, and each member has roles and permissions that decide what they can see and change.

Every record (a contact, an order, an invoice, a file) belongs to exactly one organisation. Every request, whether it comes from the administration or from the API, is resolved to one organisation first, and the platform only ever reads and writes that organisation's data. One person can be a member of several organisations and switch between them; the data of the organisations never mixes.

## Modules

Features are grouped into modules that follow the main menu of the administration:

<table>
<thead>
<tr><th>Area</th><th>Modules</th></tr>
</thead>
<tbody>
<tr><td>Sales</td><td>Shop, products and categories, orders, basket, vouchers, branches, complaints, warehouse, fulfillment, shipping</td></tr>
<tr><td>CRM</td><td>Contacts, calendar and bookings, tickets, forms, projects, time tracking</td></tr>
<tr><td>Finance</td><td>Invoices, payment gateways, bank transactions, contracts, VAT, accounting</td></tr>
<tr><td>Communication</td><td>E-mail, templates and layouts, newsletters, notifications, team chat</td></tr>
<tr><td>Content</td><td>Posts and categories, RSS feeds, file storage, glossary, knowledge base</td></tr>
<tr><td>System</td><td>Organisation settings, members and permissions, API keys, system log, analytics, smart locks and IoT</td></tr>
</tbody>
</table>

Modules share the same records. An order refers to a contact and products, its payment arrives through a payment gateway or a bank transaction, the invoice is generated from it and e-mailed with a template, and every step is visible in the contact's history.

## Ways in

<table>
<thead>
<tr><th>Surface</th><th>Address</th><th>For</th></tr>
</thead>
<tbody>
<tr><td>Administration</td><td><code>admin.bizkithub.com</code></td><td>Members of an organisation, in the browser.</td></tr>
<tr><td>Public REST API</td><td><code>api.bizkithub.com/api/v1/</code></td><td>Your e-shop, website, mobile app or any other system. Authenticated with an <a href="/api-key-overview">API key</a>.</td></tr>
<tr><td>Public pages</td><td>Your own domain or a BizKitHub address</td><td>Your customers: order detail and payment, forms, newsletter subscription, ticket follow-up.</td></tr>
<tr><td>Services</td><td><code>pdf.</code>, <code>cdn.</code>, <code>status.</code>, <code>support.bizkithub.com</code></td><td>PDF generation, asset delivery, platform status and support.</td></tr>
</tbody>
</table>

The [API explorer](/swagger) lists every endpoint. The administration uses its own session-based interface, which is documented in the explorer for transparency but is not intended for third-party integrations (see [BFF](/bff-overview)).

## What happens with a request

1. **Edge.** The request reaches the nearest location of the edge network, which terminates TLS and filters abusive traffic.
2. **Identity.** The platform resolves the API key or the signed-in session to one organisation and, for members, to their permissions. Rate limits apply per key.
3. **Validation.** Every parameter is validated against the published schema. Invalid input is rejected with a `422` error that names the field.
4. **Business rules.** The module applies its rules, for example stock reservation, price and VAT calculation or the order workflow, and saves all changes in one transaction.
5. **Side effects.** E-mails, PDF documents, notifications and integrations with payment gateways or carriers run after the change is saved, many of them in the background.
6. **Response.** JSON with a stable shape. Errors carry an `errorCode`, a human-readable message and a `requestId` (see [API error codes](/errors)).

## Background work

Work that does not need to happen during a request runs on schedule: bank synchronisation, processing of incoming e-mails, reminders, imports, renewal of subscriptions and others. Every run is monitored; see [Monitoring](/monitoring-overview).

## Languages

The administration is available in Czech, English, German, Italian, Polish and Slovak. Content such as posts, products and e-mail templates can be kept in several languages per organisation.

## Related

- [Infrastructure](/infrastructure-overview)
- [Security](/security-overview)
- [Storage](/storage-overview)
- [API quickstart](/api-quickstart)

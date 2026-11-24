---
code: "bizkithub-at-a-glance"
category: "platform"
tags: ["type-overview", "getting-started"]
published_at: "2026-11-24T00:00:00.000Z"
---


BizKitHub at a glance
=====================

BizKitHub is one platform for running a business. Customers, orders, payments, invoices, accounting, e-mail, content and automation live in one system and share one set of data, so the same customer, product or payment never has to be copied between tools.

This page explains what the platform covers, how the parts fit together and where to continue reading.

## Who uses it

- **Online shops** that need a back office: catalogue, orders, payments, invoices, stock and shipping behind their own storefront.
- **Service businesses** such as studios, gyms or agencies: bookings, clients, recurring payments, projects and time tracking.
- **Content publishers**: posts, newsletters, a newsroom and a knowledge base, with translations into several languages.
- **Developers** who build websites and integrations on top of the platform through the public REST API.

## The building blocks

<table>
<thead>
<tr><th>Area</th><th>What it does</th></tr>
</thead>
<tbody>
<tr><td>Sales</td><td>Product catalogue with variants and categories, baskets and orders, vouchers, branches, complaints, warehouse, fulfillment and shipping.</td></tr>
<tr><td>CRM</td><td>One record per customer or company with the full history: orders, invoices, e-mails, tickets, bookings and forms. Calendar and bookings, help desk tickets, projects and time tracking.</td></tr>
<tr><td>Finance</td><td>Invoices and credit notes, online payment gateways, bank account synchronisation and payment matching, contracts, VAT and accounting.</td></tr>
<tr><td>Communication</td><td>Transactional e-mail with templates and layouts, newsletters, notifications and team chat.</td></tr>
<tr><td>Content</td><td>Posts with categories, tags and translations, RSS feeds, file storage, glossary and knowledge base.</td></tr>
<tr><td>System</td><td>Organisation settings, members and permissions, API keys, system log, analytics, automation and smart locks.</td></tr>
</tbody>
</table>

## How the parts work together

A typical order shows how much happens without manual work:

1. A customer places an order on your website, which calls the [order API](/order-create-api).
2. The customer record is created or updated in the CRM, and the order appears in the administration.
3. The customer pays through a [payment gateway](/payment-gateway-overview), or by bank transfer that is matched automatically from your [bank account](/bank-transaction-overview).
4. The [invoice](/invoice-overview) is issued and e-mailed with your template and branding.
5. The order moves through its [workflow](/workflow-overview) to fulfillment and shipping.
6. Every step is visible in the customer's history and in the activity log.

## Ways to work with BizKitHub

- **The administration** at `admin.bizkithub.com`, in six languages, on desktop and mobile.
- **The public REST API** at `api.bizkithub.com/api/v1/`, authenticated with an [API key](/api-key-overview). Start with the [API quickstart](/api-quickstart).
- **Public pages** that your customers use: order detail and payment, forms, newsletter subscription and ticket follow-up.

## Your data

Every record belongs to exactly one organisation, and the platform never mixes the data of two organisations. Data is processed in the European Union, backed up continuously and protected by role-based permissions. See [Architecture](/architecture-overview), [Security](/security-overview) and [Backup and recovery](/backup-overview).

## Where to go next

- New to BizKitHub: [Core concepts](/core-concepts), then [New organization](/new-overview).
- Building a website or an integration: [API quickstart](/api-quickstart) and [E-shop quickstart](/eshop-quickstart-overview).
- Choosing a plan: [Free plan](/free-tier-overview).

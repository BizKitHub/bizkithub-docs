---
id: "6Iq04yEHl7pVK7h2"
category: "developers/env"
tags: []
published_at: "2026-07-24T19:26:34.621Z"
---


env
===

Complete reference of all configurable environment variables in BizKitHub. Customize your application settings and integrate with external services through a centralized configuration system.

## Example .env

<pre><code># Payment Gateway
STRIPE_SECRET_KEY=sk_live_...

# Email Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587

# Shipping Integration
PACKETA_API_KEY=pk_...</code></pre>

## Overview

- All variables are optional — the system operates without them.
- All configured values are encrypted at rest.
- The full, live list of variable keys is loaded dynamically from `https://api.bizkithub.com/api/v1/docs/env-list`.

## Variable Categories

Environment variables are organized into logical categories for easier management and discovery. Categorization is derived from the key name.

<table>
<thead>
<tr><th>Category</th><th>Description</th><th>Key pattern</th></tr>
</thead>
<tbody>
<tr><td>Payment Gateways</td><td>Stripe, GoPay, Comgate and other payment provider credentials</td><td>keys containing <code>stripe</code>, <code>gopay</code>, or <code>comgate</code></td></tr>
<tr><td>Email &amp; SMTP</td><td>Email service configuration and SMTP server settings</td><td>keys containing <code>emailer</code>, <code>smtp</code>, or <code>email</code></td></tr>
<tr><td>Shipping &amp; Logistics</td><td>Packeta and other shipping provider integrations</td><td>keys containing <code>packeta</code></td></tr>
<tr><td>Smart Locks &amp; IoT</td><td>TTLock and IoT device connectivity settings</td><td>keys containing <code>ttlock</code></td></tr>
<tr><td>Customer &amp; Orders</td><td>Customer management and order processing settings</td><td>keys containing <code>customer</code> or <code>order</code></td></tr>
<tr><td>General</td><td>General application configuration and system settings</td><td>everything else</td></tr>
</tbody>
</table>

## Usage Guidelines

### Best practices

- Use only the predefined environment variable keys from this reference.
- Set values to non-empty strings or leave them undefined.
- Configure sensitive credentials through the admin panel only.
- Test all configuration changes in the development environment first.

### Important notes

- All variables are optional — the system operates without them.
- Custom variable names are not supported — use documented keys only.
- Empty strings are treated as undefined values by the system.
- Some changes may require an application restart to take effect.

## Managing Variables

Manage all environment variables through the BizKitHub administration panel with a secure, user-friendly interface. Open the [admin panel](https://admin.bizkithub.com) or see the [API documentation](/api) for programmatic access.

**Flag:** The live page also renders an interactive client component (`EnvTableClient`) that fetches the full env-key list from the API and provides category filtering. The dynamic list is not captured here — the CMS post shows the static reference above and links to the admin panel for the live catalogue.

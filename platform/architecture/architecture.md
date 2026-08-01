---
id: "igyi3OAhqVoYab5Y"
category: "platform/architecture"
tags: []
published_at: "2026-07-24T19:26:42.501Z"
---


Architecture
============

BizKitHub is a comprehensive digital platform for business management that combines CRM, e-commerce, payments, invoicing, communication, and automation into one unified system. It is built on modern technologies with a modular architecture that enables flexibility, scalability, and seamless integration.

## Business modules

The platform is organized into specialized modules, each handling a specific business domain while sharing a unified data layer.

### Core business

- **CRM &amp; Contacts** — customer management, groups, credits.
- **Orders** — order lifecycle, payments, invoices.
- **Products** — catalog, variants, categories.
- **Invoicing** — invoices, receipts, tax documents.

### Communication

- **Email system** — transactional emails, templates.
- **Newsletter** — campaigns, segmentation, analytics.
- **Calendar** — events, reservations, reminders.

### Payments

- **Payment gateways** — support for multiple providers.
- **Bank integration** — automated transaction matching.
- **Vouchers** — discounts and promo codes.

### Automation

- **Workflow engine** — end-to-end process automation.
- **Scheduled tasks** — background jobs and cron.
- **AI assistant** — analysis, matching, automation.

## System overview

The platform follows a layered architecture with clear separation between presentation, business logic, and data layers.

### Frontend applications

<table>
<thead>
<tr><th>Application</th><th>Role</th><th>URL</th></tr>
</thead>
<tbody>
<tr><td>bizkithub.com</td><td>Main platform</td><td>https://bizkithub.com</td></tr>
<tr><td>admin.bizkithub.com</td><td>Administration</td><td>https://admin.bizkithub.com</td></tr>
<tr><td>docs.bizkithub.com</td><td>Documentation</td><td>https://docs.bizkithub.com</td></tr>
<tr><td>status.bizkithub.com</td><td>Status page</td><td>https://status.bizkithub.com</td></tr>
<tr><td>cdn.bizkithub.com</td><td>Static assets</td><td>https://cdn.bizkithub.com</td></tr>
<tr><td>pdf.bizkithub.com</td><td>PDF generation</td><td>https://pdf.bizkithub.com</td></tr>
</tbody>
</table>

### API layers

#### Public REST API

External integrations with API key authentication. Base URL: `api.bizkithub.com/api/v1/`

- Rate limiting
- API key authentication
- JSON responses
- Webhook support

#### BFF layer

Optimized endpoints for frontend applications. Base URL: `api.bizkithub.com/bff/`

- Session authentication
- Optimized queries
- Real-time sync
- Frontend-specific responses

### Business logic layer

A modular architecture with 30+ specialized modules handling all business operations, including: Account, Contact, Order, Product, Payment, Emailer, Calendar, Workflow.

### Data layer

<table>
<thead>
<tr><th>Store</th><th>Role</th></tr>
</thead>
<tbody>
<tr><td>PostgreSQL</td><td>Primary database</td></tr>
<tr><td>Redis</td><td>Cache &amp; sessions</td></tr>
<tr><td>S3 storage</td><td>Files &amp; media</td></tr>
</tbody>
</table>

## Data flow

Understanding how requests are processed through the platform layers.

1. **Request authentication** — API requests are authenticated via API keys or session tokens with rate limiting applied.
2. **Business logic processing** — requests are routed to the appropriate modules where business rules and validations are applied.
3. **Data persistence** — data is stored in PostgreSQL with full ACID compliance and referential integrity.
4. **Response &amp; events** — responses are returned with optional webhook notifications for subscribed events.

## Security architecture

Multiple layers of security protect your data and ensure compliance.

- **API key authentication** — secure API access with rotating keys.
- **Rate limiting** — protection against abuse.
- **Role-based access** — granular permissions system.
- **Data encryption** — TLS 1.3 in transit and encryption at rest.

## Technology stack

Built with modern, battle-tested technologies for reliability and performance.

<table>
<thead>
<tr><th>Category</th><th>Technology</th><th>Role</th></tr>
</thead>
<tbody>
<tr><td>Frontend</td><td>Next.js 14</td><td>App Router</td></tr>
<tr><td>Database</td><td>PostgreSQL</td><td>Primary database</td></tr>
<tr><td>Database</td><td>Drizzle ORM</td><td>Type-safe queries</td></tr>
<tr><td>Cache</td><td>Redis</td><td>Caching layer</td></tr>
<tr><td>Storage</td><td>S3 Storage</td><td>File storage</td></tr>
<tr><td>Language</td><td>TypeScript</td><td>End-to-end types</td></tr>
</tbody>
</table>

## Platform capabilities

### Architecture advantages

- Modular business logic separation
- Unified API across all services
- Horizontal scalability
- Multi-tenant architecture
- Real-time event processing
- Automated workflow execution

### Key features

- Full-text search across all entities
- Intelligent data linking
- Multi-language support (CS, EN, SK, PL)
- High availability (99.9% uptime)
- Audit logging
- GDPR compliance

## API integration

All platform features are accessible through a comprehensive REST API, enabling seamless integration with external systems.

### Available API modules

- Contacts
- Products
- Orders
- Payments
- Calendar
- Emailer
- Vouchers
- Webhooks

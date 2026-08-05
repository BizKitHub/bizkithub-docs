---
id: "54yLjTp0WuSKUmRf"
category: "system/organization"
tags: []
published_at: "2026-04-24T06:57:28.149Z"
---


Organization
============

The `/organisation` page contains the complete organization settings divided into several tabs. It focuses on the operational and business profile of the organization — identity, branding, billing details, customer communication, and marketing channels. The overlap with the `/settings` module is intentional; both modules share the same data sections, just in a different arrangement.

> ℹ️ `/organisation` emphasizes **business and branding**, while `/settings` also includes advanced system settings (API keys, environment variables, terminal, IP blacklist). In practice, customers typically manage their daily profile via `/organisation`, and technical integrations via `/settings`.

## Tabs and their content

Tabs are divided into three main groups corresponding to the thematic context. The content of each tab relates to one clear area (profile, emails, plan…), so that users do not get lost in long forms.

### Organization

Identification and basic parameters of the organization.

- **Profile** — name, slug, emoji, description, support person. The organization name is used as the sender of all emails, appears on invoices, and in the organization switcher.
- **Branding** — primary and secondary color (hex), logo for web (email header), and logo for print (invoices, PDF). Colors must be a valid 3- or 6-digit hex code with a `#` sign.
- **Company details** — Company ID (IČO), Tax ID (DIČ), VAT payer status. These details are printed on invoices, used for ARES lookup, Firmy.cz feed, and checking unreliable VAT payers.
- **Localization** — list of active languages, default language, default currency (ISO 4217), timezone (IANA). The default language is used for selecting articles in newsletters and for default communication with contacts without a preferred language.
- **Contact** — publicly available emails and phone, callback link after newsletter confirmation.

### Business

Operational parameters of the e-shop and communication.

- **Emails** and SMTP — host, port, login name, and password for transactional emails. Port `587` for STARTTLS, port `465` for implicit SSL. A second, separate SMTP server can be configured for marketing bulk mailings (dedicated IP reputation).
- **Orders** — default return strategy (`credit` — credit, `cash` — bank transfer with credit note, `none` — no return), automatic credit note generation mode, BCC emails for internal notifications about order status changes.
- **Newsletter** — master switch for automatic digest, interval in days (default 14), subject template with Handlebars variables (`{{ postCount }}`, `{{ intervalDays }}`), introductory HTML text, language, and maximum number of articles in one batch.
- **Payment methods** — enabling recurring payments via Comgate gateway (subscription billing, card tokenization), default customer credit expiration in days.

### System

Access management and technical infrastructure.

- **Feature flags** — experimental features for the entire organization.
- **Plan** — current plan, limit usage, effective price, 12-month history.
- **Managed organizations** — vendor / white-label relationships for partners.
- **Members** — list of users with access, roles, and permissions.
- **API keys** — tokens for integrations.
- **Domains** — custom domains with DNS verification.
- **Routes** — rules for URL addresses.
- **Data import** — bulk uploading of records from CSV / JSON.
- **Blocked IP addresses** — list of blocks with geolocation.
- **Locks** — smart TTLock locks.
- **Environment variables** — advanced key-value storage.

> 💡 Detailed descriptions of individual system subsections can be found in the `/settings` documentation — they are displayed identically in both places.

## Controls

### Forms

Each tab contains its own form with specific settings. All fields are optional — only those you actually change will be updated. The rest will remain unchanged.

### Saving

The **Save changes** button in the lower right corner of the form confirms the edit and immediately updates the settings. After successful saving, the system clears the cache, and all dependent modules start working with the new values.

> ⚠️ Fields for SMTP passwords are write-only — they are never displayed after saving. In the UI, you only see a placeholder. If you do not want to change the password, leave the field blank.

### Branding and logos

- A logo can be uploaded via the **Upload** button (drag and drop or select from disk). Only image formats (PNG, JPG, WEBP) are accepted.
- The web logo is automatically rendered in the header of all outgoing emails.
- The print logo is optimized for invoices and PDF documents; if not set, the system automatically uses the web logo as a fallback.
- Deleting the print logo is immediate; when removed, the web logo becomes unused, and the logo section in emails is hidden.

### Default currency

> ⚠️ Changing the default currency of an organization is a sensitive operation and is not self-service. If you attempt to set a currency code different from the current one, the request will be rejected, a warning will be recorded, and the system will direct you to BizKitHub technical support.

### Languages

- An organization can have multiple active languages. Exactly one of them is always designated as default.
- The order in the list determines the display priority (from highest to lowest).
- When saving, the list always completely replaces the existing configuration; therefore, you must submit all languages that are to remain active.

## Specifics

- **Terminal** — for advanced users, allows diagnostic and service commands in the context of the current organization.
- **Data import from CSV / JSON** — with column detection, preview, and automatic mapping for the Shoptet provider.
- **IP block management** — with geolocation data, proxy, Tor, and hosting range detection.
- **Masking sensitive values** — keys, tokens, and passwords are displayed masked; the full value can be revealed by the **Show** button.
- **Vendor widget** — if the organization is managed by a partner with an active white-label license, the **My Technical Administrator** tab displays their contact details, offered plan, and contact person.

## Relationship to `/settings`

Both modules work with the same data. A change made in one is immediately reflected in the other. The choice of module depends on your working style:

- `/organisation` — suitable for owners and business users who manage the profile, company details, and marketing communication.
- `/settings` — suitable for administrators and developers who need access to API keys, environment variables, routes, and the terminal.

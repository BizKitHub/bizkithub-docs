---
id: "E4YxcV4bweMGXzdf"
category: "system/organization-settings"
tags: []
published_at: "2026-04-24T06:57:29.035Z"
---


Organization settings
=====================

The `/settings` page is a central hub for all organization, access, and integration configurations. It consolidates all operational parameters that apply to the entire account into one clear interface with a left sidebar menu.
> ℹ️ The `/settings` section functionally overlaps with the `/organisation` section. This is an intentional overlap — both modules access the same data but arrange it for different use cases.
## Settings Structure
The left sidebar menu is divided into three logical groups. The order of sections corresponds to typical usage frequency — from daily organization settings through business parameters to system administration.
### Organization
Basic identity and profile data.
- **Profile** — organization name, emoji, description, contact person (support person)
- **Branding** — primary and secondary color, logo for web and logo for print (invoices, PDF)
- **Company Details** — Company ID (IČO), Tax ID (DIČ), VAT payer status, billing address. This data is printed on invoices and receipts and used for verification in ARES (Czech Business Register).
- **Localization** — list of active organization languages, primary language, default currency, time zone, data formats
- **Contact Information** — emails for transactional and marketing communication, return URL after newsletter confirmation
### Business
Parameters for daily e-shop operation and customer communication.
- **Emails / SMTP** — sending server configuration, separate settings for transactional and marketing emails, custom HTML template (layout) and footer
- **Orders** — default return strategy (credit / cash / none), credit note accounting mode, internal BCC emails for notifications
- **Newsletter** — enabling automatic digest, interval in days, subject template, language, and maximum number of articles per batch
- **Payment Methods** — activation of recurring payments (Comgate), default customer credit expiration
### System
Access management, technical integrations, and diagnostics.
- **Feature Flags** — toggling experimental features (e.g., AI assistants in ticket workflow)
- **Plan** — current plan, limit usage, 12-month history, expiration date
- **Managed Organizations** — vendor and white-label relationships (visible only to partners)
- **Members** — users with access to the organization, their roles, permissions, and blocking
- **API Keys** — access tokens for integrations and developers
- **Domains** — custom domains, DNS verification, HTTPS, and availability monitoring
- **Routes** — rules for URL addresses and canonical links
- **Data Import** — batch upload from CSV / JSON / remote URL
- **Blocked IP Addresses** — list of IP bans with geolocation
- **Locks** — overview of TTLock smart locks (IoT)
- **Environment Variables** — advanced key-value store for secrets and integration keys
## Controls
### Switching Sections
- In the left sidebar menu, click on the desired section. The content of the right panel will instantly adapt.
- When switching to another section, unsaved changes are not discarded, but unconfirmed forms remain in the current session.
### Saving Changes
- Each section has its own **Save Changes** button. Changes will take effect immediately after submitting the form.
- Sensitive fields (SMTP passwords, tokens) are marked as write-only — they are never displayed after saving, only overwritten with a new value.
> ⚠️ The default currency of the organization cannot be changed self-service. If you try to change it, the request will be rejected, and the system will redirect you to BizKitHub technical support.
### Copying and Masking
- For each key or value, a **Copy** button is available, which saves the value to the clipboard.
- Secret values are displayed masked (e.g., `****abcd`). The full value can be revealed by the **Show** button.
## Sub-section Details
### API Keys
- Keys are generated in **PROD**, **DEV**, or **ROOT** environments. The default validity is 90 days; the maximum can be set to a specific date.
- The key is shown to the user only once upon generation — copy it immediately and store it in a safe place. The system cannot recover it later.
- For each key, a list of **scopes** (permission range) can be assigned. An empty list means full access.
- Key deactivation is irreversible. The key will remain in the list with the **Canceled** flag and will stop working immediately.
- Key details show usage history for the last 90 days.
### Domains
- Adding a new domain takes effect immediately, but the domain will remain in **Unverified** status until you perform DNS verification.
- The system will generate a verification token and a TXT record that must be inserted into your domain's DNS zone.
- The **Check** button can be used to repeatedly verify the DNS record; once found, the domain will be marked as **Verified**.
- For each domain, the HTTP code, HTTPS support, response time, and availability are continuously monitored.
### Members
- Inviting a new member is done via email. The system creates a pending invite request, and the invited person receives a link to complete registration.
- The member list supports full-text search by name and email.
- Member details include contact information, time zone, last login date, and the supervising member in the hierarchy.
- Permissions can be assigned directly or via roles. Each permission in the detail clearly shows its source.
- Blocking a member invalidates all their API keys and sends a notification email. The last active member cannot be blocked.
### Feature Flags
- Toggles allow activating or deactivating experimental features for the entire organization.
- A typical example is **Disable experiments** — deactivating AI ticket routing and automatic AI responses.
- Changes take effect immediately for all members.
### Plan
- Displays the current plan (`free`, `startup`, `business`, `enterprise`), effective price, and subscription expiration date.
- For each resource (storage, members, products, monthly orders, customers, emails, AI tokens, API requests, forms), **usage / limit** is displayed with a colored status indicator (ok / warn / critical / over).
- For monthly metrics, the system estimates usage projection at the end of the period (linear extrapolation).
- History shows the last 12 months, including empty months.
- A limit of `0` means unlimited.
### Routes
- Routes control the URL structure for articles, products, and other entities.
- Each route has a type (e.g., `article`, `product-detail`), slug, language, and a **canonical** flag.
- Changing a canonical route redirects old links and updates SEO metadata.
### Environment Variables
- Advanced key-value store for secrets: payment gateway API keys, SMTP passwords, TTLock tokens, etc.
- Values are masked by default — only the last 4 characters are displayed. Highly sensitive keys are fully masked.
- Changing a value is done with **optimistic locking**: the existing (original) value must be entered; if it has changed in the meantime, the system will reject the request.
- Each change creates an audit record in the history.
### Blocked IP Addresses
- Adding an IP to the blacklist automatically populates with geolocation data: city, state, ISP, proxy / Tor / hosting flags.
- A text reason can be stored for each block.
- Removing a block is immediate.
### Data Import
- Supported sources: **file** (CSV, JSON) or **remote URL** (feed).
- After upload, an analysis is performed: column detection, preview of the first 10 rows, parsing error check.
- The import is launched separately and runs asynchronously. Its status can be monitored in the import list — showing the total number of rows, successfully imported, and failed.
- For **Shoptet** provider, Czech column names are automatically mapped to English equivalents.
> 💡 To monitor the progress of longer imports, we recommend repeating the query for import details approximately every 10 seconds.
### Locks
- Overview of connected TTLock smart locks, battery level, gateway status, uptime for the last 30 days.
- For each lock, a list of access codes, unlock history, and an administrative contact can be displayed.
### Terminal
- Designed for advanced users — allows running internal commands (log display, task execution, diagnostics).
- Supports aliases (command shortcuts), history, streamed outputs, and interactive prompts.
- Access requires a valid member account. The command context is limited to the current organization.
> ⚠️ The terminal is a powerful tool. Only run commands you understand — some operations affect the entire organization's data.

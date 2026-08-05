---
id: "A38C10uI2PzsDhqh"
category: "communication/email-templates"
tags: []
published_at: "2026-04-24T06:57:26.380Z"
---


Email templates
===============

The `/emailer-template` page is used to manage email templates that the system uses for automatic message sending. Typical examples include order confirmation, password reset, new customer welcome email, or complaint status change notification. A template defines the subject and content of a specific event in a specific language. In combination with **Email Layouts** (a common layout with a logo and footer), the resulting message is created, which is then sent via **E-mailer**.

## Template Overview

The table contains the following columns:

- **Name and Description** — a human-readable name for the template (e.g., "Order Confirmation"), supplemented by the email subject that the recipient will see.
- **Type** — the internal code of the event for which the template is intended (e.g., `order-confirmation`, `contact-reset-password`).
- **Language** — the language variant (CZ, SK, EN, DE, etc.).
- **Active** — a green icon means the template is in use; gray means it is disabled.
- **Valid from / Valid to** — a time restriction indicating when the template is valid (e.g., a seasonal offer, a temporary version of text).
- **Date of change** — when the template was last modified.

## How the system selects a template

When sending a transactional or notification message, the system searches for a template in the following order:

1. **By event type** — e.g., *new order* → searches for type `order-confirmation`.
2. **By recipient's language** — the template in the customer's language takes precedence; if not available, the first available other language variant is used.
3. **By variant** — some types have multiple variants (e.g., order status notifications for different status codes). If a variant is specified, it is used preferentially.
4. **Only active templates** — disabled templates are never used.
5. **Default template** — if the organization does not have its own, the system's default template for the given language is used.

> ℹ️ Thanks to this chain, you can safely switch between old and new versions of a template using the *Active* flag or *Valid from/to*, without the risk of a message remaining without content.

## Validity and activation

A template has two independent levels of control over when it is in operation:

- **Active flag** — a simple manual switch. An inactive template is always skipped.
- **Valid from / Valid to** — a time window. The template automatically becomes valid on the specified day and expires afterwards. This allows preparing changes in advance (e.g., new text for Christmas).

Both levels can be combined: a template must be active *and* within the valid time window.

> 💡 For planned campaign texts, we recommend always setting *Valid to* — this prevents unintended sending of outdated content.

## Language mutations

A single event (type) can have any number of language mutations. The system automatically selects the one that matches the recipient's language:

- If the customer's profile is set to Czech, the CZ variant will be used.
- If no template exists in the given language, any other active version will be offered.
- If no variant is available, the default system template will be used.

> ⚠️ Always ensure that at least one language mutation is active. Otherwise, the system will use a generic default text that may not suit your brand.

## Variables

Template content is constructed using variables enclosed in double curly braces, such as `{{customerName}}` or `{{order.number}}`. The system replaces these placeholders with actual values from the database when sending. Available variables differ by template type — for an order, these are item numbers, addresses, and total amounts; for a password reset, it's a link with a one-time token. A list of all variables for the current template type is displayed directly in the editor, including example values.

### Variable validation

Before sending, the system checks:

- whether all used variables are defined for the given template type,
- whether the data to be substituted exists (if missing, the template will attempt to load a default value),
- the format of dates, amounts, and numbers (automatic localized display).

An unrecognized variable will remain in the text literally — this is intentional to easily detect a typo. In such a case, the message will receive a *preparation error* status and will not be sent.

## Creating a new template

The **Add** button in the top right corner opens a form for creating a new template:

1. **Event type** — selection from a catalog of supported types (order confirmation, password reset, newsletter onboarding, etc.).
2. **Unique template code** — e.g., `order-confirmed-v2`. Serves as an internal identifier for further edits and linking.
3. **Variant (optional)** — a suffix to distinguish multiple templates of the same type (e.g., by order group).
4. **Name** — a human-readable label displayed in the administration.
5. **Subject** — the default email subject text. Can contain variables.
6. **Language** — the primary localization of the template.

Optionally, when creating, the template can be immediately assigned to an order group and status (for example, "Confirmation — VIP group — PAID status"). This automatically activates it for the relevant scenario.

## Template detail and editing

Clicking on a row opens the editor:

- **Subject** — a single-line text, can contain variables.
- **Content** — an HTML editor with support for formatting, images, and embedded variables. The preview shows how the message will look after being wrapped in the organization's layout.
- **Type and variant** — basic identification.
- **Language and validity** — when and to whom the template is intended.
- **Active** — immediate enable or disable.

The **Send test email** button sends a message to the currently logged-in user with substituted test values. Use it before any important change to verify the appearance and functionality of links.

## Filtering

In the top panel, templates can be filtered by:

- **Event type**
- **Language**
- **Activity status**

> 💡 If you need to quickly find a template that should be used for a specific action, filter by type. The result is a complete list of variants, including validity, and you can quickly identify the "active winner" for the given language.

## Managing a larger number of templates

In larger organizations (dozens of templates), the following discipline has proven effective:

- Name templates with versions (e.g., `-v1`, `-v2`) and deactivate older versions, rather than deleting them. The history of sent messages thus remains traceable.
- Maintain a consistent subject tone across languages.
- Attachments (e.g., general terms and conditions as a PDF) should be directly linked to the template; the system will then automatically include them with every sent message.
- Test every change using **Send test email** before activation.

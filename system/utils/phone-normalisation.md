---
id: "5Ok75MqAqhxZWvSl"
category: "system/utils"
tags: []
published_at: "2026-08-01T00:00:00.000Z"
---


Phone normalisation
===================

Phone numbers are one of the platform's core identifiers of a shopper — used for order-status notifications, event reminders, delivery-driver contact and, in some flows, for account recovery. Because a phone number typed into a form arrives in an unpredictable shape (`+420 777 123 456`, `777 123 456`, `+420777123456`, `00420 777.123.456`), every phone number is normalised into a single canonical format before it is stored.

The same physical number may be attached to more than one contact — the phone is not a uniqueness key by itself. What matters is that when it *is* stored, it is stored in a form the platform can reason about.

## Canonical format

The stored representation is:

```
+{prefix} {value}
```

For example: `+420 777123456`.

The value obeys the following invariants:

- The number is stored as a **string**, never as an integer.
- The **country prefix** (`+420` for the Czech Republic, `+44` for the United Kingdom, and so on) is always present. This keeps the value globally meaningful when it leaves the platform.
- Exactly **one space** separates the prefix from the subscriber part. This is the sole delimiter within the stored value.
- The **subscriber part** has no internal spaces — digits run continuously.
- The subscriber part must satisfy the length and shape rules the platform's validator holds for the given prefix. A number that violates its country's rules is rejected at input.
- Formatting for display is a **presentation concern**, not a storage concern. The stored value is always canonical; the UI may insert additional spaces or dashes when rendering.

## Why normalisation matters

Storing phone numbers in a single canonical form protects several downstream systems from having to re-parse them:

- **Search** can match by exact string without needing tolerance for formatting variance.
- **De-duplication** across a merger of two data sources is straightforward: two canonical values that differ are genuinely different numbers.
- **Outbound integrations** — SMS gateway, carrier APIs, courier notification services — receive a shape they can consume without further munging.
- **Support** can hand the number to any external tool without a preliminary translation step.

## Presentation

When a phone number is shown to a human — in the administration, on a printed invoice, in an e-mail template — the UI is free to add spaces, dashes or country-formatting flourishes. The presentation layer is the correct place for locale-specific styling. Only the stored form is guaranteed to match the canonical shape above.

## Related articles

- [Utils](/utils) — index of the platform's stateless utilities.
- [String normalisation](/string-normalisation) — related normalisers for free-form text fields.

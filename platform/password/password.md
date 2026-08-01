---
id: "O659h0cqmmn99xCS"
code: "docs-migration-password"
category: "platform/password"
tags: []
published_at: "2026-07-26T18:33:19.958Z"
---


Password
========

## Storage

BizKitHub never stores passwords in a readable form. All user passwords are hashed with **bcrypt** at cost factor 12, which corresponds to 2¹² = 4 096 iterations of the underlying key-derivation function.

| Property | Value |
|----------|-------|
| Algorithm | bcrypt (Blowfish-based) |
| Cost factor | 12 |
| Average hash time | ~250 ms per password |
| Per-password salt | Yes, cryptographically random |
| Access by staff | None |

## Why bcrypt

Bcrypt is an adaptive hash: as hardware gets faster, the cost factor can be raised so a single verification stays slow enough to make brute-force impractical. Each password also carries a unique random salt, which defeats rainbow-table attacks and prevents two identical passwords from producing the same hash.

## Password rules

To be accepted, a password must satisfy every one of the following:

- At least 8 characters long.
- Contain at least one uppercase letter (A–Z).
- Contain at least one lowercase letter (a–z).
- Contain at least one digit (0–9).

The following make a password meaningfully stronger and are strongly recommended:

- 10 characters or more.
- 12 characters or more.
- A special character.
- No dictionary word, name or date used verbatim.

## Common mistakes

- Personal information (name, birthday, phone number).
- Trivial patterns such as `123456`, `qwerty`, `password`.
- Dictionary words without modification.
- Reusing the same password across services.
- Storing passwords in unsecured notes or e-mails.
- Sharing passwords over unencrypted channels.

## Recommended practices

- Use a **password manager** to generate and store unique random passwords.
- Enable **two-factor authentication** wherever available.
- Rotate passwords after any suspected leak or shared-computer incident.
- Never send a password by e-mail; use the built-in reset flow instead.

## What BizKitHub does on its side

- Rate-limits login attempts to blunt online brute-force attacks.
- Locks the account after a configurable number of consecutive failures.
- Logs authentication events to the audit trail under `Systém → Aktivity`.
- Notifies the account owner by e-mail on a successful login from a new device.
- Runs periodic security audits of the authentication pipeline.

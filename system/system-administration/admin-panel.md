---
category: "system/system-administration"
tags: []
published_at: "2026-08-01T00:00:00.000Z"
---


Admin panel
===========

The `/admin` route in the administration UI is the cross-organisation control plane reserved for platform operators. Where the `/organisation` and `/settings` modules configure a single organisation from the point of view of one of its members, `/admin` looks at every organisation on the platform and at every user record that spans them.

## Who sees it

Access is granted by a distinct `admin` role that is not tied to any organisation membership. A normal owner or root member of an organisation does not automatically see the panel — the two concepts are deliberately separate. If you have logged in and cannot find the entry point, you are not currently in the operator group; ordinary tenant-level administration is done from [`/settings`](/settings-overview) and [`/organisation`](/organisation-overview) instead.

## What the panel exposes

- **Organisations.** Every organisation on the platform, its plan tier, member count, storage footprint, and lifecycle state (active, suspended, in trial, scheduled for deletion). Operators can impersonate into an organisation for support debugging without knowing member credentials — every impersonation session is written to `core__activity` under the operator's identity.
- **Users.** Cross-organisation user records — the same `shop__contact` row can be a member of several organisations, and this view collapses those memberships into one row per user. Password resets, deletion requests, and GDPR data-export tickets originate here.
- **Global rate-limits and API keys.** The default per-organisation rate-limit tiers, and a read-only view of the API keys issued organisation-side. Operators can revoke a leaked key without waiting for the owning organisation to notice.
- **System audit.** A high-fanout feed of the platform's `core__activity` and `core__system_log` streams filtered to security-relevant events (root grants, member blocks, key revocations, permission changes).

## Related articles

- [Organization](/organisation-overview) — a single organisation's own settings.
- [Organization settings](/settings-overview) — technical/integration settings inside one organisation.
- [System administration](/administrace-systemu-overview) — deeper operator handbook covering incident response and rollback procedures.

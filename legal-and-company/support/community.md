---
id: "Nb2o5YiAw1SOZuJ8"
category: "legal-and-company/support"
tags: []
published_at: "2026-08-01T00:00:00.000Z"
---


Community
=========

BizKitHub is built in the open by a small team that lives on top of it every day, and grows with the developers, agencies, and operators who put it into production. The community around the platform is where implementation know-how, integration recipes, and bug reports circulate between the people who ship on top of it — before they become official documentation.

## Where to reach us

The primary channel for asking questions, sharing implementations, and reporting issues is direct e-mail to [support@bizkithub.com](mailto:support@bizkithub.com). Every message reaches a human on the core team; there is no ticket-triage queue between you and the engineers who wrote the code you are integrating with. Response time targets and SLA definitions are covered in the [Support](/support-overview) article.

For urgent production incidents (payments not settling, e-mails not sending, API returning 5xx across the board), the same address is monitored outside business hours and takes priority over feature questions.

## What the community produces

- **Integration recipes.** Real-world glue code between BizKitHub and third parties (Stripe, GoPay, ARES, Fio, e-mailing providers) contributed back once someone has solved a problem worth generalising.
- **Bug reports and edge cases.** Anything reproducible feeds into the [changelog](/changelog-overview) once it is fixed, so the community's testing effectively becomes the platform's release notes.
- **Feature requests.** The public API surface (`/api/v1/*`) evolves under a stable-versioning contract, so requests that would break existing integrations are queued for the next major; smaller additions land continuously and appear in the changelog.

## Reporting a security issue

Security disclosures do **not** go through the community channel. Follow the coordinated-disclosure process described in the [Security](/security-overview) and [Security Acknowledgments](/security-acknowledgments-overview) articles — this protects both you and the users of every organisation running on the platform.

## Contributing to the documentation

The Markdown source of every article on `docs.bizkithub.com` is in a public repository and round-trippable via the platform's importer. If you spot a typo, an outdated screenshot, or a section that would benefit from a real-world example, the fastest path is to open a pull request; the maintainers review and import so the change is live within one deploy cycle.

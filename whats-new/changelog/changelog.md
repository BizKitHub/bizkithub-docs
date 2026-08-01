---
id: "Ja8Wz6cj3N3nLT3L"
code: "docs-migration-changelog"
category: "whats-new/changelog"
tags: []
published_at: "2026-07-26T18:33:11.119Z"
---


Changelog
=========

## About this log

The changelog tracks user-visible changes to the BizKitHub API and platform. Entries are grouped by release and tagged as **added**, **improved**, **fixed**, **security**, **breaking** or **removed**. Breaking changes are always announced in advance.

## Versioning

The API follows semantic versioning:

- **Major** — incompatible API changes that require caller updates.
- **Minor** — new features that keep existing calls working.
- **Patch** — bug fixes and internal improvements.

Deprecated endpoints keep working for at least one full major release after the deprecation notice.

## Recent releases

### v2.1.0 — Enhanced authentication and new endpoints

- **added** OAuth 2.0 authentication flow support.
- **added** Webhook signature verification endpoints.
- **improved** Rate limiting now includes a burst allowance.
- **fixed** Timezone handling in date filters.

### v2.0.5 — Bug fixes and performance improvements

- **fixed** Pagination issue with large datasets.
- **improved** Reduced API response times by around 25%.
- **fixed** Error messages for invalid API keys.

### v2.0.0 — API redesign

- **breaking** Updated the API versioning scheme to v2.
- **added** New user management endpoints.
- **added** Enhanced filtering and sorting capabilities.
- **removed** Deprecated v1 endpoints (migration guide available on request).

### v1.8.2 — Security updates

- **security** Enhanced API key validation.
- **fixed** CORS issues for browser requests.

## Older releases

Archive of pre-1.8 releases is available in the platform admin under **Systém → Změny**.

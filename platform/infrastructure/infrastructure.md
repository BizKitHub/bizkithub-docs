---
id: "jtGQLwgPRj0udQSS"
category: "platform/infrastructure"
tags: ["type-concept"]
published_at: "2026-07-24T19:26:39.763Z"
---


Infrastructure
==============

This article describes where BizKitHub runs and how the platform stays available while it is being updated. It covers the guarantees that matter to customers; internal topology and vendor details beyond the [sub-processor list](/subprocessors-overview) are intentionally not published.

## Where your data is

- **Database and application servers** run on dedicated hardware in a data centre in **France (EU)**. The data centre operator is certified to ISO/IEC 27001.
- **Files** are kept in object storage with redundant copies (see [Storage](/storage-overview)).
- **Backups** are stored with two independent providers in different locations (see [Backup and recovery](/backup-overview)).

Customer records are processed in the European Union. Vendors that handle customer data are listed on the [sub-processors](/subprocessors-overview) page.

## Edge network

All public addresses (`api.bizkithub.com`, `admin.bizkithub.com`, `cdn.bizkithub.com` and the other BizKitHub services) are served through a global edge network. The edge terminates TLS close to the visitor, absorbs denial-of-service traffic, and caches static files and images. See [Regions](/regions) for the list of edge locations.

## Zero-downtime updates

The API and the administration each run as two independent instances behind a load balancer that checks their health continuously. An update is built once and then rolled out to one instance at a time: while one instance restarts, the other serves all traffic. Releases therefore happen during the day without a maintenance window, and a release that fails its health check never receives traffic.

## Separate services

Workloads with very different resource profiles run separately from the API, so that a spike in one cannot slow down the others:

- **PDF generation** (`pdf.bizkithub.com`) renders invoices, orders and documents.
- **Background workers** handle scheduled jobs such as bank synchronisation, e-mail processing and data imports.
- **Asset delivery** (`cdn.bizkithub.com`) serves images, QR codes and other generated assets.

## Network security

Only HTTPS is exposed to the internet. The database and internal services are not reachable from the public network at all; administrative access to servers uses key-based authentication only. See [Security](/security-overview) for the full set of controls.

## Related

- [Architecture](/architecture-overview)
- [Monitoring](/monitoring-overview)
- [Security](/security-overview)
- [Regions](/regions)

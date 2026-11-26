---
id: "uZD07gSIa74ZJp7P"
category: "platform/backup"
tags: ["type-concept"]
published_at: "2026-07-24T19:26:36.067Z"
---


Backup and recovery
===================

BizKitHub backs up every organisation's data automatically. You do not need to configure anything, and backups do not count towards any plan limit. This article explains what is backed up, how often, where the copies live and what recovery looks like.

## What is backed up

- **All business records.** Contacts, orders, invoices, products, posts, settings, members and every other record you see in the administration or the API.
- **Uploaded files.** Images, documents and attachments live in the BizKitHub global distributed storage, which keeps redundant copies on several devices. Every file is also copied automatically to a second, geographically separated datacentre in Nuremberg, Germany, operated by a different provider (see [Storage](/storage-overview) and [Durability](/durability-overview)).
- **Audit history.** Activity and system logs are part of the database and are backed up with it.

## How often

The platform combines two mechanisms:

- **Full snapshots** of the database are taken every three days.
- **Continuous archiving** records every change between snapshots. The change stream is shipped off the server at least every 15 minutes, and immediately when a block of changes fills up.

Together they allow **point-in-time recovery**: the database can be restored to any moment covered by the archive, not only to the moment of the last snapshot. In the worst case, a total loss of the primary server loses at most the last 15 minutes of changes.

## Where the copies live

Backups are stored outside the production server, with two independent storage providers in different locations. The primary backup store is **write-once**: a backup object cannot be changed or deleted before its retention period ends, not even with administrator credentials. A compromised server or a mistaken command therefore cannot destroy the backups.

Database snapshots are stored through the same [backup service](/backup-service) that is available to Enterprise customers, including its copy in the second datacentre in Nuremberg, Germany. Backup freshness is checked automatically twice a day. If a snapshot or the change stream falls behind, the operations team is alerted.

## Recovery

Recovery is performed by the BizKitHub operations team. Typical cases:

- **Platform incident.** The whole platform is restored from the latest consistent state. The [status page](https://status.bizkithub.com) reports the incident and its progress.
- **Data mistake in one organisation.** If someone in your organisation deleted or overwrote data by mistake, contact [support](https://support.bizkithub.com) as soon as possible and state the time when the mistake happened. The team can restore the affected records from a point just before it.

Many records are also protected before a backup is ever needed: deleted items are soft-deleted first, and most changes are recorded in the activity log with the original values.

## Related

- [Backup service](/backup-service) for backups of your own servers
- [Durability](/durability-overview)
- [Storage](/storage-overview)
- [Infrastructure](/infrastructure-overview)
- [SLA](/sla-overview)

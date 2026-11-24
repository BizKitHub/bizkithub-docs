---
id: "4Rz0O5Lqen8Kcnm6"
category: "platform/durability"
tags: ["type-concept"]
published_at: "2026-07-24T19:26:36.674Z"
---


Durability
==========

Durability is the guarantee that data you have saved stays saved. BizKitHub protects every write on several independent levels, so that no single failure, whether a disk, a server, a data centre or a human error, can lose committed data.

## Layers of protection

<table>
<thead>
<tr><th>Layer</th><th>Protects against</th><th>How</th></tr>
</thead>
<tbody>
<tr><td>Transactional writes</td><td>Half-written records after a crash</td><td>Every change is committed atomically. A request either saves all of its changes or none of them.</td></tr>
<tr><td>Mirrored disks</td><td>Failure of a single disk</td><td>Every block is written to two physical drives at the same time.</td></tr>
<tr><td>Continuous archiving</td><td>Loss of the whole server</td><td>Changes are shipped off the server at least every 15 minutes.</td></tr>
<tr><td>Full snapshots</td><td>Corruption that spreads over time</td><td>A complete copy of the database every three days, kept alongside the change archive.</td></tr>
<tr><td>Two storage providers</td><td>Outage or loss at one provider</td><td>Backups are kept with two independent providers in different locations.</td></tr>
<tr><td>Write-once backups</td><td>Ransomware, stolen credentials, operator error</td><td>Backup objects cannot be modified or deleted before their retention period ends.</td></tr>
</tbody>
</table>

## Recovery point and recovery time

- **Recovery point.** Because the database can be restored to any moment in the archive, the maximum data loss after a total loss of the primary server is 15 minutes of changes. Losses smaller than a server, such as a single disk, lose nothing.
- **Recovery time.** Restoring the platform from backups takes hours rather than days. Progress of any such incident is published on the [status page](https://status.bizkithub.com).

## Files

Uploaded files are stored in object storage that keeps redundant copies across several devices. A file is confirmed as uploaded only after it has been stored durably. See [Storage](/storage-overview).

## What durability does not cover

Durability protects data that the platform has accepted. It does not undo changes that were made intentionally through the administration or the API: an order you cancelled stays cancelled. For accidental changes, see the recovery section in [Backup and recovery](/backup-overview).

## Related

- [Backup and recovery](/backup-overview)
- [SLA](/sla-overview)
- [Security](/security-overview)

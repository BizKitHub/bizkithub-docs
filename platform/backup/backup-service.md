---
code: "backup-service"
category: "platform/backup"
tags: ["type-concept", "backup", "security"]
published_at: "2026-11-26T09:00:00.000Z"
---


Backup service
==============

The backup service stores backups of **your own servers and applications**: database dumps, website files, Docker volumes, anything you can pack into one file. Each backup is uploaded through the API, kept in two independent places, checked and monitored, and can be listed and downloaded in the administration. Nobody, including a person with full access to your server, can delete or overwrite a stored backup.

This article explains how your backups are protected and what the service checks for you. The step-by-step setup for administrators is in [Set up the backup service](/backup-service-setup).

> **Note.** This page is about backups you send. Backups of your BizKitHub data (orders, contacts, invoices, files) are made automatically by the platform; see [Backup and recovery](/backup-overview).

## Where your backups live

Every backup is written into the BizKitHub **global distributed storage**, the same object storage that serves files across the platform. It keeps several redundant copies of each object and is designed for a data durability of 99.999999999 % (eleven nines) per year. In practice, if you stored ten million files, you would statistically lose one in ten thousand years. See [Durability](/durability-overview).

On top of that, the platform makes a **full physical copy of every backup in a second datacentre in Nuremberg, Germany**. It is a different provider in a different location with separate credentials, so an outage, an incident or an operator error in one place cannot affect the other copy.

| | Primary copy | Second copy |
|---|---|---|
| Location | Global distributed storage | Datacentre in Nuremberg, Germany |
| When | During your upload | Automatically after the upload finishes |
| Can be deleted or overwritten | No | No |

### When the second copy is made

The copy starts automatically, nothing needs to be configured. **Every backup has its second copy within 1 hour after the upload finishes**, plus 1 hour for every started 8 GiB of size. This is a commitment of the service level agreement (see [SLA](/sla-overview)) and the administration shows for each backup whether the copy was made on time and how long it took. If a copy is late, the operations team is alerted immediately.

## Protection against ransomware and mistakes

Ransomware and attackers usually try to delete or encrypt backups first, so that the victim has nothing to restore from. The service is built so that this does not work:

- **Write-only access from your servers.** The API key used for backups can upload a new backup and read the list of backups. It cannot delete, overwrite, rename or download a backup. A compromised server can therefore neither destroy your backups nor steal them through the key it holds.
- **Immutable storage.** A stored backup cannot be deleted or changed, not even by a BizKitHub administrator. A mistaken command or a stolen password has nothing to erase.
- **Unique names.** Every upload gets a unique name in a monthly folder, so a new backup never replaces an older one. A backup encrypted by ransomware is stored next to the clean ones, and you restore from the last clean one.
- **A dedicated key per machine.** The administration creates an API key limited to the backup service with one click. Use a separate key for each server, so you can revoke exactly one if it leaks.
- **Encryption in transit.** All uploads and downloads go over HTTPS. For sensitive data we recommend encrypting the file before sending it (for example with `gpg` or `age`); you keep the key, so nobody else can read the content.
- **Downloads only in the administration.** Restoring requires signing in to the administration with a permission for the backup module. Every download is recorded in the activity log. If the primary copy is ever unavailable, the download is served from the second datacentre.

## What the service checks for you

Backups are useful only if they really run and really contain data. The service watches several things and sends an e-mail notification to your organisation when something is wrong:

| Check | What happens |
|---|---|
| **The next backup did not arrive.** With every backup your server announces when the next one is due (for example "every 24 hours"). | If the next backup does not arrive by that time plus 20 %, you get an e-mail. A server that stopped backing up is noticed within hours, not when you need a restore. |
| **An upload failed or stopped.** | A failed upload, or an upload with no activity for 6 hours, is closed and reported by e-mail. |
| **The size changed suddenly.** Each backup is compared with the previous backup of the same source and type. | If it is more than 20 % larger or smaller, you get a warning e-mail. A much smaller dump often means an incomplete export: an empty or unreachable database, a missing table or a permission error. A much larger file can mean logs or a wrong directory in the archive. |
| **The content is not intact.** While the second copy is made, the platform computes the SHA-256 checksum of the whole file and compares it with the checksum your client sent. | A mismatch is reported immediately as a critical problem. The administration marks every backup as verified or checked. |
| **The second copy is late.** | The operations team is alerted and the backup is marked in the administration. |

The service itself is monitored by the platform: upload processing, copying to the second datacentre and the checks above run as monitored jobs, and the operations team is alerted when one of them stops or falls behind. Platform incidents are published on the [status page](https://status.bizkithub.com).

## What you see in the administration

The **Backups** page under *System* shows the state of everything at a glance:

- one health state (all good, needs attention, problem) with the reason and the time of the last backup;
- the share of backups with a second copy, the copy SLA for the last 30 days and the integrity results;
- a chart of the total storage of your organisation together with how much was written each day, so a growing trend or an unusual day is visible immediately;
- every backup series (source and type) with its last backup, size change, next expected backup and copy state;
- the list of all backups with download, checksums and details.

## Related

- [Set up the backup service](/backup-service-setup)
- [Backup and recovery](/backup-overview)
- [Durability](/durability-overview)
- [Security](/security-overview)
- [SLA](/sla-overview)
- [API keys](/api-key-overview)

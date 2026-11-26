---
code: "backup-service"
category: "platform/backup"
tags: ["type-concept", "backup", "security"]
published_at: "2026-11-26T09:00:00.000Z"
---


Backup service
==============

The backup service stores backups of **your own servers and applications**: database dumps, website files, Docker volumes, anything you can pack into one file. Each backup is uploaded through the API, stored in the BizKitHub global distributed storage, copied automatically to a second datacentre in Nuremberg, Germany, and monitored. Nobody can delete or overwrite a stored backup: not a person with full access to your server, and not a BizKitHub administrator.

This article explains how your backups are protected and what the service watches for you. The step-by-step setup is in [Backup service setup](/backup-service-setup), the API contract in [Backup API](/backup-api), and solutions to common problems in [Backup troubleshooting](/backup-troubleshooting).

> **Note.** This page is about backups you send. Backups of your BizKitHub data (orders, contacts, invoices, files) are made automatically by the platform; see [Backup and recovery](/backup-overview).

## Who can use it

The backup service is part of the **Enterprise** tariff. Organisations on other tariffs cannot start a new upload; the API answers with `PUBLIC_BACKUP_TARIFF_NOT_SUPPORTED`. Backups that are already stored stay readable after a tariff change. BizKitHub uses the same service for the snapshots of its own database.

## When you would use it

- Nightly dumps of a production database (`pg_dump`, `mysqldump`) with an alert when a night is missed.
- Archives of website files, uploaded media or configuration (`tar`, `zstd`).
- Exports of Docker volumes or virtual machine images, up to 1 TiB per file.
- An off-site copy that ransomware on your server cannot reach, as part of a 3-2-1 backup strategy.
- Moving older backups from another location into one place, sorted into the correct months.

## Where your backups live

Every backup is written into the BizKitHub **global distributed storage**, the same storage that holds files across the platform. It keeps redundant copies of each object on several devices and is designed for an annual data durability of 99.999999999 % (eleven nines). With 10 million stored files, that means statistically losing one file in 10,000 years. See [Durability](/durability-overview).

On top of that, the platform makes a **full copy of every backup in a second datacentre in Nuremberg, Germany**. It is a different provider in a different location with separate credentials, so an outage, an incident or an operator error in one place cannot affect the other copy.

| | Primary copy | Second copy |
|---|---|---|
| Location | Global distributed storage | Datacentre in Nuremberg, Germany |
| When it is made | During your upload | Automatically after the upload finishes |
| Can be deleted or overwritten | No | No |

The copy starts automatically, and nothing needs to be configured. Large backups are copied part by part; an interrupted copy resumes from the last finished part. Every backup in the administration shows whether its second copy exists, when it was made and in which region. Through the API, the `isMirrored`, `mirroredAt` and `mirrorRegion` fields carry the same information.

If a copy fails repeatedly, the operations team is alerted, and a daily platform check reports any file that has waited for its second copy for more than 24 hours.

## How an upload works

The file never passes through the API. Your client asks the API to start a backup, receives signed upload addresses, and sends the file in parts **directly to the storage**:

1. The client announces the file name and size. The API answers with a backup identifier, the part size and the upload addresses.
2. The client uploads the parts, several at the same time. Each part is at least 64 MiB, and a failed part is simply sent again.
3. The client confirms the upload. The platform checks that every part arrived and that the stored size matches the announced size, and registers the backup.

Because the API only coordinates, a backup of hundreds of gigabytes does not slow anything down, and an unstable connection costs one part, not the whole file. The full contract is in the [Backup API](/backup-api).

Each backup is stored in a **monthly folder** with a unique random suffix in its name, for example `prod-db_aB3dE5fG7hJ9kL1m.sql.zst`. Compound extensions such as `.tar.zst` or `.sql.gz` are preserved. A new backup never replaces an older one, even when the file name is the same.

## Protection against ransomware and mistakes

Ransomware and attackers usually try to delete or encrypt backups first, so that the victim has nothing to restore from. The service is built so that this does not work:

- **Write and read only.** The API can start uploads and read backup metadata. It has no operation to delete, overwrite, rename or download a backup. A compromised server can therefore neither destroy your backups nor steal them through the key it holds.
- **Immutable storage.** A stored backup cannot be deleted or changed, not even by a BizKitHub administrator. A mistaken command or a stolen password has nothing to erase.
- **Unique names.** Every upload gets its own name. A backup encrypted by ransomware is stored next to the clean ones, and you restore from the last clean one.
- **A restricted key per machine.** An API key can be limited to the scope **Backup service only**. Such a key is rejected by every other endpoint of the platform. Use a separate key for each server, so you can revoke exactly one if it leaks.
- **Encryption in transit.** All uploads and downloads use HTTPS. For sensitive data, encrypt the file before sending it (for example with `gpg` or `age`) and keep the key outside the server. Only you can then read the content.
- **Downloads only in the administration.** Restoring requires signing in to the administration with permission for the **Backups** module. See [Restoring a backup](#restoring-a-backup).

## What the service watches for you

Backups are useful only if they really run. The service watches the following and sends an e-mail notification to your organisation when something is wrong. Each event is also recorded in the system log with its code; the [system code reference](/system-codes) explains every code.

| Event | What happens | Code |
|---|---|---|
| **The next backup did not arrive.** Every backup can announce when the next one of the same source and type is due. | If no newer backup starts by that time plus 20 % of the interval, you receive one e-mail. A server that stopped backing up is noticed within hours, not when you need a restore. | `BKP_EXPECT_MISS` |
| **An upload failed.** The client reported an error, the stored size did not match, or no data arrived for 6 hours. | The backup is marked as failed and you receive an e-mail with the reason and the progress reached. | `BKP_UPLOAD_FAIL` |
| **The client never confirmed the upload.** All parts arrived, but the confirmation did not, for example because the server restarted. | After 6 hours without activity, the platform completes the backup on its own and records a warning. The backup is stored normally. | `BKP_UPLOAD_AUTO` |

The monitoring of the next backup works per series. A **series** is the combination of the `source` and `type` you send with each backup, for example `shop-db` and `full`. The next backup in the series ends the watch, so every backup has to announce its own next time to keep monitoring on. The Linux client does this with the `--every` option.

The service itself is monitored by the platform: the upload checks and the copying to the second datacentre run as monitored jobs, and the operations team is alerted when one of them stops or falls behind. Platform incidents are published on the [status page](https://status.bizkithub.com).

## What you see in the administration

The **Backups** page under **System** shows:

- a **storage report** with the total size of your stored backups, how much was written each day and the trend over time, with a CSV export;
- the **list of backups** with name, source, type, size, status, upload progress, the next expected backup and the state of the second copy, with help text for every column;
- the **detail** of each backup with its checksum, metadata, the API key that uploaded it and the second copy (time and region);
- ready-made upload scripts for Linux (bash), Node.js and PHP.

## Restoring a backup

1. Sign in to the administration with a user who has permission for the **Backups** module.
2. Open **System → Backups** and find the backup in the list or its detail.
3. Click the download action. The administration generates a signed download link valid for **15 minutes**.
4. Download the file and restore it with the same tool that created it (`psql`, `mysql`, `tar` and so on).

Every download is recorded in the activity log of your organisation, so you can see who downloaded which backup and when. If the primary copy cannot be served, the download is served from the second datacentre automatically. If you uploaded the backup with a SHA-256 checksum, compare it with the downloaded file using `sha256sum` before you restore.

## Limits

| Limit | Value |
|---|---|
| Size of one backup | 1 TiB |
| Part size | At least 64 MiB, larger for very large files |
| Metadata attached to one backup | 8 KB of JSON |
| Validity of upload addresses | 12 hours, renewable |
| Inactivity before an upload is closed | 6 hours |
| Validity of a download link | 15 minutes |

## Related

- [Backup service setup](/backup-service-setup): connect a Linux server in a few minutes.
- [Backup API](/backup-api): endpoints, fields and error codes for your own client.
- [Backup troubleshooting](/backup-troubleshooting): what to do when an upload or an alert goes wrong.
- [Backup and recovery](/backup-overview): how BizKitHub backs up its own data.
- [Durability](/durability-overview): what eleven nines and the second datacentre mean.
- [API keys](/api-key-overview): creating and restricting keys.
- [SLA](/sla-overview): contractual commitments.

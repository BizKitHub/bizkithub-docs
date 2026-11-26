---
code: "backup-service"
category: "platform/backup"
tags: ["type-concept", "backup", "security"]
published_at: "2026-11-26T09:00:00.000Z"
---


Backup service
==============

The backup service stores backups of **your own servers and applications**: database dumps, website files, Docker volumes, anything you can pack into one file. Each backup is uploaded through the API, stored in the BizKitHub global distributed storage, copied automatically to a second datacentre in Nuremberg, Germany, checked for integrity and monitored. Nobody can delete or overwrite a stored backup: not a person with full access to your server, and not a BizKitHub administrator.

This article explains how your backups are protected and what the service checks for you. To connect a server with one command, follow [Backup service setup](/backup-service-setup). To get data back, see [Backup restore](/backup-restore). The API contract is in [Backup API](/backup-api), and solutions to common problems are in [Backup troubleshooting](/backup-troubleshooting).

> **Note.** This page is about backups you send. Backups of your BizKitHub data (orders, contacts, invoices, files) are made automatically by the platform; see [Backup and recovery](/backup-overview).

## Who can use it

The backup service requires a **storage plan**: Basic, Pro or Enterprise (see [Pricing](#pricing)). Organisations on the Enterprise organisation tariff that used the service before storage plans existed keep their access. Organisations without a plan cannot start a new upload; the API answers with `PUBLIC_BACKUP_TARIFF_NOT_SUPPORTED`. Backups that are already stored stay readable after a plan change. BizKitHub uses the same service for the snapshots of its own database.

## Pricing

The backup service is a managed service with an SLA on durability. Uploading backups and restoring them, including restores through the administration, is free of charge: you pay only for the data you store. The minimum fee is CZK 199 per month for the Basic plan.

| Plan | Price per month | Storage included |
|---|---|---|
| Basic | CZK 199 | 100 GB |
| Pro | CZK 1,490 | 1 TB |
| Enterprise | CZK 5,990 | 5 TB |

You can choose any plan. Storage above the amount included in your plan costs CZK 1.50 per GB per month, up to the [storage cap](#storage-cap) of the plan.

For other sizes or specific projects, pricing and conditions can be agreed individually. Contact info@bizkithub.com.

### Annual prepayment

When you pay for one year in advance, you get a 10 % discount on the whole order. The longest period is 1 year. The price is fixed for the period and is paid in advance.

| Plan | Price per year |
|---|---|
| Basic | CZK 2,149.20 |
| Pro | CZK 16,092 |
| Enterprise | CZK 64,692 |

The fixed price also fixes the storage of the chosen plan. When your stored data exceeds it, you pay for the extra GB (CZK 1.50 per GB) in the month in which the plan was exceeded.

### Storage cap

Every organisation has one shared storage for all its files: Drive, attachments, images and backups. The storage plan covers all of it, not only backups. Sizes are decimal: 1 GB is 1,000,000,000 bytes and 1 TB is 1,000 GB.

With any plan, paid monthly or annually, your storage can exceed the included amount by at most 20 %. Without a plan, the storage of an organisation is capped at 100 GB.

| Plan | Storage included | Storage cap |
|---|---|---|
| No plan | None | 100 GB |
| Basic | 100 GB | 120 GB |
| Pro | 1 TB | 1.2 TB |
| Enterprise | 5 TB | 6 TB |

The cap counts the files already stored, the announced size of backup uploads still in progress, and the new file. When the new file would take the total over the cap, the platform refuses it with HTTP 507 and the error code `PUBLIC_STORAGE_LIMIT_REACHED`. This applies to:

- starting a backup (`POST /api/v1/backup/start`);
- new files in Drive: uploads in the administration including large files, copies of files, and files received through public file requests;
- files uploaded through `POST /api/v1/disk/store-blob`.

Some operations are never refused. A backup upload that was already accepted can always be finished. Files the platform generates itself, such as invoices, e-mails, shipping labels and image variants, are always stored. Reading, downloading and restoring existing data always works.

To accept new files again, move the organisation to a higher plan or remove Drive files you no longer need. Stored backups cannot be deleted, so they keep counting towards the storage. To set up or change a plan, contact info@bizkithub.com.

## When you would use it

- Nightly dumps of a production PostgreSQL or MySQL database, with an alert when a night is missed.
- Archives of website files, uploaded media or configuration.
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

The copy starts automatically, and nothing needs to be configured. Large backups are copied part by part; an interrupted copy resumes from the last finished part.

### Copy deadline

Every backup uploaded through the API has a deadline for its second copy: **1 hour after the upload finishes, plus 1 hour for every 8 GiB of size**, counted proportionally. A 4 GiB backup is due within 1 hour 30 minutes, a 100 GiB backup within 13 hours 30 minutes.

Each backup shows when its copy was made and how long after the upload, or by when it is due. A copy that misses its deadline is marked as late in the administration and through the API, and the operations team is alerted. The [Backup API](/backup-api#backup-fields) returns the same information in `mirrorDeadlineAt`, `mirrorLagSeconds` and `isMirrorLate`.

## Integrity check

While the second copy is made, the platform reads the stored file once more and checks it:

- **Every part** is compared with its copy in the second datacentre. A part that does not match is copied again.
- **The whole file** gets a SHA-256 checksum computed by the platform. It is compared with the checksum your client sent when it finished the upload.

The result is stored with each backup as its **integrity state**:

| State | Meaning |
|---|---|
| `verified` | The stored file matches the checksum your client sent. |
| `computed` | Your client sent no checksum. The platform computed one, and you can use it to verify a downloaded copy. |
| `mismatch` | The stored file differs from the checksum your client sent. Your organisation receives a critical e-mail. |
| `unavailable` | The backup was copied before the integrity check existed. |

A mismatch means that the file stored is not the file your client hashed, for example because the file was still being written during the upload. Both copies are identical to each other; the difference is between your file and the uploaded one. Run the backup again and see [Backup troubleshooting](/backup-troubleshooting#integrity-check-failed).

### Periodic re-verification

A check at upload time proves that the backup arrived intact. To prove that it **stays** intact, the platform reads every stored backup that has its second copy back about every 30 days and computes its SHA-256 again. The runs alternate between the primary storage and the copy in the second datacentre, so both copies are read over time. Backups stored before checksums existed get their checksum on the first run, and later runs compare against it.

The backup detail shows the result under **Periodic check of stored data**: when it last ran, which copy it read, and whether the data is intact. If a copy no longer matches its checksum or cannot be found, the BizKitHub operations team is alerted automatically to restore it from the other copy, which stays available in the meantime. This alert goes to BizKitHub, not to your organisation. The [Backup API](/backup-api#re-verification-fields) returns the result in `reverifiedAt`, `reverifyStatus` and `reverifyCopy`.

## How an upload works

The file never passes through the API. Your client asks the API to start a backup, receives signed upload addresses, and sends the file in parts **directly to the storage**:

1. The client announces the file name and size. The API answers with a backup identifier, the part size and the upload addresses.
2. The client uploads the parts, several at the same time. Each part is at least 64 MiB, and a failed part is simply sent again.
3. The client confirms the upload. The platform checks that every part arrived and that the stored size matches the announced size, and registers the backup.

Because the API only coordinates, a backup of hundreds of gigabytes does not slow anything down, and an unstable connection costs one part, not the whole file. The ready-made client and the one-command installer do all of this for you.

Each backup is stored in a **monthly folder** with a unique random suffix in its name, for example `prod-db_aB3dE5fG7hJ9kL1m.sql.zst`. Compound extensions such as `.tar.zst` or `.sql.gz` are preserved. A new backup never replaces an older one, even when the file name is the same.

## Protection against ransomware and mistakes

Ransomware and attackers usually try to delete or encrypt backups first, so that the victim has nothing to restore from. The service is built so that this does not work:

- **Write and read only.** The API can start uploads and read backup metadata. It has no operation to delete, overwrite, rename or download a backup. A compromised server can neither destroy your backups nor steal them through the key it holds.
- **Immutable storage.** A stored backup cannot be deleted or changed, not even by a BizKitHub administrator. A mistaken command or a stolen password has nothing to erase.
- **Unique names.** Every upload gets its own name. A backup encrypted by ransomware is stored next to the clean ones, and you restore from the last clean one.
- **A restricted key per machine.** Keys created for backups are limited to the backup service and rejected by every other endpoint of the platform. **Connect a new machine** on the Backups page creates such a key with one click. Use a separate key for each server, so you can revoke exactly one if it leaks. When you re-install a series, the key of its previous installation is deactivated and your administrators receive a security e-mail.
- **Encryption in transit.** All uploads and downloads use HTTPS. For sensitive data, encrypt the file before sending it (for example with `gpg` or `age`) and keep the key outside the server.
- **Downloads only in the administration.** Downloading requires signing in with permission for the **Backups** module, and every download link is recorded in the activity log. See [Backup restore](/backup-restore).

## What the service watches for you

The service watches the following and sends an e-mail notification to your organisation when something is wrong. Each event is also recorded in the system log with its code; the [system code reference](/system-codes) explains every code.

| Event | What happens | Code |
|---|---|---|
| **The next backup did not arrive.** Every backup can announce when the next one of the same source and type is due. | If no newer backup starts by that time plus 20 % of the interval, you receive one e-mail. A server that stopped backing up is noticed within hours. | `BKP_EXPECT_MISS` |
| **An upload failed.** The client reported an error, the stored size did not match, or no data arrived for 6 hours. | The backup is marked as failed and you receive an e-mail with the reason and the progress reached. | `BKP_UPLOAD_FAIL` |
| **The client never confirmed the upload.** All parts arrived, but the confirmation did not. | After 6 hours without activity, the platform completes the backup on its own and records a warning. The backup is stored normally. | `BKP_UPLOAD_AUTO` |
| **The size changed suddenly.** Each completed backup is compared with the previous completed backup of the same source and type. | If it is more than 20 % larger or smaller, you receive a warning e-mail. The backup is stored normally. Backups where both files are under 1 MiB are not compared. | `BKP_SIZE_JUMP` |
| **The integrity check failed.** | You receive a critical e-mail with both checksums. | `BKP_SHA_MISMATCH` |

To feed the same events into your own monitoring or ticketing, subscribe to the backup [webhooks](/webhooks): `backup.completed`, `backup.failed`, `backup.mirrored`, `backup.overdue`, `backup.size_anomaly` and `backup.integrity_mismatch`. The e-mails are sent either way.

A sudden size change often reveals a problem the backup tool did not report: a much smaller dump can mean an empty or unreachable database, a missing table or a permission error; a much larger file can mean logs or a wrong directory in the archive.

The monitoring of the next backup works per **series**: the combination of the `source` and `type` sent with each backup, for example `shop-db` and `pg-dump`. The next backup in the series ends the watch, so every backup has to announce its own next time. The installer and the client's `--every` option do this automatically.

The service itself is monitored by the platform: the upload checks, the copying, the copy deadlines and the periodic re-verification run as monitored jobs, and the operations team is alerted when one of them stops or falls behind. Platform incidents are published on the [status page](https://status.bizkithub.com).

## The Backups page

The **Backups** page under **System** shows the state of all your backups at a glance.

- **Health state.** One of **All good**, **Needs attention**, **Backup problem** or **No backups yet**, with the reasons. A series past its next backup time, a copy outside its deadline, an integrity mismatch or storage at its cap is a problem; failed uploads, an organisation without a storage plan, or storage at 90 % of its cap or more need attention.
- **Key figures.** Stored backups, the share with a copy in the second datacentre, the share of copies made within their deadline over the last 30 days, the integrity results over the last 30 days, uploads running now, and the total storage of the organisation with the share of the [storage cap](#storage-cap) it uses, uploads in progress included.
- **Storage chart.** The total size in storage at the end of each day, and below it the amount written per day with its 7-day average. Both charts share the time axis. The daily data can be exported to CSV.
- **Backup series.** Each series with its state (OK, overdue, failed, uploading, not monitored), the last and the next backup, how many backups have their second copy, the integrity results and the size change.
- **Folders.** Which monthly folders grow most.
- **Backup list and detail.** Every backup with its status, size and size change, checksums, integrity state, the result of the periodic check of stored data, metadata, the API key that uploaded it, and its second copy with the time, the delay after the upload and the deadline.

Two actions start from this page: **Connect a new machine** (see [Backup service setup](/backup-service-setup)) and **Restore to a server** in the backup detail (see [Backup restore](/backup-restore)).

## Limits

| Limit | Value |
|---|---|
| Size of one backup | 1 TiB |
| Storage of the organisation | 100 GB without a plan, otherwise the included storage + 20 % (see [Storage cap](#storage-cap)) |
| Part size | At least 64 MiB, larger for very large files |
| Metadata attached to one backup | 8 KB of JSON |
| Validity of upload addresses | 12 hours, renewable |
| Inactivity before an upload is closed | 6 hours |
| Install command | Single use, valid 24 hours |
| Download link in the administration | 15 minutes |
| Download link for a server (restore) | 1 hour |

## Related

- [Backup service setup](/backup-service-setup): connect a server with one command.
- [Backup restore](/backup-restore): get a backup back onto a server.
- [Backup API](/backup-api): endpoints, fields and error codes.
- [Backup troubleshooting](/backup-troubleshooting): alerts and errors explained.
- [Backup and recovery](/backup-overview): how BizKitHub backs up its own data.
- [Durability](/durability-overview): eleven nines and the second datacentre.
- [SLA](/sla-overview): contractual commitments of the platform.

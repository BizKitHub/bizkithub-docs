---
code: "backup-troubleshooting"
category: "platform/backup"
tags: ["type-troubleshooting", "backup"]
published_at: "2026-11-26T12:00:00.000Z"
---


Backup troubleshooting
======================

This article helps you when a backup sent to the [backup service](/backup-service) did not arrive, failed, or triggered an alert. Each section starts with the symptom you see: an e-mail, an error code from the API, a message from the installer or the `bkh-backup` client, or a state in **System → Backups**. Find your symptom, check the causes in order and follow the fix.

All codes mentioned here are explained in the [system code reference](/system-codes) (e-mail alerts) and in the [error codes](/errors) (API errors).

## "Expected backup did not arrive"

**Symptom.** Your organisation receives an e-mail with this subject, and the system log shows the code `BKP_EXPECT_MISS`.

**What causes it.** The last backup of a series announced when the next one is due. That time plus 20 % of the interval has passed, and no newer backup of the same source and type has started. The most common causes are:

- the cron job or scheduled timer did not run (server down, cron disabled, a typo after an edit);
- the backup script failed before the upload, for example because the database dump failed or the disk was full;
- the source or type changed in the script, so the new backups belong to a different series;
- the API key expired or was revoked, so the upload was rejected.

**How to fix it.**

1. Open the script log on the server, for example `/var/log/shop-backup.log`, and read the last run.
2. Run the backup script by hand and watch the output. The client exits with a non-zero code and prints the error on any failure.
3. Check that `--source` and `--type` match the earlier backups of the series.
4. Check the key in **System → API keys**: it must be active, not expired, and allowed for the backup service.

The alert is sent once per backup. The next successful backup that announces its own next time restarts the monitoring.

## "Backup … failed"

**Symptom.** An e-mail says that a backup failed, the system log shows `BKP_UPLOAD_FAIL`, and the backup has the status **failed** in the administration. The e-mail and the backup detail state the reason and how much of the file arrived.

**What causes it.**

| Reason in the e-mail | Meaning |
|---|---|
| The backup client reported an error | The client gave up, typically after a part failed five times. The client log contains the details. |
| No data arrived within 6 hours after the start | The upload was started but no part was sent, for example because the server lost the connection or the script was killed. |
| The upload stopped: N of M parts arrived | The connection broke or the server stopped in the middle, and nothing arrived for 6 hours. |
| Stored size does not match the declared size | The uploaded parts do not add up to the size announced at the start, typically because a custom client split the file incorrectly. |
| The upload expired in storage | The upload stayed open for too long without being finished. |

**How to fix it.** A failed backup cannot be resumed. Fix the cause and start a new backup:

1. Make sure the file is complete before the upload starts. Create the dump into a file first, then upload the finished file.
2. On a slow or unstable connection, lower `--parallel` to `2` or `1`.
3. Run the script again by hand and check that it ends with `stored: backup <identifier>`.

The failed backup stays in the list as a record of the event. It does not count as a stored backup and does not end the watch for the next expected backup.

## "Backup completed automatically"

**Symptom.** The system log shows the warning `BKP_UPLOAD_AUTO`.

**What causes it.** Every part of the file arrived, but the client never confirmed the upload, for example because the server restarted or the script was stopped right before the end. After 6 hours without activity, the platform completed the backup on its own.

**How to fix it.** Nothing to recover: the backup is stored and protected normally. If it happens repeatedly, check why the script does not finish, for example a timeout in the job runner. A backup completed this way has no SHA-256 checksum, because the client sends the checksum only when it confirms the upload.

## API key errors

| Error code | Cause | Fix |
|---|---|---|
| `PUBLIC_API_KEY_DOES_NOT_EXIST` | The key is missing, mistyped, or deleted. | Check `/etc/bkh-backup.conf`. The line must be `BKH_API_KEY=` followed by the key, without spaces. |
| `PUBLIC_API_KEY_HAS_BEEN_EXPIRED` | The key passed its expiry date. | Create a new key with a later expiry date and replace it on the server. |
| `PUBLIC_API_KEY_IS_NOT_ACTIVE` | The key was deactivated. | Create a new key. Deactivation cannot be undone. |
| `PUBLIC_API_KEY_SCOPE_NOT_ALLOWED` | The key is restricted to other scopes, for example only to the cron monitor. | Assign the scope **Backup service only** or create a new key with it. |
| `PUBLIC_BACKUP_TARIFF_NOT_SUPPORTED` | The organisation of the key has no storage plan. | Check that the key belongs to the right organisation. Contact info@bizkithub.com to set up a storage plan. |

## Upload errors

| Error code | Cause | Fix |
|---|---|---|
| `PUBLIC_BACKUP_FILE_TOO_LARGE` | The file is larger than 1 TiB. | Split the backup, for example one file per database or directory, or compress it. |
| `PUBLIC_BACKUP_UPLOAD_INCOMPLETE` | When finishing, some parts were missing or had a wrong `ETag`, or the stored size differed from the declared size. | With the `bkh-backup` client, run the backup again. With your own client, upload the missing parts again and repeat the final call. See the [Backup API](/backup-api#finish-the-upload). |
| `PUBLIC_BACKUP_INVALID_STATE` | The backup is no longer uploading: it is completed, failed or cancelled. | Read the state of the backup and start a new one. |
| `PUBLIC_REQUEST_VALIDATION_FAILED` | A value is invalid, for example `--next` in the past or more than one year ahead, or metadata over 8 KB. | Read the `errors` list in the response and fix the value. |
| `PUBLIC_STORAGE_LIMIT_REACHED` (HTTP 507) | The organisation storage is at its cap. | See [Storage limit reached](#storage-limit-reached). |

## Storage limit reached

**Symptom.** Starting a backup fails with HTTP 507 and the error code `PUBLIC_STORAGE_LIMIT_REACHED`. Uploading a new file to Drive fails with the same error. On the Backups page, the health state shows **Needs attention** when the storage reaches 90 % of its cap, and **Backup problem** when it is full.

**What causes it.** All files of the organisation share one storage: Drive, attachments, images and backups. Its cap is 100 GB without a storage plan, or the included storage of the plan + 20 % (120 GB for Basic, 1.2 TB for Pro, 6 TB for Enterprise). The new file is refused when the stored files, the backup uploads still in progress and the new file together would exceed the cap. Several large backups started at the same time count with their full announced size from the start.

**How to fix it.**

1. Open **System → Backups** and check the organisation storage and the share of the cap it uses. From 90 % the page shows **Needs attention**, so you can act before uploads are refused.
2. Move the organisation to a higher plan, or set up a plan if it has none. Contact info@bizkithub.com. See [Storage cap](/backup-service#storage-cap).
3. Or remove Drive files you no longer need. Stored backups cannot be deleted.
4. Run the backup again.

Backups that were already accepted finish normally, and files the platform generates itself, such as invoices and e-mails, are still stored. Existing backups stay readable and can be restored.

## Client errors on the server

| Message | Cause | Fix |
|---|---|---|
| `missing API key` | The client found no key in the configuration file, the environment or the options. | Create `/etc/bkh-backup.conf` with `BKH_API_KEY=…`, or set `BKH_BACKUP_CONFIG` to your file. |
| `file not readable` or `file is empty` | Wrong path, missing permission, or the dump produced an empty file. | Check the path and that the user running the script can read the file. An empty file usually means the dump command failed. |
| `invalid --every` | The interval has the wrong format. | Use a number with `m`, `h`, `d` or `w`, for example `24h` or `1d`. |
| `date: invalid option` or `wait: -n: invalid option` | The system has a non-GNU `date` or `bash` older than 4.3. | Use a current Linux distribution, or upload with your own client over the [Backup API](/backup-api). |
| `upload of part N failed after 5 attempts` | The connection to the storage failed repeatedly. | Check outgoing HTTPS from the server, a proxy or a firewall. Lower `--parallel`. |

## Integrity check failed

**Symptom.** Your organisation receives a critical e-mail that a backup failed the integrity check, the system log shows `BKP_SHA_MISMATCH`, and the backup has the integrity state `mismatch`. The e-mail lists the checksum your client sent and the checksum of the stored file.

**What causes it.** The platform computed the SHA-256 of the stored file while copying it to the second datacentre, and it differs from the checksum your client sent. The stored file is therefore not the file your client hashed. Both stored copies are identical to each other. The most common causes are:

- the file was still being written when the upload started, for example a dump that had not finished;
- a script changed or replaced the file between computing the checksum and uploading it;
- a custom client sent the checksum of a different file.

**How to fix it.**

1. Make sure the backup script writes the file completely before it calls the client, as in the examples in [Backup service setup](/backup-service-setup).
2. Run the backup again and check that the new backup reaches the state `verified`.
3. Do not rely on the backup with the mismatch for a restore. Restore from the last backup with the state `verified`.

## "Backup size changed by more than 20 %"

**Symptom.** A warning e-mail says that a backup is much larger or smaller than the previous one, and the system log shows `BKP_SIZE_JUMP`. The backup list marks the size change.

**What causes it.** Each completed backup is compared with the previous completed backup of the same source and type. The backup itself is stored normally; the warning tells you that its content may not be what you expect.

- **Much smaller:** the database was empty or unreachable, a table was missing, the export lacked permissions or stopped early.
- **Much larger:** logs, temporary files or a wrong directory got into the archive, or the data really grew.
- **Either way:** the compression or the backup tool changed.

**How to fix it.** Compare the backup with the previous one. If the change is expected, for example after a data import or a cleanup, nothing needs to be done: the next backup is compared with this one. If not, check the output of the backup job and fix the export. Backups where both files are under 1 MiB are not compared.

## Install command errors

The installer runs all of its checks before it requests an API key. When a check fails, nothing is changed on the server, no key is created and the command stays valid: fix the cause and run the **same command** again within 24 hours. Once the checks pass, the command is used up and a backup-only key exists, even when a later step fails. Such keys appear in **System → API keys**; their description starts with `Backup:` and contains the host name. Every error is printed after `bkh: ERROR:`.

| Message on the server | Cause | Fix |
|---|---|---|
| `This install command was already used or has expired (24 h)` | The command was already used up by a run whose checks passed, or it is older than 24 hours. | Create a new command with **Connect a new machine** and run it. If an earlier run of the command created a key you do not need, deactivate it in **System → API keys**. |
| `run as root` | The installer was run without root rights. | Pipe it into `sudo bash`, as shown in the administration. |
| `missing command: pg_dump` (or `psql`, `mysqldump`, `mysql`, `tar`, `docker`, `curl`, `sha256sum`) | A required tool is not installed. Nothing was changed on the server. | Install the tool, then run the same command again. |
| `path /var/www does not exist` | The folder in the profile does not exist on this server. | Create a new command with the correct absolute path. |
| `Docker volume … not found` | The volume name is wrong or the volume is on another host. | Check `docker volume ls`, then create a new command with the correct volume name. |
| `system user postgres not found` | PostgreSQL is not installed on this server, or runs in a container. | Run the installer on the database server, or back up the Docker volume instead. |
| `cannot connect to PostgreSQL as user postgres` (with `(database …)` when you entered one) | PostgreSQL is not running, the `postgres` user cannot log in over the local socket, or the database does not exist. | Run `sudo -u postgres psql -c 'SELECT 1'` (add `-d` and the database name if you entered one) and fix what it reports, then run the same command again. If the database name was wrong, create a new command. |
| `cannot connect to MySQL as root: configure /root/.my.cnf or socket auth` | `root` cannot log in to MySQL or MariaDB without a password prompt, the server is not running, or the database does not exist. | Store the credentials in `/root/.my.cnf` (readable by root only) or enable socket authentication for `root`, check that `sudo mysql -e 'SELECT 1'` works, then run the same command again. |
| `the Docker daemon is not reachable` | Docker is installed, but its daemon does not answer. | Start it with `systemctl start docker`, then run the same command again. |
| `cannot reach the BizKitHub API` | The server could not connect to the API when requesting the key. | Check outgoing HTTPS from the server and run the same command again. If it then reports that the command was already used, create a new one. |
| `unexpected answer from the API, nothing was changed` | The answer to the key request was not an API key. | Run a new command. If it happens again, contact info@bizkithub.com. |
| `the first backup failed` | The job is installed, but its first run failed. | Read the output above the message, fix the cause (most often database access) and run the job by hand with `sudo /usr/local/sbin/bkh-backup-<series>`. |

## Periodic check of stored data

**Symptom.** The backup detail in the administration shows **Periodic check of stored data** with **Copy does not match the checksum** or **Copy not found**, or the API returns `reverifyStatus` `mismatch` or `missing`.

**What causes it.** About every 30 days the platform reads each backup back from one of its two copies, alternating between the primary storage and the second datacentre, and compares its SHA-256 with the stored checksum. A different result means that this one copy is damaged or missing.

**How to fix it.** You do not need to do anything. The operations team is alerted automatically, and the other copy stays available for a restore. If you need to restore this backup, contact info@bizkithub.com with the backup identifier.

## The second copy is late

**Symptom.** A backup does not show its copy in the second datacentre yet, or the administration marks the copy as late.

**What causes it.** The copy starts automatically after the upload and is due within 1 hour plus 1 hour per 8 GiB of size. Large backups are copied part by part and take longer. You do not need to do anything: the backup is already stored durably in the primary storage. A copy that misses its deadline, fails repeatedly, or a file that waits for its copy longer than 24 hours alerts the operations team, which resolves it.

## When to escalate

Contact info@bizkithub.com and quote the backup identifier when:

- a backup you need to restore cannot be downloaded in the administration;
- a backup has not had its second copy for more than 24 hours;
- a backup shows the integrity state `mismatch` and running the backup again does not help;
- the API returns a `5xx` error repeatedly; include the `requestId` from the response.

Check the [status page](https://status.bizkithub.com) first: platform incidents are published there.

## Related

- [Backup service](/backup-service)
- [Backup service setup](/backup-service-setup)
- [Backup API](/backup-api)
- [Backup restore](/backup-restore)
- [System codes](/system-codes)
- [API key](/api-key-overview)

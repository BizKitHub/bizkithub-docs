---
code: "backup-troubleshooting"
category: "platform/backup"
tags: ["type-troubleshooting", "backup"]
published_at: "2026-11-26T12:00:00.000Z"
---


Backup troubleshooting
======================

This article helps you when a backup sent to the [backup service](/backup-service) did not arrive, failed, or triggered an alert. Each section starts with the symptom you see: an e-mail, an error code from the API or the `bkh-backup` client, or a state in **System → Backups**. Find your symptom, check the causes in order and follow the fix.

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
| `PUBLIC_BACKUP_TARIFF_NOT_SUPPORTED` | The organisation of the key is not on the Enterprise tariff. | Check that the key belongs to the right organisation. Contact info@bizkithub.com to change the tariff. |

## Upload errors

| Error code | Cause | Fix |
|---|---|---|
| `PUBLIC_BACKUP_FILE_TOO_LARGE` | The file is larger than 1 TiB. | Split the backup, for example one file per database or directory, or compress it. |
| `PUBLIC_BACKUP_UPLOAD_INCOMPLETE` | When finishing, some parts were missing or had a wrong `ETag`, or the stored size differed from the declared size. | With the `bkh-backup` client, run the backup again. With your own client, upload the missing parts again and repeat the final call. See the [Backup API](/backup-api#finish-the-upload). |
| `PUBLIC_BACKUP_INVALID_STATE` | The backup is no longer uploading: it is completed, failed or cancelled. | Read the state of the backup and start a new one. |
| `PUBLIC_REQUEST_VALIDATION_FAILED` | A value is invalid, for example `--next` in the past or more than one year ahead, or metadata over 8 KB. | Read the `errors` list in the response and fix the value. |

## Client errors on the server

| Message | Cause | Fix |
|---|---|---|
| `missing API key` | The client found no key in the configuration file, the environment or the options. | Create `/etc/bkh-backup.conf` with `BKH_API_KEY=…`, or set `BKH_BACKUP_CONFIG` to your file. |
| `file not readable` or `file is empty` | Wrong path, missing permission, or the dump produced an empty file. | Check the path and that the user running the script can read the file. An empty file usually means the dump command failed. |
| `invalid --every` | The interval has the wrong format. | Use a number with `m`, `h`, `d` or `w`, for example `24h` or `1d`. |
| `date: invalid option` or `wait: -n: invalid option` | The system has a non-GNU `date` or `bash` older than 4.3. | Use a current Linux distribution, or upload with your own client over the [Backup API](/backup-api). |
| `upload of part N failed after 5 attempts` | The connection to the storage failed repeatedly. | Check outgoing HTTPS from the server, a proxy or a firewall. Lower `--parallel`. |

## The second copy is not shown yet

**Symptom.** A completed backup does not show its copy in the second datacentre yet.

**What causes it.** The copy starts automatically after the upload and takes longer for large backups, which are copied part by part. You do not need to do anything: the backup is already stored durably in the primary storage, and the operations team is alerted if the copy fails repeatedly or any file waits for its copy longer than 24 hours.

## When to escalate

Contact info@bizkithub.com and quote the backup identifier when:

- a backup you need to restore cannot be downloaded in the administration;
- a backup has not had its second copy for more than 24 hours;
- the API returns a `5xx` error repeatedly; include the `requestId` from the response.

Check the [status page](https://status.bizkithub.com) first: platform incidents are published there.

## Related

- [Backup service](/backup-service)
- [Backup service setup](/backup-service-setup)
- [Backup API](/backup-api)
- [System codes](/system-codes)
- [API key](/api-key-overview)

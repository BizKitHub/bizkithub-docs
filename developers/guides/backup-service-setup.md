---
code: "backup-service-setup"
category: "developers/guides"
tags: ["type-guide", "backup", "api"]
published_at: "2026-11-26T09:00:00.000Z"
---


Set up the backup service
=========================

This guide connects a server to the [backup service](/backup-service) in a few minutes: create an API key, install the client, schedule the backup and check that it arrived. It is written for server administrators and developers. How the backups are protected is explained in [Backup service](/backup-service).

## What you need before you start

- The backup service enabled for your organisation and the permission for the **Backups** module in the administration.
- A Linux server with `bash`, `curl` and `sha256sum` (any current distribution has them). For other systems, use the API directly; the administration contains ready-made Node.js and PHP scripts.
- A command that creates your backup as **one file**: `pg_dump`, `mysqldump`, `tar`, `docker run … tar` and so on.

## Steps

### 1. Create an API key for the server

In the administration, open **System → Backups** and click **Connect a new machine**. Choose a name (for example the server name) and validity, and confirm. The dialog shows the key once, together with the installation commands with the key already filled in. Copy them.

The key is limited to the backup service: it can upload and list backups, nothing else. Create one key per server.

### 2. Install the client

```bash
curl -fsSL https://api.bizkithub.com/api/v1/backup/client.sh -o /usr/local/bin/bkh-backup
chmod +x /usr/local/bin/bkh-backup
echo 'BKH_API_KEY=your-key' > /etc/bkh-backup.conf
chmod 600 /etc/bkh-backup.conf
```

### 3. Write the backup script

Create the backup file, upload it and remove the local copy. The `--every` option announces the next backup and turns on monitoring.

```bash
#!/usr/bin/env bash
set -euo pipefail
FILE=/var/backups/shop-db-$(date -u +%F).sql.zst
pg_dump --format=plain shop | zstd -q -o "$FILE"
bkh-backup --source shop-db --type full --every 24h "$FILE"
rm -f "$FILE"
```

| Option | Meaning |
|---|---|
| `--source` | What is backed up, for example a server or database name. Backups with the same source and type form a series. |
| `--type` | Kind of backup, for example `full`, `files`, `incremental`. |
| `--every` | Interval to the next backup (`6h`, `24h`, `7d`). Turns on the "next backup did not arrive" alert. |
| `--next` | Exact time of the next backup (ISO 8601) instead of `--every`. |
| `--name` | Human-readable name shown in the administration. |
| `--encrypted` | Marks a file you encrypted yourself before uploading. |
| `--meta` | Your own JSON metadata stored with the backup. |
| `--parallel` | Number of parts uploaded at the same time. |

Run `bkh-backup --help` for the full list.

### 4. Schedule it

```bash
# /etc/cron.d/shop-backup
30 2 * * * root /usr/local/bin/shop-backup.sh >> /var/log/shop-backup.log 2>&1
```

The client exits with a non-zero code on any error, so cron reports failures too. The service also sends an e-mail on a failed upload and when the next backup does not arrive.

## Verifying it worked

- The client prints `stored: backup <identifier>` with the size and the next expected time, and exits with `0`.
- In **System → Backups** the backup appears in the list and in its series. Within the copy SLA (1 hour + 1 hour per 8 GiB) it shows the second copy as done and the integrity check as verified.
- From scripts, `GET /api/v1/backup/list` returns the latest backups with their copy and integrity state, so you can add the check to your own monitoring. See the [API explorer](/swagger).

## Good practice

- **One backup, one file.** Create the whole package first and upload the finished file. Large files upload faster than thousands of small ones, are consistent to one point in time and are easy to restore.
- **Compress** the file (`zstd`, `gzip`). Compound extensions such as `.tar.zst` are kept intact.
- **Encrypt sensitive data** before uploading (`gpg`, `age`) and keep the key outside the server.
- **Keep the size stable.** The service warns when a backup is more than 20 % larger or smaller than the previous one of the same series. If you change what a script backs up, expect one warning.
- **Test a restore** regularly: download a backup in the administration and restore it into a test environment.

## What can go wrong

| Symptom | Cause and fix |
|---|---|
| The API rejects the key | The key is wrong, expired, revoked or lacks the backup scope. Create a new key with **Connect a new machine**. |
| "The next backup did not arrive" e-mail | The cron job did not run or failed before the upload. Check the server log and cron. |
| "Backup size changed" warning | Compare the backup with the previous one. A much smaller file usually means the export failed partway. |
| Upload stops on a slow line | Lower `--parallel`. An interrupted upload is closed after 6 hours without activity and reported. |
| Your plan does not allow uploads | The administration shows a notice; contact support to enable the backup service. |

## Related

- [Backup service](/backup-service)
- [API keys](/api-key-overview)
- [Monitoring](/monitoring-overview)
- [Error codes](/errors)

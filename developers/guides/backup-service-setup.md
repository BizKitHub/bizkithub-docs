---
code: "backup-service-setup"
category: "developers/guides"
tags: ["type-guide", "backup", "api"]
published_at: "2026-11-26T09:00:00.000Z"
---


Backup service setup
====================

This guide connects a Linux server to the [backup service](/backup-service): create a restricted API key, install the `bkh-backup` client, write a backup script, schedule it and check that the backup arrived. It takes about ten minutes and is written for server administrators and developers. How the backups are protected is explained in [Backup service](/backup-service); the API behind the client is documented in the [Backup API](/backup-api).

## What you need before you start

- An organisation on the **Enterprise** tariff, which includes the backup service.
- A user with permission to manage API keys and permission for the **Backups** module in the administration.
- A Linux server with `bash` 4.3 or newer, `curl`, `dd`, `stat`, GNU `date` and `sha256sum`. Every current Linux distribution has them. On other systems, use the API directly; the administration contains ready-made Node.js and PHP scripts.
- A command that creates your backup as **one file**: `pg_dump`, `mysqldump`, `tar`, `docker run … tar` and so on.

## Steps

### 1. Create an API key for the server

1. In the administration, open **System → API keys** and create a new **production** key. Use the server name as the description, so you can recognise the key later in the backup list.
2. Set the **expiry date** to cover the whole period during which the server should back up. A key stops working when it expires, and so do the backups that use it.
3. Assign the scope **Backup service only** to the key. The key can then upload backups and read their state, and every other endpoint of the platform rejects it.
4. Copy the key. It is shown only once.

Create one key per server. If a server is compromised, you revoke its key and nothing else stops working. More about keys in [API keys](/api-key-overview).

### 2. Install the client

The client is a single bash script. Downloading it needs no API key.

```bash
sudo curl -fsSL https://api.bizkithub.com/api/v1/backup/client.sh -o /usr/local/bin/bkh-backup
sudo chmod +x /usr/local/bin/bkh-backup
```

### 3. Store the key

The client reads the key from `/etc/bkh-backup.conf`. Keep the file readable by `root` only.

```bash
printf 'BKH_API_KEY=%s\n' 'YOUR_API_KEY' | sudo tee /etc/bkh-backup.conf >/dev/null
sudo chmod 600 /etc/bkh-backup.conf
```

The key can also come from the `BKH_API_KEY` environment variable or the `--api-key` option. To use a different configuration file, for example one key per application on a shared server, set `BKH_BACKUP_CONFIG=/path/to/file`.

### 4. Send a test backup

```bash
sudo bkh-backup --source test --name "First test" /etc/hostname
```

The client prints its progress on standard error and the identifier of the stored backup on standard output, then exits with code `0`.

```text
02:30:01 bkh-backup: sha256 of /etc/hostname (7 B)…
02:30:01 bkh-backup: backup aB3dE5fG7hJ9kL1m: 1 part(s) of 64 MiB, 4 in parallel
02:30:02 bkh-backup: stored: backup aB3dE5fG7hJ9kL1m (7 B)
aB3dE5fG7hJ9kL1m
```

### 5. Write the backup script

Create the backup file, upload it and remove the local copy. The `--every` option announces the next backup and turns on monitoring.

```bash
#!/usr/bin/env bash
# /usr/local/bin/backup-shop.sh
set -euo pipefail
FILE=/var/backups/shop-db-$(date -u +%F).sql.zst
pg_dump --format=plain shop | zstd -q -o "$FILE"
bkh-backup --source shop-db --type full --every 24h "$FILE"
rm -f "$FILE"
```

For MySQL or MariaDB, replace the dump line with `mysqldump --single-transaction --quick --routines shop | gzip > "$FILE"` and use a `.sql.gz` file name. For website files, use `tar -C /var/www -cf - . | zstd -q -o "$FILE"` with a `.tar.zst` file name.

### 6. Schedule it

```bash
# /etc/cron.d/shop-backup
30 2 * * * root /usr/local/bin/backup-shop.sh >> /var/log/shop-backup.log 2>&1
```

Make the script executable with `chmod +x`. A timer of your init system works the same way.

## Client options

```bash
bkh-backup [options] FILE
```

| Option | Meaning |
|---|---|
| `--source CODE` | What is backed up, for example a server or database name (`shop-db`, `web-files`). Backups with the same source and type form a **series**. |
| `--type TYPE` | Kind of backup within the source, for example `full`, `incremental`, `mysqldump`. |
| `--name TEXT` | Human-readable label shown in the administration. |
| `--every DURATION` | When the next backup is due, as `30m`, `12h`, `1d` or `1w`. Turns on the "next backup did not arrive" alert. |
| `--next ISO` | Exact time of the next backup in ISO 8601, instead of `--every`. |
| `--period YYYY-MM` | Month folder for the backup. Defaults to the current month; use it when you import older backups. |
| `--meta JSON` | Your own metadata as a JSON object, for example `'{"db":"shop"}'`. Without it, the client sends the host name and its own version. |
| `--encrypted` | Marks a file you encrypted yourself before uploading. Informational only. |
| `--parallel N` | Number of parts uploaded at the same time. Default `4`. |
| `--no-sha256` | Skips the SHA-256 checksum, which saves time on very large files. |
| `--api-key KEY` | API key, instead of the configuration file or `BKH_API_KEY`. |
| `--quiet` | Prints only errors and the backup identifier. |

`bkh-backup --help` prints the list, and `bkh-backup --version` the client version.

### What the client does for you

- Computes the **SHA-256** checksum of the file and stores it with the backup, so you can verify a downloaded copy later.
- Uploads the file in parts directly to the storage, several at the same time. Each part is retried up to five times, with fresh upload addresses when the previous ones expired.
- Reports a failure to the service when it gives up. The backup is then marked as failed at once and your organisation receives an e-mail.
- Exits with a non-zero code on any error, so cron or your job scheduler reports the failure too.

## Verifying it worked

- The script run ends with `stored: backup <identifier>` in the log and exit code `0`.
- In **System → Backups**, the backup appears in the list with status **completed**, its size, its series and the next expected time.
- Shortly after the upload, the backup shows that its second copy in the Nuremberg datacentre exists.
- From your own monitoring, call `GET /api/v1/backup/list?source=shop-db&limit=1` with the same key and check `status`, `completedAt` and `isMirrored`. See the [Backup API](/backup-api#list-backups).

## Good practice

- **One backup, one file.** Create the whole package first and upload the finished file. One large file uploads faster than thousands of small ones, is consistent to one point in time and is easy to restore.
- **Compress** the file (`zstd`, `gzip`). Compound extensions such as `.tar.zst` are kept intact in the stored name.
- **Encrypt sensitive data** before uploading (`gpg`, `age`), keep the decryption key outside the server, and add `--encrypted`.
- **Always announce the next backup** with `--every`. Without it, a stopped cron job goes unnoticed.
- **Keep source and type stable.** Monitoring works per series; a new source or type starts a new series.
- **Check the key expiry.** Renew the key before it expires and replace it in `/etc/bkh-backup.conf`.
- **Test a restore** regularly: download a backup in the administration, compare its checksum and restore it into a test environment.

## What can go wrong

| Symptom | Cause and fix |
|---|---|
| `missing API key` | The client found no key. Check `/etc/bkh-backup.conf` and its permissions, or `BKH_BACKUP_CONFIG`. |
| `PUBLIC_API_KEY_SCOPE_NOT_ALLOWED` | The key is restricted to other scopes. Assign **Backup service only** or create a new key. |
| `PUBLIC_API_KEY_HAS_BEEN_EXPIRED` | The key expired. Create a new key with a later expiry date. |
| `PUBLIC_BACKUP_TARIFF_NOT_SUPPORTED` | The organisation is not on the Enterprise tariff. Contact info@bizkithub.com. |
| `date: invalid option` or `wait: -n: invalid option` | The server has a non-GNU `date` or an older `bash`. Use a current Linux distribution, or call the API directly. |
| Upload stops on a slow line | Lower `--parallel`. An interrupted upload is closed after 6 hours without activity and reported by e-mail. |
| "Expected backup did not arrive" e-mail | The cron job did not run or failed before the upload. Check the script log and the cron configuration. |

More cases with step-by-step fixes are in [Backup troubleshooting](/backup-troubleshooting).

## Related

- [Backup service](/backup-service): how backups are protected and monitored.
- [Backup API](/backup-api): build your own client.
- [Backup troubleshooting](/backup-troubleshooting)
- [API keys](/api-key-overview)
- [Monitoring](/monitoring-overview)

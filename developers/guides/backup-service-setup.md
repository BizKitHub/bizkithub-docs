---
code: "backup-service-setup"
category: "developers/guides"
tags: ["type-guide", "backup", "api"]
published_at: "2026-11-26T09:00:00.000Z"
---


Backup service setup
====================

This guide connects a Linux server to the [backup service](/backup-service). The recommended way is **one command**: you choose what to back up and when in the administration, and run the generated command on the server. It installs the client, stores a backup-only key, schedules the job and runs the first backup. If you need full control, the second part of this guide sets up the `bkh-backup` client by hand.

How the backups are protected is explained in [Backup service](/backup-service). Getting data back is covered in [Backup restore](/backup-restore), and the API behind the client in [Backup API](/backup-api).

## What you need before you start

- An organisation with a storage plan (Basic, Pro or Enterprise), which includes the backup service. Plans, prices and the storage cap are listed in [Backup service](/backup-service#pricing).
- A user with permission for the **Backups** module in the administration.
- A Linux server where you can run commands with `sudo`. One-command setup has been tested on current Debian and Ubuntu releases using either the standard service manager timers (`systemctl`) or cron.
- `curl`, `sha256sum`, `dd`, `stat` and GNU `date` on the server, plus the tool for what you back up: `pg_dump`, `mysqldump`, `tar` or `docker`. The installer checks all of them before it changes anything.

## One-command setup

### 1. Create the install command

1. In the administration, open **System → Backups** and click **Connect a new machine**.
2. Keep **One command (recommended)** selected.
3. Enter a **description**: the machine and what it backs up, for example `web-01 MySQL`. The series name is derived from it (`web-01-mysql`).
4. Choose **what to back up**:

   | Option | Target | What the job runs |
   |---|---|---|
   | PostgreSQL database | Database name, or empty for all databases | `pg_dump --no-owner --no-privileges` of one database, or `pg_dumpall` of the whole server, as the `postgres` system user |
   | MySQL / MariaDB database | Database name, or empty for all databases | `mysqldump --single-transaction --quick --routines --events --triggers` |
   | Folder with files | Absolute path, for example `/var/www` | `tar` of the folder; a file that changes while it is being read does not fail the backup |
   | Docker volume | Volume name | `tar` of the volume, mounted read-only into a temporary container |

5. Choose **how often**: every 6 hours, daily, or weekly on Sunday.
6. Enter the **start time** in the server's local time (`HH:MM`). With the 6-hour interval it is the first slot of the day: `02:30` means 02:30, 08:30, 14:30 and 20:30.
7. Choose the **validity** of the API key the installer creates: 1, 2 or 5 years.
8. Click **Create install command**.

The dialog shows one command, for example:

```bash
curl -sSL https://api.bizkithub.com/api/v1/backup/install -d token=Xq3vB8nKp2LmT7wR9yZc4dFg6hJs1aEu -d host="$(hostname)" | sudo bash
```

The command works **once** and is valid for **24 hours**. Do not share it: it contains one-time access to your organisation's backups.

### 2. Run it on the server

Paste the command into a shell on the server. The installer prints each step. It runs **every check first** and requests the API key only when all of them pass, so a server that fails a check is left unchanged and no key is created.

1. Runs the checks for the chosen profile, and stops at the first one that fails:

   | Check | Applies to | Message when it fails |
   |---|---|---|
   | The installer runs as root. | All | `run as root`, followed by the command to use |
   | `curl`, `sha256sum`, `dd`, `stat` and `date` exist, plus the tools of the profile: `pg_dump` and `psql`, `mysqldump` and `mysql`, `tar`, or `docker`. | All | `missing command: <name>` |
   | The Docker daemon answers. | Docker volume | `the Docker daemon is not reachable` |
   | The Docker volume exists. | Docker volume | `Docker volume <name> not found` |
   | The folder exists. | Folder | `path <path> does not exist` |
   | The `postgres` system user exists. | PostgreSQL | `system user postgres not found (is PostgreSQL installed here?)` |
   | The `postgres` system user can log in to PostgreSQL and run a query, in the chosen database if you entered one. | PostgreSQL | `cannot connect to PostgreSQL as user postgres (database <name>)` |
   | `root` can log in to MySQL or MariaDB and run a query, in the chosen database if you entered one, through `/root/.my.cnf` or socket authentication. The attempt times out after 5 seconds. | MySQL / MariaDB | `cannot connect to MySQL as root: configure /root/.my.cnf or socket auth (database <name>)` |

   The part in brackets with the database name appears only when you entered a database. Each message is printed after `bkh: ERROR:`.
2. Installs the client to `/usr/local/bin/bkh-backup`.
3. Requests an API key limited to the backup service and stores it in `/etc/bkh-backup/<series>.conf`, readable by root only. The key appears in **System → API keys** with the description and the host name. This step uses up the install command.
4. Writes the backup job to `/usr/local/sbin/bkh-backup-<series>`.
5. Schedules the job with a **service manager timer** `bkh-backup-<series>.timer` (listed by `systemctl list-timers`). The start is delayed randomly by up to 10 minutes, and a run missed while the server was off is made up after it starts. On a server without `systemctl`, the installer adds a **cron** entry instead and logs to `/var/log/bkh-backup-<series>.log`.
6. Runs the **first backup** right away and reports the result, then prints the next scheduled run.

To install without the first run, for example on a server you are still preparing, put `BKH_SKIP_FIRST_RUN=1` before `bash`: `… | sudo BKH_SKIP_FIRST_RUN=1 bash`.

### What the job does

Every run creates the dump, compresses it with `zstd` (or `gzip` when `zstd` is not installed), uploads it with `--every` set to the chosen interval, and deletes the local file. The series type is `pg-dump`, `mysql-dump`, `files` or `docker-volume`. The job is a short, readable bash script; you can edit it, for example to add a `pg_dump` option. Run it by hand with `sudo /usr/local/sbin/bkh-backup-<series>`.

Database access: the PostgreSQL job connects as the `postgres` system user over the local socket. The MySQL job runs as root and uses the usual MySQL client configuration, for example socket authentication or `/root/.my.cnf`.

### Changing or removing a job

- **Change the schedule or target.** Create a new install command with the **same description** and run it. It replaces the job, the schedule and the key file of that series. The API keys created by earlier install commands of the same series are **deactivated automatically** when the new key is issued, and the organisation's administrators receive a security notification e-mail. If the old key is still needed elsewhere, reactivate it in **System → API keys**.
- **Remove a job.** Disable the timer (`systemctl disable --now bkh-backup-<series>.timer`) or delete the cron file, then revoke the key in **System → API keys**. Stored backups stay in the service.

## Manual setup with the client

Use this path for a custom backup script, several files per run, or a system where the installer does not fit.

### 1. Create a key

On the Backups page, click **Connect a new machine** and choose **API key only**. Enter the machine name and the validity (1, 2 or 5 years). The key is limited to the backup service and is shown only once, together with setup commands that already contain it.

### 2. Install the client and store the key

```bash
sudo curl -fsSL https://api.bizkithub.com/api/v1/backup/client.sh -o /usr/local/bin/bkh-backup
sudo chmod +x /usr/local/bin/bkh-backup
printf 'BKH_API_KEY=%s\n' 'YOUR_API_KEY' | sudo tee /etc/bkh-backup.conf >/dev/null
sudo chmod 600 /etc/bkh-backup.conf
```

The client needs `bash` 4.3 or newer. The key can also come from the `BKH_API_KEY` environment variable or the `--api-key` option; `BKH_BACKUP_CONFIG=/path/to/file` selects a different configuration file.

### 3. Write and schedule the backup script

```bash
#!/usr/bin/env bash
# /usr/local/bin/backup-shop.sh
set -euo pipefail
FILE=/var/backups/shop-db-$(date -u +%F).sql.zst
pg_dump --format=plain shop | zstd -q -o "$FILE"
bkh-backup --source shop-db --type full --every 24h "$FILE"
rm -f "$FILE"
```

```bash
# /etc/cron.d/shop-backup
30 2 * * * root /usr/local/bin/backup-shop.sh >> /var/log/shop-backup.log 2>&1
```

The client prints its progress on standard error, the backup identifier on standard output, and exits with `0` when the backup is stored.

### Client options

| Option | Meaning |
|---|---|
| `--source CODE` | What is backed up, for example `shop-db`. Backups with the same source and type form a **series**. |
| `--type TYPE` | Kind of backup within the source, for example `full`. |
| `--name TEXT` | Human-readable label shown in the administration. |
| `--every DURATION` | When the next backup is due: `30m`, `12h`, `1d` or `1w`. Turns on the "next backup did not arrive" alert. |
| `--next ISO` | Exact time of the next backup in ISO 8601, instead of `--every`. |
| `--period YYYY-MM` | Month folder; use it when you import older backups. |
| `--meta JSON` | Your own metadata, for example `'{"db":"shop"}'`. Default: host name and client version. |
| `--encrypted` | Marks a file you encrypted yourself. Informational only. |
| `--parallel N` | Parts uploaded at the same time. Default `4`. |
| `--no-sha256` | Skips the checksum, which saves time on very large files. The platform still computes one during the integrity check. |
| `--api-key KEY` | API key, instead of the configuration file. |
| `--quiet` | Prints only errors and the backup identifier. |

The client computes the **SHA-256** checksum and sends it with the backup, retries each part up to five times, reports a failure to the service when it gives up (your organisation then receives an e-mail at once), and exits with a non-zero code on any error.

## Verifying it worked

- The installer ends with `first backup stored`, or your script's log ends with `stored: backup <identifier>`.
- In **System → Backups**, the series appears with state **OK**, the last backup and the next expected time.
- Within the copy deadline (1 hour plus 1 hour per 8 GiB), the backup shows its second copy in Nuremberg and the integrity state `verified`.
- From your own monitoring, call `GET /api/v1/backup/list?source=<series>&limit=1` and check `status`, `isMirrored` and `integrityStatus`. See [Backup API](/backup-api#list-backups).

## Good practice

- **One backup, one file.** One consistent file is faster to upload and easy to restore.
- **Encrypt sensitive data** before uploading (`gpg`, `age`), keep the decryption key outside the server, and add `--encrypted`.
- **Always announce the next backup.** The installer does it; with your own script, use `--every`.
- **Keep the description, source and type stable.** Monitoring and the size comparison work per series.
- **Renew keys in time.** Run a new install command, or create a new key, before the old one expires.
- **Test a restore** regularly with [Backup restore](/backup-restore).

## What can go wrong

| Symptom | Cause and fix |
|---|---|
| `This install command was already used or has expired (24 h)` | The command works once for 24 hours. Create a new one. |
| `missing command: pg_dump` (or another tool) | Install the tool on the server and run the same command again. It is still valid, because no key was requested. |
| `run as root` | Run the command with `sudo bash` as shown. |
| `cannot connect to PostgreSQL as user postgres` | Check that PostgreSQL runs on this server and that `sudo -u postgres psql -c 'SELECT 1'` works, then run the command again. |
| `cannot connect to MySQL as root: configure /root/.my.cnf or socket auth` | Make `sudo mysql -e 'SELECT 1'` work without a password prompt, then run the command again. |
| `the Docker daemon is not reachable` | Start Docker (`systemctl start docker`), then run the command again. |
| `the first backup failed` | Read the output above the message; most often the database is not reachable for the job user. Fix it and run the job by hand. |
| `PUBLIC_API_KEY_HAS_BEEN_EXPIRED` | The key expired. Run a new install command or create a new key. |
| `PUBLIC_BACKUP_TARIFF_NOT_SUPPORTED` | The organisation has no storage plan. Contact info@bizkithub.com. |
| `PUBLIC_STORAGE_LIMIT_REACHED` | The storage of the organisation is at its cap. See [Storage limit reached](/backup-troubleshooting#storage-limit-reached). |

More cases are in [Backup troubleshooting](/backup-troubleshooting).

## Related

- [Backup service](/backup-service)
- [Backup restore](/backup-restore)
- [Backup API](/backup-api)
- [Backup troubleshooting](/backup-troubleshooting)
- [API keys](/api-key-overview)

---
code: "backup-restore"
category: "developers/guides"
tags: ["type-guide", "backup"]
published_at: "2026-11-26T12:00:00.000Z"
---


Backup restore
==============

This guide gets a backup from the [backup service](/backup-service) back onto a server. The **restore assistant** in the administration creates a download link for the server and the exact commands for the file: download, checksum check, decryption, decompression and import into PostgreSQL, MySQL, a folder or a Docker volume. You copy the commands one by one; nothing has to be worked out by hand.

Backups cannot be downloaded through the API. This is deliberate: a compromised server that holds a backup key cannot read your backups. Every restore therefore starts in the administration.

## What you need before you start

- A user with permission for the **Backups** module in the administration.
- Shell access with `sudo` on the target server, and `curl` and `sha256sum` there.
- The tools for the file: `zstd`, `gzip`, `xz`, `bzip2` or `lz4` for decompression, `gpg` or `age` for an encrypted file, and `psql`, `pg_restore`, `mysql`, `tar` or `docker` for the import.
- For an encrypted backup, your own decryption key. BizKitHub never holds it.

> **Warning.** Restoring overwrites data in the target database, folder or volume. Try the restore on a test server or into a new database first, and restore over production data only when you are sure.

## Steps

1. Open **System → Backups** and find the backup in the list or in a series. Choose the last backup you know is good; with ransomware or a damaged export, that may not be the newest one.
2. Open the backup detail and click **Restore to a server**.
3. The dialog shows what the file is (for example a PostgreSQL SQL dump or a tar archive) and the numbered steps. The download link in the steps is valid for **1 hour**.
4. Run the steps one by one on the target server. Fill in the values in angle brackets, such as `<database>` or `<volume>`.

The download link is recorded in the activity log of your organisation with the user who created it. If the primary copy cannot be served, the link points to the copy in the second datacentre in Nuremberg, and the dialog says so.

## What the steps look like

The assistant reads the file name from the outside in: encryption first, then compression, then the format. The series type helps to tell a PostgreSQL dump from a MySQL dump. A nightly PostgreSQL backup made by the installer, `web-01-pg-20261126-023000_aB3dE5fG7hJ9kL1m.sql.zst`, gives these steps:

```bash
curl -fL --retry 5 -o 'web-01-pg-20261126-023000_aB3dE5fG7hJ9kL1m.sql.zst' 'https://…'
echo '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08  web-01-pg-20261126-023000_aB3dE5fG7hJ9kL1m.sql.zst' | sha256sum -c -
zstd -dc 'web-01-pg-20261126-023000_aB3dE5fG7hJ9kL1m.sql.zst' | sudo -u postgres psql -v ON_ERROR_STOP=1 postgres
```

| File | Restore step |
|---|---|
| PostgreSQL SQL dump (`.sql`, type contains `pg` or `postgres`) | Piped into `psql` as the `postgres` user, stopping at the first error. |
| PostgreSQL custom dump (`.dump`, `.backup`, `.pgdump`) | `pg_restore --clean --if-exists --no-owner` into a database you name. |
| MySQL or MariaDB dump (`.sql`, type contains `mysql` or `maria`) | Piped into `mysql`. |
| Other SQL file | Unpacked to a plain `.sql` file for you to import. |
| tar archive | First a preview of the contents, then extraction into `/restore`. Copy the files to their place yourself. |
| Docker volume (`.tar`, type contains `docker`) | Extracted into a volume you name, through a temporary container. |
| Anything else | Downloaded, and unpacked when it is compressed or encrypted. |

### Checksum

When a checksum is known, the second step checks the downloaded file with `sha256sum -c`. The assistant uses the checksum the platform computed during the integrity check, or the one your client sent. `OK` means the file is exactly the stored backup; continue only then.

### Encrypted files

Files ending in `.gpg`, `.pgp` or `.asc` are decrypted with `gpg --decrypt`, files ending in `.age` with `age --decrypt -i /path/to/key.txt`. Replace the key path with yours. For a backup marked as encrypted without one of these extensions, the assistant reminds you to decrypt it with your own tool first.

## Download in the browser

For a quick look at a backup, the **Download** action in the backup list downloads the file to your computer. That link is valid for 15 minutes and is recorded in the activity log too.

## Verifying it worked

- The checksum step prints `OK`.
- The import step finishes without an error. `psql` stops at the first error because of `ON_ERROR_STOP`.
- The restored application starts and shows the data from the time of the backup.

## What can go wrong

| Symptom | Cause and fix |
|---|---|
| `curl: (22) … 403` | The link expired after 1 hour. Click **Restore to a server** again for a new link. |
| `sha256sum: WARNING: 1 computed checksum did NOT match` | The download is incomplete or damaged. Download again; if it repeats, contact info@bizkithub.com with the backup identifier. |
| `zstd: command not found` (or `gzip`, `xz`, `lz4`) | Install the tool on the target server. |
| `gpg: decryption failed: No secret key` | The server does not have your private key. Import it, or decrypt on a machine that has it. |
| `psql: … already exists` errors | The target database is not empty. Restore into a new, empty database, or drop the old one first if you are sure. |
| The restore cannot be prepared | Only completed backups can be restored. Failed and cancelled uploads have no stored file. |

## Related

- [Backup service](/backup-service)
- [Backup service setup](/backup-service-setup)
- [Backup troubleshooting](/backup-troubleshooting)
- [Backup and recovery](/backup-overview): recovery of your BizKitHub data.

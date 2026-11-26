---
code: "backup-api"
category: "platform/backup"
tags: ["type-reference", "backup", "api"]
published_at: "2026-11-26T12:00:00.000Z"
---


Backup API
==========

The backup API lets your own scripts and applications upload backups to the [backup service](/backup-service) and read their state. It lives under `https://api.bizkithub.com/api/v1/backup/` and is the same API the `bkh-backup` Linux client uses. Use this reference when you write a client in another language, integrate backups into an existing tool, or add backup checks to your own monitoring.

The API can **write and read only**. It starts and finishes uploads and returns metadata. It has no endpoint to delete, overwrite or download a backup: downloads are available only in the administration. The file itself never passes through the API; it goes in parts directly to the storage over signed addresses.

## Authentication and access

Every endpoint except the client download takes the API key in the `apiKey` query parameter, also for `POST` requests with a JSON body. Keys in headers are ignored.

- Use a **production** API key of the organisation that should own the backups. See [API keys](/api-key-overview).
- Restrict the key to the scope **Backup service only**. Such a key is accepted by the backup endpoints and rejected by every other endpoint of the platform.
- Starting an upload requires the **Enterprise** tariff. Reading (`list`, `detail`, `usage`) works on every tariff, so existing backups stay readable after a tariff change.
- Requests to the backup endpoints count towards the request quota of the key like any other API call. Part uploads go to the storage and do not count. See [Rate limiting](/rate-limiting-overview).

## Endpoints

| Method and path | Purpose |
|---|---|
| `GET /api/v1/backup/client.sh` | Download the Linux client. No API key needed. |
| `POST /api/v1/backup/start` | Start an upload and receive the first upload addresses. |
| `POST /api/v1/backup/part-urls` | Get more upload addresses, or fresh ones for a retry. |
| `POST /api/v1/backup/complete` | Finish the upload and register the backup. |
| `POST /api/v1/backup/abort` | Cancel an upload that is still in progress. |
| `GET /api/v1/backup/list` | List backups, newest first. |
| `GET /api/v1/backup/detail` | Read one backup. |
| `GET /api/v1/backup/usage` | Read storage totals. |

The [API explorer](/swagger) shows the same endpoints with their full schemas and ready-to-run request samples.

## The upload flow

1. Call `start` with the file name and the **exact size in bytes**. The response contains the backup `id`, the `partSize`, the `partCount` and up to 100 upload addresses.
2. Split the file into parts. Part `n` covers the bytes from `(n − 1) × partSize` up to `n × partSize − 1`; the last part holds the remainder. Every part except the last is exactly `partSize` bytes.
3. Upload each part with a plain HTTP `PUT` of its bytes to its address, with no extra headers. Keep the value of the `ETag` response header for each part. Parts can be uploaded in parallel and in any order.
4. When a part fails, upload it again. When the addresses expire (after 12 hours) or you need more than the first 100, call `part-urls`.
5. Call `complete` with the list of all parts and their `ETag` values, and optionally the SHA-256 checksum of the whole file.

```bash
KEY=YOUR_API_KEY
API=https://api.bizkithub.com/api/v1/backup

curl -s -X POST "$API/start?apiKey=$KEY" \
  -H 'content-type: application/json' \
  -d '{"filename":"shop-db-2026-11-26.sql.zst","size":52428800,"source":"shop-db","type":"full","nextExpectedAt":"2026-11-27T02:30:00Z"}'
```

```bash
curl -s -X PUT -T part-1.bin -D - -o /dev/null "UPLOAD_ADDRESS_OF_PART_1" | grep -i '^etag'
```

```bash
curl -s -X POST "$API/complete?apiKey=$KEY" \
  -H 'content-type: application/json' \
  -d '{"id":"aB3dE5fG7hJ9kL1m","parts":[{"partNumber":1,"etag":"5d41402abc4b2a76b9719d911017c592"}],"sha256":"9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"}'
```

A backup that is not completed has no effect on your stored backups. If your client stops in the middle, the platform closes the upload after 6 hours without new data (see [Abandoned uploads](#abandoned-uploads)).

## Start an upload

`POST /api/v1/backup/start`

| Field | Type | Required | Meaning |
|---|---|---|---|
| `filename` | string, 1–200 characters | Yes | Original file name. It is normalised and stored with a random 16-character suffix. Compound extensions such as `.tar.zst` are preserved. |
| `size` | integer | Yes | Exact file size in bytes, at most 1 TiB (1,099,511,627,776 bytes). |
| `name` | string, up to 255 | No | Human-readable label shown in the administration. |
| `source` | string, up to 64 | No | What is backed up, for example `shop-db`. Groups backups of one origin. |
| `type` | string, up to 64 | No | Kind of backup within the source, for example `full`. Source and type together form a **series**. |
| `nextExpectedAt` | ISO 8601 date-time | No | When the next backup of the series is due. Must be in the future and at most one year ahead. Turns on monitoring (see [Monitoring fields](#monitoring-fields)). |
| `period` | `YYYY-MM` | No | Month folder for the backup. Defaults to the current month; an invalid value is replaced by the current month. Use it when you import older backups. |
| `createdAt` | ISO 8601 date-time | No | When the data was produced, for example the start of the dump. |
| `contentType` | string, up to 128 | No | MIME type. Derived from the file extension when omitted. |
| `isClientEncrypted` | boolean | No | Marks a file you encrypted yourself. Informational only. |
| `meta` | JSON object, up to 8 KB | No | Your own metadata, for example host, tool and version. |

Response:

```json
{
  "id": "aB3dE5fG7hJ9kL1m",
  "filename": "shop-db-2026-11-26.sql.zst",
  "blobPath": "backup/2026-11/shop-db-2026-11-26_aB3dE5fG7hJ9kL1m.sql.zst",
  "partSize": 67108864,
  "partCount": 1,
  "parts": [
    { "partNumber": 1, "url": "https://…" }
  ],
  "urlExpiresAt": "2026-11-26T14:30:02.000Z"
}
```

The part size is at least 64 MiB. For files larger than 625 GiB it grows in whole MiB, so that no file needs more than 10,000 parts. Always use the `partSize` from the response; never compute your own.

## Get more upload addresses

`POST /api/v1/backup/part-urls`

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | string, 16 characters | Yes | Backup identifier from `start`. |
| `fromPart` | integer | Yes | First part number to sign. |
| `count` | integer, 1–100 | No | How many addresses to return. Default 100. |

The response contains `parts` and `urlExpiresAt` in the same shape as `start`. The endpoint works only while the backup has the status `uploading`. Use it for parts beyond the first 100, and for retries after the addresses expired.

## Finish the upload

`POST /api/v1/backup/complete`

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | string, 16 characters | Yes | Backup identifier from `start`. |
| `parts` | array of `{ partNumber, etag }` | Yes | Every part from `1` to `partCount` exactly once, each with the `ETag` header value of its upload. Quotes around the value are optional. |
| `sha256` | string, 64 hex characters | No | SHA-256 checksum of the whole file. Stored with the backup so you can verify a downloaded copy. |

The platform assembles the parts, checks that the stored size equals the declared `size` and registers the backup. The response is the backup detail with `status: "completed"`. The call is **idempotent**: repeating it for a completed backup returns the same detail, so you can safely retry after a lost response.

If a part is missing or an `ETag` does not match, the call fails with `PUBLIC_BACKUP_UPLOAD_INCOMPLETE` and the upload stays open: upload the affected parts again and repeat `complete`. If the assembled file has a different size than declared, the backup is marked as `failed` and your organisation receives an e-mail.

The copy to the second datacentre follows automatically after `complete`. Follow it in the `isMirrored` field.

## Cancel an upload

`POST /api/v1/backup/abort`

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | string, 16 characters | Yes | Backup identifier from `start`. |
| `reason` | string, up to 500 | No | Why the upload was cancelled. Shown in the administration. |
| `failed` | boolean | No | `true` when your client gave up because of an error. The backup becomes `failed` and your organisation receives an e-mail at once. Without it, the backup becomes `aborted` and no e-mail is sent. |

The response is `{ "success": true }`. Only uploads in progress can be cancelled. A stored backup cannot be deleted through the API or in any other way.

## List backups

`GET /api/v1/backup/list`

| Query parameter | Meaning |
|---|---|
| `status` | `uploading`, `completed`, `failed` or `aborted`. |
| `source` | Only backups of this source. |
| `type` | Only backups of this type. |
| `from`, `to` | Only backups started in this range (ISO 8601). |
| `page` | Page number, from 1. |
| `limit` | Items per page, 1–100. Default 50. |

```bash
curl -s "https://api.bizkithub.com/api/v1/backup/list?apiKey=YOUR_API_KEY&source=shop-db&status=completed&limit=1"
```

The response contains `items`, `itemCount`, `page` and `limit`. Each item has the fields described in [Backup fields](#backup-fields). This is the endpoint to call from your own monitoring to confirm that the last backup arrived and has its second copy.

## Read one backup

`GET /api/v1/backup/detail?id=aB3dE5fG7hJ9kL1m`

Returns one backup with all [backup fields](#backup-fields), plus `meta` (your metadata) and `blobPath` (the stored path inside your organisation, for example `backup/2026-11/shop-db-2026-11-26_aB3dE5fG7hJ9kL1m.sql.zst`). For a backup that is still uploading, the progress fields reflect the data that has already arrived.

## Read storage totals

`GET /api/v1/backup/usage`

| Field | Meaning |
|---|---|
| `isUploadAllowed` | `false` when the tariff does not include the backup service. |
| `maxFileBytes` | Largest allowed backup in bytes. |
| `backupCount`, `backupBytes` | Number and total size of stored backups. |
| `mirroredCount`, `mirroredBytes` | Number and total size of backups with a copy in the second datacentre. |
| `pendingMirrorCount` | Backups whose second copy is still being made. |
| `lastBackupAt` | Time of the newest backup. |
| `mirrorRegion` | Region code of the second datacentre (Nuremberg, Germany). |

## Backup fields

| Field | Meaning |
|---|---|
| `id` | Backup identifier, 16 characters. |
| `name`, `source`, `type` | Values sent with `start`. |
| `filename` | Normalised file name. |
| `status` | `uploading`, `completed`, `failed` or `aborted`. |
| `declaredSize` | Size declared on `start`, in bytes. |
| `size` | Stored size, in bytes. Present once completed. |
| `contentType` | MIME type. |
| `sha256` | Checksum sent with `complete`. |
| `isClientEncrypted` | Value sent with `start`. |
| `sourceCreatedAt` | Value of `createdAt` sent with `start`. |
| `startedAt`, `completedAt` | Start and completion time. |
| `durationSeconds` | Time from start to completion. |
| `partSize`, `partCount` | Part layout of the upload. |
| `uploadedBytes`, `uploadedParts`, `uploadPercent` | Upload progress while uploading. |
| `lastActivityAt` | Last time upload data arrived. |
| `isMirrored` | `true` once the copy in the second datacentre is confirmed. |
| `mirroredAt` | Time the second copy was confirmed. |
| `mirrorRegion` | Region code of the second datacentre. |
| `error` | Reason of a failure or cancellation. |

### Monitoring fields

| Field | Meaning |
|---|---|
| `nextExpectedAt` | When the next backup of the series is expected, as sent with `start`. |
| `expectationDeadlineAt` | Alert threshold: the start of this backup plus 120 % of the announced interval. |
| `expectationAlertedAt` | When the "expected backup did not arrive" e-mail was sent. |

A newer backup of the same `source` and `type` with the status `uploading` or `completed` ends the watch. A failed or cancelled backup does not. Send `nextExpectedAt` with every backup to keep monitoring on.

## Abandoned uploads

The platform checks uploads in progress every few minutes. When no new data arrives for **6 hours**:

- if every part has arrived, the backup is completed automatically and stored normally (system code `BKP_UPLOAD_AUTO`);
- otherwise the backup is marked as `failed` with the precise reason, for example how many parts arrived, and your organisation receives an e-mail (system code `BKP_UPLOAD_FAIL`).

## Errors

Errors use the standard error shape of the API with a stable `errorCode`, described in the [API quickstart](/api-quickstart). Every code has its own page under [error codes](/errors).

```json
{
  "state": "error",
  "code": 409,
  "message": "The backup is not in a state that allows this operation.",
  "errorCode": "PUBLIC_BACKUP_INVALID_STATE",
  "hint": "Part URLs, `complete` and `abort` only work while the backup is `uploading`. A completed, failed or aborted backup cannot be changed. Start a new backup instead.",
  "documentationUrl": "https://docs.bizkithub.com/errors/PUBLIC_BACKUP_INVALID_STATE"
}
```

| Code | HTTP | When | What to do |
|---|---|---|---|
| `PUBLIC_BACKUP_TARIFF_NOT_SUPPORTED` | 403 | `start` in an organisation without the Enterprise tariff. | Check that the key belongs to the right organisation, or change the tariff. |
| `PUBLIC_BACKUP_FILE_TOO_LARGE` | 413 | The file is larger than 1 TiB. | Split the backup into several files or compress it. |
| `PUBLIC_BACKUP_NOT_FOUND` | 404 | No backup with this `id` in the organisation of the key. | Use the `id` from `start` and a key of the same organisation. |
| `PUBLIC_BACKUP_INVALID_STATE` | 409 | `part-urls`, `complete` or `abort` on a backup that is no longer uploading, or an upload that expired in storage. | Read the state with `detail` and start a new backup. |
| `PUBLIC_BACKUP_UPLOAD_INCOMPLETE` | 400 | Parts are missing, duplicated or have a wrong `ETag`, or the stored size differs from `size`. | Upload the affected parts again and repeat `complete`. |
| `PUBLIC_REQUEST_VALIDATION_FAILED` | 422 | A field is missing or invalid, for example `nextExpectedAt` in the past, `sha256` not 64 hex characters or `meta` over 8 KB. | Read `errors` in the response and fix the field. |
| `PUBLIC_API_KEY_SCOPE_NOT_ALLOWED` | 403 | The key is restricted to other scopes. | Assign the scope **Backup service only**. |
| `PUBLIC_API_KEY_HAS_BEEN_EXPIRED` | 403 | The key expired. | Create a new key with a later expiry date. |
| `PUBLIC_API_KEY_DOES_NOT_EXIST` | 404 | The key is missing or wrong. | Pass the key in the `apiKey` query parameter. |

## Compatibility

The endpoints, request fields, response fields and error codes in this article are a stable contract. New optional response fields can be added at any time, so your client must ignore fields it does not know. The upload addresses are opaque: do not parse them or rely on their host.

## Related

- [Backup service](/backup-service): how backups are protected and monitored.
- [Backup service setup](/backup-service-setup): the ready-made Linux client.
- [Backup troubleshooting](/backup-troubleshooting)
- [API keys](/api-key-overview)
- [Error codes reference](/error-codes-reference)

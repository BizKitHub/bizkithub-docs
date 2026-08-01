---
id: "XxnF99hw5Ll9GdRK"
code: "docs-migration-api-key"
category: "developers/api-key"
tags: []
published_at: "2026-07-26T18:33:08.685Z"
---


API Key
=======

## What an API key is

Every request to the BizKitHub REST API is authenticated with an API key. The key identifies the calling organisation, its allowed scopes, and its rate limit tier. Without a valid key the request is rejected before any handler runs.

## Key format

Keys are 32 characters long. The first four characters are a **prefix** that indicates the key type, followed by 28 random alphanumeric characters.

| Prefix | Type | Purpose | Rate limit |
|--------|------|---------|------------|
| `PROD` | Production | Live applications and integrations | High |
| `DEV_` | Development | Local development, tests, sandboxing | Low |
| `ROOT` | System | Reserved for platform-level maintenance | Unlimited |

The full pattern is `/^(PROD|DEV_|ROOT)[a-zA-Z0-9]{28}$/`. Keys are generated with a cryptographically secure random source and are globally unique.

## Passing the key

Include the key as the `apiKey` parameter in either the query string or the JSON body. Every endpoint accepts both.

**Query string**

```
GET https://api.bizkithub.com/api/v1/order/list?apiKey=YOUR_API_KEY
```

**Request body**

```json
{
  "apiKey": "YOUR_API_KEY",
  "customerId": "cus_abc123"
}
```

## Verification pipeline

Each request is validated in the following order:

1. Presence — the key must be provided in the query or body.
2. Format — must match the prefix + 28-character pattern.
3. Registry — the key must exist and be active in the organisation database.
4. Expiration — expired or revoked keys are rejected.
5. Rate limit — the caller must be within its per-minute quota.
6. Permission — the resolved organisation must be allowed to call the endpoint.

Only after all six checks pass does the endpoint handler execute.

## Handling keys safely

- Store keys in environment variables. Never commit them to a repository.
- Use `DEV_` keys for local development so a leak cannot touch production data.
- Rotate production keys periodically and immediately if a leak is suspected.
- Always call the API over HTTPS. Plain HTTP is refused.
- Do not log the full key value in application logs or error reports.

Keys are created and rotated from the BizKitHub admin dashboard under **Systém → API klíče**.

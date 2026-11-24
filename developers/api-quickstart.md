---
code: "api-quickstart"
category: "developers"
tags: ["api"]
published_at: "2026-11-24T12:00:00.000Z"
---


API quickstart
==============

This guide takes you from an empty terminal to a working, authenticated call to the BizKitHub REST API in a few minutes. You check that the API is reachable, create an API key, make your first authenticated request and learn how to read an error response. Every request in this guide uses `curl`, so you can run it as is after you replace the key.

## What you need before you start

- A BizKitHub account with access to an organisation. The API key you create belongs to that organisation, and every request made with it reads and writes only that organisation's data.
- Permission to manage API keys in the organisation.
- A terminal with `curl`.

## Steps

### 1. Check that the API is reachable

The ping endpoint needs no key and answers with `PONG`.

```bash
curl "https://api.bizkithub.com/api/v1/ping"
```

The response confirms the connection and carries a `requestId`. Quote the `requestId` when you contact support about a specific request.

```json
{
  "result": "PONG",
  "datetime": "2026-11-24T11:49:03.522Z",
  "requestId": "bkh::xa9uf-1795520943521-h6l8q7s"
}
```

### 2. Create an API key

In the BizKitHub administration, open **System → API keys** and create a key. Production keys start with `PROD`, development keys with `DEV_`. The [API key](/api-key-overview) article describes the key format and how to store keys safely.

### 3. Make your first authenticated request

Pass the key as the `apiKey` query parameter. The API reads the key only from the query string, also for `POST` requests with a JSON body. The post feed is a good first call because every organisation can read it.

```bash
curl "https://api.bizkithub.com/api/v1/post/feed?apiKey=YOUR_API_KEY&limit=1"
```

A successful response lists the items, the total count and whether more pages exist.

```json
{
  "items": [
    {
      "id": "cq7OPX6v6N6yWGgh",
      "slug": "ticket-classification-model",
      "title": "Ticket classification model",
      "publishedDate": "2026-08-08T00:00:00.000Z"
    }
  ],
  "total": 113,
  "hasMore": true
}
```

Identifiers such as `id` are opaque strings. Store them as strings and never derive anything from their content.

### 4. Find the endpoint you need

The [API explorer](/swagger) lists every public endpoint with its parameters, response schema and request samples in `curl`, `fetch`, Axios and Python.

## Verifying it worked

Your integration is set up correctly when the request in step 3 returns HTTP `200` with an `items` array. An empty `items` array with `total: 0` is also a success: the key is valid, the organisation only has no posts yet.

## What can go wrong

Every error response has the same shape. `errorCode` is stable and safe to branch on in code, `message` and `hint` are for people, and `documentationUrl` opens the page that explains the error.

```json
{
  "state": "error",
  "code": 404,
  "message": "Organisation API key does not exist or is broken.",
  "errorCode": "PUBLIC_API_KEY_DOES_NOT_EXIST",
  "hint": "Parameter \"apiKey\" is always required.",
  "documentationUrl": "https://docs.bizkithub.com/errors/PUBLIC_API_KEY_DOES_NOT_EXIST"
}
```

| Symptom | Cause | Fix |
|---------|-------|-----|
| HTTP `422` with `PUBLIC_REQUEST_VALIDATION_FAILED` and `apiKey` in `errors` | The request has no `apiKey` query parameter. | Add `apiKey=YOUR_API_KEY` to the query string. A key in a header or in the body is ignored. |
| HTTP `404` with `PUBLIC_API_KEY_DOES_NOT_EXIST` | The key is mistyped, was deleted, or belongs to no organisation. | Copy the key again from **System → API keys**, or create a new one. |
| HTTP `422` with other fields in `errors` | A parameter has the wrong type or format. | Read `on` (`query`, `body` or `params`) and the `path` of each entry in `errors`, then compare the request with the endpoint in the API explorer. |

The full list of codes is in the [error code reference](/errors).

## Related

- [API key](/api-key-overview)
- [E-shop quickstart](/eshop-quickstart-overview)
- [Error codes reference](/error-codes-reference)

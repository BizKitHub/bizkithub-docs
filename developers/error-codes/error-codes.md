---
id: "R3nskoS2r0fMU0K6"
category: "developers/error-codes"
tags: []
published_at: "2026-08-01T00:00:00.000Z"
---


Error codes
===========

Every failure path in the BizKitHub platform is a **named error**, not a free-form message. When an API call fails for a documented reason, the response carries a stable, unique code that can be looked up in the error registry and pattern-matched by client integrations. This is the developer-facing complement to the [API](/api) article: it explains how to interpret the errors those endpoints return.

The architectural principle is simple: negative outcomes deserve the same care as positive ones. If a request must fail — the API key is missing, the product slug does not exist, the payment gateway rejected the card — it must fail in a documented, predictable way. Random strings and undifferentiated `500`s are, in the platform's philosophy, bugs.

## Anatomy of an error

Every documented error has three fixed attributes:

- **Internal code** — a unique identifier such as `PUBLIC_API_KEY_DOES_NOT_EXIST`. This is the stable machine-readable handle you should switch on in your client. It is guaranteed not to be reused for a different meaning.
- **HTTP status** — the transport-level status code returned with the response body. Defaults to `500` when the specific error type does not override it.
- **Message** — a short human-readable description of what went wrong. Intended for developers, not for shoppers; you should translate it or replace it with a user-friendly string in your UI.

The registry is authoritative. If your client encounters a code that is not in the registry, that is a platform bug — please report it through the support channel.

## Example

When an API call is made without an `apiKey` parameter — or the key does not resolve to a live registration — the platform returns the error `PUBLIC_API_KEY_DOES_NOT_EXIST`. This is not "an error" in the abstract, it is *this specific error*: uniquely named, documented at a stable URL, and consistent across every endpoint that authenticates requests. Your client can catch it once and route every caller through the same "please check your API key" path.

## Where to find the full list

The complete error catalog is generated automatically from the platform's internal registry and published on the developer documentation site. Every code has its own permalink so you can bookmark or link to a specific error from your own runbooks, incident reports, or user-facing error messages:

```
https://docs.bizkithub.com/errors/<CODE>
```

For example, `https://docs.bizkithub.com/errors/PUBLIC_API_KEY_DOES_NOT_EXIST` documents the API-key-not-found case in isolation. The URL is stable — you can reference it from client-side error messages and it will still resolve years later even if the platform's internal implementation of the check changes.

## Recommended client handling

- **Switch on the internal code, not the message.** Messages may be reworded for clarity; codes never change meaning.
- **Fall back on the HTTP status when your client cannot recognise the code.** A `401`/`403`/`404`/`422`/`500` is still meaningful even without further parsing.
- **Log the internal code plus the request identifier** (when returned) so support can trace the exact call in the platform logs.
- **Do not surface the raw platform message to end users.** The messages are developer-oriented; wrap them in your own copy before showing to a shopper or operator.

## Related articles

- [API](/api) — request/response conventions of the platform's REST API.
- [API key](/api-key) — the most common source of authentication-related error codes.
- [Rate limiting](/rate-limiting) — errors related to per-key quotas.

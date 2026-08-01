---
id: "fmbSOiCV61rEH7k1"
category: "crm/contacts"
tags: []
published_at: "2026-08-01T00:00:00.000Z"
---


Customer account info API
=========================

The account-info endpoint returns a compact snapshot of the currently signed-in shopper. This is the endpoint a storefront calls on every page render to determine "who is looking at this page right now, and do we need to show a sign-in button or an account menu".

The endpoint intentionally does not return the full contact profile — that would be heavier than most page renders need, and the fields it does return are already sufficient to render an account widget, decide credit-related UI, and gate premium content. For fields that are not exposed here (address, communication history, order history), call the specific endpoint that owns them.

This is one of three storefront-integration endpoints for shopper accounts, together with the [customer register API](/customer-register-api) and the [customer login API](/customer-login-api). For the concepts behind contacts, `cuRefNo`, credit and the trust score, see the [Contacts](/contact-overview) article.

## Endpoint

```
GET https://api.bizkithub.com/contact/v1/get-account-info?identityId=xxx
```

The `identityId` is the opaque session token returned by the [customer login API](/customer-login-api). Authentication is via the standard `apiKey` parameter (see the [API key](/api-key-overview) article).

## Response

```ts
export type PublicCustomerAccountInfoResponse =
  | { loggedIn: false }
  | {
      loggedIn: true;
      identityId: string;
      cuRefNo: string;
      creditBalance: number;
      email: string;
      phone?: string;
      firstName?: string;
      lastName?: string;
      companyName?: string;
      premium?: boolean;
      ban?: boolean;
    };
```

### Signed-out response

When the token is not recognised (missing, expired, revoked), the response is the single value `{ loggedIn: false }`. Storefronts should treat this as "sign the shopper out and show the sign-in UI".

### Signed-in response

When the token is valid, the response carries the following fields.

| Property | Type | Meaning |
|----------|------|---------|
| `loggedIn` | `true` | Marker that the shopper is authenticated and the token is valid. |
| `identityId` | `string` | The same token you supplied — echoed for symmetry and diagnostic pairing. |
| `cuRefNo` | `string` | External customer reference number (16 chars). Safe to expose to the shopper. |
| `creditBalance` | `number` | Current usable credit balance. |
| `email` | `string` | Shopper's e-mail address. |
| `phone` | `string` | Phone number in the normalised `+<prefix> <value>` format (see [Phone normalisation](/phone-normalisation)). |
| `firstName` | `string` | First name. |
| `lastName` | `string` | Last name (includes middle name if applicable). |
| `companyName` | `string` | Company name — the entity the shopper represents, owns or works for. |
| `premium` | `boolean` | Whether the shopper is a premium customer. |
| `ban` | `boolean` | Whether the shopper is currently banned. |

## Individuals vs companies

If the contact represents a company rather than a person, the platform returns `companyName` without `firstName` or `lastName`. If all three are present, the contact is a natural person acting for or representing that company — invoicing is then always billed to the company, and the personal name is only supporting information.

## Session state and freshness

The response reflects the current server-side session state at the moment of the call. If an operator invalidates the shopper's sessions from the administration between two calls, the second call will return `{ loggedIn: false }` immediately — there is no client-side cache to invalidate. This makes the endpoint reliable as a per-request authentication check on the storefront.

## Related articles

- [Customer register API](/customer-register-api) — create a new shopper account.
- [Customer login API](/customer-login-api) — sign a shopper in and obtain the `identityId`.
- [Contacts](/contact-overview) — administration guide covering `cuRefNo`, credit, quality scoring and blocking.
- [API key](/api-key-overview) — how to authenticate the request.

---
category: "crm/contacts"
tags: []
published_at: "2026-08-01T00:00:00.000Z"
---


Customer login API
==================

The login endpoint verifies a shopper's credentials and, on success, returns an `identityId` — an opaque session token the storefront stores in a cookie and echoes on subsequent calls. Losing the token ends the session; a leaked token grants the holder the same access the shopper has, until the storefront invalidates it.

This is one of three storefront-integration endpoints for shopper accounts, together with the [customer register API](/customer-register) and the [customer account info API](/customer-account-info). For the concepts behind contacts, registered accounts and guests, see the [Contacts](/contacts) article.

## Endpoint

```
POST https://api.bizkithub.com/contact/v1/login
```

Authentication is via the standard `apiKey` parameter (see the [API key](/api-key) article).

## Request body

| Property | Type | Meaning |
|----------|------|---------|
| `email` | `string` | Shopper's e-mail address on the contact record. |
| `password` | `string` | Shopper's password. |

## Response

```ts
export type PublicCustomerLoginResponse =
  | { success: false; errorCode: CustomerLoginErrorCode; message: string }
  | { success: true; identityId: string };

export const CUSTOMER_LOGIN_ERROR_CODE = {
  E001: 'Customer login failed.',
  E002: 'Customer e-mail does not exist.',
  E003: 'Customer have not a registered account.',
  E004: 'Wrong e-mail or password.',
  E005: 'Customer account has been banned.',
  E006: 'Too many login attempts.',
  E007: 'Customer mail has not been authorized.',
} as const;

export type CustomerLoginErrorCode = keyof typeof CUSTOMER_LOGIN_ERROR_CODE;
```

## Error codes

| Code | Message | Meaning |
|------|---------|---------|
| `E001` | Customer login failed. | Generic failure — typically a platform-side error. |
| `E002` | Customer e-mail does not exist. | No contact exists with the supplied e-mail address. |
| `E003` | Customer have not a registered account. | A contact exists but has never registered — no password is set. Direct the shopper to the [register endpoint](/customer-register). |
| `E004` | Wrong e-mail or password. | Credentials do not match. In practice this almost always means the password is wrong, because `E002` covers the missing-email case. |
| `E005` | Customer account has been banned. | Sign-in is blocked by the merchant. |
| `E006` | Too many login attempts. | Rate-limit protection against password guessing. Retry after the cooldown. |
| `E007` | Customer mail has not been authorized. | Registration was started but the confirmation e-mail was never clicked. Prompt the shopper to complete verification. |

## Persisting the session

The `identityId` is opaque to the storefront — its only job is to be replayed on subsequent API calls. In a Node.js environment (Next.js, plain Express) the recommended pattern is to store it as a first-party HTTP-only cookie:

```ts
export const AUTH_COOKIES_NAME = 'auth-id';

cookies().set({
  name: AUTH_COOKIES_NAME,
  value: response.identityId || '',
  secure: true,
  httpOnly: true,
  path: '/',
  expires: new Date(new Date().setMonth(new Date().getMonth() + 3)),
});
```

Two properties matter beyond the value itself:

- **`httpOnly: true`** — JavaScript on the storefront cannot read the token, which mitigates the impact of an XSS bug.
- **`secure: true`** — the token is only sent over HTTPS.

Match the cookie expiration to the platform's session lifetime. The platform keeps a sign-in session valid for **three months** as a persistent-login default; a shorter cookie expiration is fine for shorter idle windows, a longer one is not — the server-side session will already be invalid.

If your storefront is not Node.js (for example a native mobile app or a backend written in another language), store the token in whatever secure storage the platform offers — the only invariant is that you must not lose it and must not expose it to untrusted parties.

## Handling sign-out

There is no dedicated sign-out endpoint on the public API; signing out is the storefront's responsibility. Delete the local cookie and, if you want to invalidate the platform-side session as well, request the operator to revoke it from the [Contacts](/contacts) administration (the **Invalidate sessions** action). A subsequent request with a revoked token receives `{ loggedIn: false }` from the [customer account info API](/customer-account-info).

## Related articles

- [Customer register API](/customer-register) — create a new shopper account.
- [Customer account info API](/customer-account-info) — load the compact profile once the shopper is signed in.
- [Contacts](/contacts) — administration guide.
- [API key](/api-key) — how to authenticate the request.
- [Error codes](/error-codes) — the platform's error-code conventions.

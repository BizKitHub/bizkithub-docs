---
category: "developers/customer-account-api"
tags: []
published_at: "2026-08-01T00:00:00.000Z"
---


Customer account API
====================

The customer account API is the surface a merchant's storefront uses to register, authenticate and load the profile of an end shopper — the person on the other side of the checkout. It is intentionally minimal: three endpoints (register, login, load-profile), a single session token (`identityId`), and a small, documented set of error codes.

This article is the developer contract. For the operator-side view of the same records — searching contacts, editing profiles, managing credit, resolving duplicates — see the [Contacts](/contacts) article.

## Concepts

Every shopper who interacts with a merchant is represented in the platform as a **contact** scoped to that merchant's organisation. Contacts are uniquely identified within the organisation by their normalised e-mail address; two orders paid by the same e-mail always land on the same contact, whether the shopper is registered or checked out as a guest.

A **registered contact** is a contact that has set a password. Registration lets the shopper sign in to their storefront's user portal, view their order history, manage credit and profile fields. A **guest** is a contact created without registration — typically as a side effect of a checkout — and cannot sign in until the shopper explicitly registers with the same e-mail (at which point the existing profile is merged into the new account, preserving all history).

Authentication produces an opaque `identityId` — a token the storefront stores in a cookie and echoes on subsequent requests. Losing the token ends the session; a leaked token grants the holder the same access the shopper has, until the storefront invalidates it.

## Register a shopper

```
POST https://api.bizkithub.com/contact/v1/register-account
```

Creates a registration request for the shopper. On success the platform sends a confirmation e-mail (template code `customer-register-account`) to verify that the address is real; the shopper must click through it before the account is usable for sign-in. Until then the profile exists but is not yet activated.

### Request body

```ts
export type CustomerRegisterRequest = {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  companyName?: string;
  companyRegistrationNumber?: string;
  taxIdentificationNumber?: string;
  streetAddress?: string;
  city?: string;
  cityPart?: string;
  stateRegion?: string;
  postalCode?: string;
  country?: string;
  newsletter?: boolean;
  primaryLocale?: string;
};
```

The minimum accepted payload is a syntactically valid `email` and a non-empty `password`. Every other field is optional and can be added to the profile later, either through the administration or by re-sending it with a subsequent order.

### Response

```ts
export const CUSTOMER_REGISTER_ERROR_CODE = {
  E001: 'Customer register failed.',
  E002: 'Customer has been registered.',
  E003: 'Customer account has been banned.',
  E004: 'Too many registration attempts.',
} as const;

export type CustomerRegisterErrorCode = keyof typeof CUSTOMER_REGISTER_ERROR_CODE;

export type PublicCustomerRegisterAccountResponse =
  | { success: false; errorCode: CustomerRegisterErrorCode; message: string }
  | { success: true };
```

### Error codes

| Code | Message | Meaning |
|------|---------|---------|
| `E001` | Customer register failed. | Generic registration failure — typically a platform-side error. Rare. |
| `E002` | Customer has been registered. | The shopper is already registered and confirmed. Direct them to sign in or to reset their password instead. |
| `E003` | Customer account has been banned. | The merchant has forbidden any interaction with this contact. Registration is refused. |
| `E004` | Too many registration attempts. | Too many pending registrations for this address without completing verification. Wait and retry. |

### Rate limits and constraints

- Registration is available only for addresses that can receive the confirmation e-mail on the public internet through the merchant's SMTP configuration. Addresses that bounce hard are rejected.
- Registration is refused for the built-in **anonymous customer** account and for any contact flagged as banned.
- If a registration request is created but the e-mail is never confirmed, a fresh registration attempt for the same address is only accepted once every ten minutes.
- Being "registered" is defined by having a password set on the profile — not by the existence of the profile itself. A profile can exist for years as a guest before the shopper registers.

## Sign a shopper in

```
POST https://api.bizkithub.com/contact/v1/login
```

Verifies the shopper's credentials and, on success, returns an `identityId` — the session token the storefront stores in a cookie and echoes on subsequent calls.

### Request body

| Property | Type | Meaning |
|----------|------|---------|
| `email` | `string` | Shopper's e-mail address on the contact record. |
| `password` | `string` | Shopper's password. |

### Response

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

### Error codes

| Code | Message | Meaning |
|------|---------|---------|
| `E001` | Customer login failed. | Generic failure — typically a platform-side error. |
| `E002` | Customer e-mail does not exist. | No contact exists with the supplied e-mail address. |
| `E003` | Customer have not a registered account. | A contact exists but has never registered — no password is set. |
| `E004` | Wrong e-mail or password. | Credentials do not match. In practice this almost always means the password is wrong, because `E002` covers the e-mail-missing case. |
| `E005` | Customer account has been banned. | Sign-in is blocked by the merchant. |
| `E006` | Too many login attempts. | Rate-limit protection against password guessing. Retry after the cooldown. |
| `E007` | Customer mail has not been authorized. | Registration was started but the confirmation e-mail was never clicked. |

### Persisting the session

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

## Load the signed-in profile

```
GET https://api.bizkithub.com/contact/v1/get-account-info?identityId=xxx
```

Loads a compact snapshot of the currently signed-in shopper. This is the endpoint the storefront calls on every page render to determine "who is looking at this page right now, and do we need to show a sign-in button or an account menu".

The endpoint intentionally does not return the full contact profile — that would be heavier than most page renders need, and the fields it does return are already sufficient to render an account widget, decide credit-related UI, and gate premium content. For fields that are not exposed here (address, communication history, order history), call the specific endpoint that owns them.

### Response

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

### Response fields

When the token is not recognised (missing, expired, revoked), the response is the single value `{ loggedIn: false }`. Storefronts should treat this as "sign the shopper out and show the sign-in UI".

When the token is valid, the response carries the following fields.

| Property | Type | Meaning |
|----------|------|---------|
| `loggedIn` | `true` | Marker that the shopper is authenticated and the token is valid. |
| `identityId` | `string` | The same token you supplied — echo for symmetry and diagnostic pairing. |
| `cuRefNo` | `string` | External customer reference number, safe to expose to the shopper. |
| `creditBalance` | `number` | Current usable credit balance. |
| `email` | `string` | Shopper's e-mail address. |
| `phone` | `string` | Phone number in the normalised `+<prefix> <value>` format. |
| `firstName` | `string` | First name. |
| `lastName` | `string` | Last name (includes middle name if applicable). |
| `companyName` | `string` | Company name — the entity the shopper represents, owns or works for. |
| `premium` | `boolean` | Whether the shopper is a premium customer. |
| `ban` | `boolean` | Whether the shopper is currently banned. |

### Individuals vs companies

If the contact represents a company rather than a person, the platform returns `companyName` without `firstName` or `lastName`. If all three are present, the contact is a natural person acting for or representing that company — invoicing is then always billed to the company, and the personal name is only supporting information.

## Handling sign-out

There is no dedicated sign-out endpoint on the public API; signing out is the storefront's responsibility. Delete the local cookie and, if you want to invalidate the platform-side session as well, request the operator to revoke it from the [Contacts](/contacts) administration (the **Invalidate sessions** action). A next request with a revoked token receives `{ loggedIn: false }`.

## Related articles

- [Contacts](/contacts) — administration guide for managing shoppers, including how the platform derives the customer reference number, how credit works and how the trust score is computed.
- [API key](/api-key) — how the storefront authenticates the underlying HTTP call.
- [Error codes](/error-codes) — general error-code conventions for the platform.
- [Order create API](/order-create-api) — creating an order once the shopper is signed in (or as a guest checkout).

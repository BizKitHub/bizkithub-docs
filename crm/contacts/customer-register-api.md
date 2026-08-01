---
id: "0EI0U17LX27voXKI"
category: "crm/contacts"
tags: []
published_at: "2026-08-01T00:00:00.000Z"
---


Customer register API
=====================

The register endpoint creates a new **registration request** for a shopper. On success the platform sends a confirmation e-mail (template code `customer-register-account`) to the supplied address; the shopper must click through it before the account is usable for sign-in. Until then the profile exists but is not yet activated.

This is one of three storefront-integration endpoints for shopper accounts, together with the [customer login API](/customer-login) and the [customer account info API](/customer-account-info). For the concepts behind contacts, registered accounts and guests, see the [Contacts](/contacts) article.

## Endpoint

```
POST https://api.bizkithub.com/contact/v1/register-account
```

Authentication is via the standard `apiKey` parameter (see the [API key](/api-key) article).

## Request body

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

The minimum accepted payload is a syntactically valid `email` and a non-empty `password`. Every other field is optional and can be added to the profile later, either through the administration or by re-sending it with a subsequent order — the platform merges new information into the profile using its quality-scoring rules (see [Contacts](/contacts) for the merge logic).

## Response

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

## Error codes

| Code | Message | Meaning |
|------|---------|---------|
| `E001` | Customer register failed. | Generic registration failure — typically a platform-side error. Rare. |
| `E002` | Customer has been registered. | The shopper is already registered and confirmed. Direct them to sign in or reset their password. |
| `E003` | Customer account has been banned. | The merchant has forbidden any interaction with this contact. Registration is refused. |
| `E004` | Too many registration attempts. | Too many pending registrations for this address without completing verification. Wait and retry. |

## Rate limits and constraints

- Registration is available only for addresses that can receive the confirmation e-mail on the public internet through the merchant's SMTP configuration. Addresses that bounce hard are rejected.
- Registration is refused for the built-in **anonymous customer** account and for any contact flagged as banned.
- If a registration request is created but the e-mail is never confirmed, a fresh registration attempt for the same address is only accepted once every ten minutes.
- Being "registered" is defined by having a password set on the profile — not by the existence of the profile itself. A profile can exist for years as a guest before the shopper registers.

## What happens after a successful call

1. The confirmation e-mail is dispatched to the supplied address through the platform's [e-mailer](/e-mailer).
2. The shopper clicks the confirmation link, which activates the profile.
3. The shopper can now sign in using the [customer login API](/customer-login).
4. Once signed in, the storefront loads the profile via the [customer account info API](/customer-account-info).

## Related articles

- [Customer login API](/customer-login) — sign a registered shopper in and obtain the session token.
- [Customer account info API](/customer-account-info) — load the compact profile of the signed-in shopper.
- [Contacts](/contacts) — administration guide covering contacts, quality scoring, anonymous customer.
- [API key](/api-key) — how to authenticate the request.
- [Error codes](/error-codes) — the platform's error-code conventions.

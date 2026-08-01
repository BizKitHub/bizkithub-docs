---
id: "qN8XzbOmBgBddQ5m"
category: "developers/api"
tags: []
published_at: "2026-07-24T19:26:29.648Z"
---


API
===

BizKitHub provides a REST API that allows you to integrate our services into your applications. All communication is done via HTTPS requests with JSON responses.

## Basics

- **Base URL:** `https://api.bizkithub.com`
- **Authentication:** API key as query parameter (`?apiKey=...`)
- **Response format:** All responses are in JSON.

## How It Works

### 1. Get your API key

First, you need to obtain an API key from your BizKitHub admin panel. The API key authenticates all your requests. See [How to get an API key](/api-key).

### 2. Make HTTPS requests

All API calls are made as standard HTTPS requests. The `apiKey` parameter is always required and must be included as a URL query parameter.

### 3. Process JSON response

Every API endpoint returns a JSON response. The exact structure depends on the endpoint and is documented in detail in our Swagger documentation.

## Example Request

<pre><code>fetch('https://api.bizkithub.com/api/v1/calendar/detail?apiKey=YOUR_API_KEY&amp;code=EVENT_CODE')
.then(response =&gt; response.json())
.then(data =&gt; console.log(data));</code></pre>

## Required Parameter

The `apiKey` query parameter is mandatory for all API requests. Requests without a valid API key will be rejected.

## API Endpoints

For a complete list of all available endpoints, including request parameters and response formats, please refer to our interactive [Swagger documentation](/swagger). You can also [get an API key](/api-key) from the admin panel.

## URL Structure

Every public endpoint on `api.bizkithub.com` follows a predictable path template:

```
/<module>/<version>/<service>/<action>
```

The **module** identifies the business area (`shop`, `product`, `contact`, `calendar`, `newsletter`, `ping`, …). The **version** is always a `v`-prefixed number (`v1`); if you do not know which version to target, use `v1`. The optional **service** and **action** narrow down to a specific endpoint.

The minimum well-formed path is `/<module>/<version>`, for example `/ping/v1`. A representative fully-qualified URL — creating an order — looks like this:

```
POST https://api.bizkithub.com/shop/v1/order/create
```

## HTTP Method Conventions

Each endpoint documents the HTTP method it accepts. By convention:

- **`GET`** — retrieval endpoints. Idempotent; safe to retry.
- **`POST`** — creation, mutation, and any endpoint that changes server state.

Endpoints that must accept a large or structured body — order creation, bulk imports, complex searches — use `POST` even when they are conceptually reads. When in doubt, refer to the interactive [Swagger documentation](/swagger); every endpoint declares its exact method there.

## How to pass the API key

The `apiKey` parameter can be supplied through either channel — pick whichever fits your integration:

**In the URL query string** (typical for `GET`):

```
GET https://api.bizkithub.com/api/v1/ping/v1?apiKey=YOUR_API_KEY
```

**In the JSON request body** (typical for `POST`):

```json
{
  "apiKey": "YOUR_API_KEY",
  "customerEmail": "buyer@example.com"
}
```

Both channels are accepted on every endpoint, and they may be combined — what matters is that the key is supplied at least once. For details on key formats, prefixes, and rate-limit tiers, see the [API key](/api-key) article.

## Quick health check

To verify that your key and network path work end to end, hit the ping endpoint from a browser or `curl`:

```
GET https://api.bizkithub.com/ping/v1?apiKey=YOUR_API_KEY
```

A successful response confirms that the gateway received your request, resolved your key, and reached the platform.

## Related Topics

- [Error Codes](/error-codes) — Learn about API error responses and how to handle them in your application.
- [Rate Limiting](/rate-limiting) — Understand API rate limits and best practices for optimal performance.
- [BFF](/bff) — Backend-for-Frontend endpoints used by BizKitHub's own administration UI.
- [Order create API](/order-create-api), [Product catalog API](/product-catalog-api), [Customer account API](/customer-account-api) — end-to-end contracts for the most-used endpoints.

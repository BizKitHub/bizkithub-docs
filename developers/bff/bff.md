---
id: "IF2P1Blh9pUTLRcv"
category: "developers/bff"
tags: []
published_at: "2026-07-26T08:11:40.094Z"
---


BFF
===

## What is BFF (Backend for Frontend)?

**Backend for Frontend (BFF)** is an architectural pattern in which a dedicated backend service is built specifically to support a single frontend application or a single type of client — such as a web app, mobile app, or smart TV app — rather than exposing one generic API to all clients.

## The Problem It Solves

In many systems, a single backend API is shared by multiple frontends: a web client, an iOS app, an Android app, and maybe a third-party partner integration. Each of these clients often has different needs:

- A mobile app may need smaller, optimized payloads to save bandwidth.
- A web dashboard may need rich, aggregated data pulled from several microservices at once.
- A partner API may need a completely different data shape or authentication flow.

Trying to satisfy all of these requirements with one shared API leads to bloated endpoints, excessive conditional logic, and constant negotiation between frontend and backend teams over what the API should return.

## How BFF Works

Instead of one shared backend, each frontend (or frontend team) gets its own dedicated backend layer:

```
[Web App]     --> [Web BFF]     --> Microservices
[Mobile App]  --> [Mobile BFF]  --> Microservices
[Partner API] --> [Partner BFF] --> Microservices
```

Each BFF acts as an intermediary between its client and the underlying microservices or data sources. It can:

- Aggregate data from multiple backend services into a single response
- Reshape and filter data to match exactly what the client needs
- Handle client-specific authentication or session logic
- Reduce the number of round trips the frontend needs to make

## Benefits

- **Tailored APIs** – Each client gets exactly the data structure it needs, nothing more.
- **Decoupling** – Frontend teams can evolve their BFF independently without waiting on a shared backend team.
- **Simplified frontend logic** – Aggregation and transformation happen server-side instead of cluttering client code.
- **Better performance** – Fewer, smaller, and more relevant API calls per client.

## Trade-offs

- **More services to maintain** – Each BFF is its own deployable unit, adding operational overhead.
- **Potential code duplication** – Similar logic may be repeated across multiple BFFs if not carefully managed.
- **Team ownership questions** – Someone needs to own and maintain each BFF, which usually falls to the frontend team.

## When to Use It

BFF makes the most sense when you have multiple distinct client types with meaningfully different data or performance needs, and when frontend teams want more autonomy over the API shape they consume. For simple applications with a single client, a shared general-purpose API is often simpler and sufficient.

## Conclusion

The Backend for Frontend pattern trades a bit of extra infrastructure for significantly cleaner, faster, and more maintainable client-specific APIs. It's a popular choice in microservice architectures where different clients have genuinely different needs — and it lets frontend and backend teams move faster, with less friction, by giving each frontend the backend it actually needs.

## The BizKitHub BFF

BizKitHub applies this pattern in a specific way — the platform exposes two parallel HTTP surfaces on `api.bizkithub.com`, and understanding when each applies is important if you are integrating against the platform.

The **public API** at `api.bizkithub.com/api/v1/*` (documented in the [API](/api) article) is the external contract: stable, versioned, authenticated by [API key](/api-key), and intended for external systems — merchant storefronts, partner integrations, mobile apps, third-party tools. It carries strong backwards-compatibility guarantees so that integrations built against it continue to work as the platform evolves.

The **BFF layer** at `api.bizkithub.com/bff/*` is the second surface. It is not part of the public contract — it exists to serve BizKitHub's own administration UI at `admin.bizkithub.com` and any other in-house front-end the platform may add. Its shape is optimised for the exact needs of the admin: a single call typically returns everything a screen needs to render.

### Key differences from the public API

| Aspect | Public API | BFF |
|--------|-----------|-----|
| Base URL | `api.bizkithub.com/api/v1/*` | `api.bizkithub.com/bff/*` |
| Auth | API key | Signed-in session cookie |
| Contract stability | Versioned, long-term stable | Free to change with the admin UI |
| Payload shape | Normalised, JSON-first | Tailored to the admin screen consuming it |
| Caching | Uses cached snapshots where safe | Prefers fresh live data — no aggressive caching |
| Intended consumer | External integrations | BizKitHub's own front-ends only |

BFF endpoints prefer live database reads over cached snapshots because the operators consuming them expect to see the state as it is *right now* — a merchant editing a product should see the update reflected immediately in every subsequent screen, without waiting for a cache to invalidate. This is the opposite optimisation from the public catalog endpoints, which serve high-traffic public storefronts and are backed by cached snapshots refreshed on every write.

### When not to use BFF

If you are building an integration on top of BizKitHub — a marketplace importer, an accounting connector, a reporting tool, a mobile companion app — use the public API rather than the BFF. Reasons:

- BFF endpoints are not versioned and can change without notice; a working integration today may break tomorrow.
- Session-cookie authentication is not designed for headless clients.
- Payload shapes are shaped for specific admin screens, not for generic consumption.

The public API surface exposes every operation an integration needs; if you find yourself thinking a BFF endpoint would be more convenient, the correct path is to file a feature request against the public API.

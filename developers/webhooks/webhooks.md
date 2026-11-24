---
code: "webhooks"
category: "developers"
tags: ["type-reference", "api", "webhooks"]
published_at: "2026-11-24T00:00:00.000Z"
---


Webhooks
========

Webhooks let BizKitHub tell your system that something happened, instead of your system asking the API over and over. When a subscribed event occurs, the platform sends an HTTPS `POST` with a JSON body to an address you choose, signs it with a secret only you and BizKitHub know, and retries until your system confirms it.

This article covers setting up an endpoint, the request format, verifying the signature, the event catalogue and how delivery and retries work.

## Setting up an endpoint

Webhooks are managed in the administration under **Settings → Webhooks**.

1. Click **New webhook**.
2. Enter the **URL (HTTPS)** of your receiver and, optionally, a description such as the name of the receiving system.
3. Choose the **Events** to receive. With nothing selected, the endpoint receives every event, including events added later.
4. Click **Create webhook** and store the **signing secret** right away. It is shown in full only once; later you can only generate a new one.
5. Click **Send test event** to check that your receiver answers.

An organisation can have several endpoints, each with its own events and secret.

## The request

Every delivery is a `POST` with these headers:

| Header | Value |
|---|---|
| `Content-Type` | `application/json` |
| `User-Agent` | `BizKitHub-Webhooks/1.0` |
| `X-BKH-Event` | Event code, for example `shipment.created` |
| `X-BKH-Delivery` | Unique delivery identifier, the same on every retry |
| `X-BKH-Signature` | `t={unix seconds},v1={hex signature}` |

The body is an envelope with the event data:

```json
{
  "id": "whd_k3m9x0q2v7c1b8n4z6tp",
  "event": "shipment.state_changed",
  "createdAt": "2026-11-24T10:15:02.000Z",
  "data": { }
}
```

`id` and `createdAt` stay the same across retries, so use `id` to ignore a delivery you have already processed.

## Verifying the signature

The signature is HMAC-SHA256 of the string `{t}.{raw request body}`, keyed with the endpoint's signing secret, encoded as hexadecimal. To verify a request:

1. Read `t` and `v1` from the `X-BKH-Signature` header.
2. Reject the request if `t` is more than 5 minutes away from your current time. This stops replays of old requests.
3. Compute the HMAC over `t`, a dot and the **raw** body exactly as received, before any JSON parsing.
4. Compare it with `v1` using a constant-time comparison.

```js
import { createHmac, timingSafeEqual } from 'node:crypto';

export function verifyBizKitHubSignature(header, rawBody, secret) {
  const parts = Object.fromEntries(header.split(',').map((p) => p.trim().split('=')));
  const t = Number(parts.t);
  if (!Number.isFinite(t) || !parts.v1) return false;
  if (Math.abs(Date.now() / 1000 - t) > 300) return false;
  const expected = createHmac('sha256', secret).update(`${t}.${rawBody}`).digest();
  const given = Buffer.from(parts.v1, 'hex');
  return expected.length === given.length && timingSafeEqual(expected, given);
}
```

If you generate a new secret with **Generate new secret**, the old secret stops working immediately.

## Events

| Event | Sent when |
|---|---|
| `shipment.created` | A shipment is created for an order, with a carrier label. |
| `shipment.state_changed` | The carrier reports a new state of a shipment, for example in transit, ready for pickup or delivered. |
| `webhook.test` | You click **Send test event**. Always delivered, whatever the subscription. |

Both shipment events carry the same `data`:

```json
{
  "shipment": {
    "id": "shp_9f2k1m",
    "state": "delivered",
    "previousState": "in_transit",
    "direction": "outbound",
    "carrier": { "code": "gls", "name": "GLS" },
    "serviceCode": "parcel",
    "trackingNumber": "1234567890",
    "trackingUrl": "https://gls-group.eu/track/1234567890",
    "weightG": 1200,
    "cod": null,
    "createdAt": "2026-11-23T08:02:11.000Z"
  },
  "order": { "number": "2026001234", "hash": "b81f0c7e9a…" }
}
```

`previousState` is `null` for `shipment.created`. `direction` is `return` for return shipments. `cod` holds `amount` and `currency` when the parcel is cash on delivery. See [Shipments and carriers](/shipments-and-carriers) for the meaning of each state.

## Delivery and retries

- Your receiver must answer with an HTTP `2xx` status within 10 seconds. Any other answer, a timeout or a redirect counts as a failure; redirects are not followed.
- A failed delivery is retried 7 times, after 1 minute, 5 minutes, 30 minutes, 2 hours, 6 hours, 12 hours and 6 hours. Together the eight attempts cover about 27 hours, enough for a receiver that is down overnight.
- Deliveries may arrive more than once and not strictly in order. Deduplicate by the envelope `id` and compare `createdAt` before overwriting newer data.
- After 50 failed deliveries in a row the endpoint is disabled and a warning appears in the [system log](/log-overview). Fix the receiver, then click **Enable**.
- **Delivery history** shows every delivery with its status, attempts and the start of your receiver's response. **Send again** queues a delivery once more.

Answer quickly and do the real work afterwards, for example by putting the event on your own queue. A receiver that takes longer than 10 seconds will see the same event again.

## Related

- [Shipments and carriers](/shipments-and-carriers)
- [API quickstart](/api-quickstart)
- [API key](/api-key-overview)
- [System log](/log-overview)

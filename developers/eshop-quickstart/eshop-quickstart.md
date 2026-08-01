---
id: "gVp5BJ2JJgE9z82p"
code: "docs-migration-eshop-quickstart"
category: "developers/eshop-quickstart"
tags: []
published_at: "2026-07-26T18:33:15.639Z"
---


Eshop Quickstart
================

## Overview

This guide walks through the smallest possible headless e-shop built on top of BizKitHub. The backend (products, cart, orders, payments) lives inside BizKitHub; the frontend is a Next.js application that fetches from the public REST API.

## Prerequisites

- A BizKitHub organisation with API access.
- Basic knowledge of JavaScript or TypeScript.
- Familiarity with REST APIs.
- Node.js installed locally.

## 1. Get your API credentials

Create an API key in the admin dashboard. Use a `DEV_` key while developing, then switch to a `PROD` key for the deployed application.

```
BIZKITHUB_API_KEY=DEV_xxxxxxxxxxxxxxxxxxxxxxxxxxx
BIZKITHUB_API_URL=https://api.bizkithub.com/api/v1
```

## 2. Set up the project

```
npx create-next-app@latest my-eshop
cd my-eshop
```

Store the API key and base URL in `.env.local` and add that file to `.gitignore`.

## 3. Create an API client

A small server-side helper keeps the API key out of the browser bundle.

```ts
// lib/bizkithub.ts
const API_KEY = process.env.BIZKITHUB_API_KEY!;
const API_URL = process.env.BIZKITHUB_API_URL!;

export async function fetchFromAPI(path: string, init: RequestInit = {}) {
  const url = new URL(`${API_URL}${path}`);
  url.searchParams.set('apiKey', API_KEY);
  const response = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers },
  });
  if (!response.ok) throw new Error(`API error ${response.status}`);
  return response.json();
}
```

## 4. Fetch and render products

```ts
// app/products/page.tsx
import { fetchFromAPI } from '@/lib/bizkithub';

export default async function ProductsPage() {
  const { items } = await fetchFromAPI('/product/list');
  return (
    <ul>
      {items.map((p) => (
        <li key={p.id}>{p.name} — {p.price} {p.currency}</li>
      ))}
    </ul>
  );
}
```

## 5. Create an order

Cart contents and a customer identifier are posted to the order endpoint; the response includes an order hash that unlocks the public order page and the payment gateway.

```ts
const order = await fetchFromAPI('/order/create', {
  method: 'POST',
  body: JSON.stringify({
    items: [{ productId: 'prod_abc', quantity: 1 }],
    customer: { email: 'buyer@example.com' },
  }),
});
window.location.href = order.paymentUrl;
```

## 6. Handle the payment callback

BizKitHub posts a signed webhook to your configured URL when the payment settles. Verify the signature, then mark the local order as paid or trigger the fulfilment flow.

## Where to go next

- Product catalogue reference — `/api/v1/product`.
- Cart and pricing rules — `/api/v1/cart`.
- Payment gateways and recurring tokens — `/api/v1/payment`.
- Webhook signature format — `/api/v1/webhook`.

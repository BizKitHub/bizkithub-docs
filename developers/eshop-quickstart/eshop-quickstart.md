---
id: "gVp5BJ2JJgE9z82p"
code: "docs-migration-eshop-quickstart"
category: "developers/eshop-quickstart"
tags: ["type-guide"]
published_at: "2026-07-26T18:33:15.639Z"
---


E-shop quickstart
=================

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
  const { items } = await fetchFromAPI('/product/feed?currency=CZK&limit=24');
  return (
    <ul>
      {items.map((p) => (
        <li key={p.id}>{p.name}: {p.price} CZK</li>
      ))}
    </ul>
  );
}
```

## 5. Create an order

Post the customer's e-mail and the items to the order endpoint. The response carries the order number, the order `hash` and two ready-made links: the public order page and the payment page. See [Creating orders via the API](/order-create-api) for every field.

```ts
// Runs on the server (route handler or server action), never in the browser.
const order = await fetchFromAPI('/shop/order/create', {
  method: 'POST',
  body: JSON.stringify({
    customer: { email: 'buyer@example.com' },
    items: [{ label: 'Cheese Burger', price: 189, count: 1 }],
    returnUrl: 'https://shop.example.com/thank-you',
  }),
});
// Send the customer to the hosted payment page.
redirect(order.links.payLink);
```

## 6. Handle the payment callback

After paying, the customer returns to your `returnUrl`. Do not trust the redirect alone: read the order with `GET /api/v1/shop/order/detail?hash=…` and check that `paidDate` is set before you show a confirmation or release goods. If you passed a `notificationUrl` when creating the order, BizKitHub also calls it when the payment state changes, so your system learns about payments that complete after the customer has closed the browser.

For shipments, subscribe to [webhooks](/webhooks) to be told when a parcel is created or changes state.

## Where to go next

- [Creating orders via the API](/order-create-api): the full order payload.
- [API explorer](/swagger): product feed, categories, cart and payment endpoints.
- [Webhooks](/webhooks): signed events and how to verify them.
- [API error codes](/errors): what each error means and how to react.

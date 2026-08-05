---
id: "oGcZlCTB5LEn2959"
category: "sales/basket"
tags: []
published_at: "2026-04-24T06:57:25.427Z"
---


Basket
======

Stránka `/cart` is reserved for managing active customer shopping carts — i.e., in-progress orders that the customer has not yet submitted but has already placed specific goods into the system. The cart forms a notional intermediate stage in the business process between the catalog and the order, allowing the system to capture the customer's purchase intent before a binding order is generated from it.

> ⚠️ **The module is under development.** Currently, the administration displays a "Shop page work in progress" placeholder, and specific functionality is not available. Documentation will be updated after the module is deployed.

## What the module is for

The cart represents the state **before an order is created**. As soon as a customer adds a product to the cart on the e-shop, the system automatically creates a unique cart identifier and links it either to a logged-in customer or (for anonymous visitors) only to a specific browser. The cart stores selected products with variants, current price, and quantity, and for logged-in customers, the content is synchronized across devices — meaning a customer can start shopping on their phone and complete it on their computer without having to re-select items. When finalizing an order, the cart's content is copied to the new order's items, and the cart itself is emptied.

## Planned features

After the module's deployment, the administration will allow viewing a list of active and abandoned carts, browsing the content of a specific cart, and contacting the customer with an offer to complete their purchase. This will include automatic reminder emails for abandoned carts and tracking conversion statistics, i.e., the ratio at which carts turn into actual orders. The goal is to provide e-shop operators with a tool for actively working with lost purchases, which in practice is one of the most effective ways to increase turnover.

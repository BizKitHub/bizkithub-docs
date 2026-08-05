---
id: "KRcexS9kpsLDnY3O"
category: "sales/discount-vouchers"
tags: []
published_at: "2026-04-24T06:57:29.247Z"
---


Discount vouchers
=================

Discount vouchers are a marketing and business tool by which organizations offer customers financial benefits — whether it's a classic discount, a gift with an order, or a loyalty bonus. In the system, they can take many forms: percentage or fixed discounts on the entire order, gifted credit for later spending, or a voucher for a specific product for free. The `/voucher` module therefore serves not only for generating and managing codes but also for evaluating their business contribution and linking them with products in the form of templates, thus allowing the entire campaign lifecycle to be covered from one place — from the creation of the voucher to its distribution and the final measurement of how much revenue it actually generated.

## Voucher Overview

The table displays all vouchers within the organization with the most important data, enabling quick decisions about the next step. In each row, you can see the voucher code itself (a clickable link that opens the detail, and can also be conveniently copied for communication with the customer), the voucher type displayed as a colored label, the number of uses relative to the set limit, the current status, the expiration date, and the moment of last use. The overview automatically refreshes every 20 seconds, so new redemptions appear in the list almost immediately and you don't have to refresh it manually.

## Voucher Types

The system distinguishes four types of vouchers, each with different business logic and affecting the order price or customer account differently. Choosing the right type is crucial — a percentage discount behaves differently for a small order than for a large one, and free-credit has a completely different marketing impact than a classic one-time discount.

- **Fixed Amount (`fixed`)** — deducts a fixed amount from the order price, suitable for campaigns with a clearly communicable value such as „200 CZK discount”.
- **Percentage Discount (`percentage`)** — deducts a specified percentage from the total order price, with the resulting discount increasing with the size of the purchase.
- **Free Credit (`free-credit`)** — instead of an immediate discount, credits the customer's internal credit account with an amount that can be applied to any subsequent order — thus the voucher functions as a gift for repeat purchases.
- **Free Product (`free-product`)** — adds a selected product to the order free of charge, usually on the condition that another specific product is in the cart; typically used in campaigns like „buy X, get Y free”.

> ℹ️ **Information:** The voucher type cannot be changed after its first use. For unused vouchers, changing the type remains possible, so the mechanism can still be adjusted between generating and distributing the campaign without needing to create new codes.

## Voucher Lifecycle and Statuses

The status you see in the overview is not permanently stored in the database — the system calculates it in real-time from several conditions simultaneously, namely activation, validity periods, and usage limit. Thanks to this, the status changes automatically, for example, when a voucher expires or reaches its limit, without the need to run any cleanup task or manual recalculation.

- **Active** — the voucher is marked as active, has not expired, has not exceeded its limit, and its validity period (if any) has already started.
- **Inactive** — the administrator has manually deactivated the voucher.
- **Pending** — the voucher has a **Valid From** date set in the future and cannot be redeemed yet.
- **Expired** — the **Valid Until** date has already passed.
- **Exhausted** — the voucher has reached its set usage limit.

A voucher is truly redeemable only if it meets all these conditions simultaneously. Therefore, in the detail view, you will also find the item „effectively active", which summarizes the overall evaluation and answers the question of whether the code could be used in the cart right now.

> ⚠️ **Warning:** Deactivating a voucher is a soft delete — the record remains in the database and can be reactivated at any time. This ensures traceability for historical orders in which the voucher was applied and maintains a complete audit trail.

## Restrictions and Validity

Several restrictions can be set for each voucher, which together form its business rules. **Usage Limit** determines the maximum number of successful redemptions; if not specified, the voucher is unlimited and can be redeemed repeatedly. The **Valid From** and **Valid Until** settings define the time window during which the voucher is active, and both boundary values are optional, so a voucher can be time-unlimited or have only an end date. An additional setting is **Only once per order** (`isOrderSingleton`), which prevents the same voucher from being counted multiple times in a single order. The system continuously monitors the number of uses and displays the remaining number (`remainingUsage`) along with the number of days until expiration in the voucher detail.

## Creating a New Voucher

The **Add** button in the top right corner opens the form for creating a voucher. In the first step, you choose between automatic generation of a random sixteen-character code and manual entry of your own code, which is automatically converted to uppercase. Subsequently, you select the voucher type and its value, usage limit, validity period, and an optional note for internal purposes. The final step is activation — you can save the new voucher directly as active, or first as inactive and activate it later when the campaign launches. Before saving, a button to verify code availability is available, which checks if the same code already exists in your organization.

> 💡 **Tip:** For marketing campaigns, create memorable codes (e.g., `SUMMER2026` or `WELCOME10`) — they will improve conversion in ads and newsletters because customers will recall them more easily. For one-time gift vouchers, on the other hand, use a system-generated random code that cannot be guessed and poses no risk of misuse by another person.

## Voucher Redemption in Order

A customer can redeem a voucher directly in the cart, or an administrator can manually add it when creating an order. At the moment of redemption, the system successively performs several checks: it verifies the voucher's existence and validity, checks that the usage limit has not been exceeded, and confirms that the voucher is within its validity period. For the **free-credit** type, it then automatically credits the customer's account; for **fixed** and **percentage** types, it reduces the order price, and each successful redemption is recorded in the voucher's history to ensure the entire process is traceable. If a customer redeems multiple vouchers at once, the system applies them sequentially in the order they were entered. The combination of different vouchers for a single customer can be limited by the **Only once per order** flag, which prevents the same code from being used repeatedly in one order.

## Product-Bound Voucher Templates

A very specific case is the use of a voucher as a template in the product detail. In such a setting, a new voucher is automatically generated directly for the customer with each successful order of the given product — this is a mechanism by which gift vouchers, loyalty rewards, or „buy X, get Y free” campaigns can be implemented. Each voucher generated in this way has a usage limit set to one redemption, is marked as a singleton (only once per order), and the customer receives an email with the code itself, using the `voucher-gift-created` template. Furthermore, a record of this event is created in the order log, making the entire process fully traceable.

> 💡 **Tip:** If you want to credit a customer's account after a product purchase without the need to redeem a code, use a special action like „add credit” directly with the order item instead of a voucher template. The customer will see the credit in their account and won't have to deal with manual code entry, which increases convenience and reduces the risk of transcription errors.

## Voucher Detail

Clicking on the code opens a detail view divided into several tabs. The **Overview** tab is used for editing settings (type, value, limit, validity, note) and contains a deactivation button; calculated values such as remaining uses, days until expiration, and effective status are also displayed here. The **Statistics** tab shows summarized usage indicators — the total number of orders with this voucher, revenue from them, average order value, number of unique customers, distribution of orders by status (paid, pending, canceled), and the date of first and last use. The **Usage History** tab then contains a list of all orders in which the voucher was applied, including the customer's name, amount, and date. In the upper part of the detail view, the last five orders are also displayed, and for templates, a list of products from whose purchase the voucher is automatically generated, so you have an overview of the entire business context of the code from one place.

## Best Practices

> 💡 **Tip:** For time-limited campaigns, always set **Valid Until**. Even if you forget to manually end the campaign after it finishes, the voucher will stop working on its own and will no longer reduce the margin on sales where its application is no longer desired.
> ⚠️ **Warning:** Percentage discounts on orders that already contain discounted items can lead to surprisingly high overall discounts. Therefore, consider combining with a minimum order value or a carefully set usage limit to prevent undesirable margin losses.

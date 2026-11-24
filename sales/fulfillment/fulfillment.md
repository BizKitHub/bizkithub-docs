---
code: "fulfillment-pick-and-pack"
category: "sales"
tags: ["type-overview", "fulfillment", "shipping"]
published_at: "2026-11-24T00:00:00.000Z"
---


Fulfillment (pick and pack)
===========================

The Fulfillment module is the workspace of the packing table. It collects every order that is ready to ship, tells the picker which goods to fetch from the shelves, groups orders with the same content so they can be packed in one go, creates and prints the shipping labels, and records which orders are packed. It is built for keyboard use on a full screen, so one person can pack a long queue without touching the mouse.

**Packed** is a fulfillment state only. Packing an order never changes its order status. The order status moves forward when the carrier reports the parcel, as described in [Shipments and carriers](/shipments-and-carriers).

## When you would use it

- You ship physical goods every day and want one screen that says what to pick and what to pack next.
- Several orders contain the same products, and you want to pack them together.
- You print carrier labels at the packing table and want the label created automatically for each parcel.
- You need to put problem orders aside (missing goods, unclear address) without losing them.

## Where to find it in the admin

Open **Shop → Fulfillment**. The module has five tabs: **Overview**, **Picking**, **Packing**, **Orders** and **Products**. Access is granted per member like any other module, so warehouse staff can work here without access to other parts of the administration.

The detail of every order also has a **Fulfillment** box. It shows the stage of the order, how many shelf items are picked, and buttons to pick the whole order, hold or release it, and open the packing station on this order.

## Which orders enter the queue

An order enters the fulfillment queue when all of the following apply:

- Its status belongs to the **In progress** category, or it is a **New** order that is already paid or is paid by cash on delivery.
- It was created in the last 30 days. Older open orders stay out of the queue.
- It is not packed yet. Packed orders remain visible on the **Orders** tab for 72 hours.
- It has no postponed shipping date in the future.

**Postponed shipping.** An order can carry a "do not ship before" day, set by your storefront through the [Order create API](/order-create-api) or later through the API. Until that day, the order waits outside the queue; on that day it returns by itself, and the 30-day window counts from that day. The Overview tab shows how many orders are postponed and when the next one returns.

**Cash on delivery** is recognised when the payment method code contains `cod`, `dobirka` or `cash-on-delivery`, or when the order has a fee line labelled as cash on delivery. For such unpaid orders, the packing screen shows the amount to collect, and the label is created with the full order total as the cash-on-delivery amount.

## Product packing settings

The **Products** tab defines how each product is handled. Set these once per product:

| Setting | Values | Effect |
|---|---|---|
| **Type** | `Large (shelf)`, `Small (at the table)`, `Digital` | Large products are picked from the shelves. Small products lie at the packing table and are added to the parcel without picking. Digital products are not packed. |
| **Main** | on / off | Main products are listed first in the pick list and in each packing group. |
| **Location** | free text, for example `B-04` | Shown in the pick list so the picker knows where to go. |
| **Volume** | number | Estimates the box size. The total volume of the parcel up to 1.8 means box S, up to 3.4 box M, up to 5.5 box L, above that XL. |

Products without settings are marked **NEW, please check** and count as large shelf items. The Overview tab warns how many such products exist; filter them with **Unchecked only**.

## Overview

The **Overview** tab shows counters for **To pick**, **To pack**, **On hold** and **Packed today**, the total cash on delivery packed today, and a breakdown by carrier. It also warns about orders without a shipping method and about the oldest open order (in hours). Use **Start picking** or **Start packing** to go straight to the work.

## Picking

The **Picking** tab lists large items from all open orders, summed per product, with the location, number of pieces and number of orders. Main products come first.

- Mark a row as **Picked** when you have fetched all pieces. Every open line of that product is marked as picked.
- Use **Picked only** with a number of pieces when you could not fetch all of them. Whole lines of the oldest orders are taken first, so no order ends up half picked.
- Keyboard: `↑` `↓` select, `Space` picked, `Enter` done and continue to packing.

An order whose large items are all picked moves to the stage **To pack**. An order with only small or digital items skips picking.

## Packing

Click **Start full-screen packing**. The station shows one order at a time, inside a group of orders with the same shelf content and the same carrier. Groups that contain an order older than 24 hours come first, then groups are sorted by carrier, by size and by age.

For each order the screen shows the shelf items, the small items to **ADD FROM THE TABLE**, digital products, the suggested box size, the customer note, the pickup point and, in large letters, warnings such as **CASH ON DELIVERY** with the amount, **CAUTION: MORE PIECES** or the number of different items.

| Key | Action |
|---|---|
| `Enter` | Mark the order as packed and move to the next one. |
| `P` | Create (if missing) and print the label of this order. |
| `G` | Create and print the labels of the whole group. |
| `R` | Try again after a label error. |
| `S` | Skip the order for now. |
| `N` | Go to the next group. |
| `Shift+H` | Put the order on hold with a reason: `Goods missing`, `Damaged goods`, `Unclear address` or `Another problem`. |
| `Shift+Z` | Undo the last packing; the order returns to the queue. |
| `F` / `Esc` | Full screen / exit. |

With **Print labels automatically** switched on, the label of the order on screen is created and printed as soon as the order appears.

### How labels are created

The label is a shipment created through your carrier account (see [Shipments and carriers](/shipments-and-carriers)). The station takes the carrier account, service and pickup point from the order's [shipping method](/shipping-methods). If the order has no shipping method and the organisation has exactly one carrier account with a verified connection, that account is used. The parcel weight is the sum of item weights, or 1 kg when a product has no weight. An order never gets a second shipment: if one exists, its stored label is printed again.

When a group print partly fails, the failed orders are put on hold with the error as the reason, and the rest are printed.

An order without a shipment can only be packed after confirming **Pack without a label**. Use it for personal pickup or when the parcel is shipped another way.

> **Note.** To print without a print dialog, start Chrome with the `--kiosk-printing` option and set the label printer as the default printer. The label format (Thermo is recommended for label printers) is set on the carrier account.

## Orders

The **Orders** tab lists every order in the queue with its customer, shipping, items, stage and shipment. From the row you can **Put on hold**, **Return to queue** (release a held order), **Undo packing** or open the **Order detail**.

## What can go wrong

| Symptom | Cause | Fix |
|---|---|---|
| An order is missing from the queue. | Its status, payment or age does not meet the queue rules, or shipping is postponed. The order detail Fulfillment box says "The order is not in the fulfillment queue right now". | Move the order to an in-progress status, record the payment, or clear the postponement. |
| "Orders without a shipping method" on the Overview. | The storefront did not send the delivery method code with the order. | Create the label from the order detail, and update the storefront to send `deliveryCode` (see [Shipping methods](/shipping-methods)). |
| "Shipping method … has no carrier account with a verified connection." | The method has no ready carrier account. | Set **API account for shipments** on the shipping method and verify the account. |
| "Not every shelf item of the order is picked yet." | Packing was attempted before picking. | Pick the items, or use **Pick the whole order** in the order detail. |

## Related

- [Warehouse and stock](/warehouse-and-stock): stock is taken by the order, not by packing.
- [Shipping methods](/shipping-methods): what the customer chooses at checkout.
- [Shipments and carriers](/shipments-and-carriers): labels, tracking and carrier accounts.
- [Orders](/order-overview): statuses and the order detail.

---
id: "ldcO0Qx1NkhHHvTm"
category: "sales/order-workflow"
tags: ["type-concept"]
published_at: "2026-04-24T06:57:29.370Z"
---


Order Workflow
==============

## Overview

The order workflow describes how orders, subscriptions, reservations and service requests move through their lifecycle. Each organisation defines its own order statuses, sorts them into four fixed groups, and attaches automatic actions to individual statuses. Everything is edited in the administration and takes effect immediately.

## Key capabilities

- **Custom statuses.** Every group accepts any number of statuses, so the list matches your process.
- **Automatic actions per status.** A status can mark the order as paid, issue an invoice or a receipt, move the order on to another status, and notify the customer or your team.
- **Payment-driven moves.** A status can name the status an order switches to as soon as it is paid.
- **API access.** Your systems can read an order's status and change it through the public API.

The actions themselves are described in [Workflow automation](/workflow-automation).

## Workflow structure

Every workflow is composed of four *stage groups*. Groups are fixed; the states inside them are entirely yours.

### New — intake

Entry point for anything newly created — orders, subscriptions, reservations, service requests. This is the default group for a fresh record.

*Example states:* Order created · Subscription renewed · Reservation placed · Service requested.

### Processing — in progress

The broadest group. Everything between intake and a terminal state lives here: awaiting payment, packing, shipping, delays, transit incidents.

*Example states:* Awaiting payment · Packing · Shipping · Delayed · Lost in transit · Damaged.

### Cancelled — terminal

Final resting state for anything that will not be fulfilled. Records in this group are not billed or shipped and are excluded from operational KPIs (though they still count for cancellation rate reporting).

*Example states:* Payment timeout · Customer cancelled · Partial refund · Full refund · Out of stock.

### Completed — terminal

Final resting state for anything successfully delivered. These records feed revenue reporting and are eligible for post-sale actions such as satisfaction surveys or loyalty points.

*Example states:* Delivered · Service provided · Reservation fulfilled · Project completed.

## Automation

Automatic actions are set on each status, not on the transition between two statuses. When an order enters a status, the platform runs the actions configured for it, for example:

- **Awaiting payment**: when paid, switch to *Processing*.
- **Processing**: issue the invoice and e-mail it to the customer.
- **Shipped**: notify the customer.
- **Delivered**: after a delay, move the order on to *Completed*.

See [Workflow automation](/workflow-automation) for every available action, how they combine and their limits.

## Cancellation scenarios

### Customer-initiated

- Payment not received in time.
- Customer explicitly requested cancellation.
- Partial or full refund issued.

### Provider-initiated

- Items out of stock at fulfilment time.
- Delivery failed permanently after all retries.
- Technical or operational issues that make the order unfulfillable.

## Completion scenarios

The *Completed* group is the successful terminal state. Records here have been fulfilled and require no further action. Common success criteria:

- Product delivered to the customer.
- Service successfully provided.
- Customer confirmation received (where the workflow requires it).

## Working with the API

External systems read an order's current status from the order endpoints and change it with `POST /api/v1/shop/order/set-status`. The status change runs the same automatic actions as a change made in the administration. All order endpoints are listed in the [API explorer](/swagger).

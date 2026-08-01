---
id: "ldcO0Qx1NkhHHvTm"
category: "sales/order-workflow"
tags: []
published_at: "2026-04-24T06:57:29.370Z"
---


Order Workflow
==============

## Overview

The Workflow Engine lets an organisation model how orders, subscriptions, reservations and service requests move through their lifecycle. Instead of hard-coding "when payment arrives → send invoice → mark as processing" in application code, you describe the states, the allowed transitions between them, and the actions to fire on entry — all editable from the admin without a redeploy. It is the backbone of everything transactional in BizKitHub.

## Key capabilities

- **Visual state builder** — design a workflow visually; states, transitions, and side-effects live in one canvas.
- **Automated transitions** — rules move an order between states without operator intervention (e.g. payment received → processing).
- **Event-driven actions** — trigger e-mails, webhooks, and notifications on any state change.
- **Custom states** — every stage group accepts an unlimited number of custom states so you can match your process, not the platform's opinion of it.

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

## Intelligent automation

State changes are events. Every event can trigger one or more actions declared alongside the workflow definition. Actions run in order and can be conditional on the target state, the source state, or arbitrary record properties.

### Common triggers

- **Order delayed** → send an apology e-mail with an updated ETA.
- **Package lost** → alert the operations team and start the replacement flow.
- **Order completed** → send a feedback request and issue loyalty points.

### Example action definition

<pre><code>{
"trigger": "state_changed",
"conditions": { "new_state": "delayed" },
"actions": [
{ "type": "send_email", "template": "delay_notification", "to": "customer" },
{ "type": "webhook", "url": "https://api.example.com/notify" }
]
}</code></pre>

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

Every state transition is available through the public API — external systems can promote an order to the next state, subscribe to state-change events via webhooks, or read the current workflow definition for display. See the API reference for the exact endpoints under `/api/v1/order/*`.

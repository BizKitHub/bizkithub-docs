---
code: "workflow-automation"
category: "system"
tags: ["type-guide", "workflow", "orders", "automation"]
published_at: "2026-11-24T00:00:00.000Z"
---


Workflow automation
===================

The workflow editor is where you define the order statuses of your organisation and the automatic actions attached to each status. When an order enters a status, the platform can mark it as paid, issue an invoice or a receipt, send e-mails, and move the order on to another status, either immediately, after a delay, or as soon as it is paid.

This article is a practical guide to those automation rules. For the concepts behind the four status groups and the life of an order, read [Order workflow](/workflow-overview) first. For working with individual orders, see [Orders](/order-overview).

## Where to find it in the admin

Open **Workflow** in the main menu. It opens the **Workflow & groups** settings with two tabs:

- **Order groups** splits orders into groups such as "E-shop", "Reservations" or "Subscriptions". Each group has its own set of statuses and a few billing and notification options.
- **Workflow statuses** is the editor described in this article.

When you have more than one order group, the **Order group** selector above the editor limits the view to the statuses of one group. Choose **All groups** to see every status.

## How the editor is laid out

The editor shows four columns, one per status group: **New**, **Processing**, **Storno** and **Done**. Each column lists its statuses in order, with a number in front of each name. Small icons on a status card show which rules are active, such as "Mark order as paid", "Issue invoice for order" or the number of linked notifications. Hover over an icon to see its meaning.

Two positions have a special meaning:

- **First system state.** The first status in **New** is the status every new order starts in.
- **Default group state.** The first status in each group is the one the platform uses when it moves an order into that group for system reasons, for example when an order is cancelled and goes to **Storno**.

Use the arrows on a status card to move it up or down within its column. Every group must keep at least one status.

## Adding a status

1. Click **Add** at the bottom of the column where the status belongs.
2. Enter the **State name**, for example `Waiting for stock`. The **System state code** is generated from the name, for example `waiting-for-stock`.
3. Check **State type**, the group the status belongs to.
4. Pick a **Color**.
5. Click **Create new state**.

> **Note.** The system state code cannot be changed later. Notifications, integrations and the public API refer to the status by this code.

## Status settings

Click a status card to open its settings.

### Names

- **State name** is the general name, used whenever a more specific one is missing. You can change it at any time.
- **Internal state name** is what your team sees in the administration.
- **Public state name** is what your customer sees.

For example, a status can be called `Picking` internally and `We are preparing your order` publicly.

### Automatic actions on entry

These actions run every time an order enters the status:

| Setting | What happens |
|---|---|
| **Mark order as paid** | The order is marked as paid, unless it is paid already. |
| **Issue invoice for order** | An invoice is issued for the order. |
| **Issue receipt for order** | A simplified receipt is issued for the order. |

Rules that keep the tax documents correct:

- An order never gets two tax documents from one status. If both **Issue invoice for order** and **Issue receipt for order** are on, only the invoice is issued.
- If the order group has **Always full invoice** turned on, the group always gets an invoice instead of a receipt.
- Registration orders are marked as paid as usual, but no invoice or receipt is issued for them automatically.
- If generating the PDF of the invoice fails, the document is still created and the customer notification is still sent. You can regenerate the PDF later from the invoice detail. See [Invoices](/invoice-overview).

### Automatic redirect

**Automatic redirect** moves the order on to another status that you choose. **Delay redirection by time** sets when:

- Leave the delay empty or zero to move the order immediately after it enters the status. The actions of both statuses run, one after the other.
- Enter a delay such as `30m`, `2h`, `1d` or `1w` to move the order later. The delay counts from the last change of the order. The platform checks for due redirects regularly, so the move happens shortly after the delay ends.

Example: the status `Shipped` redirects to `Delivered` after `7d`. Seven days after the order was last changed, it moves to `Delivered` without anyone touching it.

### When paid, switch to

**When paid, switch to** moves the order to another status as soon as it is both in this status and paid. The order of events does not matter:

- If the payment arrives while the order is in the status, the order moves right after the payment is recorded.
- If the order enters the status already paid, it moves right after entering.

Example: the status `Waiting for payment` has **When paid, switch to** set to `Processing`. A customer who pays by bank transfer three days later is moved to `Processing` automatically when the payment is matched.

Choose **Do not switch** to turn the rule off.

### Notifications

Each status can send e-mails when an order enters it:

- **Related notifications** lists the e-mail templates linked to the status. Use **Add notification** to create one. The **Active?** column shows whether the link is on.
- **Email templates for this status** shows, for every language you have enabled, which template the platform will use. Click an existing template to edit it, or **create** to fill in a missing language.
- **Group notifications** lists templates that apply only to orders in a specific order group. Use **Add group notification** to create one.

Templates themselves are edited in the e-mailer. See [E-mailer](/emailer-overview).

## Group options that affect automation

Each order group, in the **Order groups** tab, has options that change how the status rules behave for orders in that group:

- **Always full invoice** replaces a receipt with a full invoice.
- **Use system default notifications** sends the platform's default e-mail copy instead of your templates.
- **Send only templates assigned to the group** sends nothing when the group has no template for the status. When it is off, a missing group template falls back to the general one.
- **Statuses in the group** decides which statuses orders in the group can use.

## Safety limit

To stop a misconfigured chain of redirects (for example `A` redirects to `B` and `B` back to `A`), the platform allows at most 10 status changes per order within one minute. Further changes are refused and the order log records an error. Fix the redirect settings, then move the order to the correct status by hand.

## Status changes from the public API

An integration can move an order to another status with `POST /api/v1/shop/order/set-status`. The same automatic actions, notifications and redirects run as when an operator changes the status in the administration.

```bash
curl -X POST "https://api.bizkithub.com/api/v1/shop/order/set-status?apiKey=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"orderId": "sSO98YxzR4KJiOu66Jn6K3wRwa4FPI7S", "statusCode": "paid"}'
```

`orderId` is the 32-character order hash and `statusCode` is the system state code of the target status. A successful call returns:

```json
{ "success": true }
```

See [API keys](/api-key-overview) for creating a key and the [API explorer](/swagger) for the full contract.

## Related articles

- [Order workflow](/workflow-overview) explains the four status groups.
- [Orders](/order-overview) covers working with individual orders.
- [Invoices](/invoice-overview) covers the documents issued by status rules.
- [E-mailer](/emailer-overview) covers e-mail templates.

---
code: "firewall"
category: "system"
tags: ["type-overview", "security", "firewall"]
published_at: "2026-11-24T00:00:00.000Z"
---


Firewall
========

The firewall protects the public entry points of your organisation (orders, customer sign-in and registration, and the contact form) against traffic you do not want. When it blocks an attempt, it records a **blocked attempt** with the reason, the time, the location of the visitor and the contact details they entered. The **Firewall** module in the administration shows these records, kept apart from real system errors so they do not hide genuine problems.

You influence the firewall in two places: the **IP Ban List**, where you block specific IP addresses, and the customer record, where you can ban a customer. Everything else runs automatically.

## Where to find it in the admin

- **Firewall** in the menu: statistics of blocked attempts. **Blocked attempts list** in the header opens the full list.
- **Settings → IP Ban List** (in the **Access & security** group): the addresses your organisation blocks.

Viewing blocked attempts requires the **Logs** permission. Root members always have it. See [Members, roles and permissions](/team).

## What the firewall blocks

| Situation | Where it applies |
|---|---|
| The visitor connects through the Tor network. | Orders, customer sign-in, customer registration, contact form |
| The visitor's IP address is on your **IP Ban List**. | Orders, customer sign-in and registration |
| The customer's e-mail belongs to a banned customer. | Orders |
| The order is placed into an order group that is inactive. | Orders |

Blocked orders and the Tor checks are recorded as blocked attempts. A sign-in or registration refused because of the **IP Ban List** is refused without a record in the firewall list.

A ban on a customer's e-mail also covers variants of the same address with a `+tag`, so `jana+shop@example.com` is blocked when `jana@example.com` is banned. Upper- and lower-case letters make no difference.

The visitor receives an error and the order, sign-in or message is not created. For orders placed through the API, the request fails and no order is stored.

## The dashboard

The **Firewall** page summarises blocked attempts:

- totals for the **Last 24 hours**, **Last 7 days** and **Last 30 days**,
- a breakdown **By type** with counts for each period,
- the **Top 10 countries (7 days)** the blocked attempts came from.

When nothing has been blocked, the page shows "No blocked attempts yet".

## The list of blocked attempts

Each row shows the **Time**, **Type**, **Category**, **Endpoint** (which entry point was hit, for example order creation), **Location** and **E-mail**. Filter by **Category** or **Type** to narrow the list, and **Clear filter** to reset it.

The categories group the types:

| Category | Meaning |
|---|---|
| **Network** | The connection itself was refused, for example Tor or a banned IP address. |
| **Identity** | The person was refused, for example a banned customer. |
| **Rate-limit** | Too many attempts in a short time. |
| **Content** | The submitted content was refused, for example a spam pattern. |
| **Fraud** | The request looks like an abuse of the order process. |

## Detail of a blocked attempt

Open **Detail** on a row to see:

- the **Reason**: a sentence explaining why the attempt was refused, including the IP address and location,
- the **Geolocation**: IP address, hostname, country and city,
- the **Attacker contact**: e-mail, phone and name the visitor entered,
- the raw context of the request.

The contact data helps you recognise repeat attempts and decide whether to ban an address. Treat it as security data: do not include it in standard customer exports.

## Banning an IP address

1. Open **Settings → IP Ban List**.
2. Enter the address in **Ban IP address**, for example `203.0.113.45` or an IPv6 address.
3. Optionally fill in the reason, for example "spam orders" or "repeated failed sign-ins". Only your team sees it.
4. Click **Ban**.

The list shows each address with its hostname, country and city at the time of banning, which often reveals a hosting provider or a proxy service. To lift a ban, remove the row and confirm.

The ban applies only to your organisation. Other organisations on BizKitHub are not affected.

## Examples

- **A wave of fake orders.** The dashboard shows 40 blocked attempts in 24 hours, all from one country, type Tor. No action is needed: the firewall already refused them.
- **One address keeps sending spam orders.** Open a real order from that address, note the IP, and add it to the **IP Ban List** with the reason "spam orders". Further orders from that address appear in the firewall list instead of your order list.
- **A customer cannot order.** A customer reports that checkout fails. Search the firewall list for their e-mail. If the reason says the customer has been banned, check the customer record; if it says the IP address is banned, review the ban list.

## Related

- [Security](/security-overview)
- [System logs](/log-overview)
- [Rate limiting](/rate-limiting-overview)
- [Members, roles and permissions](/team)
- [Error codes](/errors)

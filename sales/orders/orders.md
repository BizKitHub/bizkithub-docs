---
id: "ZwWBpTzSY9w2mHKG"
category: "sales/orders"
tags: []
published_at: "2026-04-24T06:57:28.032Z"
---


Orders
======

Orders are a central record of all business cases in the system. Each order represents a commitment between the organization and the customer – whether it's a classic e-shop purchase, a service reservation, a custom invoice, or a recurring subscription. The `/order` module provides a unified interface for tracking the order lifecycle from its creation through payment and dispatch to archiving, including all related documents, payments, and customer communication.

## Order Overview

The main page displays a list of all orders for the current organization. The table is designed so that the most important information for daily operation is visible at a glance — i.e., who ordered, what is happening, and how much money is involved. Individual columns indicate:

- **Order Number** — a unique identifier within the chosen group of orders; the numbering sequence is continuous and allows for convenient reference in communication with the customer.
- **Customer** — the name and email of the person or company that placed the order.
- **Payment Status** — a quick indicator of whether money has been received from the customer.
- **Status** — the processing status of the order (e.g., "New", "Dispatched", "Completed"). It can be changed directly in the table row, which immediately triggers any automatic actions (see below).
- **Price** — the total amount of the order, including VAT, shipping, and fees.
- **Date Created** and **Expiration Date** — when the order was created and by when payment is awaited.

The table automatically refreshes every 5 seconds to ensure the displayed data in the overview is as real-time as possible. Authorized users see summary statistics above the table, serving as a quick check of business performance.

## Filtering

There can be a large number of orders in the system, which is why the list is supplemented with a combination of filters. Filters work additively — each selected filter further narrows the selection. Selection is available by order group, processing status, payment status, and date range. Full-text search then allows finding a specific order by number, email, name, company name, or phone; the system ignores diacritics and case.

## Creating a New Order

An order is usually created automatically when a customer completes a purchase on the website. The **Create Order** button in the top right corner offers a second path — manually creating an order directly from the administration, known as POS mode. This mode is suitable for orders received by phone, email, or at a physical store. The form allows you to search for an existing customer from the contact database, or create a new one directly from the dialog. Any combination of items can be added to the order: a product from the catalog, a specific variant, an event from the calendar (typical for reservation systems), or a so-called virtual item with a manually entered name and price. Fields are available for discounts, shipping costs, and payment fees. If the customer has received a discount voucher, it can be applied before saving the order. Payment processing is chosen between standard payment via a gateway or deduction from the customer's credit. The last two fields — internal and public notes — serve to add context; the internal note is for colleagues, the public one is reflected in communication with the customer. A manually created order can be saved as a **draft (cart)** and completed later, or confirmed immediately. By default, the system does not send a confirmation email to the customer when an order is manually created — sending can be triggered manually in the order detail.

> 💡 **Tip:** Drafts are useful for orders that still need to be refined with the customer (e.g., agreeing on a delivery date). Once confirmed, the draft enters the same state as if the order had come through the standard website path.

## Order Lifecycle

An order in the system goes through a sequence of statuses that indicate what is currently happening with it. Each organization defines its own list of statuses, but all statuses belong to one of four **categories**, which are system-defined and cannot be changed. The category determines how the system processes the order (e.g., whether it counts it towards revenue or whether it can still be canceled).

- **New** — the order has just been created and is awaiting processing. This includes statuses like "New", "Awaiting Confirmation", or "To Be Processed".
- **In Progress** — the order is in an active flow. The customer is paying, goods are being packed, the service is being performed. Typical statuses are "Paid", "Dispatched", "Ready for Pickup".
- **Completed** — the order has been successfully closed. Goods arrived, service performed, money is in order.
- **Canceled** — the order has been canceled. Whether at the customer's request, due to non-payment, or administrative decision.

Transitions between specific statuses are managed by the **Workflow** module. It allows defining rules such as "after payment, automatically move the order to Paid status" or "if the customer does not pay within 7 days, move the order to Expired status". The status can also be changed manually by clicking on the Status column in the table or in the order detail.

> ⚠️ **Warning:** Rapid, repeated status changes are blocked. If the status of the same order changes more than ten times within a minute, the system will reject further changes. This is protection against looping caused by a poorly configured workflow rule.

## Automatic Actions on Status Change

Each status can be assigned one or more automatic actions that are triggered when the order enters that status — regardless of whether the transition occurred manually, from the website, or by another rule. This logic is precisely what distinguishes orders from a simple list: the system performs routine tasks on behalf of the administrator and only proceeds to situations requiring human decision. Available actions include marking an order as paid, generating a tax document of type invoice or a simplified document of type receipt, automatically transitioning to a target status after a specified time (delayed redirection, e.g., "after 2 hours in waiting, move to Expired"), and sending an email to the customer according to a template linked to the status. Actions can be configured differently for individual order groups, so a reservation system behaves differently from a classic e-shop, even when running under the same organization.

## Order Groups

An order group is a logical container that groups orders of a single activity type. Typical divisions include, for example, "E-shop", "Reservations", and "Subscriptions". Groups exist because, in practice, a single universal order flow typically doesn't work — reservations require different statuses and notifications than product sales. Each group has its own numbering series (so an e-shop order has a different prefix than a reservation), its own list of allowed statuses, its own set of email templates, its own due date, and its own invoicing entity, which is listed as the document issuer. When creating an order, the group must be selected, and this choice cannot be changed; thus, the order remains in its group throughout its lifecycle.

> ℹ️ **Information:** If you operate multiple projects under one organization, order groups allow you to separate workflows and numbering series without having to create a new organization. Invoices can be issued under a single entity or different ones — depending on the invoicing entity's configuration for each group.

## Order Detail

Clicking on a row opens the order detail, which is divided into tabs according to what is relevant to the user at that moment. The **Overview** tab gathers everything necessary for processing: items with prices, customer details, delivery and billing addresses, notes, and a link to online payment. The **Files** tab contains attachments and documents — invoices, delivery notes, confirmations, which are either automatically generated by the system or uploaded manually. The **Payments** tab displays all online payments and bank transactions associated with the order, making the entire financial flow visible. **Recurring Payments** is a tab that applies to subscriptions and schedules (see below). **Email Notifications** show the history of all messages sent to the customer, including whether they were delivered and opened. The **Log** is then a timeline of all events: every status change, payment, or automatic action is recorded here along with its severity level (info, success, warning, error), which facilitates tracing why the order reached a specific status. Order items can be freely added, edited, or removed in the detail; individual items can also be canceled without affecting the rest of the order. After each change, the total price is automatically recalculated to ensure the totals reflect the actual situation.

> 💡 **Tip:** The order log can be extensive in complex cases. The **Explain** button passes the log content to an AI assistant, which generates a coherent description of what happened with the order in the administration language — suitable for a quick summary during a complaint.

## Order Cancellation

Cancellation is a process that revokes an order or part of it while also dealing with financial settlement. The system distinguishes between full cancellation (the entire order) and partial cancellation (individual items). Canceled items are not included in the order price or sales statistics but remain visible in the order as a historical record. The method of refunding money depends on the organization's configuration. The default setting is **credit** — the amount for canceled items is credited to the customer as internal credit, which they can use for future orders. The second option is **cash or bank transfer**, where the system automatically issues a credit note (tax document) and records the refund request; the actual money transfer is handled by the operator outside the system. The third option, **no refund**, is intended for situations where the terms imply that the customer is not entitled to a refund (e.g., cancellation after the withdrawal period for non-refundable services).

> ⚠️ **Warning:** Cancellation can also be performed for unpaid orders — in such cases, only already used credits are refunded. Furthermore, a full cancellation immediately expires the entire order, so any outstanding balance cannot be completed by the customer.

## Recurring Payments (Subscriptions)

For orders representing regular payments (subscriptions, installment plans, memberships), a schedule of recurring payments can be set. The schedule defines when and how much is to be charged — the system then automatically initiates the charge through the payment gateway on the specified dates, if the gateway supports recurring payments. For each schedule item, the amount (the first and last payments can have different values, which is useful for, e.g., a discounted initial payment), cycle (daily, weekly, monthly, or annual), and period within the cycle (e.g., "every 2 months") are entered. The end of the schedule is determined either by a fixed number of repetitions (e.g., 12 monthly payments) or a fixed date for the last charge. Individual planned payments can be edited or deleted before they occur — typically when a customer requests a change in the payment amount. Each successful charge creates a separate **sub-order**, which represents the specific paid period and can be managed like a regular order (including invoice issuance).

## Payments

Order payment can occur through several methods, which can also be combined within a single order. **Online payment** uses a payment gateway configured in the order group (e.g., Stripe, GoPay, Comgate); the administration generates a payment link that the customer receives via email or in the order detail. **Bank transfer** is automatically paired — when a bank transaction with a matching variable symbol arrives in the system, the order is marked as paid, and the corresponding automatic actions are triggered. An order can be paid immediately with **customer credit** if the customer has a sufficient balance in the system. The last option is **manual marking**, where the administrator declares the order as paid (e.g., after a cash payment); this marking can also be reverted if an error occurs.

## Statistics

At the top of the page, authorized users see a compact summary of business performance for the last 30 days. The summary includes the total number of orders, an overview of the **Top 5 customers** by volume (only paid orders from actual contacts, not test accounts, are counted), and **revenue** broken down by currency. Only orders in "In Progress" and "Completed" statuses are included in revenue, so unpaid or canceled orders do not distort statistics. If a filter for a specific order group is selected in the top bar, the summary is recalculated only for the selected group — this allows comparing e-shop performance against reservations without leaving the page.

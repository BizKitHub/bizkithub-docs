---
code: "reports"
category: "system"
tags: ["type-overview", "reports", "analytics"]
published_at: "2026-11-24T00:00:00.000Z"
---


Reports
=======

The **Reports** page is a dashboard of ready-made cards that answer the recurring questions of running a business: how much you earned, who owes you money, where orders get stuck, and whether customers come back. Every card computes its figures from the data already in your organisation (orders, invoices, bank payments, subscriptions, bookings and e-mails), so there is nothing to configure.

Cards appear only when there is data behind them. A new organisation sees the message "Nothing to show on the dashboard yet" until it has collected enough orders, invoices or bookings. Cards with financial figures are shown only to members with the Root permission.

## Where to find it in the admin

Open **Reports** in the menu. Every card has a help icon that explains how the figure is calculated. The **Board** button in the header returns you to the start page.

For report tables you can filter, sort and share by link, see [Analytics](/analytics-overview). Reports is the visual dashboard; Analytics holds the detailed tables.

## Who sees which card

Cards are split into two groups:

- **Operational cards** are visible to every member who opens the page: **Order Funnel**, **Payment Success Rate**, **Calendar Utilization** and **Email Statistics**.
- **Financial cards** show revenue, unpaid amounts or customer value. They are shown only to members with **Root**. All other cards in the list below are financial.

To let a colleague see the financial cards, they need Root. Because Root grants unrestricted access to everything, consider whether the colleague can work from the [Analytics](/analytics-overview) module instead. See [Members, roles and permissions](/team).

## The cards

The default order follows business priority: money first, then risk, conversion, retention and operations.

### Revenue and money

- **Daily Revenue**: revenue from paid orders per day for the last 30 days, compared with the previous period of the same length, with the percentage change.
- **Cash Flow**: invoiced amounts compared with money actually received, with the gap and the collection rate. Invoices are not cash in hand; this card shows the difference.
- **Monthly Recurring Revenue (MRR)**: the sum of active subscription prices, with active, new and churned subscriptions and the churn rate.

### Money at risk

- **Unpaid Orders**: orders waiting for payment, split into those expiring within 24 hours and within 7 days, with the total value at risk and the age of the oldest unpaid order.
- **Overdue Invoices**: invoices past their due date in aging buckets of 1–7, 8–30, 31–60 and 61+ days, with the top debtors. A debtor whose oldest invoice is more than 30 days overdue is highlighted in red.
- **Unmatched Payments**: bank transactions not matched to any order, grouped into today, this week, this month and older, with the sender and variable symbol to help you match them by hand.

### Conversion and sales

- **Order Funnel**: conversion at each step from carts created to orders created, paid and completed, so you see where customers drop out.
- **Payment Success Rate**: successful, failed and pending payments per payment gateway. A sudden drop for one gateway points to a gateway problem before it costs revenue.
- **Orders by Status**: count and value of orders in each status, which shows bottlenecks in order processing.
- **Top Selling Products**: products ranked by revenue, with quantity sold and share of revenue. The top three carry medals.
- **Brand Performance**: revenue and units sold per brand.
- **Average Order Value**: revenue divided by the number of paid orders, per month.

### Customer retention

- **Revenue Retention (YoY)**: how much of last year's revenue from existing customers continues this year. It groups customers into bands from **Growing** (100 % or more) to **Lost** (0 %), shows net and gross retention and an organisation stability score, and warns when retention drops below 70 %. The current, unfinished year is compared with the same-length window of the previous year. The card needs at least two years of paid orders and counts only orders in your primary currency.
- **Upcoming Renewals**: subscriptions due for renewal soon, so you can contact customers before they cancel.
- **Inactive Customers**: customers who have not ordered recently, with their past spend; a list to start a reactivation campaign from.
- **New vs. Returning Customers**: the share of first-time and repeat customers.

### Operations

- **Payment Methods**: which payment methods customers choose and how each gateway performs.
- **Voucher Performance**: voucher usage, total discount, revenue with vouchers and the top vouchers.
- **Calendar Utilization**: booked hours against available hours per calendar for the coming period, with the cancellation rate.
- **Cancelled Events**: cancellations by calendar and day of the week, lost revenue, and late cancellations without a refund by week.
- **Email Statistics**: delivery and open rates of transactional e-mails (invoices, notifications, password resets) by type, with recent failures. This is a health indicator of your e-mail sending, not a marketing statistic.

## Rearranging cards

Drag a card to move it. The new order lasts until you leave or reload the page; the next visit starts with the default order again.

## When a card is missing

| What you see | Why |
|---|---|
| A card you expect is not on the page | It has no data yet, for example **Monthly Recurring Revenue (MRR)** without any subscriptions or **Calendar Utilization** without calendars. |
| Only four cards are visible | You do not hold Root, so financial cards are hidden. |
| **Revenue Retention (YoY)** shows a notice instead of figures | The organisation has less than two years of paid-order history. |
| Revenue figures look lower than expected | Retention counts only the organisation's primary currency; orders in other currencies are left out and the card says so. |

## Related

- [Analytics](/analytics-overview)
- [Members, roles and permissions](/team)
- [Usage and plan limits](/usage)

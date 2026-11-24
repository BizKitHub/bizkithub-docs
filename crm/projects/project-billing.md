---
code: "project-billing"
category: "crm"
tags: ["type-reference", "projects", "time-tracking", "invoices"]
published_at: "2026-11-24T00:00:00.000Z"
---


Project rates and invoicing billable time
=========================================

A **project rate** says how much an hour of work on a project costs you and how much you charge for it. When someone logs time against the project, the platform copies the rate that applies on that day onto the time entry. When you issue an invoice from logged time, the invoice uses those copied rates, so every hour is billed at the price that was valid when the work happened.

This article is a reference for rate fields, billing modes and rounding, followed by the steps for issuing an invoice from logged time. For projects in general, see [Projects](/projects). For logging time, see [Time tracking](/time-tracking).

## Rate periods

Each rate has a validity period. A project can have any number of rates, but their periods must not overlap. On any given day, at most one rate applies to a project.

- **Valid from** is the first day the rate applies.
- **Valid to** is optional. Leave it empty for a rate with no end date (shown as `open-ended`). When you fill it in, the rate applies up to the day **before** this date, and the date must be later than **Valid from**.

To change the price from 1 July 2026, end the current rate first and then add the new one:

| Rate | Valid from | Valid to | Billing / h |
|---|---|---|---|
| Old rate | 2026-01-01 | 2026-07-01 | 750 CZK |
| New rate | 2026-07-01 | (empty) | 850 CZK |

Work logged on 30 June uses 750 CZK; work logged on 1 July uses 850 CZK. If the periods overlap, the platform refuses to save the new rate.

The rate that covers today is marked `Active` in the **Rates** section of the project detail.

## Rate fields

You add a rate in the project detail with **Add rate**. The form has these fields:

| Field | Meaning | Default |
|---|---|---|
| **Valid from** | First day the rate applies. Required. | Today |
| **Valid to (optional)** | Day the rate stops applying. Empty means no end. | Empty |
| **Billing mode** | How the project is billed. See below. | Time & Materials |
| **Cost rate / h (in hellers)** | What an hour costs you. Used to calculate the margin. | 0 |
| **Billing rate / h (in hellers)** | What you charge the client per hour. | 0 |
| **Fixed price (in hellers)** | Total contract value, only for the Fixed price mode. | 0 |
| **Currency** | Three-letter ISO code, for example `CZK` or `EUR`. | `CZK` |
| **Rounding (min)** | Rounding step for billed time, from 1 to 240 minutes. | 15 |
| **Rounding method** | `To the nearest` or `Always up`. | To the nearest |

Amounts are entered in the smallest unit of the currency (hundredths). For example, `75000` means 750.00 CZK per hour and `30000` means 300.00 CZK per hour.

> **Note.** Invoices from logged time are issued in your organisation's default currency, and the amounts are taken from the rate without conversion. Use the same currency for project rates as your default currency.

## Billing modes

| Mode | What it means | Can you invoice the hours? |
|---|---|---|
| **Time & Materials (hourly rate)** | The client pays for every hour at the billing rate. | Yes |
| **Fixed price (time is tracked but not billed hourly)** | The client pays an agreed total. Time is logged to measure cost and margin. | No |
| **Retainer** | A recurring arrangement. Logged time is invoiced the same way as Time & Materials. | Yes |
| **Non-billable** | Internal work. Time is logged for reporting only. | No |

The mode that counts is the one on the rate that applies on the last day of the invoiced period.

## How rates are copied onto time entries

When a time entry is linked to a project, the platform looks up the rate that covers the entry's day and copies the cost rate, billing rate and currency onto the entry. This copy does not change later:

- Editing or deleting a rate does not change entries that were already logged.
- Adding a rate later does not price entries that were logged while no rate applied. Those entries show in the project detail as hours "without a rate", and the platform refuses to invoice them.

Add the rate **before** the team starts logging time on a new project. If time was logged first, delete those entries and log them again after the rate exists.

## Rounding

Rounding applies when you issue the invoice, to the **total** of each invoice item, not to each entry separately. This avoids inflating the bill with many small round-ups.

Example: in May, the team logged four entries of 20, 25, 22 and 30 minutes (97 minutes in total) with a rounding step of 15 minutes.

- With **To the nearest**, 97 minutes are billed as 90 minutes (1.50 h).
- With **Always up**, 97 minutes are billed as 105 minutes (1.75 h).

If you choose one item per day, each day's total is rounded on its own.

## Issuing an invoice from logged time

### What you need before you start

- The project has billable time that is not on any invoice yet. When it has none, the **Issue invoice** button is disabled with "The project has no uninvoiced time."
- Every entry in the period has a billing rate.
- All entries in the period use the same currency.
- The client exists as a contact in your CRM. See [Contacts](/contact-overview).

### Steps

1. Open the project detail and go to the **Billing** section.
2. Click **Issue invoice**.
3. Set **From** and **To**. Both dates are inclusive. By default, the period runs from the first day of the current month to today.
4. Under **Customer**, click **Select contact** and pick the contact you are invoicing.
5. Under **Invoice items**, choose **One summary item** or **One item per day**.
6. Optionally fill in **Text for the client**, for example `CRM development, May 2026`. The text is printed on the invoice.
7. Click **Issue invoice**.

The confirmation shows the invoice number and the amount excluding VAT, for example "Number 2026-0042 · 63,750 CZK excl. VAT".

### What the invoice contains

- **Items.** With one summary item, the invoice has a single line such as `Billable time 2026-05-01 — 2026-05-31: 85.00 h`. With one item per day, each line shows the date and the hours, for example `2026-05-04: 6.50 h`. The unit price is the hourly billing rate.
- **VAT.** 21 % when your organisation is a VAT payer, otherwise 0 %.
- **Dates.** Issued today, due in 14 days, payable by bank transfer.
- **Status.** The invoice starts as `Open`. Generate its PDF and send it from the invoice detail, as described in [Invoices](/invoice-overview).

Only entries that are billable, not written off, linked to the project and dated within the period are included. Every included entry is marked as invoiced and its status changes to `Invoiced` in the time entry list.

### Verifying it worked

- The **To invoice** figure on the project detail drops by the invoiced amount.
- In **Time tracker**, filter **Billing** to `Invoiced` to see the entries that went onto the invoice.
- The invoice appears in **Documents** on the **Issued** tab.

If two people issue an invoice for the same project at the same moment, each hour is still billed only once.

### What can go wrong

| Message or symptom | Cause | Fix |
|---|---|---|
| "Project is on a fixed-price contract" | The rate on the last day of the period uses the Fixed price mode. | Fixed-price projects are not invoiced by the hour. Issue a regular invoice for the agreed price. |
| "Project is marked as non-billable" | The rate uses the Non-billable mode. | Change the mode only if the work really should be billed. |
| "No billable, unbilled time entries match the given range" | Nothing billable and uninvoiced falls within the dates. | Widen the period or check the entries in **Time tracker**. |
| An entry "has no billing-rate snapshot" | Time was logged while no rate applied. | Add a rate, then delete and re-log the affected entries. |
| "Entries span multiple currencies" | Rates in the period use different currencies. | Narrow the period so it covers one currency, or issue two invoices. |

## Editing invoiced time

Once an entry is on an invoice, it cannot be edited or deleted. The same applies to entries in a locked accounting period. This keeps the invoice and the logged time consistent.

## Related articles

- [Projects](/projects)
- [Time tracking](/time-tracking)
- [Invoices](/invoice-overview)

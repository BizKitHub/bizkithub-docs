---
code: "time-tracking"
category: "crm"
tags: ["type-guide", "time-tracking", "projects"]
published_at: "2026-11-24T00:00:00.000Z"
---


Time tracking
=============

The **Time tracker** records how long you and your team work. You can measure work live with a stopwatch, or log time after the fact as a manual entry with a day, a duration and a project. Entries linked to a project become billable work that you can later turn into an invoice.

Use the stopwatch for quick, ad-hoc measurement of what you are doing right now. Use manual entries when the time should be billed to a client, because only entries linked to a project can be invoiced.

## Where to find it in the admin

Open **Time tracker** in the main menu. The page has three parts: the stopwatch at the top, the **Log time** button for manual entries, and the list of entries below.

## Measuring time with the stopwatch

1. Optionally type a short note about what you are working on into the note field.
2. Click the start button (or press `Enter` in the note field). The stopwatch shows the elapsed time and the note, and keeps running even if you close the page.
3. Click the stop button when you finish.

How the stopwatch behaves:

- **One stopwatch per person.** Each member has at most one running measurement in an organisation. If you start the stopwatch while a measurement is already running (for example in another browser tab), the platform stops the running one first and then starts a new one.
- **Server time counts.** The duration is calculated by the platform from the start and stop moments, so a wrong clock on your computer does not affect the result.
- **Coming back.** When you reopen the page while a measurement runs, the stopwatch picks it up and continues counting from the original start.
- **Day of the entry.** A stopped measurement is booked to the day it started.

Stopwatch entries are not linked to a project. Use them for your own overview of where the time goes. To bill time to a client, log it as a manual entry with a project.

## Logging time manually

1. Click **Log time**. The **Manual time entry** form opens.
2. Set **Day**, the date the work belongs to. It defaults to today.
3. Enter **Minutes**, for example `90` for one and a half hours. It defaults to `60`. One entry is at least 1 minute and at most 24 hours. Split longer work across several days.
4. Pick a **Project**, or leave "no project" for work that does not belong to one.
5. Fill in **Client description**, the text meant for the client, for example `Checkout page redesign`.
6. Optionally fill in **Internal note**, visible only to your team.
7. Leave **Billable** on for work the client pays for. Turn it off for internal work that should not be invoiced.
8. Click **Log time**.

When you pick a project, the platform looks up the project rate valid on the chosen day and stores it with the entry. If the project has no rate for that day, the entry is logged without a price and cannot be invoiced. Set rates up first, as described in [Project rates and invoicing billable time](/project-billing).

## The entry list

Below the stopwatch, switch between your own entries and the entries of the whole organisation. The list has these columns:

- **Date**, the day the work is booked to.
- **Who**, the member who did the work.
- **Project**, the project key and name, or "no project".
- **Client description / note**, the client description, or the internal note when the entry has no client description.
- **Duration**, the length of the entry.
- **Rate**, the billing rate copied onto the entry.
- **Status**, one of the values below.

| Status | Meaning |
|---|---|
| `To invoice` | Billable work that is not on any invoice yet. |
| `Invoiced` | The entry is part of an issued invoice. |
| `Written off` | Billable work you decided not to charge. |
| `Internal` | Work marked as not billable. |

The summary above the list shows the number of entries and their total duration.

### Filtering

- **From** and **To** limit the list to a date range.
- **Billing** shows only `Waiting to invoice (WIP)` entries or only `Invoiced` entries.
- **Billable** shows only billable or only non-billable entries.

For example, to check what is left to bill for May, set **From** to `2026-05-01`, **To** to `2026-05-31` and **Billing** to `Waiting to invoice (WIP)`.

## Deleting an entry

Click the delete icon on the row and confirm. You cannot delete an entry that is already on an invoice, or an entry in a locked accounting period. The platform refuses with "Entry is invoiced; reverse the invoice before deleting." or a message about the locked period.

To correct an entry that is not invoiced yet, delete it and log it again with the right values.

## Turning time into an invoice

Billable time linked to a project appears on the project detail under **To invoice**. From there, the **Issue invoice** button creates an invoice for a chosen period. The steps, rounding rules and error messages are in [Project rates and invoicing billable time](/project-billing).

## Related articles

- [Projects](/projects)
- [Project rates and invoicing billable time](/project-billing)
- [Invoices](/invoice-overview)

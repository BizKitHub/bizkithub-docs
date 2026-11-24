---
code: "projects"
category: "crm"
tags: ["type-overview", "projects", "time-tracking"]
published_at: "2026-11-24T00:00:00.000Z"
---


Projects
========

A **project** groups the work you do for one client or one product: the requests your team handles, the time it logs and the hourly rates you bill. Each project has its own key, which prefixes the numbers of its requests, so a request numbered `WEB-42` belongs to the project with the key `WEB`.

Use projects when you sell services by the hour, run support for several clients, or simply want to see how much work sits behind each client. The project detail shows open requests, uninvoiced time and the current rate on one screen, and lets you issue an invoice from logged time in a few clicks.

## When you would use it

- An agency builds a website for a client and bills the hours at the end of each month.
- A support team keeps one project per customer and wants requests that wait for a customer reply to close on their own.
- A consultant tracks time on a fixed-price contract to see the real margin, without billing the hours.
- A product team groups internal requests and logs internal time that is never invoiced.

## How it fits with the rest of the platform

- **Requests.** Every request (ticket) can belong to a project. The project detail counts open requests and links to the filtered request list. See [Tickets](/issue-overview).
- **Time tracking.** Time entries logged against a project become the project's billable work. See [Time tracking](/time-tracking).
- **Rates and invoicing.** Rates set on the project price the logged time, and the project detail issues the invoice. See [Project rates and invoicing billable time](/project-billing).
- **Invoices.** An invoice issued from logged time is a regular issued invoice, so it appears with all other documents. See [Invoices](/invoice-overview).
- **Contacts.** The invoice recipient is a contact from your CRM. See [Contacts](/contact-overview).

## Where to find it in the admin

Open **Projects** in the main menu. The list shows every project in your organisation. Click a project name to open its detail.

## The project list

The list has one row per project with these columns:

- **Project** shows the key and the name.
- **Manager** shows the member responsible for the project.
- **Open requests** shows the number of open requests "of" the total, for example `3 of 41`. Click it to open the request list filtered to the project.
- **Rate** shows `Active` when a rate covers today, or `No rate`.
- **To invoice** shows billable time that is not on any invoice yet.
- **Last activity** shows when the project last changed, or `No activity`.

When you have no projects yet, the list shows "You have no projects yet." with a button to create the first one.

## Creating a project

1. Click **New project**.
2. Enter the **Project name**, for example `Website for client XY`. The name is the only required field.
3. Optionally add a **Short description**. It helps you find your way around the list.
4. Optionally set the **Project key**, a short prefix used in request numbers such as `WEB`. If you leave it empty, the platform derives the key from the name.
5. Optionally set the **URL slug**. If you leave it empty, the platform derives it from the name.
6. Click **Create project**.

> **Note.** Choose the key with care. Once the project exists, the key cannot be changed, because it is part of the numbers of existing requests.

## The project detail

The top of the detail shows four figures:

- **Open requests**, with the number of unassigned requests and the total.
- **To invoice**, the value of billable time that is not on an invoice yet. When some of that time has no rate, the figure shows how many hours are "without a rate". When there is no such time, it shows "No uninvoiced time".
- **Current rate**, the billing rate per hour and the date it is valid from. When the project has no rate, the detail warns that time cannot be invoiced without one.
- **Manager**, the person responsible for the project.

Below the figures, the detail has these sections:

- **About the project** lists the key, slug, priority, creation date, start, end and due dates, and the budget.
- **Requests** lists the project's requests. Use **Open in requests** to work with them in the full request list.
- **Billing** shows billable time that is not on any invoice yet, with the **Issue invoice** button.
- **Rates** lists the rate periods of the project, with the **Add rate** button.
- **Settings** holds the automatic closing of waiting requests.

The **Copy link** action copies a direct link to the detail, so you can share it with a colleague.

## Editing dates and budget

Click **Edit** on the project detail to change the name, description, slug and the **Dates and budget** section:

- **Start**, **Due** and **End** are plain dates for planning.
- **Budget** is free text, for example `120,000 CZK` or `40 h per month`. The platform does not calculate with it; it is a reference for the team.

## Automatic closing of waiting requests

In support work, a request often waits for a reply from the client, and no reply means the matter is resolved. The **Automatic closing** setting closes such requests for you.

1. Open the project detail and go to **Settings**.
2. In **Close after (days)**, enter a whole number between `1` and `365`. Enter `0` to switch the feature off (this is the default).
3. Click **Save**.

The platform then checks the project's requests regularly. A request whose status belongs to the "Waiting" category and that has not been updated for the set number of days is switched to "Done". The age is counted from the last update of the request, or from its creation if it was never updated. Each automatic close is recorded in the activity history of the request.

For example, with the value `14`, a request that moved to "Waiting for customer" on 1 March and received no update is closed on 15 March.

> **Note.** The reporter of the request does not receive any message when the request is closed automatically.

## Deleting a project

Click **Delete project** and confirm. A project can be deleted only while it has no requests and no time entries. If it has any, the platform refuses with "The project has requests or time entries, so it cannot be deleted." Deleting cannot be undone.

## Related articles

- [Time tracking](/time-tracking) explains the stopwatch, manual entries and the entry list.
- [Project rates and invoicing billable time](/project-billing) explains billing modes, rounding and how to issue an invoice from logged time.
- [Tickets](/issue-overview) covers requests in depth.
- [Invoices](/invoice-overview) covers issued invoices, payments and exports.

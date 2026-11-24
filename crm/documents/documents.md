---
code: "documents"
category: "crm"
tags: ["type-overview", "documents", "invoices", "received-invoices"]
published_at: "2026-11-24T00:00:00.000Z"
---


Documents and the document inbox
================================

**Documents** is the single place for the accounting documents of your organisation: the invoices and receipts you issue, and the invoices you receive from suppliers. It shows what customers owe you and what you owe suppliers, and it has an inbox where you drop supplier invoices as PDFs or photos. The platform recognises each uploaded file, reads its data, and lets you turn it into a received invoice after a check.

Issued invoices are described in detail in [Invoices](/invoice-overview). This article covers the overview, received invoices and the document inbox.

## Where to find it in the admin

Open **Documents** in the main menu. The page has these tabs:

- **Overview** sums up receivables, payables and what is due this week.
- **Issued** lists invoices, receipts and other documents you issued. See [Invoices](/invoice-overview).
- **Received** lists supplier invoices and the document inbox.
- **Analytics** shows charts of issued invoices by issuer and month.

The **Export** action in the page header exports issued invoices, as described in [Invoices](/invoice-overview).

## Overview

The **Overview** tab answers "where do we stand this month?" at a glance:

- **Issued this month** and **Received this month** show the totals and the number of documents for the current month.
- **Receivables** (what customers owe you) and **Payables** (what you owe suppliers) show the unpaid total and how much of it is overdue. Both are split by age: `Not due yet`, `1–30 days overdue`, `31–60 days overdue`, `61–90 days overdue` and `Over 90 days overdue`.
- **Coming in (7 days)** and **To pay (7 days)** list documents that fall due in the next seven days. Click a document to open it.

When something needs attention, a strip of alerts appears at the top, for example "3 documents awaiting classification", "2 documents failed to classify", "5 unpaid invoices overdue" or "2 overdue payables". Each alert links to the tab where you can act on it.

## Received invoices

The **Received** tab lists invoices from your suppliers. Above the list, a summary shows the number and total of overdue invoices, your costs for the year so far, and the number and total of invoices in the `Draft`, `Received` and `Booked` statuses.

Each row shows:

- **Number**, your own sequence number for the received invoice, for example `P20260014`. It is assigned when the invoice is created and restarts every year.
- **Vendor no.**, the number the supplier printed on its invoice. Use it when you contact the supplier.
- **Vendor**, the company name, or the first and last name of a person, taken from the linked contact.
- **Issue date**, **Tax point** and **Due date** from the supplier's document. The tax point decides the VAT period.
- **Total** including VAT in the invoice currency. For a foreign currency, an indicative amount in CZK is shown below it, converted at the rate valid on the tax point.
- **Status**, see below.

Badges mark special cases: `RC` for reverse charge, `Credit note` for a negative invoice that reduces an earlier one, and `AI` for an invoice whose data was read automatically from an uploaded file.

## Statuses of a received invoice

| Status | Meaning |
|---|---|
| `Draft` | The invoice is being prepared or checked. New invoices start here. |
| `Received` | The invoice has been accepted for processing. |
| `Booked` | The invoice has been entered in accounting. |
| `Paid` | The invoice has been paid. |
| `Cancelled` | The invoice is void. |

The detail of a received invoice offers one button for the next natural step: **Mark as received** for a draft, **Book** for a received invoice, and **Mark as paid** for a booked one. **Cancel** is available in every status except `Cancelled`.

A paid or booked invoice is closed for normal changes. To correct it, use **Force-edit**, which returns it to `Booked`. The platform asks for confirmation and records the change in the audit log, so an accountant can see who reopened the invoice and when.

The detail also lists the items of the invoice (description, quantity, unit price, VAT rate, net, VAT and total) and a **History** of status changes.

## The document inbox

The inbox turns supplier documents into received invoices with minimal typing.

### Uploading documents

1. Open **Documents**, tab **Received**.
2. Drop files onto **Upload documents**, or click it to pick files.

Each file appears in the list with the status `Queued` and the toast "Document added to the queue." If you upload the same file again (identical content), it is skipped with "This file is already in the queue. Skipped."

The platform can read PDF files and JPEG, PNG and WebP images. Other formats end with a classification error.

### Classification and data extraction

The platform processes queued documents in the background, every five minutes. For each file it:

1. Decides what kind of document it is.
2. Reads the data from it. For invoices, this means the supplier, the numbers, the dates, the items, VAT and the bank details.

The status moves from `Queued` through `Classifying…` to `Classified`, or to `Classification error` when the file cannot be read.

The platform recognises these document types: received invoice, issued invoice, received cash receipt, issued cash receipt, contract, employment contract, VAT control statement, tax return, taxpayer discount request, statement or overview, and other.

### Checking and creating the invoice

1. Click a document in the list. The **Uploaded document detail** opens.
2. Look at **Classification**: the detected type and the **Confidence** of the result.
3. Compare the file in the preview with **Extracted data (JSON)**. You can correct any value directly in the JSON, for example a wrong due date. The JSON must stay valid, otherwise the platform rejects it with "The extracted JSON is not valid. Check the syntax."
4. Click **Create invoice**.

The platform creates a received invoice in the `Draft` status, attaches the original file to it, and confirms with "Invoice P20260015 was created." The document then leaves the inbox. Continue with **Mark as received** and **Book** on the new invoice.

**Create invoice** is available only for documents classified as a received or an issued invoice. Other types, such as contracts or tax forms, stay in the inbox with their extracted summary for reference.

### Fixing a wrong result

- **Retry classification** sends the document back to the queue, for example after a classification error.
- **Dismiss** hides a document you do not want to process, such as a marketing leaflet. Dismissed documents leave the list.

## Related articles

- [Invoices](/invoice-overview) covers issued invoices, payment matching and exports.
- [Contacts](/contact-overview) covers the supplier and customer records linked to documents.
- [Projects](/projects) and [Project rates and invoicing billable time](/project-billing) cover invoices issued from logged time.

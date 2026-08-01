---
id: "UiS3wbwvy7V04z3w"
category: "finance/invoices"
tags: []
published_at: "2026-04-24T06:57:26.796Z"
---


Invoices
========

Invoices are an official accounting document for every order — they ensure that the business case has a written form that can be presented to an accountant, tax authority, or auditor. The `/invoice` module therefore serves as a complete archive and workspace for all tax documents of an organization: invoices can be viewed, downloaded, corrected, notes added, and bulk exported for monthly closing. Because the module is tightly integrated with orders, bank transactions, and payment gateways, most invoices are issued, paired with payments, and closed fully automatically, so manual intervention is only required in atypical cases.
## Invoice Overview
This table displays all issued invoices of the organization in one place, with essential details you usually need to see immediately. For each row, you will find the invoice number linking to the detail, the order number with a link to the corresponding business case, the total price with currency, the color-coded document status, the recipient and issuer (both linked via contacts), the issue date, and the due date supplemented by a payment icon. The table automatically refreshes every 5 seconds, so new invoices and status changes appear in the overview without the need for manual refresh.
### Filtering and Searching
As the number of documents grows, it's necessary to quickly narrow down the list, which is why multiple filter axes are available and can be combined. You can filter by status (open, sent, overdue, paid, canceled, uncollectible), document type (invoice, document, proforma, partial proforma, corrective tax document, tax document, final invoice, credit note), payment status (paid versus unpaid), by specific customer, or by issue period defined by two dates. Full-text search covers invoice number, as well as customer email and name.
## Invoice Statuses
Every invoice goes through a predefined lifecycle, the current phase of which is indicated by a colored label in the **Status** column and in the document detail. There are six statuses, covering the entire flow from issuance to the eventual marking of a receivable as uncollectible.
| Status | Meaning |
| --- | --- |
| **Open** | The invoice has been issued, not yet sent to the customer. |
| **Sent** | The invoice has been dispatched to the customer and is awaiting payment. |
| **Overdue** | The due date has passed, and the invoice has not yet been paid. |
| **Paid** | Payment has been matched or manually confirmed, the document is closed. |
| **Canceled** | The invoice has been canceled by a corrective document or administratively. |
| **Uncollectible** | The receivable has been marked as uncollectible. |
> ℹ️ The transition to **Overdue** status occurs automatically based on the due date — no manual intervention is required, and the status is continuously recalculated according to the current calendar.
## Invoice Lifecycle
The lifecycle begins with the issuance of the document, which usually happens automatically from an order, but can also be initiated manually. Issuance is followed by sending to the customer (via email or PDF download) and the payment term, which is by default 14 days from issuance; if payment is not received within this period, the invoice moves to **Overdue** status. Payment is usually made automatically — either by automatic matching with a bank transaction or via a response from a payment gateway — and only if this mechanism fails is it necessary to manually mark the invoice as paid. All documents then remain permanently available in the overview and are part of bulk exports, ensuring the archive is complete, even retrospectively.
## Automatic Invoice Issuance
The system distinguishes several types of documents that are issued for an order at different points in the business process — they differ depending on whether it's an advance payment, a settlement document, a standard invoice, or a correction. This ensures that the accounting flow is correct even in more complex cases involving upfront payment or complaints.
- **Proforma (advance) invoice** — generated immediately upon receipt of an order with bank transfer payment, used for payment identification.
- **Tax document for payment** — issued as soon as an advance payment is received from a VAT payer.
- **Invoice / Document** — standard accounting document issued upon dispatch or completion of an order.
- **Corrective tax document (credit note)** — created upon goods return or complaint and automatically links to the original document.
- **Final invoice** — a settlement document closing the order after all advance payments have been made.
If the organization is not a VAT payer, simplified document variants without tax reporting are used.
> 💡 If you need to issue a document outside the standard process (e.g., for additional invoicing of services), an invoice can be created manually from the order detail — the result is fully functional and fits into the same numerical series as automatically issued documents.
## Invoice Detail
Clicking on an invoice opens a detail view, designed as a complete workspace for a single document. At the top is a PDF preview with a download button and a header block with the invoice number, a colored status label, document type, and total amount; next to it is also a **Mark as Paid** button for cases where the invoice needs to be closed manually. Below the header are information cards with the issue date, due date, and date of taxable supply, as well as payment details (variable, constant, and specific symbols, IBAN, BIC, bank name, and payment method) and identification details of both parties — the supplier and the customer, with address, Company ID (IČO), and VAT ID (DIČ). The final section consists of an item table with description, quantity, unit, unit price, VAT rate, and total amount, supplemented by public and internal notes. The status of invoices is color-coded in both the overview and the detail for quick orientation.
## Payment Details
Payment details for each invoice are automatically generated from the organization's settings and customer data, so you don't have to manually calculate or copy them. The Variable Symbol (VS) is the main payment identifier, usually identical to the invoice number, and it is by this that the system pairs incoming bank transactions with the invoice. The Constant Symbol (KS) is an auxiliary identifier — for commercial invoices, the value `0308` is generally used. The Specific Symbol (SS) serves for optional internal payment specification, and IBAN and BIC represent the international account number format and the recipient bank's SWIFT code, which is essential for international payments.
> ⚠️ If a customer is paying from abroad, always communicate the IBAN and BIC to them. Without them, their bank may not process the payment at all, and the transaction will be returned to the sender's account.
## How Payment Matching Works
The system recognizes payments in two parallel channels that work closely together. The first is bank transactions — when an account is synchronized via the `/bank-transaction` module, each new transaction is compared with open orders. A match is primarily determined by the variable symbol and verified against the amount; if everything matches, the transaction is automatically linked to the order, and the associated invoice is marked as **Paid**. The second channel is payments from the gateway — for online payments (GoPay, Comgate, Stripe), the status is updated based on the provider's response, and as soon as the gateway confirms payment, both the order and the invoice are closed. If the system cannot unambiguously assign a payment, the transaction remains unmatched and awaits manual intervention in the bank transactions module.
> ℹ️ Matching also works retrospectively — if an invoice is issued after payment has been received, matching will occur during the next synchronization, and nothing needs to be initiated manually.
## Manually Marking an Invoice as Paid
In some situations, an invoice needs to be closed manually — typically when payment was made in cash or by card at a branch, payment came from a foreign account not involved in synchronization, or the customer entered an incorrect variable symbol, causing automatic matching to fail. In such a case, click the **Mark as Paid** button in the invoice detail, select the payment date (or leave today's date), and confirm. The invoice will transition to **Paid** status, and the payment date will be recorded in its information cards.
> ⚠️ Manual marking cannot be undone by a simple click. If you made a mistake, you must revert the status in the document status dropdown menu to prevent the error from propagating to subsequent processes.
## Editing Notes
On the invoice card, two notes can be added at any time, each serving a different purpose. The **Public Note** appears directly on the printed or sent invoice and is used for thank you messages, project details, or delivery terms — i.e., text that the customer should see. The **Internal Note**, on the other hand, is visible only to the team in the administration and is useful for internal comments, approvals, or links to previous communications. Both notes can be freely edited even after the document has been issued.
## Invoice Export
The **Export** button in the top right corner opens a dialog with pre-set date ranges (Today, Yesterday, Last Week, Last Month, etc.) for bulk downloading invoices. Two formats are available: **CSV** is a table with metadata (number, status, amounts, customer, dates) suitable for accounting software, while **ZIP** is an archive of PDF files of all invoices within the given period, along with a content manifest.
> 💡 Export is an ideal tool for monthly closing — just select **Last Month** and hand over the archive to the accountant without having to download invoices one by one.
## Recommended Practices
Regular checking of invoices in **Overdue** status is the most effective defense against unpaid receivables becoming difficult-to-collect debts — it is advisable to send a reminder as soon as possible after the due date has passed, while the customer still clearly remembers the order. Before manually marking an invoice as paid, always ensure that the payment is not already paired via the bank module, as this could create a duplicate in the records. For every manually issued invoice, add an internal note with the reason for its issuance — this will help with later checks by the accountant and your colleagues. For annual closing, use the **ZIP** export format, which also contains a manifest and can be handed over to the accountant without any further processing.

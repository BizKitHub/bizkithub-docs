---
code: "accounting-posting-and-payments"
category: "finance"
tags: ["type-concept", "accounting"]
published_at: "2026-11-24T00:00:00.000Z"
---


Documents, posting and payments
===============================

This article explains how the [Accounting](/accounting-overview) module gets from your invoices, expenses and bank movements to journal entries. There are two parallel flows. Invoices and expenses become **documents**, which are posted by **posting rules**. Bank transactions and gateway payments become **payments**, which are matched to documents and posted against their open items. **Automation** decides which of these postings happen on their own and which wait for you.

Source records are never changed. If an invoice is wrong, you correct the invoice; the document is rebuilt and, depending on the period, its entry is rewritten or reversed and posted again.

## Documents

**Accounting → Documents** lists the accounting documents of the selected entity. They are built from issued invoices, received invoices and expenses. The platform checks for new and changed source records every 5 minutes; **Sync now** runs the check immediately and reports how many documents are new, changed and unchanged.

Each document has a type (for example **Issued invoice**, **Issued credit note**, **Proforma invoice**, **Received invoice**, **Expense voucher**), a direction (**Issued**, **Received**, **Internal**) and a status:

| Status | Meaning |
|---|---|
| **Draft** | The source is not final yet, for example an expense that has not been approved. Not posted. |
| **Ready** | Complete and can be posted. |
| **Blocked** | A blocking data finding prevents posting. |
| **Posted** | Has a valid journal entry. |
| **Cancelled** / **Voided** | The source was cancelled or deleted. |

The document detail shows the header, partner, amounts in the document currency and in the entity currency, lines with their **VAT classification** and **Item type**, VAT records with the return row and control statement section, findings, and the change history. **Open source record** jumps to the invoice or expense.

### Accounting adjustments

Sometimes the source is right for the customer but needs a different accounting treatment, for example a different accounting date or a line classified as a fixed asset instead of goods. Use **Accounting adjustments** on the document detail. You can change the document type, accounting date, tax point, description and line classification, and you must give a **Reason for the adjustment**. Adjustments are stored outside the source record and applied again on every resync. The list marks adjusted documents with **Adjusted**.

### Data checks on documents

When a source record is inconsistent, the document gets a **finding**. Examples: **Document without items**, **Exchange rate missing**, **Lines do not add up to the header**, **Duplicate document number**, **VAT on a non-payer**, **VAT does not match the rate**, **Partner missing**. A **Blocking** finding prevents posting; a **Warning** or **Info** does not.

All findings are collected in **Accounting → Data checks**. Mark a finding **Resolved** after you fix the source, or **Ignore** it; both require a note. A resolved finding reopens if the source problem persists.

## Posting rules

**Accounting → Posting rules** defines which accounts each kind of document posts to. Rules are grouped into **Issued documents**, **Received documents** and **Expense documents**. Each rule shows the platform **Default** and the account **In effect for the entity**. Click **Edit** to set your own account, for example `518.100` for **Purchased services**; **Restore default** returns to the platform value.

For example, an issued invoice for services of 12 100 CZK including 21 % VAT posts with the default rules as Dr **Receivable from customer** 12 100, Cr **Revenue from services** 10 000, Cr **Output VAT** 2 100.

Changes apply to documents posted from then on. To change a document already posted, open it and use **Repost**. An account without an analytic is completed from the VAT rate and the document context.

### Posting a single document

The **Posting** panel on the document detail shows the entry the document has, or the entry it would get now with the rule behind each line. The actions are:

- **Post**: posts a ready document.
- **Reverse**: creates a correcting entry with negative amounts. The document becomes ready to be posted again.
- **Repost**: in an open period, rewrites the entry from the current document; in a closed period, reverses the original entry and posts the document again.

When the source changes after posting, the panel says so and the document appears under **To finish** with the reason **Source changed after posting**.

## Automation

**Accounting → Automation** posts ready documents and payments according to the automation level of the entity:

| Level | What happens |
|---|---|
| **Off** | Nothing is posted automatically. |
| **Suggestions only** | Every posting is prepared as a suggestion for approval. |
| **Assisted** | Issued invoices and incoming and outgoing payments post automatically; received invoices, expense documents and advance tax documents become suggestions. |
| **Fully automatic** | Everything that can be posted is posted. |

On **Automation settings** you can override the level per operation (issued invoices, received invoices, expense documents, advance tax documents, incoming payments, outgoing payments) and set an **Amount cap** above which the operation only suggests. The entity's daily automatic posting limit applies on top.

Automation never posts into a closed period, never exceeds the daily limit and always sends documents with a blocking finding to **To finish**.

The tabs:

- **To approve** lists suggestions with the proposed entry. Select them and click **Approve selected**, or reject a suggestion with a reason. A rejected suggestion is offered again only after the document changes.
- **To finish** lists documents waiting for an accountant, with the reason, for example **Missing posting rule**, **Missing exchange rate**, **Account requires an analytic** or **Period is closed**.
- **Decision history** lists what was posted automatically, approved, rejected or superseded.
- **Bulk posting** posts every ready document without an entry in a date range. Start with **Dry run**: it writes nothing, checks each document exactly as posting would and lists what would fail. Then click **Post**. Documents in closed periods are skipped, and a running job can be stopped.

## Payments and matching

**Accounting → Open items**, tab **Payments and matching**, lists payments from bank accounts and payment gateways. They are imported and matched in the background; **Import and match payments** runs it on demand.

Each payment is matched to documents automatically, first by the order it belongs to and then by the variable symbol. A matched payment settles the open item of the document and is posted. The status of a payment is **Unmatched**, **Partial**, **Matched** or **Overpaid**.

Open a payment to see **Matched documents** and the posting. You can:

- **Confirm** or **Remove** a proposed match. A removed pair is never proposed again.
- **Allocate to a document**: search by document number, variable symbol, partner or amount. Leave the amount empty to allocate the highest possible amount.
- **Match again** to recalculate matching.
- **Ignore** a payment that should be neither matched nor posted, for example a transfer between your own accounts. An existing entry is reversed.

The part of a payment that is not allocated to any document goes to the suspense account `395` until you or a bank rule decide where it belongs. Payments in a foreign currency post the exchange difference to exchange gain or loss.

## Bank rules

Payments without a document (bank fees, interest, tax and insurance remittances, rent) need a counter-account. **Accounting → Bank rules** sets it.

1. Click **New rule**, or start from the **Templates** tab. Templates exist for bank fees (`568`), interest received (`662`), VAT payments to the tax office (`343`), payroll tax advances (`342`), income tax advances (`341`), social and health insurance (`336`) and rent (`518`).
2. Fill in at least one condition: **Counterparty account**, **Bank code**, **Account prefix**, **Variable symbol** or **Message contains**. A payment must meet all filled-in conditions. Optionally limit the direction, currency and amount range.
3. Pick the **Counter-account** and **Priority** (lower wins) and save.

A new rule only suggests. When it has been used at least five times, confirmed five times in a row without a change and has an amount range, it is marked **Ready for automation** and you can click **Switch to automatic posting**. An automatic rule that you correct three times goes back to suggestions.

When you choose an account by hand for the same counterparty account at least three times, the **Proposals from decisions** tab offers a rule built from those decisions. Nothing is created without your confirmation. The **History** tab records every confirmation, correction and rule change.

## Offsets

The **Offsets** tab lists partners that have open receivables and payables at the same time. **Offset** opens a dialog prefilled from the oldest documents up to the largest possible amount; both sides must be equal. The offset posts per document, so the open items stay per document. **Reverse offset** reopens the documents.

## Open items

The **Open items** tab shows receivables and payables from the general ledger as of any date, **By document** or **By partner**, with aging buckets from **Not due** to **Over 1 year**. Amounts are in the entity currency; a negative amount means an overpayment.

## Related articles

- [Accounting](/accounting-overview): activation, money accounts and automation level of the entity.
- [Chart of accounts and journal](/accounting-journal): manual entries, reversals and the general ledger.
- [Invoices](/invoice-overview), [Bank transactions](/bank-transaction-overview) and [Payment gateways](/payment-gateway-overview): where documents and payments come from.
- [Expenses](/expense-overview): how expenses become expense vouchers.

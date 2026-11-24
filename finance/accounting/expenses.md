---
code: "expense-overview"
category: "finance"
tags: ["type-overview", "expenses", "accounting"]
published_at: "2026-11-24T00:00:00.000Z"
---


Expenses
========

The **Expenses** module is the cost register of your organisation. Each row is one cost (a supplier bill, a fee, a purchase, a refund) booked against an **accounting entity**, with its amount, dates, payer, receiver and scanned receipt. New expenses go through a simple approval: someone records the cost, someone else approves or rejects it.

Expenses work on their own as a register of costs. When the [Accounting](/accounting-overview) module is active for the entity, approved expenses also become expense vouchers in the books and are posted to the journal.

## When you would use it

- Record a supplier bill or receipt and keep the scan with it.
- Let a colleague record costs and approve them before they count.
- Track which costs are paid and which are overdue.
- Assign costs to the right company when your organisation runs more than one accounting entity.
- Feed costs into double-entry bookkeeping without retyping them.

## Where to find it in the admin

- **Finance → Expenses**: the cost register.
- **Finance → Accounting entities**: the companies that bear costs.

## Accounting entities

An **accounting entity** is a legal entity whose costs and books you keep. Every organisation has at least one, the **Default** entity. If you run several companies in one organisation, for example a holding and an operating company, create one entity for each.

To add an entity, open **Finance → Accounting entities** and click **Add entity**:

| Field | Meaning |
|---|---|
| **Entity name** | The name shown in pickers, for example `Example Trading s.r.o.` |
| **Currency** | The entity's currency. New expenses default to it. |
| **Contact (company with Reg. no. / Tax ID)** | The company contact with its registration and VAT numbers. Accounting reports and VAT filings take the name, VAT ID and address from it. |
| **Accounting year start month (1–12)** | `1` for a calendar year. |
| **Note** | Internal note. |

**Set as default** makes another entity the default. An entity can be deleted only when it is not the default and has no expenses.

Turning on double-entry bookkeeping for an entity happens in **Accounting → Accounting settings**; see [Accounting](/accounting-overview).

## Recording an expense

1. Open **Finance → Expenses** and click **Add expense**.
2. Pick the **Accounting entity**. The default entity is preselected.
3. Choose a **Category**: **Fees**, **Shipping**, **Marketing**, **Payroll**, **Rent & utilities**, **Supplies**, **Services**, **Software / SaaS**, **Storage / hosting**, **Taxes**, **Insurance**, **Travel**, **Write-off**, **Refund** or **Other**.
4. Enter **Amount incl. VAT** and the **Currency**. The amount cannot be zero. A negative amount records a refund or a reversed cost.
5. Enter the **Tax / cost date** and, if the bill has one, the **Due date**.
6. Enter a **Description**, for example the supplier's invoice number. It is required.
7. Optionally pick the **Payer** (who pays the cost) and the **Receiver** (who the cost is paid to). You can leave them empty and fill them in later.
8. Add an **Internal note** and upload **Attachments** (PDF or images) such as the invoice or receipt.
9. Click **Create expense**.

Example: a hosting bill of 2 420 CZK from 3 November 2026, due 17 November 2026, recorded with category **Storage / hosting**, description `Invoice 2026-1103` and the PDF attached.

## The expense list

The list shows the **Tax date**, **Accounting entity**, **Branch**, **Category**, **Amount incl. VAT**, **Payer**, **Supplier**, **Status**, **Source**, **Description**, **Paid on** and **Files**. Refunds are shown with the label **Refund**. The **Paid on** column shows the payment date when the cost is paid; otherwise it shows the due date, in red once it has passed. **Files** opens the first attachment.

Above the table, **Selection total** sums the amounts of the listed rows and shows how many rows are waiting as **new**. Use the toolbar filter to narrow the list.

The **Source** column tells you where a row came from: **Manual** for rows recorded in this form, **Branch write-off** for write-offs recorded at a branch, and other values for costs created by other parts of the platform.

## Approval

Every expense recorded by hand starts as **New**. The row actions are:

- **Approve**: the expense counts as an approved cost. It needs an amount.
- **Reject**: the expense is rejected and stays in the list, greyed out.
- **Delete**: the row is crossed out but kept for audit. Deleted expenses cannot be approved.

Approved and rejected expenses are final: the **Approve** and **Reject** actions disappear. To change an approved cost, record a correcting expense with a negative amount.

### Branch write-offs

A write-off recorded for a specific branch (category **Write-off** with a branch) needs approval by the branch managers. When it is created, the platform notifies the branch managers by e-mail and opens an approval ticket for them. When a customer is granted credit, a write-off for the credit is created automatically; approving it is an internal step, and the credit itself applies immediately.

## Expenses in the accounting

When bookkeeping is active for the entity, every expense becomes a document of type **Expense voucher** in **Accounting → Documents**:

| Expense status | Document status |
|---|---|
| **New** | **Draft**, not posted |
| **Approved** | **Ready**, posted by the automation or by hand |
| **Rejected** or deleted | **Cancelled** |

The voucher posts the cost to the expense account for its item type and the amount owed to **Payable from expense document**; both are set in **Accounting → Posting rules**. The category decides the item type, for example **Fees** posts as a fee (**Bank and other fees**) and **Supplies** as material (**Material consumed**). Expenses in a foreign currency are converted at the exchange rate for the cost date.

Some rows are internal cost allocations rather than real costs and do not become documents: write-offs and the automatic write-offs for customer credit. An expense linked to a received supplier invoice is not posted twice; the received invoice is the document.

> **Note.** The **Add expense** form records the total including VAT only. An expense voucher therefore posts the full amount as a cost without an input VAT deduction. To claim input VAT, the cost must come in as a received invoice with its VAT breakdown.

## Related articles

- [Accounting](/accounting-overview): activating bookkeeping for an accounting entity.
- [Documents, posting and payments](/accounting-posting-and-payments): how expense vouchers are posted and matched to payments.
- [Contacts](/contact-overview): the payer, receiver and entity companies.
- [Invoices](/invoice-overview): the issued side of your documents.

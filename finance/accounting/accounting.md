---
code: "accounting-overview"
category: "finance"
tags: ["type-overview", "accounting"]
published_at: "2026-11-24T00:00:00.000Z"
---


Accounting
==========

The **Accounting** module keeps double-entry books for your organisation inside BizKitHub. It reads the invoices, expenses and payments the platform already holds, turns them into accounting documents, posts them to a journal according to rules you control, and builds the general ledger, open items, VAT filings and financial statements from that journal. Your invoices and payments are never changed by the module: the books only read them.

The module follows Czech accounting law. It uses the chart of accounts for businesses (decree 500/2002), Czech VAT forms and the Czech National Bank exchange rates. If you only need a cost register without bookkeeping, use [Expenses](/expense-overview) instead.

## When you would use it

- You want the books of a Czech company to follow your sales and payments without retyping every invoice.
- Your accountant needs a journal, a trial balance, open items and financial statements as of any date.
- You file VAT returns, control statements or EC sales lists and want them computed from posted documents.
- You run several companies (for example a holding and an operating company) in one organisation and need separate books for each.
- You keep a cash register, fixed assets or stock and need them reconciled with the accounts.

## Where to find it in the admin

**Accounting** is a top-level section of the sidebar. Every screen of the module sits under it:

| Screen | What it is for |
|---|---|
| **Accounting settings** | Activate bookkeeping, set the VAT regime, map sources and money accounts. |
| **Chart of accounts** | Synthetic and analytic accounts and their history. |
| **Journal** | Every journal entry, manual entries and journal templates. |
| **General ledger** | General ledger and trial balance, with a statement for each account. |
| **Documents** | Accounting documents built from invoices and expenses. |
| **Posting rules** | Which accounts each kind of document posts to. |
| **Automation** | What posts automatically, what waits for approval, bulk posting. |
| **Open items** | Payments, their matching to documents, open receivables and payables, offsets. |
| **Bank rules** | Counter-accounts for bank payments that have no document. |
| **Data checks** | Findings on source data, the integrity check and the monthly check. |
| **VAT filings** | VAT return, control statement and EC sales list. |
| **Fiscal periods** | Period statuses, the date lock and the year-end closing wizard. |
| **Inventory count** | Year-end inventory of balance-sheet accounts. |
| **Financial statements** | Balance sheet and income statement. |
| **Cash book**, **Fixed assets**, **Stock** | Registers that post their own documents. |
| **Dimensions** | Cost centres, projects and other analytics on journal lines. |

The section opens on **Accounting settings**, because every ledger starts there. Access is controlled by the **Accounting** module permission. Members with the root role have it by default; grant it to other members in their permissions.

## Core concepts

### Accounting entity

An **accounting entity** is a company whose books are kept. Every organisation has at least one, the default entity. You create additional entities in **Finance → Accounting entities** (see [Expenses](/expense-overview)) and turn bookkeeping on for each one separately. All screens of the module show a picker at the top: everything you see belongs to the selected entity only.

### Accounting document and journal entry

A **document** is the accounting view of a source record: an issued invoice, a received invoice or an expense. A **journal entry** is the posting of that document: balanced debit and credit lines on accounts, with a number from a series. One document has at most one valid entry. Documents are described in [Documents, posting and payments](/accounting-posting-and-payments); entries in [Chart of accounts and journal](/accounting-journal).

### Money account

A **money account** is where money is held: a bank account, a cash register, a payment gateway, a payment card, cash on delivery or customer credit. Each money account posts to its own ledger account, for example a bank account to `221.001`. A payment on a bank account or gateway without a money account cannot be posted: it waits with the reason **Money account missing**.

## Activating bookkeeping

1. Open **Accounting → Accounting settings**, tab **Accounting entities**.
2. Click **Activate bookkeeping** next to the entity.
3. Fill in **Bookkeeping starts on**. This is the first day from which documents are posted, usually the first day of the fiscal year.
4. Set **Fiscal year starts in month**. `1` means a calendar year; any other value gives a non-calendar fiscal year.
5. Choose the **Accounting currency**, **Bookkeeping type**, **Chart of accounts**, **VAT registration** and **VAT period**. Tick **OSS registration** if you report EU distance sales through the One-Stop Shop.
6. Choose the **Automatic posting** level and click **Activate**.

Activation fills the standard chart of accounts, opens the first fiscal period and maps the entity's own company as an invoice issuer. The original invoices and payments stay unchanged.

The following combinations are rejected:

- A **Not VAT registered** entity with a VAT period other than **No return**.
- A **VAT payer** or **Identified person** with **No return** as the VAT period.
- Any chart other than **Decree 500/2002 (businesses)**. The non-profit chart is listed but cannot be activated yet.
- An entity that already has bookkeeping active.

### Regime history

The VAT registration, VAT period and OSS registration can change over time. Use **Regime history** on the entity row and **Add regime change** with an **Effective from** date. For example, a company that registers for VAT on 1 March 2026 adds a regime change from `2026-03-01` with **VAT payer** and **Monthly**. Documents before that date keep the old regime.

### Entity settings

**Settings** on the entity row holds three values you will change during the year:

- **Lock the books until**: nothing can be posted or corrected up to this day. Use it after filing a return or reviewing a month.
- **Daily automatic posting limit (CZK)**: documents above the limit always wait for approval. Empty means no limit.
- **Foreign currency conversion**: daily Czech National Bank rate, fixed monthly rate or fixed yearly rate.

## Source mapping and money accounts

Every invoice, payment and bank movement is assigned to an entity by its **source**: the document issuer, the bank account, the payment gateway or the branch. Unmapped sources belong to the default entity. On the **Source mapping** tab you change the entity of each source. **Create entity** creates a new accounting entity for an issuer's company and maps the source to it in one step.

On the **Money accounts** tab, **Add money account** creates one by hand. The panel **Accounts found without a money account** lists the bank accounts and payment gateways that do not have one yet; select them and click **Create selected**. Leave **Ledger account** empty to use the default account for the type, or enter a synthetic account or sub-account such as `221` or `221.001`.

## Public API

The accounting data is available read-only through the public API under `https://api.bizkithub.com/api/v1/ledger/`. All endpoints are `GET`, take your key in the `apiKey` query parameter and, except the first one, an `entityId` of an entity with active bookkeeping.

```bash
curl "https://api.bizkithub.com/api/v1/ledger/entity-list?apiKey=YOUR_API_KEY"
```

```json
{
  "items": [
    {
      "id": "Kq3vTnY8mZ0aB1cD2eF3gH4i",
      "name": "Example Trading s.r.o.",
      "baseCurrency": "CZK",
      "accountingStartsOn": "2026-01-01",
      "fiscalYearStartMonth": 1,
      "lockedUntil": "2026-09-30"
    }
  ],
  "itemCount": 1
}
```

Entities without activated bookkeeping are left out of this list, and passing such an entity to another endpoint returns an error. The other endpoints cover the chart of accounts, the journal and its entries, the trial balance, documents, the VAT ledger, posting rules, payments, open items, VAT filings, financial statements, dimensions, journal templates, bank rules, the closing progress, check runs, offsets, fixed assets, the cash book, the inventory count and stock. Only posted entries are exposed; drafts stay in the administration. The full contract is in the [API explorer](/swagger), and error responses are explained in [Errors](/errors).

## Related articles

- [Chart of accounts and journal](/accounting-journal): accounts, manual entries, corrections, the general ledger and dimensions.
- [Documents, posting and payments](/accounting-posting-and-payments): how invoices and payments reach the journal, automation and bank rules.
- [VAT filings and closing the year](/accounting-vat-and-closing): VAT forms, fiscal periods, the inventory count and financial statements.
- [Cash book, fixed assets and stock](/accounting-cash-assets-stock): the three registers that post their own documents.
- [Expenses](/expense-overview): the cost register and accounting entities.
- [Invoices](/invoice-overview) and [Bank transactions](/bank-transaction-overview): the source records the books read.

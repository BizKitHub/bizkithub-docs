---
code: "accounting-cash-assets-stock"
category: "finance"
tags: ["type-guide", "accounting"]
published_at: "2026-11-24T00:00:00.000Z"
---


Cash book, fixed assets and stock
=================================

Three registers in the [Accounting](/accounting-overview) module create their own accounting documents instead of reading them from invoices: the **Cash book**, **Fixed assets** and **Stock**. Each keeps its own records, posts entries to the journal and has a check against the general ledger, so the register and the accounts always tell the same story.

All three work per accounting entity and follow the same pattern: you save a **draft**, then **Post** it, which gives the document a number and an entry. A posted document can no longer be edited, only reversed.

## Cash book

### Before you start

The cash book needs a cash register. Create a money account of type **Cash register** on the **Money accounts** tab of **Accounting settings**. Without one, the cash book shows a link to the settings.

### Recording cash documents

Open **Accounting → Cash book**, pick the register and the period (**Previous month** and **Next month** move by a month).

1. Click **Cash receipt** or **Cash expense**.
2. Choose the **Purpose**: **Sale (takings)**, **Purchase**, **Payment of an issued invoice**, **Payment of a received invoice**, **Transfer from or to the bank** or **Other movement**.
3. Enter the **Date**, **Document text** and the amount.
4. For a sale or purchase with VAT, tick **Document with VAT (tax document)** and enter the amount including VAT for each rate and the **Tax point date** (empty means the document date).
5. For an invoice payment, search the **Settled document** by number, variable symbol or partner. The form shows how much is left to pay.
6. Optionally fill in the **Counter account**. When empty, a sale posts to the revenue account from the posting rules (typically `602`), a purchase to the expense account (typically `518`) and a transfer to `261` Cash in transit. **Other movement** requires an account, for example `335` for an advance to an employee.
7. Click **Save draft** or **Save and post**.

Receipts are numbered in the `PPD` series and expense vouchers in the `VPD` series. Sales and purchases with VAT go to the VAT ledger; invoice payments settle the open item of the invoice.

The form warns you when:

- the cash balance would become negative after posting;
- a payment exceeds the 270 000 CZK limit for cash payments;
- a sale with VAT above 10 000 CZK has no customer VAT ID, so it goes to section A.5 of the control statement.

### Correcting and printing

On a posted document, **Reverse** writes a red-reversal entry and removes its VAT from the VAT ledger. If the VAT return for that period has already been filed, reversal is not possible; record the correction as a new document. **Copy into a new draft** speeds up a corrected copy.

The summary shows the opening balance, receipts, expenses, **Other entries on the account** (for example manual entries or order payments posted to the cash account) and the closing balance. **Print cash book** produces a printable book with a running balance and signature lines for the cashier and controller.

## Fixed assets

**Accounting → Fixed assets** holds cards of tangible and intangible fixed assets, with accounting and tax depreciation plans.

### Creating a card

1. On the **Register** tab, click **New card**.
2. Leave **Inventory number** empty to get the next free number (for example `DM-0001`).
3. Choose the **Asset account**, for example `022` Movable assets or `013` Software. Land (`031`) and works of art (`032`) are not depreciated.
4. Enter the **Acquisition date**, **Input price**, **Useful life (months)** and **Accounting residual value**.
5. For tax depreciation, choose the **Tax depreciation method** (**Straight-line (§ 31)**, **Accelerated (§ 32)**, **As accounting depreciation** or **Not depreciated**), the **Depreciation group** and an optional **First-year increase** of 10, 15 or 20 %. Tick **Passenger car, category M1** for cars: for vehicles acquired from 2024, tax depreciation counts only up to an input price of 2 000 000 CZK.
6. For an asset acquired before bookkeeping started in BizKitHub, fill in the **Existing asset** section with the years and amounts already depreciated. Its account balance then comes with the opening balances.

### Life cycle

- **Put into use** starts depreciation and posts Dr asset account / Cr acquisition account. Accounting depreciation runs from the following month. **Back to draft** reverses this, but only until depreciation is posted.
- **Technical improvement** adds to the price from its completion date.
- **Interrupt tax depreciation** skips tax depreciation for one year; the tax plan moves by one year.
- **Dispose** records a sale, liquidation, donation or shortage. Depreciation of the year up to the disposal month and half of the tax depreciation are posted, and the residual value goes to expenses. Post the sale proceeds with an issued invoice. **Cancel disposal** reverses it.

The card detail shows both plans, year by year, and the posting history.

### Yearly depreciation and reconciliation

On **Depreciation of the year**, select the year and click **Post depreciation of the year**. Accounting depreciation is posted on the last day of the year (Dr `551` / Cr `08x`) and tax depreciation is confirmed for the tax return. A year can be posted only after the previous year is done. The totals show the **Tax base difference**: a positive difference (accounting above tax) increases the tax base. Only the latest posted year can be reversed.

**Reconciliation** compares register totals with the balances of accounts `01x` to `03x` and `07x` to `08x`. A difference means an entry made outside the register or a missing opening balance.

## Stock

**Accounting → Stock** keeps stock by the continuous method (method A): every receipt and issue is posted.

### Setting up

1. On **Warehouses**, create a warehouse and choose its **Valuation of issues**: **Moving average** (recalculated after every receipt) or **FIFO** (the oldest stock leaves first). The method cannot change after the first movement.
2. On **Stock cards**, create cards one by one, or click **Load from e-shop products** to create cards with the same code and name for selected products (up to 500 at a time). The products themselves are not changed.
3. Each card has a kind: **Goods**, **Material** or **Own product**. An empty account field uses the defaults: goods `132` and `504`, material `112` and `501.900`, own products `123` and `583`.

### Stock documents

On **Documents**, create a **Receipt**, an **Issue** or a **Transfer**. Pick the purpose (for example **Purchase**, **Customer return**, **Sale**, **Consumption**, **Shortage or damage**, **Transfer between warehouses**), add lines by searching a card, and enter a unit price or a line total. The acquisition cost may include incidental costs such as transport or duty. **Save and post** values issues by the warehouse method and numbers the document.

Use the purpose **Taken-over stock** for stock that existed before bookkeeping started. It is not posted, because its value is already in the opening entry.

Reversing a stock document undoes its movements and writes a red-reversal entry. It is possible only when no later movement of the same cards in the same warehouse follows it.

### Status and check with accounts

**Stock status** shows quantity, value and average cost of every card as of any date, for one warehouse or all. **Check with accounts** compares the stock value with the balances of accounts `112`, `123` and `132`. A difference usually means a manual entry on a stock account or taken-over stock without an opening entry. The year-end precheck warns about a mismatch.

## Related articles

- [Accounting](/accounting-overview): money accounts and entity settings.
- [VAT filings and closing the year](/accounting-vat-and-closing): depreciation and inventory steps of the closing.
- [Chart of accounts and journal](/accounting-journal): the entries these registers create.
- [API explorer](/swagger): the read-only `ledger/cash-book`, `ledger/asset-list` and `ledger/stock-status` endpoints.

---
code: "accounting-vat-and-closing"
category: "finance"
tags: ["type-guide", "accounting", "vat"]
published_at: "2026-11-24T00:00:00.000Z"
---


VAT filings and closing the year
================================

The [Accounting](/accounting-overview) module computes Czech VAT filings from the posted documents of an accounting entity and guides you through closing the fiscal year. This guide covers the VAT return, control statement and EC sales list, the life cycle of a fiscal period, the date lock, the year-end inventory count, the closing wizard and the financial statements.

Two rules hold throughout. Filings are computed from the VAT ledger, so only documents that are ready for posting count. And once a period is closed or the books are locked, posted entries can no longer be rewritten, only reversed.

## VAT filings

Open **Accounting → VAT filings**. The screen is available when the entity is registered as a **VAT payer** or an **Identified person** in its regime; for other entities it explains how to set the registration. For how the platform decides VAT on each invoice line, see [VAT handling and registration types](/vat).

The calendar lists three forms per period:

- **VAT return**
- **Control statement**
- **EC sales list**

Each period has a state: **Filed**, **Draft**, **Due**, **Overdue** or **Period running**. The counters at the top show how many filings are overdue, due and in progress. The tax period (monthly or quarterly) comes from the entity regime.

### Filing details

Before the first filing, click **Filing details** and complete what the tax office needs: **Taxpayer type**, **CZ-NACE** code of the main activity (for example `62010`), the three-digit **Tax office** code (for example `451`), the four-digit **Regional office** code and the **Preparer and signatory**. Name, VAT ID and address come from the contact linked to the accounting entity; change them in that contact.

### Preparing and filing a return

1. Open the period and click **Prepare regular filing**. The draft shows each form row with its tax base and tax, for example row 1 **Supply of goods or services, standard rate** or row 40 **Supplies received from VAT payers, standard rate**.
2. Read the warnings. Problems marked **Blocks filing** must be fixed first, for example a missing VAT ID or tax office code. Other warnings flag documents without a partner VAT ID, documents not yet ready for posting or a reduced deduction to check.
3. Click **Download XML for EPO** and submit the file through the tax administration portal or a data box.
4. Back in the platform, click **Mark as filed**. Enter the **Filing date** and the **Filing number** from the confirmation. Leave **Book the VAT clearing** ticked to move the balances of the input and output VAT accounts to the VAT settlement account, and **Lock the books until** ticked to lock the period.

Amounts are rounded to whole crowns, as on the form. The rounding difference of the clearing goes to other expenses or income. If the VAT accounts differ from the return (for example because some documents are not posted yet), the dialog shows the difference and you can post the missing documents or file without clearing.

### Changes after filing

If the VAT ledger changes after a filing, the period shows **The VAT ledger has changed since filing**. Click **Prepare corrective or supplementary filing**:

- A **Corrective** filing replaces the regular one before the filing deadline.
- A **Supplementary** filing is submitted after the deadline and needs the **Date the reasons were discovered**.

The new filing replaces the previous one once you mark it as filed. **Withdraw filing** is only for a filing marked by mistake: the VAT clearing is reversed and the previous filing is in force again, while the lock of the books stays.

### VAT ledger records

The **Ledger records** tab lists the VAT records behind the filings for a period, grouped by **Tax point** or **Deduction period**, with totals of output VAT, input VAT and the VAT payable or excess deduction. You can summarise by return row or by control statement section. Supplies are split between sections A.4/A.5 and B.2/B.3 at 10 000 CZK including VAT.

## Fiscal periods

**Accounting → Fiscal periods** lists the periods of the entity. A period moves through these statuses:

| Status | Meaning | Next steps |
|---|---|---|
| **Open** | Ordinary posting allowed. | **Start closing** |
| **Closing** | Only closing entries from the wizard. | **Reopen**, **Close** |
| **Closed** | No posting. | **Mark as reviewed**, **Reopen** (reason required) |
| **Reviewed** | Checked by the accountant or auditor. | **Approve financial statements**, back to **Closed** (reason required) |
| **Approved** | The financial statements are approved. | None. This is final. |

**Approve financial statements** requires the **Approving body** (for example the general meeting) and the **Decision reference**, and it cannot be undone. **Open next period** creates the following fiscal year. Every change is kept in the **Status history**.

### Date lock

The **Date lock** panel locks the books up to and including a chosen day, independently of the period status. Use it after filing a VAT return or reviewing a month. Nothing can be posted or corrected on or before that day; corrections then go through reversals dated after the lock. **Remove lock** lifts it.

## Inventory count

Czech law requires an inventory of balance-sheet accounts at the balance-sheet date. **Accounting → Inventory count** handles it per fiscal period:

1. Click **Start inventory**. The book balances of all balance-sheet accounts are loaded from the general ledger.
2. For each account enter the **Actual balance**. Each account has an **Inventory type**: **Physical** (counted) or **Documentary** (proved by statements, confirmations or contracts). **Take over book balances** fills the actual balance for documentary accounts that you have verified.
3. For each difference, either **Post** it or **Explain** it. A shortage posts by default to `549` Shortages and damages, a surplus to `648` Other operating revenue; you can choose another counter account, for example `335` when an employee pays for a shortage. An explanation (for example money in transit) is not posted and appears in the protocol.
4. Click **Complete**. Book balances are loaded once more, and the inventory is locked until you **Reopen** it.
5. **Print protocol** produces the inventory protocol with signature lines.

The books cannot be closed without a completed inventory. If entries are added to the year afterwards, the closing precheck warns you to check the counted balances.

## Year-end closing

Click **Year-end closing** on a period to open the wizard. It shows the result for the year and walks through these steps, each of which you mark **Done** or **Skip**:

1. **Precheck**: the previous year is closed and opened, the period has no draft entries and the integrity checks pass. These block closing. Unposted documents, payments and suggestions, a balance on the suspense account, draft cash or stock documents, a stock mismatch and unposted depreciation are warnings.
2. **FX revaluation at the balance-sheet date**: open foreign-currency items are revalued at year-end rates, prefilled from the Czech National Bank. Gains go to `663`, losses to `563`.
3. **Accruals and estimates**, using journal templates.
4. **Depreciation**, posted in the fixed asset register.
5. **Provisions and allowances**.
6. **Inventory and stock count**.
7. **Income tax**: the tax for the year is posted on the last day of the period (`591` / `341`). **Confirm zero tax** handles a year without tax.
8. **Close the books**: income statement accounts close to `710`, the result and balance-sheet accounts to `702`. The period becomes closed.
9. **Open the next year**: balance-sheet accounts open through `701` on the first day of the next year, with the result on `431`. Open items stay split per document.
10. **Distribute the result**: after the financial statements are approved, allocate the profit from `431` (dividends, funds, the rest to `428`) or move a loss to `429`.

## Financial statements

**Accounting → Financial statements** builds the **Balance sheet** and the **Income statement** by nature straight from the journal as of any date. Choose the **Scope** (**Full**, **Abridged (small entity)** or **Abridged (micro entity)**) and tick **In thousands** if needed. The balance sheet shows gross, adjustment and net values with the previous period for comparison; expand a row to see the accounts behind it.

Two checks run on every statement: assets must equal equity and liabilities, and the result must match the profit and loss accounts. Accounts with a balance that do not map to any row are listed below the statement. Statements leave out year-end closing entries, so the current result shows on row A.V.

## Related articles

- [Accounting](/accounting-overview): the regime history that drives VAT registration and periods.
- [Chart of accounts and journal](/accounting-journal): reversals and journal templates.
- [Documents, posting and payments](/accounting-posting-and-payments): how documents reach the VAT ledger.
- [Cash book, fixed assets and stock](/accounting-cash-assets-stock): depreciation and stock values used in the closing.

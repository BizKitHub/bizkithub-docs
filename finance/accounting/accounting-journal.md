---
code: "accounting-journal"
category: "finance"
tags: ["type-guide", "accounting"]
published_at: "2026-11-24T00:00:00.000Z"
---


Chart of accounts and journal
=============================

The chart of accounts and the journal are the core of the [Accounting](/accounting-overview) module. The chart lists the accounts an accounting entity posts to; the journal holds every entry, whether it came from an invoice, a payment, a register or your own manual posting. This guide shows how to extend the chart, post and correct manual entries, use journal templates, read the general ledger and add dimensions such as cost centres.

The most important rule: a posted entry is never silently overwritten. In an open period a correction rewrites the entry and keeps the previous version in its history; in a closed or locked period the only correction is a reversal plus a new entry.

## Chart of accounts

Open **Accounting → Chart of accounts**. The chart is based on the standard Czech chart for businesses and is filled automatically when bookkeeping is activated. Accounts are grouped into classes 0 to 7 (for example class 3 **Settlement accounts**, class 5 **Expenses**, class 6 **Revenues**). Use **As of** to see the chart on a past date and **Show inactive** to include deactivated accounts.

Each account shows badges for its properties:

| Badge | Meaning |
|---|---|
| **Standard chart** | Part of the standard chart. It cannot be deleted. |
| **Analytic** | A sub-account of a synthetic account. |
| **Open items** | Payments are matched against documents on this account. |
| **Clearing** | The balance must be zero at the balance-sheet date. |
| **FX** | The balance is revalued at the balance-sheet date rate. |
| **Non-deductible** | Expenses on this account are not tax deductible. |
| **Inactive** | The account cannot receive new postings. |

### Adding an analytic account

1. Click **Add analytic account**.
2. Select the **Synthetic account**, for example `518`.
3. Enter the **Account number**. It must start with the synthetic number, for example `518.100` or `518D`.
4. Enter the **Name** and, if needed, the **Balance side** and **Account currency**. Set a currency only for accounts kept in a foreign currency, such as a EUR bank account.
5. Click **Create account**.

Once a synthetic account has analytic accounts, postings must go to one of them. If a synthetic account has exactly one analytic account, the entity setting **Post to a single sub-account automatically** redirects postings to it.

### Changing an account over time

Open an account and click **Edit account**. Name, balance side, tax deductibility and the active flag are versioned: fill in **Change effective from** and **Reason for the change**, and entries before that day keep the original definition. The **Definition history** on the account detail lists every version and who made it. An account that has postings cannot be deleted; deactivate it instead.

If the standard chart is missing accounts (for example after the platform added new ones), **Complete the standard chart** adds them without changing existing accounts.

## The journal

**Accounting → Journal** lists every entry of the entity. Filter by **Period**, date range, **Account** (a prefix: `311` matches `311.100`), **Status**, **Origin** and amount, or tick **Reversals only**. The summary line shows the number of entries and the turnover, and the integrity indicator shows whether the nightly integrity check found any problem.

Entry numbers combine a series code, the two-digit fiscal year and a sequence number. For example, `FV260017` is the 17th entry of the issued-invoice series in fiscal year 2026. Typical series are `FV` (issued invoices), `FP` (received invoices), `VD` (expense vouchers), `BV` (bank payments), `PB` (payment gateways, cards and cash on delivery), `PPD` and `VPD` (cash receipts and expense vouchers), `ZA` (offsets), `PS` and `UZ` (opening and closing) and `ID` (internal documents).

The **Origin** of an entry tells you how it was created: **Automatic**, **Suggestion** (an approved suggestion), **Manual**, **Backfill** (bulk posting), **Opening** or **Closing**.

## Posting a manual entry

1. Click **New manual entry**.
2. Fill in the header: entry date, document date, document number and description.
3. Add lines with **Add line**. For each line pick the **Account** and enter the amount in **Debit** or **Credit**. Tick **Red reversal** on a line to post a negative amount on the same side.
4. Watch the balance indicator. **Balanced** means debit equals credit; otherwise it shows **Difference** and the amount. **Balance** adds the difference to the last line or creates a new line.
5. Click **Save draft** to keep a draft without a number, or **Post** to give it a number.

Example: a monthly payroll recap for 10 000 CZK gross wages could post Dr `521` 10 000 / Cr `331` 10 000, plus the employer's insurance Dr `524` 3 380 / Cr `336` 3 380. Only a balanced entry can be posted, and every line needs an account and an amount on one side.

Drafts do not count in the general ledger. The general ledger warns about unposted drafts in the selected range, and the year-end precheck refuses to close a period that still has drafts.

## Correcting and reversing entries

Open an entry and look at the correction note under the header. The platform chooses the strategy for you:

- **Open period, date not locked**: **Correct entry** rewrites the entry. The previous version stays in the **Change history**.
- **Closed or locked period**: the entry can only be corrected by **Reverse** and a new entry.
- **Entry already reversed, or itself a reversal**: it can no longer be changed.

**Reverse** creates a new entry that cancels the original. Choose **Red reversal** (same sides, negative amounts) or **Black reversal** (swapped sides), a **Reversal date** and a **Reason**. With an empty date, the original date is used when its period is open, otherwise today. The dialog tells you in advance on which day and in which period the reversal will land.

Entries created from a document (an invoice, an expense, a payment) cannot be edited in the journal. Correct the source document instead; the entry is reposted (see [Documents, posting and payments](/accounting-posting-and-payments)).

## Journal templates

Templates speed up recurring entries. Open **Journal → Journal templates** to see two groups: **Own templates and payroll** and **Year-end adjustments**. Recommended templates are prepared automatically and you can edit or delete them.

- **New template** defines lines with an account, a side and an optional **Default amount**. An empty amount is filled in when the template is used.
- **Use template** in the entry editor inserts the template lines. Optionally upload **Amounts from CSV**: two columns (item name or account number, and amount), header row skipped, 500 kB maximum. The dialog shows how many lines matched and lists the rows it could not match.
- **Save as template** on an existing entry turns it into a template; **Keep amounts** stores the amounts as defaults.

## General ledger, trial balance and account statement

**Accounting → General ledger** has two tabs. **General ledger** shows opening balances, turnovers and closing balances for each account in a period. **Trial balance** shows the same with control equations: total debit turnover equals total credit turnover, the trial balance turnover equals the journal turnover, and opening and closing balances are balanced.

Options:

- **Break down by analytic accounts** shows analytic rows under each synthetic account.
- **State after closing the books** includes the closing entries.
- **Export CSV** and **Export XLSX** download the table.

If the selected period has no opening entry, opening balances of balance-sheet accounts are carried over from previous periods. Click an account to see **Monthly turnovers**, then **Account statement** for a chronological list of entries with a running balance. On the statement, **Totals by counter account** breaks the turnover down by counter account; click a row to filter the statement to it.

## Dimensions

Dimensions sort journal lines beyond the accounts. Open **Accounting → Dimensions**.

1. On **Dimensions and values**, click **New dimension** and pick a kind: **Cost centre**, **Project**, **Branch**, **Vehicle**, **Deal** or **Custom**. Add values with **Add value**, for example `PRAHA` and `BRNO`.
2. On **Rules**, click **New rule**. Enter **Accounts** as prefixes separated by commas; an exclamation mark excludes. `5, 6, !59` means classes 5 and 6 except income tax. Pick a **Default value** and an **Enforcement**: **Required** blocks manual entries without a value, **Warn** only warns, **Default value only** fills the value silently. The most specific rule wins, so a rule on `518` beats a rule on `5`.
3. On **Profit and loss by dimension**, read revenue, expenses and result for each value. The check above the table counts lines that miss a required or warned dimension.

A journal line carries at most one value of each dimension. Dimensions are analytics only: **Edit line dimensions** on an entry changes them without changing amounts, while the period is open and the date is not locked. Automatic posting never stops on a missing dimension; such lines show up in the check instead.

## Related articles

- [Accounting](/accounting-overview): activation, entities and the screen map.
- [Documents, posting and payments](/accounting-posting-and-payments): entries created from invoices, expenses and payments.
- [VAT filings and closing the year](/accounting-vat-and-closing): periods, locks and closing entries.
- [API explorer](/swagger): the read-only `ledger/account-list`, `ledger/journal`, `ledger/journal-detail` and `ledger/trial-balance` endpoints.

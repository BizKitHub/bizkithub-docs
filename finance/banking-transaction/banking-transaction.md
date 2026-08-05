---
id: "v2VAeMdqB5BZ4tHb"
category: "finance/banking-transaction"
tags: []
published_at: "2026-04-24T06:57:25.047Z"
---


Banking transaction
===================

Bank transactions are the basic layer of cashless income for the organization — without their automatic downloading and matching with orders, it would not be possible to confirm payments received via bank transfer, and all administration would have to be carried out manually. The `/bank-transaction` module therefore serves to manage linked bank accounts and track individual movements, allowing automatic categorization of transactions according to predefined rules and ensuring matching incoming payments with open orders and invoices. Thanks to it, most payments are closed automatically, without a single click from the staff, making the module a key component of any operation that receives payments to an account.

## Overview of bank accounts

At the top of the page, there is a list of all linked bank accounts. Each account displays key indicators — current balance, total number of transactions, success rate of the last synchronization, and date of the last download of movements — so you can quickly tell whether everything is fine or if any account needs attention. By clicking on a specific account, the transactions at the bottom of the page will be filtered for that account only. For each account, you have three quick actions available that cover regular maintenance:

- **Account info** — opens a dialog with details, including IBAN, BIC, current balance, income and expenses for the last 30 days, total number of transactions, and status of the last synchronization.
- **Filter transactions** — clicking on the filter icon limits the table to movements from the selected account.
- **Re-sync** — requests an immediate download of new transactions beyond the automatic cycle.

> ℹ️ If the last synchronization failed, the account is marked with a red icon and you will see a specific error message in the details, which usually indicates whether the problem is with the token, the bank, or the network.

## Overview of categories

Below the list of accounts, a colored bar shows the proportions of income and expenses by category. The width of each segment corresponds to the sum of transactions in that category, so at a glance, you can see where money is most often flowing from and to, without having to open detailed graphs. Categories are predefined (for example, revenues from the e-shop, bank fees, wages, or services) and each has its own color. The bar is divided into two zones — the green side represents income, and the red represents expenses.

> 💡 Hovering over any segment will display the exact amount and number of transactions in that category, so you can quickly get concrete numbers without leaving the overview.

## How the system assigns categories

Each transaction is evaluated according to a set of rules after being downloaded from the bank and is automatically classified into one of the categories. If the system does not find a match, the transaction remains uncategorized and waits for manual assignment or the addition of a new rule. Automated classification thus covers typical and recurring cases, while unconventional movements require human judgment.

> ⚠️ Regularly review uncategorized transactions — missing categories distort income and expenditure overviews and gradually devalue the usefulness of graphs for managing the organization.

## Transaction table

The main table displays each movement on the account with a full set of information, allowing you to either quickly scan the list or delve into the details of a specific item. Available columns include:

- **Transaction ID** — unique identifier that can be copied for tracing in the bank.
- **Category** — colored label of the automatically assigned category.
- **Order number** — link to the order details if the payment has been matched.
- **Amount** — green for income, red for expenses.
- **Variable / constant / specific symbol** and **BIC** — payment identifiers.
- **Transaction date**.
- **Recipient's account and bank**, recipient's name.
- **Transaction type** — for example, incoming payment, outgoing payment, fee, or interest.
- **Sender**.
- **Note / comment** from the bank movement.

Transactions automatically refresh every 3 minutes, so new movements will appear in the overview without needing a manual update.

## Synchronization of bank accounts

Synchronization means downloading the latest transactions from the bank's API and storing them in administration. It occurs automatically in the background at regular intervals, but you can also trigger it manually at any time — either for all accounts at once with the **Sync all** button in the upper right corner or individually with the icon in the row of a specific account. The whole process has clearly defined steps. During synchronization, the system first downloads all new transactions since the last successful download, saves them to the database, and assigns a category based on the rules. It then attempts to match each transaction with open orders (see the next section) and finally updates the balance and timestamp of the last synchronization. This process runs in several parallel phases to minimize the performance impact even for organizations with a high volume of movements.

> ℹ️ If the bank returns an error (such as an expired token or exceeded query limit), the system logs it, and the download attempt will be repeated in the next cycle, so temporary outages are usually resolved automatically without staff intervention.

## Matching transactions with orders

A key function of the module is the automatic linking of bank transactions with orders, as this connection ensures that paid orders are closed without human intervention. The system proceeds in four steps during matching: first, it loads open orders with unpaid payments (maximally 90 days old), compares the variable symbol of the transaction with the variable symbol of the order, verifies the amount match (with tolerance for multi-currency payments), and if everything matches, assigns the transaction to the order, marks the order as **Paid**, and closes the related invoice. If the variable symbol is missing or does not match, the system will also attempt to search the message text and comment of the transaction for the order number. In ambiguous cases, the transaction will remain unmatched and wait for manual intervention.

> 💡 For reliable matching, always instruct customers to include the variable symbol when making a payment — it is the fastest way to ensure automatic order closure and significantly reduces manual work for a larger number of incoming payments.

## Types of banks and account connection

The **Add token** button in the upper right corner opens a dialog for connecting a new bank account. In the current version of the administration, connection through Fio Bank using an API token is supported, while additional banks (including connections via the European PSD2 standard) are in preparation.

### Fio Bank — connection via API token

Connecting to Fio Bank occurs in four simple steps. In Fio's online banking, you select **Settings › API** and generate a new API token with read-only permissions. You then copy the token and paste it into the **Add token** dialog in administration. After saving, the system immediately verifies the token and performs the first transaction synchronization, allowing you to see right away if the connection works correctly.

> ⚠️ The token provides access to your transaction history. Keep it secure, and if you suspect it has been compromised, revoke it at the bank immediately and generate a new one — the administration can handle the token change without service interruption.

### Connection via PSD2 / OAuth

For selected banks, connecting via the European PSD2 standard with authorization via OAuth will be possible in the future. The advantage is that you don’t need to manually generate tokens — access is confirmed directly in online banking and updates automatically. For availability for specific banks, please check with support.

## Manual work with transactions

Although most of the process is automated, some situations require manual intervention. Among the most common are incorrectly paired transactions that need to be disconnected from an order and assigned to another one, transactions with an unknown category where it is appropriate to create a new rule for future movements, or internal transfers between the organization's own accounts, which must be marked so that they are not counted toward revenues or costs and do not distort the economic result.

## Recommended practices

At least once a week, open the module and check that all accounts are green — that is, whether the last synchronization was successful. Regularly review unmatched transactions as they are typically payments with an incorrect variable symbol that need to be assigned manually for the order to close. When adding a new account, always verify that the token has read-only rights — this mitigates the risk of unauthorized movements even if it is compromised. Finally, continuously supplement categories of transactions, as the resulting graphs then more accurately reflect the actual financial health of the organization and provide reliable grounds for decision-making.

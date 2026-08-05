---
id: "hgzA2CTAf11F0BMj"
category: "finance/payment-gateways"
tags: []
published_at: "2026-04-24T06:57:28.256Z"
---


Payment gateways
================

Payment gateways are a bridge between an e-shop and the world of online payments — thanks to them, customers can pay by card, fast bank transfer, Apple Pay, Google Pay, or other methods, without having to deal with anything outside your website. The `/payment-gateway` module is used to configure these gateways, test their connection, monitor payment success rates, and manage access credentials. Each organization can have multiple gateways configured simultaneously — for example, one for production and another in a sandbox for testing — as well as different gateways for different operational segments, so the module covers both small e-shops and extensive projects with multiple sales channels.

## Payment Gateway Overview

The table contains all configured gateways for the organization with summary data, allowing for quick orientation even in larger installations. Each row shows the unique gateway code (typically in the format `gopay-production`), the provider (GoPay, Comgate, or Stripe), an optional description for easier orientation, the environment (production, sandbox, or test), an active flag, the number of payments processed by the gateway, the creation date, and the last used timestamp. Inactive gateways remain visible in the overview but cannot accept new payments. However, they are still accessible for existing transactions for review or additional synchronization purposes, so disabling a gateway does not mean loss of history or audit limitations.

## Supported Providers

The administration currently supports three payment providers, which collectively cover most of the Czech and European markets. They differ primarily in the range of payment methods offered and geographical focus, but the technical integration behaves similarly for all from the administration's perspective.

| Provider | Payment Types | Environment |
| --- | --- | --- |
| **GoPay** | Payment cards, bank buttons, Apple Pay, Google Pay | production, sandbox |
| **Comgate** | Payment cards, online banking, QR payment | production, test |
| **Stripe** | Payment cards, Apple Pay, Google Pay, SEPA, recurring payments | production, test |

> ℹ️ The specific payment methods offered (cards, bank buttons, mobile wallets) are governed by the provider itself and your contractual package with them. In the administration, you only configure the connection to the gateway; the provider is responsible for the availability of individual methods on their end.

## Gateway Environment

Each gateway instance runs in one of three modes, which distinguish whether real money or test data is being processed. The choice of environment has a direct impact on the behavior of the entire administration — from customer redirection to the actual completion of an order.

- **Production (`p`)** — real payments from actual customers. Funds are transferred to your merchant account with the provider.
- **Sandbox (`s`)** — the provider's official testing environment with test cards. No real money is transferred.
- **Test (`t`) —** local administration testing mode without calling an external gateway, used only to verify the behavior of the order process.

> ⚠️ Always verify the entire payment flow in the sandbox before going live. Switching a gateway from sandbox to production means a change of environment and, in the vast majority of cases, also the replacement of all access keys, because providers separate production and test accounts at the authentication level itself.

## Adding a New Gateway

The **Add** button in the top right corner opens a dialog for adding a new gateway and guides you through the setup step-by-step. First, you select the provider (GoPay, Comgate, or Stripe), then choose a gateway code — a short slug that will help you identify the gateway (e.g., `gopay-production`); if you leave the field blank, the code will be generated automatically. Next, you enter a description that will appear in the list, choose the environment (the default is sandbox to prevent accidental production payments), and fill in the login credentials obtained from the provider — keys and identifiers vary by gateway type. After saving, the gateway will immediately appear in the list, and the system will usually test it automatically (see the Connection Testing section).

## Gateway Detail

Clicking on a gateway opens its detail page, divided into five tabs that together cover the entire lifecycle of the gateway from basic settings to performance monitoring.

- **Information** — basic gateway settings, code, description, environment, and activity status.
- **Connection** — connection status with the provider, option to test configuration, and an overview of masked data.
- **Credentials** — API keys and other sensitive data; opening this tab requires elevated permissions.
- **Payments** — list of transactions processed by the gateway, with the current status of each.
- **Statistics** — overview of payment success rates, average amount, and number of successful and unsuccessful transactions.

### Credentials Tab

Each provider uses its own combination of identifiers and keys, but conceptually it's a similar set. **Merchant ID** is your shop's identifier with the provider, **public key** serves as a public key that can be shared in gateway requests, **secret key** is a secret key for signing requests (never disclose this to third parties), and **secure key** is an additional signing key, which Comgate uses, for example.

> ⚠️ Secret keys are displayed masked in the interface — only the first and last characters are visible. The full content of the key can only be obtained directly from the provider's administration, which prevents its accidental leakage from screenshots or screen-sharing sessions.

## Connection Testing

A connection test is used to verify that the gateway is indeed working. After it's launched, the administration sends a control query to the provider's API and attempts to retrieve basic merchant data. The test is initiated either automatically (after saving or modifying credentials) or manually by clicking the **Test Connection** button in the Connection tab. The result is a clear success or failure response, and in case of failure, the administration will also display a specific error message from the provider — this usually indicates whether you entered a wrong key, chose an incorrect environment, or if your membership with the provider has expired.

> 💡 When changing keys, you can run the test with new values without overwriting the existing configuration. If the test passes, only then save the changes — this eliminates the risk of overwriting currently functional settings with non-functional data and thus interrupting customer payments.

## Payment Lifecycle in the Gateway

Every payment goes through four phases, which together describe what actually happens between clicking the "Pay" button in the shopping cart and completing the order. In the **creation** phase, the customer selects a payment method in the cart, the administration creates a payment request in the gateway, and redirects them to the provider's page. In the **waiting** phase, the customer confirms the payment in the bank or enters card details, and the gateway holds the transaction in a `PENDING` state. Upon **confirmation**, the gateway redirects the customer back to the e-shop and simultaneously calls a webhook to the administration with the payment status. And finally, in the **finalization** phase, the administration verifies the status with the gateway again for certainty (so-called synchronization), and if the payment is successful, it marks the order as **Paid**. A webhook callback is an internal communication channel between the gateway and the administration — it allows gateways to inform the system about status changes even if the customer does not return to the e-shop (for example, if they close the browser immediately after payment).

> ℹ️ If you suspect that the gateway did not send a callback or that it was not delivered, use the **Synchronize Payment** action in the payment detail — the administration will request the status again and potentially correct the final processing.

## Payment Propagation to Order and Invoice

Once the gateway confirms payment, the payment is automatically reflected in all related entities through linked integrations, eliminating the need for any manual completion. The payment itself transitions to `PAID` status, with the amount, provider, and date recorded. The order is marked as **Paid** and continues its workflow — usually heading for dispatch and delivery. An invoice, if already issued, transitions to **Paid** status with the payment date according to the payment. Conversely, if a payment fails (was canceled, rejected by the bank, or expired), the order remains open, and the customer is automatically prompted to pay again, so the entire process concludes in a controlled state without loss of the order.

## Statistics and Monitoring

The **Statistics** tab displays a performance overview for each gateway, which is essential for timely problem detection. Specifically, you will see the total number of payment attempts, the number of successful payments, the number of failed or canceled transactions, the number of payments still pending, the sum of paid amounts, and the success rate in percentages. The long-term trend of the success rate is the most sensitive indicator of the health of the payment flow — a sharp drop usually points to a problem that needs to be resolved as quickly as possible.

> 💡 If the success rate consistently drops below 80%, check with the provider whether you are seeing a higher number of rejected cards. This often involves the activation of fraud filters or a change in limits on their end, and prompt communication with provider support usually resolves the issue before it costs you a significant portion of your revenue.

## Best Practices

Always set up the gateway in the sandbox first and perform a test order before switching to production — this will save you most of the errors that are difficult to fix in live operation. Name gateway codes clearly (`gopay-production`, `stripe-eu`) to quickly orient yourself when managing multiple business units. If a gateway is not actively used, disable it instead of deleting it; payment history will remain traceable, and you can reactivate the gateway if needed. Regularly monitor statistics — a sharp drop in success rate is the first sign of a change on the provider's side, and a timely reaction is usually easy, whereas a delayed one can mean lost revenue. And finally: always change access keys when a team member who knew them leaves. The administration allows for key replacement without disrupting active payments, so security hygiene can be maintained without any impact on customers.

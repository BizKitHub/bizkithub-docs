---
code: "usage"
category: "system"
tags: ["type-overview", "billing", "limits"]
published_at: "2026-11-24T00:00:00.000Z"
---


Usage and plan limits
=====================

Every organisation runs on a plan. A plan includes an allowance for each metered resource, such as storage, API requests or e-mails sent. The **Usage** page shows how much of each allowance you have used in the current billing period, how usage developed day by day, and what any usage above the allowance costs.

Usage above an allowance is called **overage**. It is billed in whole packages: if a plan includes 10 000 e-mails and the package size is 1 000, then 10 250 sent e-mails count as one package of overage.

## Where to find it in the admin

- **Usage** in the menu: the daily usage dashboard with two tabs, **Overview** and **Pricing**.
- **Settings → Tariff**: your current plan, its price, billing dates, all limits and a 12-month usage history.

## The metered resources

| Metric | What is counted | How it accumulates |
|---|---|---|
| **Storage** | Space occupied by all files of the organisation: attachments, product images, e-mails, documents. | A daily snapshot of the total; deleting files lowers it. |
| **API requests** | Authenticated requests to the public API made with your organisation's API keys. | Summed over the billing period. |
| **AI tokens** | Text processed by AI features in your organisation, measured in tokens. | Summed over the billing period. |
| **Emails sent** | E-mails sent by the organisation. | Summed over the billing period. |
| **New orders** | Orders created in the organisation. | Summed over the billing period. |

The [API key](/api-key-overview) article explains how requests are authenticated; [Rate limiting](/rate-limiting-overview) covers the separate request-rate limits of the API, which are not part of the plan allowance. AI features are described in [AI assistant and agents](/ai-assistant).

## The Overview tab

The header shows the **Current tariff** with its monthly price, the **Billing period** and the **Overage this month**: the total amount charged so far for usage above your allowances.

**Daily usage over the last 30 days** shows one card per metric:

- the usage in the current billing period against the limit,
- the remaining allowance, or the overage and its price once you are over,
- a progress bar of the used share,
- a daily bar chart in real units. The dashed line is the average daily quota: the limit divided by the number of days in the billing period. Bars that keep rising above the line mean you will run out before the period ends.

**Metrics overview** repeats the same data in a table with the columns **Metric**, **Trend (30 days)**, **Usage / limit**, **Overage** and **Price**. You can sort and filter the table and export it to CSV.

A metric marked **Unlimited** has no cap in your plan. Its usage is still shown, but it never produces overage.

## The Pricing tab

The **Pricing** tab lists every metric for every plan. Each cell shows three values:

- how many units the plan includes,
- the package size for overage,
- the price of one package.

The Enterprise plan has individual limits and a contractual price, so it appears as a note below the table rather than in it. If you are already over an allowance, the tab also states the overage charged for the current period.

## Plan limits in Settings

**Settings → Tariff** gives the full picture of your plan:

- **Current plan**, **Effective price** (the catalogue price, or your discounted or custom price), **Active from**, **Active until** and **Paid until** with the number of days left.
- **Resources & Limits**: used against limit for products, orders per month, storage, AI tokens per month, API requests per month, e-mails per month, members, customers and forms. Products, members, customers, forms and storage are running totals; the other limits restart every month.
- **Usage History**: monthly counters for the last 12 months. Months without usage show zero.

Each resource carries a status badge:

| Status | Usage of the limit |
|---|---|
| **OK** | Below 80 % |
| **Warning** | 80 % to below 95 % |
| **Critical** | 95 % to below 100 % |
| **Over limit** | 100 % or more |
| **Unlimited** | The plan has no cap for this resource. |

The same tab warns you when the subscription has expired, when it expires within 14 days, and when no paid-until date is set.

If your organisation was sold by a partner, the tab also shows the **Reseller / technical partner** and its contact person.

## Changing the plan

Your plan is assigned and changed by BizKitHub; the tab reads "Managed by system administrators". To move to another plan, contact [support](https://support.bizkithub.com) or your partner. Every plan change is recorded in your organisation's [system log](/log-overview). The plans themselves are described in [Free plan](/free-tier-overview).

## Examples

- **Storage close to the limit.** The Storage card shows 4.7 GB of 5 GB and the badge **Critical**. Delete old e-mail attachments or unused product images, or ask for a larger plan before the next uploads push you into overage.
- **A traffic spike on the API.** The API requests chart jumps above the dashed line for three days after you connected a new storefront. Check that the storefront caches product data instead of requesting it on every page view.
- **Overage already charged.** **Overage this month** shows an amount and the Emails sent card shows "+1 250" over the limit. With a package size of 1 000, that is two packages; the **Pricing** tab shows the price per package.

## Related

- [Free plan](/free-tier-overview)
- [API key](/api-key-overview)
- [Rate limiting](/rate-limiting-overview)
- [AI assistant and agents](/ai-assistant)
- [Organization](/organisation-overview)

---
code: "shipping-methods"
category: "sales"
tags: ["type-overview", "shipping", "checkout"]
published_at: "2026-11-24T00:00:00.000Z"
---


Shipping methods
================

A shipping method is a delivery option the customer chooses at checkout, such as "Zásilkovna pickup point", "GLS home delivery" or "Personal pickup". Each method has a price list by destination country, order value and parcel weight, can take part in free shipping from a threshold, and can be linked to a carrier so that the parcel label is created with the right carrier account and service.

When your storefront sends the chosen method with the order, BizKitHub calculates the delivery fee itself, adds it to the order as a line, and remembers the method and the pickup point for creating the shipment later. This article covers the configuration of methods and prices. Creating shipments and labels is described in [Shipments and carriers](/shipments-and-carriers).

## Where to find it in the admin

Open **Shop → Shipping** and go to the **Delivery methods** tab. The tab lists methods with their segment, carrier, number of price rules and countries, and flags for free shipping, visibility and default. Below the list is the **Free shipping by order value** section. Click a method to open its detail with the basic settings and the **Price list**.

## Creating a shipping method

Click **+ New shipping method** and fill in the basic details. You can change all of them later in the method detail.

| Field | Meaning |
|---|---|
| **Name** | Shown to the customer in the cart, for example `GLS ParcelShop`. |
| **Internal code** | Stable identifier for the API and integrations, for example `gls-parcelshop`. It stays the same when you rename the method. Your storefront sends this code with the order. |
| **Description** | Optional text for the customer in the cart. |
| **Segment** | Who sees the method: `All (retail and wholesale)`, `Retail only` or `Wholesale only`. Customers in a wholesale customer group are wholesale; everyone else, including anonymous visitors, is retail. |
| **Order** | Position in the cart. A lower number is higher. |
| **Carrier** and **Carrier service** | The carrier that delivers the parcel and its service, such as home delivery or delivery to a pickup point. Leave empty for personal pickup or your own delivery. |
| **API account for shipments** | The carrier account preselected when a shipment is created for an order with this method. The packing table uses it to create labels automatically. |
| **Active (master switch)** and **Visible in the cart** | A method that is inactive or hidden is not offered in the cart. |
| **Eligible for free shipping** | Free-shipping rules apply to this method only when this is on. |
| **Base price incl. VAT** | The fallback price, used when no price rule matches. Set `0` for personal pickup. |

## Price list

The **Price list** in the method detail is a set of rules. Each rule has a **Country**, a **VAT classification**, an order value range (**Value from**, **Value to**, both including VAT), a weight range in grams (**Weight from**, **Weight to**), a **Price incl. VAT** and an **Order**. An empty upper bound means no limit.

Ranges include the upper bound and exclude the lower one, except a lower bound of zero, which is included. A parcel of exactly 3,000 g therefore falls into a 0–3,000 g rule, not into a 3,000–12,000 g rule.

The platform picks the rule as follows:

1. It takes the rules of the destination country.
2. It keeps the rules whose value range contains the order value and whose weight range contains the parcel weight. The order value is the sum of item prices after item discounts; the weight is the sum of product weights (the **Weight (g)** field on the product).
3. If several rules match, the cheapest wins. On equal price, the lower **Order** wins.

**Example.** A method for the Czech Republic has these rules:

| Value | Weight | Price incl. VAT |
|---|---|---|
| 0 – ∞ | 0 – 5,000 g | 89 |
| 0 – ∞ | 5,000 – 15,000 g | 149 |
| 2,000 – ∞ | 0 – 15,000 g | 0 |

A 1,200 CZK order weighing 4 kg matches only the first rule and pays 89. A 2,500 CZK order weighing 8 kg matches the second and the third rule; the third is cheaper, so delivery is free. A 20 kg parcel matches no rule.

A method is offered in the cart only when it has at least one rule for the destination country. Without any rule, the method does not appear.

### Coverage warnings

The method detail shows **Price list coverage warnings** when rules for a country leave a gap (for example nothing between 5,000 and 6,000 g, or between two order values) or overlap. Gaps mean some carts get no offer; overlaps are allowed, but check that the cheaper rule is the one you want.

## Free shipping by order value

Free-shipping rules are global for the organisation. Each rule has a **Country**, a **Segment** (`All customers`, `Retail only` or `Wholesale only`) and a **Threshold** (order value after discounts, including VAT). The threshold is in the currency of the country.

When the order value reaches the threshold, every method flagged **Eligible for free shipping** costs zero for that country and segment. If several rules apply, the lowest reached threshold is used.

**Example.** A rule "Czech Republic, All customers, 1,500" makes all eligible methods free from 1,500 CZK. A method without the flag, such as an express courier, keeps its price-list price.

## How the fee reaches the order

Your storefront lists the available methods through the cart (see [Cart](/cart-overview)) and sends the customer's choice with the order through the [Order create API](/order-create-api):

```json
{
  "customer": { "email": "jana.novakova@example.com" },
  "items": [{ "label": "Starter set", "productCode": "starter-set", "count": 1 }],
  "deliveryCode": "gls-parcelshop",
  "deliveryPointId": "CZ60200-PSHOP017",
  "paymentCode": "cod"
}
```

- `deliveryCode` is the **Internal code** of the method. An unknown code rejects the order with `404`.
- When `deliveryCode` is sent, BizKitHub calculates the fee from the price list and free-shipping rules for the destination country, and any `deliveryPrice` you send is ignored. A fee above zero is added to the order as an ordinary line named after the method, so the total, the invoice and the payment amount include it.
- If no price rule matches, the **Base price** is used and a warning is written to the order log.
- `deliveryPointId` is the pickup point chosen by the customer. It becomes the destination of the shipment. For GLS, search pickup points with the API described in [Shipments and carriers](/shipments-and-carriers#pickup-points); for Zásilkovna, use the point id returned by the Zásilkovna widget.
- `paymentCode` is the code of the payment method. A fee above zero is also added as a line.

> **Warning.** Without `deliveryCode` and `deliveryPointId`, the order has no shipping method. The shipment cannot be prefilled, and the packing table cannot create the label automatically.

The calculated price, the rule used and whether free shipping applied are stored with the order. Later changes to the price list do not change existing orders.

## Related

- [Shipments and carriers](/shipments-and-carriers): carrier accounts, labels, tracking and pickup points.
- [Fulfillment (pick and pack)](/fulfillment-pick-and-pack): label printing at the packing table.
- [Order create API](/order-create-api): the full order payload.
- [Cart](/cart-overview): delivery and payment selection in the storefront.

---
code: "shipments-and-carriers"
category: "sales"
tags: ["type-overview", "shipping", "carriers", "api"]
published_at: "2026-11-24T00:00:00.000Z"
---


Shipments and carriers
======================

A **shipment** is one parcel sent to a customer through a carrier. BizKitHub creates the parcel at the carrier through your own carrier account, stores the label, follows the tracking, e-mails the customer at the important moments and moves the order to the matching status. You connect each carrier once with your contract credentials; after that, labels are created from the order detail, the order list or the packing table.

Two carriers can create shipments today: **Zásilkovna (Packeta)** and **GLS**. Accounts for **PPL**, **DPD** and **Česká pošta** can be saved, but their integration is not finished yet and they cannot create shipments.

## Where to find it in the admin

Open **Shop → Shipping**. The module has four tabs:

- **Shipments**: every parcel across all carriers.
- **Delivery methods**: what the customer chooses at checkout. See [Shipping methods](/shipping-methods).
- **Carriers**: your carrier API accounts.
- **Carrier invoices**: imported carrier invoices checked against your parcels.

Each order detail also has a **Shipments** section with the parcels of that order.

## Connecting a carrier

1. Go to the **Carriers** tab and click **Add carrier**.
2. Pick the **Carrier** and enter a **Configuration label**, for example `GLS production`.
3. Fill in the credentials from your carrier contract:
   - **Zásilkovna:** `API password` and `E-shop identifier`.
   - **GLS:** `Username (MyGLS e-mail)`, `MyGLS password`, `Client number` and the `Label format` (`A4_2x2`, `A4_4x1`, `Thermo` or `ThermoZPL`). Use `Thermo` for a label printer.
4. Fill in the **Sender address** printed on the label.
5. Optionally set a **Default service code**, and switch on **Sandbox mode** for a test account.
6. Save. The login is verified automatically after saving.

You can save incomplete credentials and finish them later. The **Connection** column shows the result:

| State | Meaning |
|---|---|
| `Verified` | The carrier accepted the login. The account can create shipments. |
| `Login failed` | The carrier rejected the login. The error message is shown. |
| `Incomplete` | Some credentials are missing; the message lists them. |
| `Integration in progress` | The carrier's integration is not finished (PPL, DPD, Česká pošta). |
| `Not verified` | The login has not been checked yet. Use **Verify connection** from the row menu. |

The carrier detail shows statistics (shipments, parcels in transit, API calls and errors in the last 24 hours) and the tabs **Settings**, **Shipments**, **Services**, **Shipping methods**, **API log** and **Handover protocols**. The **API log** lists every request to the carrier with its response; passwords and label contents are not stored.

## Creating a shipment

There are three ways to create a shipment:

- **One click from the order detail.** In the order's **Shipments** section, click **Create shipment**. The carrier account, service, pickup point and weight are taken from the order's shipping method; the weight is the sum of product weights, or 1 kg when a product has no weight. If something is missing, the form opens with the reason so you can fill it in manually.
- **For many orders from the order list.** Select up to 50 orders and use the bulk action **Create shipments**. The result lists how many were created, how many already existed and which failed. Orders that fail are put on hold in [Fulfillment](/fulfillment-pick-and-pack) with the error as the reason.
- **At the packing table.** See [Fulfillment (pick and pack)](/fulfillment-pick-and-pack).

An order never gets a second shipment from the one-click and bulk paths. To send a second parcel deliberately, use **Add shipment** and fill in the form.

The manual form takes the order, the carrier account, the weight and dimensions, the carrier service, the **Pickup point ID** and the **Cash on delivery** amount and currency. A home-delivery parcel needs a full delivery address (street, city, postal code); a pickup-point parcel needs the customer's e-mail or phone.

**Cash on delivery** is set automatically on one-click, bulk and packing-table shipments when the order is unpaid and its payment method is cash on delivery. The amount is the order total.

## Labels

The label PDF is downloaded from the carrier and stored as soon as the shipment is created. Open it with **View label** in the shipment detail, print it, or download several at once with **Download labels** on the Shipments tab. GLS issues each label only once, so the stored copy is the one you reprint.

## Shipment states and tracking

Tracking is refreshed automatically about every 15 minutes for open parcels up to 60 days old. Use **Refresh** in the shipment detail for an immediate update.

| State | Meaning | Order status set automatically |
|---|---|---|
| `Created` | The label exists; the carrier does not have the parcel yet. | Ready to ship |
| `Handed over`, `In transit` | The carrier has the parcel. | Shipped |
| `Ready for pickup` | The parcel waits at a pickup point. | Ready for pickup |
| `Delivered` | The customer received the parcel. | Delivered (a completed status) |
| `Undeliverable` | The carrier reports a delivery problem. | Delivery failed |
| `Returned` | The parcel went back to the sender. | Returned |
| `Cancelled` | The shipment was cancelled. | No change |

The order statuses in the last column are created in your [order workflow](/workflow-overview) the first time they are needed; you can rename and recolour them. The order only moves forward and only while it is new or in progress, never out of a completed or cancelled status. With several parcels, the order follows the least advanced parcel, and a returned or failed parcel takes priority.

Further automatic effects:

- **Delivered with cash on delivery.** The collected amount is recorded as a payment. When it covers the order total, the order is marked as paid, which runs the usual paid actions such as issuing the invoice.
- **Returned.** The goods are put back on stock (see [Warehouse and stock](/warehouse-and-stock)), and the order log asks you to decide whether to resend or cancel the order.
- **Order cancelled.** Parcels that the carrier does not have yet are cancelled at the carrier. Parcels already on the way cannot be recalled; the order log warns you.

### Customer e-mails

The customer receives an e-mail when the shipment is created (with the tracking number, sent 15 minutes later so that a label cancelled by mistake does not notify anyone), when the parcel is ready for pickup, when it is delivered, and when there is a delivery problem. Each e-mail is sent at most once per shipment. **Resend e-mail** in the shipment detail sends the tracking e-mail again.

### Changing the state manually

Use **Change status** when the carrier does not report reality, for example a parcel handed over in person. Enter the new status and a reason, and decide whether to e-mail the customer. A manual status overrides tracking: carrier events are still stored but do not change the status until you click **Resume carrier tracking**.

### Parcels that need attention

The **Needs attention** filter on the Shipments tab shows parcels that:

- have not been handed over to the carrier for more than 3 days;
- have had no carrier update for more than 7 days;
- have waited at a pickup point for 5 days or more;
- became undeliverable or returned within the last 7 days.

### Cancelling a shipment

Click **Cancel shipment** in the shipment detail. A delivered or returned parcel cannot be cancelled.

## Handover protocols

On the **Handover protocols** tab of a carrier account, click **Create protocol**. The protocol lists every parcel of the account that waits for pickup and is not on a protocol yet. Print it as a PDF for the driver to sign. With **Mark the parcels as handed over to the carrier** checked, the parcels move to `Handed over`.

## Carrier invoices

The **Carrier invoices** tab checks what the carrier charged you. Click **Import invoice**, pick the carrier account, enter the invoice number and issue date, and upload the CSV export of the invoice (UTF-8 or Windows-1250). The tracking number, price and weight columns are detected automatically; correct the mapping if needed. Surcharge rows of the same parcel are added up. Importing the same invoice number again replaces it.

Each invoice line is matched to a shipment by tracking number and marked `Matched`, `Unknown parcel` or `Charged again`. The detail also highlights a higher billed weight than declared, shows the shipping price the customer paid next to the carrier price, and lists **Shipments without an invoice** from the invoice period.

## Public API

All endpoints authenticate with your API key in the `apiKey` query parameter. See [API keys](/api-key-overview) and the [API explorer](/swagger).

### Pickup points

Use this endpoint to build a GLS pickup point picker in your checkout (ParcelShops and lockers in the Czech Republic and Slovakia, refreshed daily from GLS). Send the chosen `pointId` as `deliveryPointId` when you create the order.

```http
GET https://api.bizkithub.com/api/v1/shipment/delivery-point/search?apiKey=YOUR_API_KEY&carrier=gls&country=CZ&query=Brno%20Lidick%C3%A1&limit=5
```

| Parameter | Meaning |
|---|---|
| `carrier` | Required. Currently `gls`. |
| `country` | Two-letter country code. |
| `query` | Words matched against name, street, city, ZIP and id. |
| `lat`, `lng` | With coordinates, the nearest points come first and each carries `distanceKm`. |
| `type` | `shop` (ParcelShop) or `locker`. |
| `codOnly` | `true` returns only points that accept cash on delivery. |
| `limit` | 1 to 100, default 20. |

```json
{
  "items": [
    {
      "carrierCode": "gls",
      "pointId": "CZ60200-PSHOP017",
      "country": "CZ",
      "type": "shop",
      "name": "PLODY MORAVY s.r.o.",
      "street": "Lidická 45",
      "city": "Brno",
      "zip": "60200",
      "lat": 49.2051,
      "lng": 16.6068,
      "acceptsCod": true,
      "openingHours": [{ "day": 1, "from": "08:30", "to": "18:00" }],
      "isActive": true
    }
  ]
}
```

`GET /api/v1/shipment/delivery-point/detail?carrier=gls&pointId=…` returns one point. `isActive` is `false` when the point has disappeared from the carrier's list.

### Tracking and label

- `GET https://api.bizkithub.com/api/v1/shipment/{id}/tracking` returns the state, tracking number, tracking URL, carrier and the full event history of a shipment. The `{id}` is the 16-character shipment id. A shipment of another organisation returns `404`.
- `GET https://api.bizkithub.com/api/v1/shipment/{id}/label.pdf` redirects (`302`) to a short-lived link to the label PDF.

### Webhook events

When your organisation receives outbound webhooks, shipments emit `shipment.created` and `shipment.state_changed`. The payload carries the shipment (id, state, previous state, direction, carrier, service, tracking number and URL, weight, cash on delivery) and the order number and hash.

## Related

- [Shipping methods](/shipping-methods): checkout options, prices and the link to a carrier account.
- [Fulfillment (pick and pack)](/fulfillment-pick-and-pack): labels at the packing table.
- [Orders](/order-overview) and [Workflow](/workflow-overview): order statuses.
- [Complaints](/complaint-overview): return parcels for complaints.

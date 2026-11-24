---
code: "warehouse-and-stock"
category: "sales"
tags: ["type-overview", "warehouse", "stock"]
published_at: "2026-11-24T00:00:00.000Z"
---


Warehouse and stock
===================

The Warehouses module keeps track of how many units of each product you physically hold, where they lie and how they got there. Every change of stock is a **movement**: a stock-in from a supplier, a stock-out, a transfer between shelves or buildings, a correction after a count, or a reservation made by an order. The current quantity of any item is the result of its movements, and the movement history is kept in full.

The module is connected to orders. When a customer places an order, the ordered goods are reserved in the warehouse; when the order is paid, the reservation becomes a stock-out; when the order is cancelled, the goods return to stock. You can also let the warehouse drive the stock numbers that your storefront shows (see [Stock on the storefront](#stock-on-the-storefront)).

## When you would use it

- You sell physical goods and want to know what is on hand, in which warehouse and on which shelf.
- You run more than one stock location and move goods between them.
- You receive goods in lots and need to know which lot was sold or written off.
- You want the storefront to stop selling a product once the last unit is reserved.

## Where to find it in the admin

Open **Shop → Warehouses**. The list page has six tabs:

| Tab | What it shows |
|---|---|
| `Warehouses` | All warehouses of the organisation with their code, city, number of stock items and total units. |
| `Low stock` | Items below their minimum level, with a badge showing the count. |
| `Dead stock` | Items with stock but no recent movement. |
| `Movements` | The movement log across all warehouses, filterable by type and date. |
| `Stocktake` | Stocktake sessions. See [Stocktake](/warehouse-stocktake). |
| `Production` | Production orders. See [Production orders](/warehouse-production-orders). |

The **Stock** tab of the product detail (see [Products](/product-overview)) shows a product's stock per warehouse and per variant, with buttons to stock it in or out.

## Warehouses

Create a warehouse with **New warehouse**. You enter a name, a code, an optional description and two switches:

- **Warehouse code** must be unique within the organisation (for example `PRG-MAIN`). It appears in the address of the warehouse detail and cannot be changed after creation. Rename the warehouse through its name instead.
- **Set as default warehouse.** Exactly one warehouse is the default. Orders reserve and take stock from the default warehouse. If there is no default, the first active warehouse is used. Change the default from the row menu with **Mark as default**.
- **Allow negative stock** is on by default. While it is on, a stock-out, transfer or correction may push the quantity below zero, which suits back-orders, dropshipping and items you do not count precisely. Turn it off for a strict physical warehouse: the platform then refuses manual operations that would take more units than are on hand.

An inactive warehouse keeps its history but is skipped by automation and default pickers. Use it to archive a warehouse. You can delete a warehouse only when it holds no units; move or write off the stock first.

## Locations

A **location** is a physical place inside a warehouse: a rack, a shelf or a bin. Create locations on the **Locations** tab with a code (for example `A-12-3`), an optional name and an optional parent location, so you can build a hierarchy such as rack, shelf and bin. Each stock operation can target a location; stock without a location is "loose in the warehouse". A location can be deleted only when it holds zero units.

## Stock operations

The warehouse detail header and the **Stock** tab offer four buttons. Each creates one or more movements.

| Button | Use it for | Effect |
|---|---|---|
| `Stock in` | Goods received from a supplier, returns, opening balances. | Adds units to a warehouse and optional location. |
| `Stock out` | Goods leaving outside an order: samples, internal use, a sale recorded elsewhere. | Removes units from a warehouse and optional location. |
| `Transfer` | Moving goods between warehouses, or between two locations of one warehouse. | Removes units at the source and adds them at the target in one step. If the source is short, nothing is moved. |
| `Adjust` | Corrections: goods found, damaged, lost or stolen. | Adds or removes units by a delta. The delta can be negative but not zero. |

Each operation takes a product (and variant, where the product has variants) or a **virtual SKU** for items that are not in the catalogue, such as packaging material. Quantities may have up to three decimal places, so you can stock 2.5 metres of fabric when the product's stock unit is metres. Add a note with the delivery-note number or the reason; it stays on the movement.

**Example.** You receive 40 units of a product from a supplier. Open the warehouse, click **Stock in**, pick the product, location `A-12-3`, enter `40` and the note `Delivery note 2026-1187`. The Stock tab now shows 40 units at `A-12-3`, and the Movements tab shows a `Stock in` movement with your name and the note.

Operations are blocked inside the scope of an open stocktake that locks movements. Finish or cancel the stocktake first.

### Lots

Products with **Track lots** switched on (product detail) are stocked per lot. A stock-in then requires the lot number from the delivery note or label. A stock-out without a chosen lot takes units from the oldest lots first, and may split into several movements, one per lot. Customers never see lots; the storefront shows the total.

### Products that are not stocked

Switch off **Keep in warehouse** on a product for services, digital products and e-vouchers. Orders then neither reserve nor deduct the product, and the shop sells it regardless of stock.

## Movements

The **Movements** tab is the audit log. Each row shows the type, the item, the source (**From**), the target (**To**), the number of units, the note, the member who made it (**By**) and the time (**When**). An empty **By** means the movement was created automatically, for example by an order.

| Type | Created by |
|---|---|
| `Stock in`, `Stock out`, `Transfer`, `Adjustment` | The operations above, or an approved stocktake (adjustments). |
| `Reservation` | An order was placed; the units are held for it. |
| `Reservation released` | An unpaid order was cancelled or expired; the units are free again. |
| `Reservation committed` | The order was paid; the held units left the warehouse. |
| `Used in production`, `Produced` | A completed [production order](/warehouse-production-orders). |

## How orders change stock

Stock follows the [order lifecycle](/order-overview) without any manual step:

1. **Order created.** Each stocked line is reserved in the default warehouse. Reserved units stay on hand but are no longer available. A bundle reserves its components, not the bundle itself. Lines without a product, event tickets and products that are not stocked are skipped.
2. **Order paid.** The reservation turns into a stock-out. A paid order is always honoured: if the units are no longer there, the stock goes negative and an error is logged for follow-up.
3. **Order cancelled.** An unpaid order releases its reservation. A paid order books the units back into stock. A cancelled item does the same for that item only.
4. **Parcel returned to sender.** When the carrier reports a returned parcel, the goods are put back on stock (see [Shipments and carriers](/shipments-and-carriers)).

A reservation has no time limit. It ends when the order is paid or cancelled. Unpaid orders release their stock when the order itself expires, according to the expiration set on the payment method.

## Stock on the storefront

By default, the stock number your storefront reads from the product API is the number kept on the product card, independent of the warehouse module. An organisation can switch to **warehouse-driven stock**. The platform then:

- copies the available quantity (units on hand minus reserved units, never below zero) from all active warehouses to each product and variant, about every two minutes;
- computes the stock of a bundle as the number of complete bundles its components allow;
- leaves products with **Keep in warehouse** switched off untouched;
- rejects a new order that asks for more than the default warehouse has available, if that warehouse does not allow negative stock. The API answers `409` with the error `PUBLIC_PRODUCT_OUT_OF_STOCK` ("Product is out of stock.") and the order is not created.

> **Warning.** Switching to warehouse-driven stock with empty warehouses sets every product to zero on the storefront. Stock in your current quantities first, then ask [support](https://support.bizkithub.com) to switch the organisation over.

Storefront developers should handle the `409` response by reloading availability and asking the customer to lower the quantity. See [Errors](/errors) and [Order create API](/order-create-api).

## Low stock and dead stock

The **Low stock** tab lists items whose quantity is below their minimum level, sorted by how far below they are. The minimum level is shown in the **Min. level** column of the Stock tab, and the quantity turns red when it is below. Every breach is also written to the organisation's system log as a warning, at most once a day per item.

The **Dead stock** tab lists items that have units on hand but no movement for the number of days in the **Threshold (days)** field. The default is 90 days; raise it for slow-moving goods such as furniture.

## Related articles

- [Stocktake](/warehouse-stocktake): count the warehouse and write the differences to stock.
- [Production orders](/warehouse-production-orders): turn material into finished products and calculate their cost.
- [Fulfillment (pick and pack)](/fulfillment-pick-and-pack): pick and pack orders at the packing table.
- [Products](/product-overview): product cards, variants, lots and bundles.

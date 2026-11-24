---
code: "warehouse-production-orders"
category: "sales"
tags: ["type-overview", "warehouse", "production"]
published_at: "2026-11-24T00:00:00.000Z"
---


Production orders
=================

A production order turns material from your warehouse into a finished product. It takes the material listed in the product's **bill of materials**, writes it off from stock, receives the finished units into stock and calculates what one unit cost to make. Use it when you assemble, sew, bottle or pack your own products and want the warehouse and the product cost to reflect that work.

The unit cost is calculated from real numbers: the purchase prices of the material lots actually consumed (oldest lots first) plus labour (hours multiplied by an hourly rate), divided by the quantity produced. On completion, this cost is also stored as the product's catalogue cost.

## When you would use it

- You make products from components you buy and keep in stock, for example a gift set assembled from three products and a box.
- You need the cost of each production run for pricing or margin reporting.
- You track lots and want the finished product to carry its own lot number.
- You want material reserved for a planned run so that orders do not sell it in the meantime.

## Where to find it in the admin

- **Shop → Warehouses → Production** lists production orders and holds the **New production order** and **Labour types** buttons.
- The **Bill of materials** tab on the product detail defines what the product is made of. See [Products](/product-overview).

## Core concepts

**Labour type.** A kind of work with an hourly rate, for example `Sewing` at 450 per hour or `Assembly` at 380 per hour. Manage them with the **Labour types** button. A rate change applies only to production orders created afterwards.

**Bill of materials.** The recipe of a product: material lines (a product or variant and a quantity) and labour lines (a labour type and a number of hours). Quantities are entered per production run, and **Run yields (units)** says how many finished units one run produces (empty means 1). A product with variants can have one bill for the whole product and separate bills for individual variants; a variant without its own bill uses the product's bill. The tab shows an **Estimated unit cost** from catalogue purchase prices; it is indicative only.

**Production order.** One run of production for a given quantity. It is numbered, and moves through the states `Planned`, `In production`, `Completed` or `Cancelled`.

## Setting up a bill of materials

**Example.** You sell a "Starter set" made of one terrarium, one bag of substrate, two feeding dishes and 15 minutes of assembly.

1. Click **Labour types** on the Production tab and add `Assembly` with its hourly rate.
2. Open the Starter set product and go to the **Bill of materials** tab.
3. Click **Add material** and add the terrarium with quantity `1`, the substrate with `1` and the feeding dish with `2`.
4. Click **Add labour**, pick `Assembly` and enter `0.25` hours.
5. Leave **Run yields (units)** empty (one run makes one set) and click **Save bill of materials**.

The estimated unit cost appears below the lines. If any material has no purchase price, the tab warns that the estimate is too low.

## Running production

1. On the Production tab, click **New production order**.
2. Pick the **Product** and enter the **Quantity to produce**, for example `20`. The material and labour lines are scaled from the bill of materials and copied to the order. Later changes to the bill do not affect this order.
3. Pick **Material from warehouse** and **Finished product to warehouse**, optionally a **Location of the finished product**, and optionally the **Lot of the finished product**. For a product that tracks lots, the production order number is used as the lot when you leave the field empty.
4. Click **Create production order**. The order is `Planned`. Nothing is reserved yet.
5. While the order is planned, you can open it and use **Change lot** on a material line to take a specific lot. Without a choice, the oldest lot is used.
6. Click **Start production**. The material is reserved in the source warehouse so nobody else uses it, and the order is `In production`. If material is missing, the order shows a **Missing material** panel, for example "Feeding dish: needed 40, available 32, missing 8", and stays planned.
7. Click **Complete production** and confirm. In one step, the material is written off (movements `Used in production`), the finished units are received (movement `Produced`), and the unit cost is calculated and stored on the order and on the product.

You can complete a planned order directly; it is started and completed in the same step. If anything is missing at that moment, nothing is written.

## How the cost is calculated

On completion, the platform values each consumed material unit at the purchase price of the lot it came from, oldest lot first. Labour is hours multiplied by the hourly rate stored on the order. The unit cost is:

```text
unit cost = (material cost + labour cost) / quantity produced
```

**Example.** Twenty Starter sets consume material worth 6,400 and 5 hours of assembly at 380 per hour (1,900). The unit cost is (6,400 + 1,900) / 20 = 415.

Material units that have no purchase price in stock are valued at the product's catalogue cost instead, and the completion message says how many units were valued this way. Purchase prices of received goods come from the cost set on the product or variant at the time of the stock-in.

## Cancelling

Click **Cancel** on a planned or in-progress order. The material reservations are released and nothing is written off. A completed order cannot be cancelled; correct stock with an adjustment instead (see [Warehouse and stock](/warehouse-and-stock)).

## What can go wrong

| Message | Meaning | Fix |
|---|---|---|
| "This product has no bill of materials." | The product has no material lines. | Add a bill of materials on the product. |
| A **Missing material** panel on a planned order | The source warehouse does not have enough free material (on hand minus reservations, including reservations made by customer orders). | Stock in the material, transfer it from another warehouse, or lower the quantity. |
| "The reserved material is no longer physically in stock" on an in-progress order | In a warehouse that allows negative stock, someone took the reserved units in the meantime. | Restock the material or cancel the order. |
| Completion refused for a lot-tracked product | The finished product needs a lot number. | Set the lot on the order, then complete it. |

## Related

- [Warehouse and stock](/warehouse-and-stock): warehouses, lots and movements.
- [Stocktake](/warehouse-stocktake): counting the warehouse.
- [Products](/product-overview): product cards, variants and bundles.

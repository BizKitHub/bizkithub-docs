---
code: "warehouse-stocktake"
category: "sales"
tags: ["type-guide", "warehouse", "stocktake"]
published_at: "2026-11-24T00:00:00.000Z"
---


Stocktake
=========

A stocktake compares the stock recorded in BizKitHub with the quantity you physically count, then writes every difference to the warehouse as a correction. Use it for the annual inventory, for a spot check of one shelf, or whenever the numbers on the storefront stop matching what is on the shelves.

A stocktake moves through five states: `Draft`, `In progress`, `In review`, `Approved` and `Cancelled`. Nothing changes in stock until you approve it, and an approved stocktake cannot be undone. This guide walks through one stocktake from creation to approval.

## What you need before you start

- A warehouse with stock. See [Warehouse and stock](/warehouse-and-stock).
- Locations, if you want to count one shelf or rack at a time instead of the whole warehouse.
- Access to the Warehouses module.

## Steps

1. Open **Shop → Warehouses** and go to the **Stocktake** tab, or open a warehouse and use its **Stocktake** tab.
2. Click **New stocktake**.
3. Pick the **Warehouse**. Optionally pick a **Location**; the stocktake then covers only the stock at that location. Without a location it covers the whole warehouse.
4. Enter a **Stocktake name**, for example `Annual stocktake 2026`.
5. Decide on **Block stock movements within the stocktake scope**. When it is on, no stock-in, stock-out, transfer or adjustment is possible in the selected warehouse or location until the stocktake is approved or cancelled. Turn it on when goods must not move during the count.
6. Click **Create stocktake**. The stocktake is created as a `Draft` with one row per item that has stock in scope. Items with zero stock are not listed; add them as found items if you find any. Each row records the **Expected** quantity: the system stock at the moment of creation.
7. Open the stocktake and click **Start stocktake**. Its state becomes `In progress` and counting can begin.
8. For each row, enter the **Counted** quantity and click **Save count**. You can pick a **Reason** for a difference (`Record error`, `Damage`, `Theft`, `Found extra` or `Other reason`) and add a note. Recounting a row overwrites the previous count.
9. If you find goods that the stocktake does not list, click **Add found item**. Pick the product (or enter a virtual SKU), the location, an optional lot and the counted quantity. The expected quantity of the new row is taken from current stock, or zero.
10. When counting is done, click **Submit for review**. The state becomes `In review`. Counts can still be corrected in this state.
11. Check the rows with a difference (filter **With difference**) and the **Total deviation**.
12. Click **Approve**, then **Approve and write differences**.

## What approval does

Approval creates one `Adjustment` movement for each row where the counted quantity differs from the expected quantity. The movement carries the difference: a row expected at 12 and counted at 10 produces an adjustment of −2. Rows without a difference produce nothing. Rows that were never counted are skipped; they keep their current stock.

**Example.** A stocktake of location `A-12` has three rows:

| Item | Expected | Counted | Result on approval |
|---|---|---|---|
| Product A | 12 | 10 | Adjustment −2 |
| Product B | 5 | 5 | No movement |
| Product C (added with **Add found item**) | 0 | 3 | Adjustment +3 |

Approval runs as one step. If any single adjustment cannot be written, for example because a strict warehouse refuses to go below zero, nothing is written and the stocktake stays in review.

After approval the stocktake is closed and can no longer be edited. The movement lock, if any, is released. The adjustments appear in the **Movements** tab of the warehouse.

## Cancelling a stocktake

Click **Cancel stocktake** in any state before approval and enter a reason. A cancelled stocktake does not change stock, and its movement lock is released. The stocktake stays in the list for reference. An approved stocktake cannot be cancelled.

## Verifying it worked

- The stocktake list shows the state `Approved` and the approval date.
- The warehouse **Movements** tab lists one `Adjustment` per row with a difference.
- The warehouse **Stock** tab shows the counted quantities.

## What can go wrong

| Symptom | Cause | Fix |
|---|---|---|
| A stock operation fails with a message that a stocktake holds the lock. | A stocktake with blocked movements is open for that warehouse or location. | Approve or cancel the stocktake, then repeat the operation. |
| **Submit for review** is refused. | No row has been counted. Submitting an empty count would write off the whole scope. | Count at least one row first. |
| Approval fails. | One of the corrections would push a strict warehouse below zero. | Check the counts, correct the row, or allow negative stock on the warehouse, then approve again. |
| The expected quantity looks out of date. | Expected quantities are a snapshot from the moment of creation. Orders paid during an unlocked count still move stock. | Use **Block stock movements** for counts that must be exact, or count outside business hours. |

## Related

- [Warehouse and stock](/warehouse-and-stock): warehouses, locations and stock operations.
- [Production orders](/warehouse-production-orders): another source of stock movements.

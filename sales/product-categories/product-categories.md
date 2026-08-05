---
id: "oSm4eoAXovsdlWKz"
category: "sales/product-categories"
tags: []
published_at: "2026-04-24T06:57:28.570Z"
---


Product categories
==================

A good category structure is one of the main prerequisites for a usable e-shop — customers must be able to orient themselves within it in a matter of seconds and simultaneously be able to filter the offer purposefully. The `/product-category` module therefore serves to organize the catalog into a meaningful taxonomy, in which categories can be arranged into a **hierarchical tree** (parent and child), products can be assigned to their categories, and properties affecting display on the web and export to product comparison engines can be set. Because the catalog changes and grows over time, the module is built to handle even large structures and protect the consistency of the hierarchy with every modification — this allows the taxonomy to be continuously developed without the administrator having to deal with impacts on existing products, URL addresses, or historical data.

## Two Views

The module offers two complementary views, which can be switched between in the top bar. The **List** view is a classic table with all categories, filters, and sorting options; it is best suited for bulk edits when the administrator needs to quickly review many records and correct the same property in multiple places. The **Tree** view renders the hierarchy as an expandable diagram, where relationships between parent and child categories are visible at a glance; nodes can be expanded and collapsed, which proves useful for navigating extensive catalogs and planning the movement of entire branches.

## Category Overview

The table in the list view contains all the data needed to decide on the next step — category image, its name, internal code, link to parent category, short description, flags for activity, internal character, and B2B, as well as the number of products falling into the given category and a numerical position for sorting. Just like with products, the table automatically refreshes every 20 seconds, so concurrent edits by other users or changes from imports are reflected immediately.

## Hierarchy and Lifecycle

Each category can have its **parent category**; if it doesn't, it is considered a root (top-level) category. The system internally maintains a so-called **category path (path enumeration)**, which is automatically recalculated with every change of parent — this allows categories to be moved, deepened, or returned to the root arbitrarily, without the administrator having to manually fill in the breadcrumb navigation. The operation is safe even for very deep trees, as the path recalculation always affects the entire child branch at once. A category's status does not express a linear sequence, but a set of mutually combining flags that together determine to whom the category is displayed:

- **Active** — the category is displayed in the e-shop catalog and is available to customers.
- **Inactive** — the category is temporarily hidden, but products can still be assigned to it and remain visible if they belong to another active category.
- **Internal** — the category serves exclusively for internal segmentation (reports, statistics, marketing campaigns) and is never displayed to customers.
- **B2B** — the category is displayed only to verified business customers with an active B2B account.

> ℹ️ **Information:** Hiding a parent category does not automatically hide its subcategories. Each node in the hierarchy has its own status, and the system treats it independently — this allows for scenarios such as "public subcategory under a hidden parent category," which are sometimes useful, for example, during A/B testing.

## Creating a New Category

The **Add** button in the top right corner opens a form for creating a category. The only mandatory item is the **name**; the code and slug are automatically calculated from the name but can be manually edited. To create a subcategory, simply select a **parent category** — the new category will immediately be placed under the chosen node in the hierarchy. Each category must have a unique code within the organization; if the entered code already exists, the system will reject it and prompt for another.

> 💡 **Tip:** When building a new catalog, it is more efficient to first create the skeleton of the main categories (root nodes) and only then gradually add subcategories and individual products to them. This will save you later movements of entire branches.

## Category Detail

Clicking on a row opens the category detail, divided into tabs according to the type of activity you are currently dealing with. The **Overview** tab contains basic information and allows editing the name, description, flags, and selecting a parent category. The **Gallery** is used for uploading category images for marketing purposes and is currently under development. The **Products** tab displays a list of products dynamically filtered by the currently open category; from here, you can bulk change assignments, order, or mark the main category for individual products. The last tab, **Redirects**, controls URL addresses and old links for SEO purposes — it configures how historical links from search engine indexes should point to the category's new address.

## Assigning Products

A product can be in multiple categories simultaneously, which corresponds to the real behavior of catalogs — a T-shirt belongs to "Clothing," "Men," "New Arrivals," and "Sale" at the same time. One of the assigned categories is always designated as **main**, and the system uses it in two key situations: in the e-shop's breadcrumb navigation and in feeds for product comparison engines, which require exactly one category per product. Products can be assigned in **three equivalent ways**, which the administrator chooses based on where they start. From the **product detail** on the Categories tab, there is a multi-select of all available categories, and the main one can be easily determined. From the **category detail** on the Products tab, assignments are managed in the opposite direction, and dozens of products can be added or removed in bulk. And the third way is the **context menu** in the product list with the "Edit Category" action, which is used for quickly changing the main category without opening the detail.

> ⚠️ **Warning:** Removing a product from a category does not cancel its assignment in other categories. However, if you remove a product from its last category, it will remain unassigned in the catalog and may not appear in the public listing at all — therefore, before a massive reorganization of categories, we recommend checking the status.

## Position and Sorting

Each category has a numerical **position**, which determines its order within one level of the hierarchy. The position is applied in the e-shop when listing categories in the menu or in the list of subcategories under a parent category. The value can be manually edited in the detail, or by dragging rows in the table; a new category automatically gets the highest available number, so it ends up at the end of the list without intervention, and any order adjustments remain an explicit decision by the administrator.

## Multilingual Content

The name and description of the category are entered separately for each language of the organization. The **Slug (part of the URL address)** is generated from the name in the given language, so each language version of the category has its own canonical address optimized for local search engines and readers. Multilingual content works the same way as with products — if a language does not have a translation filled in, the e-shop follows the organization's set fallback logic and displays the translation in the default language instead of an empty page.

## Filtering and Searching

When working with a large catalog, filtering is essential. The table allows limiting the selection by status (active, inactive, internal, B2B), by parent category, and full-text search by name and code. The search takes into account all language variants of the name, so it is enough to enter a term in any language, and the system will find corresponding records across the entire organization — the administrator thus does not have to manually switch languages when searching.

## Good Practices

> 💡 **Tip:** Do not create unnecessarily deep hierarchies. In practice, a maximum of three to four levels of nesting proves effective — deeper trees complicate navigation for customers, complicate orientation in administration, and slow down decision-making.

> 💡 **Tip:** Use **internal categories** to group products that you want to report together but do not want to present to customers as a separate offer. This typically includes sections such as "products on sale," "liquidation products," or "seasonal items," where the primary focus is a managerial view of the data.

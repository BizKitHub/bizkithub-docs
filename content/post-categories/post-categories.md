---
id: "fUBeQIgHD3glkPj4"
category: "content/post-categories"
tags: []
published_at: "2026-04-24T06:57:28.368Z"
---


Post categories
===============

Categories in the editorial system are more than just labels — they form the navigational framework along which the reader moves, and at the same time, they help the editorial team keep track of where each article belongs. The `/post-category` module is therefore a tool for organizing articles into a thematic tree, in which the taxonomy can be structured hierarchically, moved between branches, temporarily disabled without data loss, or permanently deleted if no longer needed. This approach allows categories to be continuously refined as the website's content grows and changes over the years, without the editorial team having to worry about what happens to existing articles and their URL addresses with every intervention.

## Two Views

The module offers two complementary views of the same structure, which can be toggled in the top bar. **List** is a classic table allowing sorting and filtering — suitable for routine management, quick checks, and bulk edits. **Tree** is a hierarchical diagram visualizing relationships between categories, which at a glance reveals whether the taxonomy still makes sense and if duplications are proliferating somewhere. The list is therefore a working view, while the tree is a planning view.

## Category Overview

In the table view, each category displays its name, parent category (if any), recursive post count, creation date, and activity status. Special attention should be paid to the **recursive post count** — it counts not only articles assigned directly to the given category but also all articles in its descendants. So, if "Technology" has "Software" and "Hardware" as subcategories, the number next to "Technology" includes posts from all three levels. This makes it possible to estimate at a glance how content-heavy each branch is.

## Tree View

The tree view renders all categories as a nested structure, and for each node, it displays the name, URL slug, post count, and activity information. The tree is most effective for larger structural adjustments — when the editorial team is considering reorganization or needs to quickly check if some categories are unnecessarily deep.

## Creating a New Category

The **New category** button in the top right corner opens a form with several fields. Only the name (up to 255 characters) and the language in which the name is entered are mandatory. Optionally, you can fill in a **description** as free text for public display, an **SEO meta description** (used as an HTML meta tag for search engines, max 500 characters), and a **parent category**. If the user does not select a parent category, the category will be created as top-level. Upon saving, the system automatically generates a unique URL slug from the name, creates a canonical URL address (e.g., `/category/technology`), and sets the category as active. The user can thus work with it immediately without further setup.

> ⚠️ Only an active and undeleted category can be chosen as a parent category. If the chosen category is deleted, the system will refuse the operation — it does not want to allow a new category to hang under an archived parent.

## Category Life Cycle

A category goes through three states, which differ in visibility and what can be done with them. An **active** category is fully engaged — it appears in selection fields when creating an article, is visible on the public website, and new articles can be assigned to it. An **inactive (deactivated)** category is hidden from public views and selections, but all data remains preserved; it is suitable for seasonal sections (e.g., "Christmas" or "Summer Promotions") or for categories that the editorial team wants to temporarily hide without having to delete them. A **deleted** category is soft-deleted and does not appear anywhere in the interface. Switching between active and inactive states is deliberately very simple — just a click in the context menu — and is intended as a light, reversible action for everyday operation. Deletion, on the other hand, requires fulfilling safeguards (see below).

## Category Detail

Clicking on a category opens a detail view divided into two tabs. **Basic information** includes the name, slug, description, SEO meta description, and parent category assignment. **Routing** is reserved for URL address settings. In the detail view, a category can be renamed, its description or SEO meta description edited, moved under a different parent category (or moved to the top level), and language versions managed — each language has its own name and description.

### Rules for Moving

When changing a parent category, the system checks that no cycle is created. For example, it is not possible to set "Software" as a subcategory of its own subcategory "Operating Systems" — such an operation would create an infinite loop and the system would reject it.

> ℹ️ Moving a category within the tree does not affect the URL addresses of assigned posts in any way. These remain in their original form, so the SEO value of articles is not lost due to taxonomy reorganization.

## Multilingualism

If an organization works in multiple languages, each category can have its own translations of the name and description. In the category detail, a list of all existing translations is visible, and missing languages can be added manually using the language switcher in the editor. On the public website, the translation in the visitor's current language will then be used; if a translation in that language is missing, the system will fall back to the organization's default language, so the visitor will always see something understandable.

## SEO and URL Addresses

Each category has its own URL slug in each language. The slug is automatically generated from the name, with the system converting diacritics to ASCII characters, replacing spaces with hyphens, removing special characters, and converting everything to lowercase. The result is a safe, URL-friendly identifier that looks good in the browser's address bar and in links. The slug can be manually edited in the **Basic information** tab. The SEO meta description (if filled in) is used as an HTML meta tag for search engines — it is therefore a field worth considering, as it significantly affects how the category is presented in Google search results.

> 💡 When manually editing a slug, remember that changing it will break existing backlinks. If the URL is already in production and is linked to externally, consider creating a new category and gradually transferring content instead.

## Context Menu

Above the category row, the context menu offers two actions covering common tasks. **Toggle activity** temporarily disables or re-enables a category without data loss. **Delete** soft-deletes the category, but only if the safeguards described below are met.

## Rules for Deletion

Category deletion is protected by two checks that prevent the creation of orphaned objects. First, a category must not have subordinate (undeleted) subcategories — if they exist, the user must first move them elsewhere or delete them. Second, a category must not have assigned posts — articles must be transferred to another category, otherwise the system will refuse the operation and display the number of affected articles. Only when both conditions are met is the category soft-deleted.

> ⚠️ The difference between **Toggle activity** and **Delete** is important: deactivation merely hides the category from the interface (data remains, the category can be restored with one click), while deletion marks it as permanently removed and requires satisfying safeguards. For temporary disabling of a category, always prefer deactivation.

## Category Selection in Other Modules

Categories are linked to other parts of the system — typically as a selection field when creating and editing posts. Only active and undeleted categories, sorted by hierarchy and alphabetically, are included in the selection. Inactive categories do not appear in the menu when writing a new article, preventing a situation where someone accidentally assigns a new article to a section that was supposed to remain hidden.

## Automatic Categorization (AI)

Active categories are also candidates for automatic categorization of new articles. When AI analyzes a post's text and looks for a suitable classification, it selects from the active categories in this module. For the most accurate result, it is crucial to pay attention to the category description — this serves as context for the AI to make its decision. A category description can be up to 150 characters long, and the system shortens it when querying the AI to leave room for the analyzed article itself; therefore, it pays to write descriptions concisely and factually. For good automation, it is recommended to **fill in an understandable description** for each category containing keywords typical for the given field (e.g., "software development, programming, DevOps" for the Software category), **deactivate unused categories** so they are not offered to the AI as an option, and keep categories **at an appropriate granularity** — neither too general (it's hard to make reasonable decisions above a single "Blog"), nor too narrow (categories with one article lose their meaning).

## Best Practices

Several rules have proven effective in editorial practice and are worth considering when designing the structure. Stick to **two to three levels of hierarchy**, as deeper trees become unintelligible for visitors. Pay attention to **linguistic consistency in naming** — for example, always singular nouns ("Reviews," not "Reviews and Tests"). Avoid overly general categories like "Miscellaneous," as unclassified articles will start accumulating in them and the entire taxonomy will lose its meaning. And monitor **post counts**: if a category consistently contains only one or two articles, consider merging it with another.

### Reorganizing an Existing Structure

When you need to significantly change the category structure — for example, merge two categories or create a new parent level — proceed in three steps. First, create the necessary categories in the new arrangement, then gradually assign articles to the new categories in the **Posts** module, and finally, once the old category is empty, delete it. Reorganization never happens automatically; the system always respects the administrator's manual decision to prevent unwanted moves.

## Integration with Other Modules

Categories are linked to several other parts of the system, and their changes are reflected there. In the **Posts** module, each article has one main category, so when deleting a category, articles must first be moved. **Routing** generates a URL for the category from its slug, and when the slug changes, the URL is reconfigured. **AI automation** uses active categories as candidates for automatic classification of new articles. And the **public website** displays categories as navigational sections — usually generating a separate archive page for each category with a list of its articles.

> 💡 If you want to hide a category from the public website but retain the existing URLs for its assigned articles, use **Deactivate** instead of deleting. The articles will then remain accessible via direct URL and will only not be displayed in navigation and listings.

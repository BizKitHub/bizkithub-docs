---
id: "mzIIYVHJfCTHnwwj"
category: "system/search"
tags: []
published_at: "2026-04-24T06:57:28.912Z"
---


Search
======

The larger the system, the more difficult it is to find a specific record within it. Users often remember only a fragment — a piece of a name, half of an order number, an email subject — and need to access the relevant record without first selecting the correct module and applying filters within it. The `/search` module therefore offers a single field into which anything can be entered: the result is a list of records across all main system entities, sorted by relevance. The search is designed to be tolerant of diacritics, case sensitivity, and minor typos, and to understand context — if a user enters a mathematical expression, it will return the result of the calculation instead of records.

## Search Field

The main field accepts any text query and responds continuously: as soon as the user stops typing for a moment, the system sends the query and returns results. This technique, known as 'debounce', prevents communication with the server after every keystroke and keeps the UI fluid. A loading indicator in the right part of the field signals that the query is currently running.

> 💡 Just type part of a word. Entering `nov` will find 'Novák' and 'new order' — the full-text engine works with prefixes and substrings, not exact matches.

## Entity Types

The search simultaneously goes through all main categories of records in the system. Each type is searched within its own set of fields that make sense for it:

- **Orders (order)** — order numbers, customer names, notes.
- **Products (product)** — names, codes, EAN, short descriptions.
- **Contacts (contact)** — names, emails, phone numbers, company details.
- **Calendars (calendar)** — calendar names and their descriptions.
- **Events (event)** — names, descriptions, and codes of calendar events.
- **Emails (email)** — subjects and content of outgoing and incoming correspondence.
- **Articles and Pages (post)** — headlines, URLs, excerpts.
- **Tickets (issue)** — keys, subjects, descriptions.

Parallel searching means that the waiting time is practically the same regardless of data size — a query does not wait 'across' one type to another but runs simultaneously. Results are then sorted across categories by relevance to the query.

## Results

Each found record is displayed as a card with a uniform structure: an entity type icon for quick visual identification, a title with highlighted matching parts of the query, secondary information (e.g., an email for a contact or a number for an order), a category text label, and a link opening the record's detail. Parts of the text that match the query are visually highlighted, and for longer texts, a **contextual snippet** is displayed — showing only the section where the match is found, to make the result readable even for multi-page articles.

> ℹ️ Results are generally limited to 100 items to keep the overview readable even for very general queries. If you need to find more records of a specific category, use the type filter (see below) or refine your query.

## Filtering Results

At the top of the page, there is a dropdown list that can be used to limit results to a single category — for example, only products or only contacts. The filter has a dual benefit: it clarifies the output (you don't mix orders with articles), and it increases the result limit within that category (allowing you to get hundreds of records, not just the first few as in global mode). You can always return to global mode with a single click.

> 💡 An active filter means that other record types are not searched at all. This speeds up the query and allows you to see more results in the given category than within the global limit.

## Query Normalization

Before submission, the query undergoes automatic adjustment to ensure consistent behavior across languages and writing styles. **Case sensitivity** is ignored — `Novák` and `novák` return the same results. **Diacritics** are normalized symmetrically: `Krkonose` finds 'Krkonoše' and vice versa, so users on German or English keyboards are not disadvantaged. **Redundant spaces** are removed, and multi-word queries are understood as a whole. **Punctuation at the edges** is trimmed so that commas and periods do not interfere.

> ℹ️ Normalization is symmetrical — applied not only to the query but also to the searched data. This ensures that the search works correctly even in languages with rich diacritics and does not depend on how the record was originally entered.

## Mathematical Calculator

If a user enters a mathematical expression into the search field, the system recognizes it and displays the calculated value as the first result. This is a simple but surprisingly useful function — an administrator often needs to quickly calculate a price with VAT or divide an amount among several items, and instead of opening a calculator, they can use the same field they already have open. Basic operators (`+`, `-`, `*`, `/`), parentheses for determining priority, nested expressions, and decimal numbers are supported. Typical examples:

- `2+3*4` → `14`
- `(150+50)*1.21` → `242`
- `1000/3` → `333.33`

> 💡 The calculator is only activated if the query genuinely contains a mathematical expression. Text queries like '3 pieces' are searched normally, and the calculator will not be triggered.

## Interface Reaction

The interface provides continuous feedback during searching. A subtle animation in the right part of the field indicates that the query is currently being processed by the system. There is a short delay of hundreds of milliseconds (debounce) between a key press and query submission, which protects resources from unnecessary queries, yet is short enough that the user does not subjectively feel a delay. If a query returns no results, a 'no results' message appears along with a tip for refinement.

## Search Analytics

Every submitted query is anonymously logged into internal statistics. This has three practical benefits: it helps identify what users most frequently search for in the system, helps uncover missing content (queries for which the system found no results point to blind spots), and identifies typos or synonyms that should be added to normalization rules.

> ℹ️ Statistics are only visible to administrators in a separate analytical report. This is not about tracking specific users — it only records that a given query was used within the organization, not who entered it.

## Context and Scope

Global search respects the user's organizational affiliation — only records belonging to the organization the user is logged into are ever visible. Deleted and archived records do not appear in the results, to prevent historical items from returning to normal operation. Very long queries exceeding 100 characters are automatically shortened to keep server load within reasonable limits. The search index is updated practically immediately with every data change — a new record is searchable within a few seconds of being saved.

> ⚠️ If the search seems to not find a record you just created, simply wait a few seconds and try again. For most data, updates are instant; for extensive items (long articles, large products with extensive descriptions), indexing may take a few seconds.

## User Search by Email

The module also includes a specialized mode for precisely locating a user profile by email address. This mode is not for interactive searching but for internal system needs — contact autocompletion in forms, validation of whether a user with the entered email already exists, and matching imported data with existing profiles.

> 💡 Unlike regular search, this function returns only an exact match for an email address, not fuzzy results. It is thus deterministic and suitable for subsequent decision-making logic.

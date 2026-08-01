---
id: "9GGfNp9TTXpzQCvm"
category: "sales/branches"
tags: []
published_at: "2026-04-24T06:57:25.195Z"
---


Branches
========

Branches represent the physical presence of an organization in the world — brick-and-mortar stores, offices, service centers, pickup points, warehouses. The `/branch` module unifies their management under one roof: for each branch, you maintain its address, GPS coordinates, opening hours, contact information, and photos. This data is then used by the system across the entire administration and on the public website, which shows customers where they can find you.
The module also serves as a source of truth for external integrations. Branches synchronize with Firmy.cz, map APIs, and search engines; each has its unique public URL and a slug usable in SEO. So, when you change opening hours in the administration, the customer will see it on your website, in Google, and at the carrier.
## Branch Overview
The main table shows all branches of the organization. The order is set so that active branches are always at the top and inactive ones below them, and within each group, alphabetically by name.
- **Image** — a thumbnail of the main branch photo accompanied by its name and description, so the row also functions as a visual business card.
- **Slug** — a technical identifier that forms part of the public URL (`/branch/<slug>`).
- **Internal Code** — an organizational designation like `PRG-01` or `BRN-02`, used for linking with accounting or warehouse systems.
- **City / Address** — summary information composed of the first line of the address to clarify which branch it is.
- **Status** — a colored label distinguishing active (green) and inactive (gray) branches.
- **Web Address** — URL for cases where the branch has its own microsite.
- **Date Created** and **Date Last Modified** — auxiliary information for auditing.
The list automatically refreshes every 30 seconds, so the status of branches remains current even during long periods of work in the administration.
## Filtering
Above the list is a full-text search that simultaneously searches the branch name, slug, internal code, and city. This covers all common search scenarios — from "find the Brno branch" to "open the branch with code PRG-01".
## Creating a New Branch
The **Create Branch** button in the top right corner opens a form with basic identification data. Only the name is mandatory; the rest can be filled in later. The **Slug** will be automatically generated from the name unless you enter it manually. The **Internal Code** must be unique within the organization to identify a clear data source in linked systems. Optionally, you can also enter a short description, the public URL of the branch, and assign a **branch manager** — a contact from the directory who is responsible for the branch.
> 💡 The Slug is part of the public URL (for example, `/branch/prague-center`) and is used in third-party integrations. It can be changed after creation, but you must ensure redirects from old addresses yourself.
## Branch Details
Clicking on the name opens a detail view divided into thematic tabs. The division into tabs corresponds to how you typically work with a branch — you create it and update basic data one way, plan opening hours another way, and manage photos yet another way.
### Overview
Contains basic identification data: name, slug, internal code, public URL, and a short description. It also shows GPS coordinates (latitude and longitude), the establishment date, and the branch manager with a link to their contact in the directory. With the **Active / Inactive** switch, a branch can be temporarily disabled at any time without deleting data.
### Address
The complete postal address of the branch includes the name or company (if different from the organization), street with house number, city and optionally district, postal code, state or region, country in ISO 3166-1 alpha-2 code (e.g., `CZ`, `SK`, `DE`), and an optional note.
### Opening Hours
A dedicated tab for defining the regular schedule and exceptions. The structure is described in a separate section below.
### Contacts
Management of branch emails and phone numbers. For each contact, a role can be assigned (e.g., *Reception*, *Billing*, *Main*, *Fax*) and a **verification** indicator seen, confirming that the given channel has undergone automatic verification.
### Gallery
Photos of the branch intended for presentation on the website — facade, interior, sales area. Details about gallery controls are below.
## Opening Hours and Exceptions
Branch opening hours consist of two layers: a **regular schedule** that repeats weekly, and **exceptions** that override it for specific days. This two-layer structure allows covering both normal operation and public holidays and company vacations without the need for complete reconfiguration.
### Regular Schedule
For each day of the week (Monday to Sunday), an opening and closing time can be set (e.g., `08:00-17:00`), or multiple intervals due to a lunch break (`08:00-12:00, 13:00-17:00`). Each rule can have an optional description (e.g., *For registered customers only*), a **validity period** for seasonal schedules (summer and winter opening hours), and an active/inactive flag, which can temporarily disable the rule without deletion.
> ℹ️ Monday has index `0` in the system, Sunday has index `6`. A day without an entry means the branch is **closed** on that day. Saving the schedule replaces all existing rules at once with a single **Save** button to ensure the schedule remains internally consistent.
### Exceptions
Exceptions handle situations where a specific day deviates from the regular schedule — a public holiday, company event, inventory. For each exception, a date is entered (e.g., `December 24, 2026`), an open/closed flag, and a reason (*Christmas Eve*, *Inventory*, *Company Event*). Exceptions take precedence over the regular schedule.
> 💡 It is best to set up exceptions at the beginning of the year — you can handle all public holidays for the entire year in one session. Customers will see them both in the administration and on the public website.
### Live Open / Closed Indicator
On the public branch page, the current **Open** / **Closed** status is displayed, calculated by combining the regular schedule, exceptions, and the organization's current time zone. This way, the customer always sees whether they can leave right now.
## Gallery
The **Gallery** tab allows managing branch photos — facade, interior, sales area, parking lot. Images are uploaded by dragging and dropping or using a button, and for each, it can be marked whether it is the main photo (a branch can have at most one main photo) or the branch logo. A description can be written for each image for accessibility and SEO. The order of images can be changed by dragging and dropping; an image can be temporarily deactivated without deletion, or permanently removed.
> ℹ️ If you delete the main photo, the system automatically sets the first available active image as the main one. This way, a branch never remains without visual representation in the list.
## SEO and Public Presentation
The branch has a dedicated page on the public website at the URL `/branch/<slug>`. For good visibility in search engines, it is crucial that the slug is stable (it forms part of the URL, and a change will break backlinks), the name and description are factual (used as HTML meta tags), and the address is filled out completely, including the postal code — structured data helps Google and Firmy.cz refine results. GPS coordinates enable display on maps, and the main photo serves as an Open Graph image when sharing on social media.
> 💡 To improve visibility, fill in all address fields, including postal code and GPS. Do not use excessive marketing phrases in the description — rather factually describe the services offered, which search engines will also appreciate.
## Context Menu
- **Change Slug** — modification of the technical identifier; the slug is automatically sanitized and deduplicated to remain unique.
- **Deactivate** — temporary disabling of a branch; all data (address, schedule, photos) remain, it only disappears from public overviews and search results.
> ⚠️ Deactivation is not the same as deletion. A deactivated branch can be restored at any time with a single toggle back. If you want to permanently remove a branch, you must contact an administrator.
## Additional Features
- **Automatic synchronization with Firmy.cz** — opening hours and contacts are exported in a format that the portal accepts without manual editing.
- **Packeta integration** — when connected with the carrier, pickup points are synchronized.
- **OSM opening hours format** — internal conversion of the schedule to the OpenStreetMap standard for further interoperability.
- **Email and phone verification** — each contact detail has an indicator showing whether it has passed automatic verification.
## Tips for Daily Work
- For each branch, fill in **GPS coordinates** — customers will find it faster on the map and get to you more easily.
- At the beginning of the year, prepare **exceptions for public holidays** to avoid questions like "are you open today?"
- Use **internal codes** (e.g., `PRG-01`, `BRN-02`) for easy linking with accounting and warehouse systems.
- Choose the main photo in sufficient resolution (minimum 1200×800 px) so that it looks good even on large screens.
- Do not delete a branch, but **deactivate** it — you will preserve the history of orders and contacts associated with it.

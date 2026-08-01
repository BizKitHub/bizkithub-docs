---
id: "BMUqbFZTT4kf9vee"
category: "system/new-organization"
tags: []
published_at: "2026-04-24T06:57:27.492Z"
---


New organization
================

Creating a new organization is an action that opens up an entirely new workspace in the system — its own customers, products, calendars, settings, and invoicing. The `/new` wizard is therefore intentionally minimalist: it only asks for what cannot be automatically derived or filled in later, and leaves everything else to specialized modules that the user switches to after the first login. The goal is for the first step to be trivial and for decisions like "what color or emoji" not to become an obstacle when creating an account.
## Form
The wizard contains only three fields. **Organization Name** is the main displayed name and also the only required value that determines the uniqueness of the record in the system. The field has built-in real-time availability checking — as soon as the user stops typing, the system verifies if the name is taken, displays a loading indicator during the check, and reflects the result in a message above the field (green for available, red for taken). **Time Zone** is selected from a list of IANA time zones, and the default value is the time zone detected from the browser — the system then uses this time zone for formatting dates in emails, the calendar, and reports. **Description** is an optional short text that characterizes the organization; it is displayed in internal lists and the organization switcher.
## Creation
The **Create** button is active only if an available name has been entered. While the availability check is in progress, the button remains inactive — to prevent a race condition where the user attempts to save the organization while the system is still verifying that the name is available.
After confirmation, several steps occur automatically. A new organization is created with a unique slug derived from its name (the slug is a technical URL ID that is immutable). The founding user automatically becomes the first active member with full administrative rights. A default plan is pre-set — usually `free`, or a plan taken from a partner's invitation if the user was brought in by a partner. Finally, the user is redirected to the new organization's homepage, where they can immediately proceed with further settings: profile, branding, members, catalog, calendars.
> 💡 Don't worry about emojis, colors, or other branding in the wizard — all these fields are immediately available in the `/organisation` module after the first login. Furthermore, the system automatically generates an emoji for new organizations using AI if you don't specify one manually.
> ⚠️ The organization name is unique across the entire system. If your preferred name is taken, choose an alternative — renaming is possible at any time later, but the slug (technical URL ID) remains immutable, so it's good to consider your first choice carefully.

---
id: "Etqb3gWWI2284rsS"
category: "system/system-administration"
tags: []
published_at: "2026-04-24T06:57:24.759Z"
---


System administration
=====================

The `/admin` page is used for **system administration of organizations and their users**. It is primarily intended for internal system administrators who need an overview across all organizations and tools for resolving customer incidents — account blocking, changing organization context, auditing system events.
> ⚠️ Access to the module requires membership in the internal administrator group. Regular users do not have access here, and all attempts to open the page are rejected.
## Tabs
- **Organizations** — an overview of all organizations in the system with filtering and full-text search
- **User Search** — searching for a user by login name (email) and displaying all organizations they belong to
## Organizations Overview
The table displays a list of all organizations in the system, sorted according to internal logic (usually by creation date or activity).
**Table Columns:**
- **Emoji** — organization icon (either manually selected or automatically generated using AI)
- **Name** — clickable link opening organization details
- **Slug** — technical URL-safe organization ID, used in addresses and system commands
- **Number of Members** — number of active (unblocked) members
- **Description** — free text, if filled in
**Search:**
- Above the table is a full-text field that searches simultaneously in the organization's name and slug.
- Results are paginated, and pagination preserves the current filter.
> 💡 If you need to find an organization by a specific user, use the **User Search** tab — it will display all organizations where the given user has membership.
## Organization Details
Clicking on the name in the overview opens the detailed organization window, divided into tabs:
### Members
The table displays all members of the given organization, including blocked ones.
**Table Columns:**
- **Name** — full name of the user
- **Username** — login email
- **Email** — contact email address (may differ from login email)
- **Blocking** — colored indicator (yes / no)
- **Date Added** — date when the user gained membership in the organization
**Search:** above the table is a full-text field that searches in the name, login name, and personal number.
**Actions:**
- **Add Member** — a button in the top right corner opens a form for adding an existing user (by email) to the given organization. If the user is not yet a member, new membership is created, and a welcome email is sent. If they are already a member, the operation merely returns existing membership.
- **Block Member** — **long-clicking** (press-and-hold) on a member's row opens a blocking dialog. Upon confirmation, all API keys of the blocked member are blocked, and a notification email is sent to them. The last active member of an organization cannot be blocked.
> ⚠️ Blocking is a reversible operation — an administrator can undo it in the future. However, in addition to the user being unable to log in, their API keys will also be invalidated, which then need to be regenerated.
### System Logs
The table displays a chronological list of system events for the given organization, sorted from newest. It paginates by 50 records.
**Table Columns:**
- **Level** — severity of the event (`error`, `warning`, `info`, `debug`). More severe levels are highlighted in color.
- **Message** — event text (may contain entity identifiers or error messages)
- **Date** — timestamp of the record's creation
> 💡 System logs are a key tool for diagnosing customer incidents. When resolving a ticket, it is advisable to first check the logs of the given organization for errors within the relevant time frame.
## Context Menu
A context menu with system actions is available for each organization in both the overview and detail views.
### Switch to Organization (Switch To)
This action switches the administrator's current session into the context of the selected organization. A new identity is created, and an authentication cookie is set, so after switching, you behave as if you were directly logged into the organization.
> ⚠️ Switching is a powerful tool for customer support — in the target organization, you see and control data as if you were a regular member. Respect GDPR and internal policies; switch only when necessary to resolve an incident, and do not make any changes in a foreign organization without the owner's consent.
### Change Slug
Modification of the organization's technical URL identifier. The slug must be unique across the system and must not conflict with existing public paths (e.g., `/new`, `/admin`).
> ⚠️ Changing the slug will break all older links to the organization. Public URLs, unsubscribe links in newsletters, and feed paths will stop working. Use only in extreme cases and with awareness of the impacts.
## User Search
This tab allows you to find a user by login name (email) and display all organizations they belong to.
**The displayed list contains:**
- **Organization Name** and **Slug**
- **Blocking** — whether the given membership is blocked
- **Date of Entry** — when the user became a member
The main purpose is to support customer cases where the same user contacts support from different organizations, and you need to quickly find out where they operate and what the status of their membership is.

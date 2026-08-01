---
id: "oHnPuXiQ7fESyhZ2"
category: "communication/notification"
tags: []
published_at: "2026-04-24T06:57:27.923Z"
---


Notification
============

Notifications are a personal inbox for system messages for the logged-in user — they serve to ensure that the administrator doesn't have to constantly monitor several modules simultaneously, but receives information the moment something relevant to their work occurs. Typically, this includes a completed long-running background task, an integration error, or an event requiring operator attention. Unlike email messages, notifications function within the context of administration and complement it — they should not, therefore, serve as a primary channel for critical information, but as a quick overview during normal work in the system.
## Display
In its current form, the page has a single tab **All**, where notifications are ordered chronologically from the newest. Each item includes a brief text explaining what happened, an icon according to the event type, and a timestamp to show when the event occurred.
## Empty State
If no notifications are available, an informational message "You don't have any notifications yet. As soon as something happens, it will appear here." will be displayed, complemented by a bell icon. An empty state therefore does not signal an error, but rather a calm system state.
> ℹ️ The module is in its basic form and will be gradually expanded with additional features — filtering by type, marking as read, categorization by source module, and automatic removal of older items.
## Relationship to other modules
Notifications do not arise on their own — they are the output of other parts of the system that determine that a given event should be brought to the administrator's attention. Typical producers are:
- **E-mailer** — technical delivery errors are displayed as notifications for the administrator.
- **Newsletter campaigns** — completion of a large-scale campaign generates a summary message.
- **Complaints** — new complaints assigned to the logged-in user appear in notifications.
> 💡 Notifications on this page **do not replace** email messages — they serve as a quick overview in the administration. Critical information is also sent by the system to email, so that it reaches the user even if they are not currently logged into the administration.

---
code: "team-chat-notifications"
category: "communication"
tags: ["type-concept", "chat", "notifications", "presence"]
published_at: "2026-11-24T00:00:00.000Z"
---


Team chat notifications and status
==================================

[Team chat](/team-chat-overview) tells you about new messages in three ways: inside the administration while it is open, through browser push notifications when it is closed, and by e-mail when a message stays unread. Your **status** decides when those notifications reach you and tells colleagues whether to expect a quick reply.

This article explains each channel, the rules that prevent notification floods, and how your status is set automatically or by hand.

## Notifications inside the administration

Open **Chat settings** from the chat button in the header. These settings apply to the current browser:

| Setting | Default | Effect |
|---|---|---|
| **Message sound** | On | Plays a sound for a new message. |
| **Browser notifications** | Off | Shows a system notification for a new message while the administration is open in a background tab or a minimised window. |
| **Colleague rail** | Off | Shows a column of colleagues on wide screens. |

The browser tab title shows the number of unread messages. The **Activity** tab of the chat lists mentions, replies, thread replies and reactions to your messages from the last 30 days.

## Push notifications

Turn on **Push notifications when admin is closed** to receive new messages even when no administration tab is open. The setting applies to the current browser; turn it on in each browser where you want notifications.

- A push is sent only when you have no administration tab open.
- In a muted conversation you receive a push only when someone mentions you with `@`.
- One conversation sends at most one push every 15 seconds.
- An incoming call sends a *calling you* notification, which changes to *Missed call* if nobody answers.
- Clicking a push from another organisation switches you to that organisation first.

No pushes are sent while your status is **Do not disturb**, **Vacation** or **Out of office**, or during your quiet hours.

## E-mail about unread messages

When a message in a one-to-one conversation or a group stays unread, the platform sends you an e-mail with the unread messages. You receive one e-mail for all your organisations together. Messages in **Notes to self** are never e-mailed.

How long the platform waits depends on how recently you were active:

| Your situation | Wait after the last message | Longest wait |
|---|---|---|
| Administration open, or active in the last 15 minutes | 10 minutes | 15 minutes |
| Last active 15 to 60 minutes ago | 2 minutes | 5 minutes |
| Last active more than 60 minutes ago | 1 minute | 5 minutes |

The wait is longer in two cases. When a push notification reached you, the e-mail waits at least 5 minutes (at most 15). For a group message that does not mention you, it waits at least 15 minutes (at most 60).

The "longest wait" applies to a busy conversation: the e-mail is sent then even if new messages keep arriving.

Further rules:

- Messages you have read in the meantime are never e-mailed, and no message is e-mailed twice.
- You receive at most one e-mail every 10 minutes, and at most one per conversation every 30 minutes.
- An e-mail shows up to 10 messages per conversation. Messages older than 72 hours are not e-mailed.
- Muted conversations are included only when you were mentioned.
- Files are attached when there are at most 10, each up to 10 MB and 15 MB in total. Other files are listed as available in the chat only.
- No e-mail is sent during **Do not disturb**, **Vacation** or **Out of office**; it waits until the status ends.

### Example

You leave the office at 17:30 and close the administration. At 17:40 a colleague writes to you in a one-to-one conversation. Because you have been inactive for less than 15 minutes, the platform waits 10 minutes. You do not read the message, so the e-mail arrives at about 17:50. If a push notification reached your phone browser, the e-mail still waits at least 5 minutes after the push.

## Quiet hours

**Quiet hours** stop push notifications for messages, calls and meetings during the times you choose, **Every day** from a start to an end time, and optionally the **Whole weekend**. Unread counts keep updating. Times follow your time zone.

If you have not set your own quiet hours, unread-message e-mails are held from 22:00 to 07:00 in your local time, and messages from the night arrive as one e-mail in the morning.

## Your status

Your status is shown as a coloured dot on your avatar everywhere in the administration. Open the status panel from the user menu.

### Automatic status

With **Automatic**, the platform sets your status from your activity and your calendar:

| Situation | Status |
|---|---|
| You are in a team chat call | **In a call** |
| A calendar event or a chat meeting is running, or a personal calendar event blocks your time | **In a meeting** |
| Active in the last 90 seconds | **Online** |
| Administration open, but no keyboard or mouse input for 5 minutes | **Away** |
| Last active less than 15 minutes ago | **Away** |
| Last active 15 minutes ago or longer | **Offline** |

### Manual status

You can choose **Online**, **Busy**, **Do not disturb**, **Be right back**, **Away**, **Out of office**, **Vacation** or **Offline**, and set **Reset after** to *Never*, *30 minutes*, *1 hour*, *2 hours*, *Today* or *This week*. **Back to automatic** removes your manual choice.

**Out of office**, **Vacation** and **Offline** are shown as long as they are set. The other manual statuses are shown only while you are active; after 15 minutes without activity you appear as **Offline**.

### Custom status and work location

**Set a custom status** adds an emoji and a short text of up to 120 characters, for example 🍝 *At lunch*. Presets include *In a meeting*, *Focusing*, *At lunch*, *Commuting*, *Working remotely*, *Out sick* and *On vacation*. Choose when to **Clear after**, from *30 minutes* to *This week*, or *Never*.

**Today I work** records whether you are *In the office*, working *Remotely* or *Travelling*. **Weekly plan** sets where you usually work on each day.

## What your colleagues see

- Above the message box, a colleague's status is explained before you send, for example *Jana is in a meeting until 14:30. A reply may take a while.* or *Jana is on Do not disturb. The message arrives without a notification.*
- The colleague's **local time** is shown, with a note when it is outside working hours.
- **Notify me when available** on a colleague shows you a notification as soon as they become available. The watch lasts 24 hours and works in the current browser.

## Privacy settings

Two settings work in both directions:

- **Read receipts.** When you turn them off, others do not see that you have read their messages, and you no longer see *Seen by* under yours.
- **Last seen.** When you hide it, others do not see when you were last active or the city of your last connection, and you do not see theirs. The colour of the status dot stays visible.

## Related

- [Team chat](/team-chat-overview): conversations, groups, calls and the other chat features.
- [Notifications](/notifications-overview): notifications from other modules of the platform.
- [Board](/board-overview): the organisation wall with its *Active colleagues* card.

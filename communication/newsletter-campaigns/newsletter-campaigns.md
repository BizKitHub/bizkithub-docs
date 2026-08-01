---
id: "Ge1qudybwnkn5Lae"
category: "communication/newsletter-campaigns"
tags: []
published_at: "2026-04-24T06:57:27.697Z"
---


Newsletter campaigns
====================

A newsletter campaign is a scheduled bulk mailing of specific content to a defined group of subscribers. The `/newsletter-job` module allows the operator to prepare, launch, monitor its real-time progress, and subsequently evaluate its performance. Unlike a one-time transactional email, a campaign primarily differs in that it runs in batches with speed limits — only a certain number of messages are sent each minute — to prevent blocking by mail servers and to maintain the deliverability of other messages from the given domain. The module relies on **Newsletter** as a source of subscribers and **E-mailer** as the sending infrastructure; without both of these components, the campaign would have no one to deliver to, nor the means to deliver.
## Campaign Overview
The campaign table groups both running and completed mailings and provides the operator with an immediate overview of how many recipients have already been served and how many are still waiting in the queue. A key element is the visual progress indicator in the Progress column, as a large campaign with a low per-minute limit can easily run for several days — and an administrator needs to know at a glance whether it still makes sense to intervene.
Individual columns display:
- **Message Subject** — the email's subject text; the link leads to the campaign detail.
- **Progress** — a visual indicator of sending progress (pending vs. sent).
- **Sending Start** — the time when the campaign was actually launched.
- **Max / min** — speed limits, i.e., the maximum number of messages per minute and per day.
- **Runner ID** — identification of the process currently serving the campaign.
- **Total / Sent / Pending Contacts** — recipient breakdown by delivery status.
- **Dates** — timestamps for creation, last update, and completion.
The table automatically refreshes every 20 seconds. Completed campaigns remain in the list and can be opened at any time to view statistics, compare with previous mailings, or for inspiration when preparing new ones.
## Campaign Lifecycle
A campaign goes through a predictable sequence of phases from content preparation to final statistics. Each phase has its visual identifier in the Progress column and in the detail header, so the operator knows at a glance whether to intervene in the campaign or let it run. Separating preparation, scheduling, and sending itself allows everything to be checked in advance — content, audience, and limits — and to launch the mailing only when the operator is confident.
1. **Preparation** — the operator creates content (subject, HTML, attachments) and selects the audience.
2. **Scheduling** — start time and speed limits are set.
3. **Launch** — the system gradually adds subscribers to the runner's queue.
4. **Sending** — the runner sends individual emails in batches, updates their status, and records openings.
5. **Completion** — all recipients have been served or the operator manually terminated the campaign.
## Campaign Speed Limits
Each campaign has two independent limits that control how quickly messages reach recipient inboxes. The reason for their existence is to protect the sending domain's reputation — if the system were to blast thousands of messages in a few seconds, mail servers would evaluate it as a spam wave and begin to reject or filter subsequent messages into spam. Limits are thus not just a technical measure, but part of a long-term deliverability strategy.
Specifically, the following can be set:
- **Maximum messages per minute** — the default value is 30; prevents short-term overloading of the sending server.
- **Maximum messages per day** — an optional cap that gives the operator control over the total daily volume.
Additionally, the system automatically adjusts the recommended speed based on the dominant email provider in the target audience: for Gmail, it recommends up to 6 messages per minute (Gmail is the strictest), for Resend, 50 messages per minute, and for other providers, 30 messages per minute.
> 💡 When first using a new outgoing domain, it is advisable to set significantly lower limits and gradually increase them in subsequent campaigns. Mail servers judge new senders more strictly, and a rapid increase in volume can lead to immediate blacklisting.
## Runner — The Sending Process
The runner is an internal working process that physically handles the campaign — meaning it retrieves individual recipients from the queue, sends them messages, and records the outcome. Each running campaign has exactly one runner, identified by an ID in the table column. To detect situations where a runner crashes or freezes, the runner regularly sends a so-called heartbeat signal — if the signal stops, the campaign is automatically released and can be taken over by another runner (e.g., after a system restart). This prevents the campaign from getting stuck due to a technical failure of a single process.
During its operation, the runner:
- **Takes over the campaign** according to the negotiated ID and regularly sends heartbeat signals.
- **Pairs contacts** into the queue in batches according to the speed limit and scheduled time.
- **Sends emails** via configured SMTP, inserts a tracking pixel and an unsubscribe footer.
- **Updates the status** of each subscriber (sending date, number of failed attempts, any error message).
The maximum number of failed attempts for a single contact is 5. After these are exhausted, the recipient is skipped and marked as unsent, so that the campaign does not get stuck on one problematic address and the rest of the list receives the message in time.
## Campaign Actions
In the campaign detail and in the row's context menu, actions are available for the operator to manage the campaign throughout its lifecycle. For most situations, **Start** and **Stop** suffice; special actions are designed to resolve error states or for controlled experiments. Their combination allows a campaign to be temporarily frozen, resumed after a failure, or to have its queue cleared before a new iteration.
- **Start** — launches the campaign, sets the start time, and releases it to the runner queue; also serves to resume after a manual stop.
- **Pause** — releases the current runner, the campaign remains running, but no one is temporarily sending.
- **Resume** — after a pause, restores the heartbeat and clears the "completed" flag; the runner takes it over again.
- **Stop / Cancel** — marks the campaign as completed, releases the runner, and stops further sending.
- **Repeat** — resets all already sent recipients and relaunches the campaign; each recipient will thus receive the message a second time.
- **Retry failed** — resets the number of attempts for failed contacts and sets the campaign back to running.
- **Clear pending** — deletes all unsent recipients without error.
- **View statistics / View log** — opens a detailed overview of deliveries and technical events.
> ⚠️ The **Repeat** action is destructive in terms of customer experience — recipients will receive the same message again. Use it only if you know that the first attempt truly failed. For repeating only failed sends, the more targeted action **Retry failed** is used.
## Open Tracking and Geolocation
The system automatically inserts a small invisible image — a so-called tracking pixel — into every outgoing message. When the recipient opens the message, their email client loads the pixel from the server, and the system thus records that a view occurred. From the same HTTP request, it also obtains approximate geolocation and IP address, so analytics can reveal where and when the recipient read the message. This data helps evaluate not only the overall impact of the campaign but also the appropriate sending time for a given geographical group.
For each open, the following is stored:
- **Date and time of opening** — the exact moment the pixel was loaded.
- **IP address** — from which the view was made.
- **Geolocation** — state, and potentially city, derived from the IP.
- **Repeated opens** — the number of times the same recipient opened the message.
In addition to opens, the system also tracks the number of delivery attempts, the date of successful sending, and any SMTP server error message for each campaign subscriber.
> ℹ️ The tracking pixel only works in email clients that load external images. Some recipients have this feature disabled for privacy reasons (typically Apple Mail Privacy Protection), so open statistics are indicative — the actual number of readers is usually higher than measured.
## Campaign Detail
Clicking on the subject opens the campaign detail, divided into functional sections whose arrangement corresponds to a typical workflow — from content review to ongoing monitoring and final analysis. The header displays a color-coded status and buttons for all available actions, so the operator does not have to switch between screens.
- **Campaign Content** — subject, HTML content, attachments, and embedded images.
- **Recipient Table** — a list of all contacts with the number of attempts, sending date, IP address, geolocation, and open indicator.
- **Delivery Statistics** — totals of sent, delivered, failed, and opened messages.
- **Log** — technical record of all events from individual runners.
## Campaign Completion
A campaign automatically completes once all recipients have been served — either successfully sent or skipped after exhausting attempts. The system sets the completion date and releases the runner, making computational capacity available for other tasks. Completed campaigns remain permanently stored for retrospective analysis and comparison between individual mailings over time.
> 💡 For repeated campaigns to the same audience, it is particularly worthwhile to monitor the trend in the number of opens and unsubscribes. A sharp increase in unsubscribes is a signal that it might be appropriate to revise the sending frequency or content character — the audience is ceasing to perceive the campaigns as relevant.

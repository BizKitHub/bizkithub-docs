---
id: "TW4OTwoBjs8ugSGU"
category: "communication/e-mailer"
tags: []
published_at: "2026-04-24T06:57:26.497Z"
---


E-mailer
========

## Overview

The Emailer is the core platform service that stores, queues, and delivers every e-mail sent from BizKitHub. It guarantees at-least-once delivery, handles retries when the upstream SMTP is unreachable, and keeps a complete audit trail for every message — regardless of whether the mail was triggered by an admin operator, a workflow rule, or an API call from an external integration.

## Key capabilities

- **Queue management** — persistent storage of the outgoing queue with the full configuration required to redeliver a message if the first attempt fails.
- **Template formatting** — server-side rendering of the appropriate template (transactional, marketing, notification) with HTML and plain-text output.
- **System messages** — automatic dispatch of platform-level notifications (order status, invoice sent, workflow escalation) without operator involvement.
- **Fallback logic** — retries with exponential back-off, quarantine of undeliverable addresses, and automatic pause of the queue while the SMTP endpoint is unhealthy.

## Delivery queue

Every message enters the same queue regardless of source. The queue row captures everything needed to send, retry, and audit the message — sender, recipient, headers, body, priority and delivery state.

### Recorded fields

<table>
<thead>
<tr><th>Field</th><th>Type</th><th>Purpose</th></tr>
</thead>
<tbody>
<tr><td><code>id</code></td><td><code>int</code></td><td>Internal identifier of the e-mail.</td></tr>
<tr><td><code>external_id</code></td><td><code>char(32)</code></td><td>Public identifier of the e-mail.</td></tr>
<tr><td><code>status</code></td><td><code>smallint</code></td><td>Delivery state (see below).</td></tr>
<tr><td><code>datetime_inserted</code></td><td><code>timestamp</code></td><td>When the message entered the queue.</td></tr>
<tr><td><code>datetime_sent</code></td><td><code>timestamp</code></td><td>When delivery succeeded.</td></tr>
<tr><td><code>priority</code></td><td><code>smallint</code></td><td>Higher number = higher priority.</td></tr>
<tr><td><code>failed_attempts_count</code></td><td><code>smallint</code></td><td>Failed delivery attempts so far.</td></tr>
<tr><td><code>send_earliest_at</code></td><td><code>timestamp</code></td><td>Do not send before this time.</td></tr>
<tr><td><code>send_earliest_next_attempt_at</code></td><td><code>timestamp</code></td><td>Do not retry before this time.</td></tr>
<tr><td><code>note</code></td><td><code>text</code></td><td>Internal comment, error message or last SMTP response.</td></tr>
<tr><td><code>from</code></td><td><code>text</code></td><td>Sender address.</td></tr>
<tr><td><code>to</code></td><td><code>text</code></td><td>Recipient address.</td></tr>
<tr><td><code>subject</code></td><td><code>text</code></td><td>Subject line.</td></tr>
<tr><td><code>cc</code></td><td><code>text</code></td><td>Carbon copy.</td></tr>
<tr><td><code>bcc</code></td><td><code>text</code></td><td>Blind carbon copy.</td></tr>
<tr><td><code>reply_to</code></td><td><code>text</code></td><td>Reply-to address.</td></tr>
<tr><td><code>html_body</code></td><td><code>text</code></td><td>Full HTML body of the message.</td></tr>
<tr><td><code>organisation_id</code></td><td><code>int</code></td><td>Organisation the message belongs to.</td></tr>
<tr><td><code>from_member_id</code></td><td><code>int</code></td><td>Member that triggered the send, when known.</td></tr>
<tr><td><code>tag</code></td><td><code>varchar(64)</code></td><td>Technical tag for search (e.g. <code>order-123</code>).</td></tr>
</tbody>
</table>

### Delivery order

Messages are drained from the queue with `ORDER BY priority DESC, datetime_inserted ASC` — higher-priority mail leaves the queue first; within the same priority, the oldest message wins.

## How the queue is drained

Delivery is asynchronous: enqueuing is a millisecond-level DB write, actual sending happens in the background via a scheduled worker.

1. **Insertion.** The API or workflow places the row in the queue — the write takes tens of milliseconds.
2. **Scan.** A worker polls the queue at a short interval and picks the next batch of messages that are due and eligible.
3. **Parallel dispatch.** Up to 25 e-mails are sent concurrently across all organisations, respecting priorities and per-host connection limits.
4. **Result recording.** On success the row is marked as sent; on failure the retry counter is bumped and the next attempt is scheduled with exponential back-off.

### Performance envelope

- Enqueue latency — tens of milliseconds.
- Parallel dispatch — up to 25 messages at once.
- Scope — a single worker processes every organisation's queue.

## Delivery states

<table>
<thead>
<tr><th>ID</th><th>Code</th><th>Meaning</th></tr>
</thead>
<tbody>
<tr><td>1</td><td><code>in-queue</code></td><td>Queued and ready for the next scan.</td></tr>
<tr><td>2</td><td><code>not-ready-to-queue</code></td><td>Not yet ready — dependent data is still being assembled.</td></tr>
<tr><td>3</td><td><code>waiting-for-next-attempt</code></td><td>Previous attempt failed; scheduled to retry.</td></tr>
<tr><td>4</td><td><code>sent</code></td><td>Delivered successfully.</td></tr>
<tr><td>5</td><td><code>preparing-error</code></td><td>Error while preparing the message (template render, resource lookup).</td></tr>
<tr><td>6</td><td><code>sending-error</code></td><td>SMTP or transport error while sending.</td></tr>
<tr><td>7</td><td><code>undeliverable</code></td><td>Address is permanently invalid or has repeatedly bounced.</td></tr>
</tbody>
</table>

## Error handling and recovery

### Automatic retries

- Repeated delivery attempts on transient errors.
- Exponential back-off between attempts.
- Automatic marking of persistently undeliverable addresses.
- Every attempt is logged for troubleshooting.

### Outage protection

- The queue is paused when the SMTP host is unreachable — no messages are dropped.
- Synthetic test messages verify recovery before regular traffic resumes.
- Once the upstream is healthy again, the queue drains automatically.
- Nothing is lost during the outage — messages accumulate and dispatch in order.

### Monitoring and logging

Every Emailer action is logged and monitored. Operators can inspect delivery status, retry history and per-organisation throughput from the admin. Platform operators additionally see cross-organisation health, connection pool state and per-host reject rates.

## Integration with the BizKitHub platform

The Emailer is a first-class citizen of the platform: any module that needs to send mail — orders, invoices, workflow, newsletter, notifications — publishes to the queue rather than talking to SMTP directly. Three concrete integration surfaces:

- **API integration.** External systems trigger sends via the public API using an API key.
- **Templates.** Every message is formatted through a locale- and organisation-aware template so branding stays consistent.
- **Reporting.** Delivery metrics feed the analytics module — bounce rate, open rate (when tracking is enabled), retry count per organisation.

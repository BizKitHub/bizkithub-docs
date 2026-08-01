---
id: "BhzGgO19HOqv8iIs"
category: "system/system-logs"
tags: []
published_at: "2026-04-24T06:57:27.369Z"
---


System logs
===========

No operationally complex system runs flawlessly — integrations fail, users submit incorrectly filled forms, payment gateways sometimes return unexpected error codes. The `/log` module serves to ensure that these events do not disappear over time, but remain traceable, aggregated, and supplemented with context that allows the problem to be resolved. Here, an administrator can quickly find out when and where an error occurred, how often it repeats, and what exactly triggered it. The module is primarily intended for technical staff and those responsible for operations, but thanks to AI explanations, it is understandable even for non-technical users.

## Log Overview

The main table displays a list of recorded events, sorted from the newest. A key feature is that each row does not represent a single incident, but a **fingerprint** — a unique imprint of an event type. If the same error appeared a hundred times, it will occupy a single row in the list with an occurrence counter, not a hundred rows. This keeps the overview usable even in situations where the system generates thousands of error records daily.
Individual columns indicate:
- **Time of last occurrence** — when the event last occurred; for recurring errors, this is the current time.
- **Level (severity)** — a colored label indicating the importance of the record.
- **Code** — an internal event code that allows a standardized description to be assigned.
- **Message** — a human-readable description of the event.
- **Number of occurrences in 30 days** — how many times this event appeared in the last month.
- **Sparkline** — a miniature graph of the progression of occurrences over time, helping to distinguish a persistent problem from a new regression.
- **Total number of events** — cumulative sum from the first recorded occurrence.
- **Component** — the part of the system from which the event originated (e.g., `emailer`, `payment`, `api`, `frontend`).
The table automatically refreshes every 5 seconds so the administrator can see the current status without manual refreshing.
> ℹ️ Table rows represent event fingerprints, not individual occurrences. Identical errors are aggregated into a single record with a counter, so the list remains clear even with hundreds of occurrences of the same problem.

## Severity Levels

Each record is assigned a level, which determines the color of the label and signals how quickly a reaction is needed. **Info** (blue) is a common informational message about a standard operational event. **Success** (green) indicates the successful completion of a significant operation — typically used to confirm that a long batch job has run. **Warning** (orange) is an alert that may not require immediate action but is worth noting. **Error** (red) is an error that prevented an operation from completing, and **critical** (dark red) indicates a critical problem requiring immediate attention — typically an integration or security outage.
> ⚠️ Events at the **critical** level and errors with an anomalous occurrence pattern activate an email notification to the organization administrator. This ensures that a serious problem is not missed, even if no one is currently looking at the log.

## Occurrence Aggregation

Without aggregation, the log would be flooded with duplicate records at the slightest system error. Therefore, the system first **normalizes** each incoming message — removing variable parts such as IDs, timestamps, and random identifiers — and from the result, it calculates a **fingerprint**. All records with the same fingerprint appear in the overview as a single row, for which the occurrence counter is incremented. In the detail, individual incidents remain traceable with their specific data.
The sparkline graph for each row visualizes how the number of occurrences has evolved over the last 30 days. The administrator can thus distinguish three typical patterns at a glance: a **stable problem** has a flat graph with constant occurrences (it's an error that someone is apparently ignoring or is not critical), a **new error** has a high peak in recent days (likely a deployed regression), and a **resolved problem** was active in the past, but the last few days are empty (the error was likely fixed).
> 💡 Clicking on the sparkline opens a full-fledged graph with a timeline and precise values in the detail — useful for accurately pinpointing when the regression first appeared.

## Log Detail

Clicking the eye icon in a row opens the event detail. The header contains a colored icon corresponding to the level and a name, followed by metadata (component, level, ID, first and last occurrence times, and total count) and an extended sparkline graph. If the event was triggered by an HTTP request, the URL, IP address, and User-Agent are also displayed, which help identify the user's environment.
The detail is further divided into tabs that separate different types of context. **Stack trace** shows the calls that led to the error and is the primary tool for technical debugging. **Request / response data** contain what was transmitted between the browser and the server at the moment of the event — often revealing that the problem was caused by an unexpected request body. **Context** provides accompanying information such as user ID, order ID, or calendar ID, which help localize the problem within a specific business case. **AI explanation** then translates the technical error into human language.
> 💡 AI explanation is particularly useful for non-technical users who need to quickly decide whether to resolve the problem themselves or escalate it to technical support. It describes what likely happened and suggests specific corrective steps, all in the user's language.

## How Errors Are Categorized

Each newly incoming record goes through several automatic decisions. The **component** is determined by its origin — an error from the email sender gets `emailer`, an error from the payment gateway `payment`, an error from the client application `frontend`. The **organization** to which the record is assigned is either the one in whose context the error originated, or for system errors, an internal technical organization. The **severity level** is primarily determined by the source, but the system can automatically increase it for special cases — messages containing "timeout" or "unauthorized" typically rise higher because they indicate an infrastructural or security problem. The **fingerprint** then calculates the key for aggregation from the normalized message.

## Protective Mechanisms

The logging subsystem is a critical component itself and cannot afford to overwhelm itself or the administrator's email inbox. Therefore, three layers of protection are built into it. **Rate limiting** restricts the total number of logs per unit of time; if it is exceeded (typically during a large-scale failure when the system generates thousands of records per minute), further records are not saved in that interval, and one summary record is created. **Debounce** for repeated frontend reporting ensures that a cyclical browser error does not send a thousand identical messages to the server, but only one representative one. **Rate limit for notifications** then maintains a limit of one anomaly per hour per organization for email alerts, so that the administrator's mailbox is not overwhelmed — the subject of such a notification contains the `[ANOMALY]` tag for easy orientation.
> ⚠️ A notification may be suppressed if the system determines that sending it would exceed the allowed limit. However, the log itself is always recorded, and the administrator will see it in the overview — they just won't receive an email about it.

## Code and Message Definitions

Some events have a predefined **Code** in the system — a short identifier like `ORDER_CREATED` or `PAYMENT_FAILED`. These codes have a standardized **title** (displayed above the message text) and **description** (explaining what the code means and how to react to it) pre-prepared in the system's dictionary. Definitions are shared across organizations, so the same event is interpreted consistently everywhere, and teams can exchange information by referencing the code.
> ℹ️ If a code has no definition, only the raw message text is displayed in the detail. New codes are added to the dictionary centrally by the system administrator as new event types appear.

## Frontend Logging

The client application in the browser can send its own records to the log — typically captured JavaScript exceptions or anomalies that the server doesn't see. These records are marked with the `frontend` component, are subject to debounce by default (to prevent too frequent repetition in case of a cyclical error), and the frontend determines the level itself — typically `error` for caught exceptions. This gives the administrator visibility not only into the server-side, but also into problems occurring in customer browsers.

## Context and Lifecycle

Logs are tied to an organization — a user only sees events from the organization they are logged into. Critical errors are archived long-term, while informational events are deleted after a certain period to prevent unnecessary data volume growth. The daily report for the administrator also includes a summary of the most frequent logs over the last 24 hours, so even without actively opening the module, they have an overview of what is happening in the system.
> 💡 Regularly checking the log at least once a week is the best prevention against unexpected outages. Many problems first manifest as a series of warnings and only then as an actual error — whoever notices the warnings in time saves themselves from dealing with an incident on the weekend.

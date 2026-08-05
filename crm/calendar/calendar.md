---
id: "N3ZrGODJb3FqBMe8"
category: "crm/calendar"
tags: []
published_at: "2026-04-24T06:57:25.312Z"
---


Calendar
========

The `/calendar` page is used for managing calendars and tracking availability in time slots. It allows you to create any number of calendars—for example, for service bookings, resource occupation, shift planning, equipment rental, or lease terms. Each calendar has its own color, time zone, and an independent list of events. The module supports both internal scheduling and public bookings—integration with the product catalog allows you to sell time slots as regular goods with discounts, capacity, and upfront payment.

## Calendar Overview

The list of calendars displays:

- **Calendar Name** with a color indicator
- **Time Zone** (e.g., `Europe/Prague`)
- **Availability** — live status indicator:
- *Occupied until [date/time]* — currently ongoing event
- *Free until [date/time]* — start of the nearest upcoming event
- *No activity* (with a pulsing icon) — calendar is empty or inactive for a long time
- **Number of Events** — total, with an alert for upcoming events
- **Lock Indicator** — for calendars linked to a smart lock (IoT)
- **Date Created**

The list automatically refreshes every 15 seconds.

## Views

In the top bar, you can switch between views:

- **Report** — graphical overview of utilization, charts, and statistics
- **Day** — hourly breakdown of the selected day (default for detailed work with bookings)
- **Week** — work schedule from Monday to Sunday
- **Month** — calendar grid with an overview of events
- **Year** — year-round view (12 month miniatures)

> 💡 For regular planning, we recommend **Week**. For finding available dates in the longer term, use **Month**.

## Time Navigation

- **Previous / Next** — shift by the selected period (day, week, month, year)
- **Today** — quick return to the current day
- **Month and Year Selection** — dropdown list to jump to a specific period
- **Keyboard Shortcuts**: `←` / `→` to navigate, `T` for "today"

## Adding a New Calendar

The **Add Calendar** button opens a form with the following fields:

- **Calendar Name** (required)
- **Color** — hex code for distinction in lists and events (e.g., `#FF5733`)
- **Time Zone** — default according to the organization (e.g., `Europe/Prague`)
- **Descriptions** — public description (shown to customers), internal note (for team members only)

Once created, the calendar appears in the list, and you can add events to it.

## Calendar Detail

Clicking on a calendar opens a detailed view with a **Report / Day / Week / Month / Year** switch. On the left is the selected period, on the right is a sidebar with details of the selected event.

## Events

Events are the basic unit of a calendar—a booking, meeting, tour, workshop, or any other scheduled time.

### Creating an Event

You create a new event by clicking into the calendar grid or using the **New Event** button. The form requires:

- **Name** and optionally **event type**
- **Start and End** (date + time)
- **All-day** — switch if the event does not have a specific time
- **Description** and **agenda** (rich text)
- **Venue** — either a link to an address from the registry or free text
- **Attendees** — emails and phone numbers of people participating in the event
- **Reminders** — relative times before the start (`30m`, `1h`, `1d`)
- **URL** — external link associated with the event (e.g., video conference)

### Event Types

An **Event Type** is a template that speeds up the creation of recurring meeting types. A type includes:

- **Code** (e.g., `workshop`, `consultation`, `delivery`)
- **Display Name**
- **Color** — distinguishes it in the calendar
- **Product Link** — enables selling bookings to customers with capacity limits

> ℹ️ If an event type is linked to a product, the calendar displays **live occupancy** (e.g., *3 of 10 confirmed*). Once the limit is reached, the system automatically blocks further bookings.

### Recurring Events

For regular meetings (e.g., weekly meetings), you can set **recurrence** using an RRULE (iCalendar standard):

- `FREQ=DAILY` — every day
- `FREQ=WEEKLY;BYDAY=MO,WE,FR` — Monday, Wednesday, Friday
- `FREQ=MONTHLY;BYMONTHDAY=15` — on the 15th of every month

All instances of a series are linked—from the detail of one event, you can switch to others. You can cancel a single specific event or the entire series.

## Event Statuses and Actions

Each event has properties:

- **Blocking** (`isBlocking`) — a booking blocks the calendar slot, no further conflicting events can be created
- **Cancelled** (`isStorno`) — the event has been canceled. It remains for audit purposes, crossed out in the calendar.
- **ICS export** — each event can be downloaded as an `.ics` file and imported into Google Calendar, iCal, or Outlook

Contextual actions:

- **Open Detail** — by clicking on the event in the grid
- **Cancel Event** — cancellation of a single instance
- **Cancel Series** — cancellation of all instances of a recurring event
- **Unlock (IoT lock)** — if the calendar is linked to a smart lock, this button unlocks the lock during the event

## Time Zones in the Calendar

Each calendar has an assigned **time zone** which determines how events are displayed and how rules like "all day" or "opening hours" work.

- **Stored in UTC** — all times are internally stored in UTC
- **Displayed in local time** — the client automatically converts according to the calendar's time zone
- **Daylight saving time respected** — CET / CEST transition is handled automatically
- **Events spanning midnight** — an event starting at 23:00 and ending at 02:00 the next day will be displayed on both days

> ⚠️ If you work with branches in different time zones, create a **separate calendar** for each branch with the appropriate time zone. Otherwise, confusion may arise when interpreting booking times.

## Locked Calendars

Some calendars are **locked**—this means that only selected team members with appropriate permissions have access to them. Locking is reflected by:

- A lock icon next to the calendar name in the list
- Hiding the calendar from unauthorized users
- Permission check when viewing details

Permissions are set at the member and calendar level. Organization administrators automatically have access to all calendars.

## Live Availability and Conflicts

When creating a new event, the system automatically:

1. **Checks for conflicts** with existing blocking events
2. **Warns of overlaps** in the sidebar
3. **Offers the nearest available slot** (Scheduling Assistant)

> 💡 The **Scheduling Assistant** feature is particularly useful when planning meetings with multiple attendees. The system searches their calendars and suggests times when everyone is available.

## Calendar Settings

In the **Calendar Settings** section, you can adjust:

- **Name, color, time zone**
- **Public description** — text displayed to customers
- **Internal description** — note for the team only
- **Email template** — text sent upon booking confirmation
- **Default venue** — new events will pre-fill with this location
- **Linked product** — a sales product representing slots in the calendar
- **Online change deadline** — until when a customer can cancel a booking
- **Booking window** — from when / until when bookings can be made in advance
- **Time slot length** — granularity of the booking grid (15 min, 30 min, 1 h)

## Calendar Analytics

The **Report** view offers an extensive analytical suite:

- **Utilization heat map** — day × hour, showing peak times
- **Utilization trend** — development over the last 12 months
- **Top event types** — which types dominate
- **Occupancy vs. attendance** — how many people actually came
- **Completion rate** — how many events took place vs. were canceled
- **Time to fill capacity** — how quickly capacity is filled
- **Booking lead time** — how far in advance customers book
- **Last-minute bookings** — within 24 hours before the event
- **Revenue by type / hour** — economic evaluation of the calendar
- **Estimated lost revenue** — how much money was lost due to sold-out events
- **Weekend vs. weekday** — utilization comparison

> ℹ️ Analytics are only available for calendars with sufficient event history (usually at least 30 days of operation).

## Reminders and Notifications

You can set any number of reminders for each event. The format is relative:

- `15m` — 15 minutes before start
- `1h` — 1 hour before start
- `1d` — 1 day before start

Reminders are sent via **email** and **SMS** (if the attendee's phone is filled in). They can be combined—for example, 1 day + 1 hour before the event.

## Additional Features

- **Automatic refresh** of live status every 15 seconds
- **Respects time zones** including daylight saving time transitions and spanning midnight
- **ICS export** — download event in a format compatible with Outlook, iCal, Google Calendar
- **Integration with IoT locks** — opening doors during an event with one click
- **Selling slots as products** — linking with the product catalog
- **Support for multiple calendars** — isolation of bookings for different resources or services

## Tips for Daily Work

- For **each resource** (person, room, equipment), create a **separate calendar**. This prevents conflicting bookings.
- Utilize **event types** — save time when repeatedly creating similar appointments.
- For **public bookings**, link the calendar to a product and set the booking window.
- For long-term plans, **view the Month** — easily spot overlaps and gaps in the schedule.
- For **regular meetings**, use **recurrence** — enter once and the series handles the rest.
- Check analytics in the **Report** once a week — it reveals unused capacities and peak times.

## How blocking events protect reservations

Every event carries an `isBlocking` flag. A blocking event acts as a **binding reservation** for its slot: the calendar refuses to store a second event that overlaps in time within the same calendar. This is the mechanism that guarantees a resource — a trainer, a doctor, a treatment room — is never double-booked automatically.

When a new event is submitted, the platform scans the calendar for existing blocking events that overlap the requested time window. If one is found the create is rejected, and the caller receives a documented conflict error. The check is deterministic and takes no arguments beyond the calendar and the time window; it does not depend on event type, attendees, or product linkage.

The one exception is the administrator writing manually. An operator with the appropriate permission can override the block from the administration — typically to record a walk-in customer that the automation should not have prevented. When the automation itself creates events (recurring generation, bulk import), the block is always honoured.

## Cross-calendar attendee conflicts

Beyond the per-calendar blocking check, the platform can also detect that a person invited as a **required** attendee to an event in one calendar is already required to attend another event at the same time in a different calendar. When this happens the invite flow surfaces a warning so the operator does not accidentally commit the same trainer or doctor to two appointments in parallel across two calendars.

The check runs at invite time only — no attempt is made to enforce mutual exclusion; the operator is trusted to make the final call. Two operational caveats worth remembering when relying on this:

- **Physical distance is not modelled.** The platform cannot know whether the same person can realistically travel between two adjacent meetings held at two different addresses. That judgement remains with the operator.
- **Optional attendees are ignored.** Only attendees marked as required participate in the collision check. Optional invitees are not evaluated against other events at the same time.

## Reminder queue and timing guarantees

Every event can carry any number of reminders — each specified as a relative time before the event (`1d`, `1h`, `30m`, and so on). Reminders live in a long-running queue that the platform's automation drains at a regular interval, roughly once every three minutes.

Because the queue is polled, a reminder scheduled at a specific moment is not guaranteed to fire at that exact moment. The platform commits to firing every reminder **within five minutes of its planned time**, depending on current queue load. If you schedule a reminder that must be delivered ahead of a specific downstream deadline — a payment cutoff, a departure time — pick a lead time that comfortably accommodates the five-minute worst-case latency.

Reminders can trigger more than the customer-facing notification. A reminder can also fire a system action — generate a door-lock passcode ahead of check-in, verify that a ticket has been paid, confirm attendance for outstanding guests, or run any other pre-registered platform routine. This is the mechanism that lets calendars serve as the entry point for downstream automation of physical or digital fulfilment.

## Recurring events and the generator limit

A recurring event begins as a normal single event — the **reference event** — with an accompanying rule that describes how it should repeat and over what interval. When the rule is committed, a generator materialises the individual occurrences into the calendar as ordinary events, each linked back to the reference event.

The generator is deliberately bounded. In a single generation pass it will create **at most 1,000 occurrences**. If the supplied rule would produce more, the generator stops at the limit, persists what it produced, and reports the truncation — the remaining occurrences are not silently discarded but they are also not automatically retried; the operator can extend the interval or split the rule and generate the next batch.

This limit protects the calendar from a rule that would flood it with millions of occurrences (a typo in the recurrence expression or an accidentally-open end date). It also caps memory and lock time on very large calendars, keeping generation predictable.

Once created, every generated occurrence is an independent event. It can be renamed, moved to a different slot, cancelled, or reconciled against a later conflict without affecting the rest of the series or the reference event. If a specific occurrence conflicts with a blocking event created after the fact, the generator skips that occurrence rather than overriding the block; the operator is notified and can resolve the specific slot manually. An optional generator switch relaxes this behaviour: on conflict the occurrence is created but is marked as **non-blocking**, so the human can inspect and adjust.

The finest recurrence period the platform supports is **once per day**. Sub-daily recurrence must be modelled as several independent daily rules or as manual event creation.

## Cancelled and historical events

An event can be marked with the `isStorno` flag to indicate that it has been cancelled. The event stays in the database — it is not physically removed — and is hidden from the calendar view; the record remains available for audit and historical statistics. Statistics deliberately exclude cancelled events, so a wave of cancellations does not distort utilisation reports.

Full deletion is not a routine operation. The default is that any event can be restored: the platform biases towards preserving history because well-meaning but inexperienced users can accidentally delete large slices of a calendar if the option is too easy. If genuine physical deletion is required, contact platform support.

Historical events are retained indefinitely by default. Every calendar is backed up automatically and replicated across data centres.

## Time zones

Every calendar is bound to exactly one time zone. Every event's start, end and reserved-until timestamps are stored in UTC; the calendar's time zone is applied only at render time, so the same event always appears in a consistent local slot for readers of that calendar. If your organisation operates in multiple time zones — different branches, different countries — model each as its own calendar in the appropriate zone rather than trying to represent multiple zones in one calendar.

Daylight-saving transitions and events that cross local midnight are handled by the render pipeline. Events that span midnight appear on both local days for consistent scanning.

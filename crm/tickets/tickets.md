---
id: "pOwQ0CCSuqvVK4uF"
category: "crm/tickets"
tags: []
published_at: "2026-04-24T06:57:27.236Z"
---


Tickets
=======

Every organization that works with customers or on more complex projects needs a place where every suggestion, task, and error report is recorded — and where it will be visible who is handling it, what stage it is in, and how it was ultimately closed. The `/issue` module is a full-fledged issue tracker that fulfills this role: it records incoming tickets (whether from an internal team or from contact forms on the website), assigns them to responsible persons, monitors progress, and — a key difference from traditional trackers — automatically processes routine inquiries using AI. The AI workflow can classify spam, suggest answers to recurring questions, and recommend who to assign the ticket to. The support team, project managers, and technical resolvers thus gain a unified environment where every initiative is captured and nothing falls through the cracks.

## Ticket Overview

The main table displays a list of all tickets belonging to the current organization that are not marked as spam. Sorting is from newest to oldest, so newly arriving tickets are always at the top — the team can open the module in the morning and immediately see what has accumulated overnight. In the top bar, there is full-text search across all columns for quick retrieval of a specific case. Each row indicates:

- **Ticket Key** — an internal identifier in the format `PROJ-123` (project abbreviation and sequence number), which is permanent and used in communication.
- **Subject** — a concise name describing the essence of the ticket.
- **Priority** — a colored label ranging from 1 to 5, indicating urgency.
- **Status** — the current processing phase.
- **Assignee** — the person currently responsible for progress.
- **Reporter** — the person who created the ticket.
- **Creation Date** — the moment the ticket was created.
- **Last Update** — when the last change was made.

The list automatically refreshes every 15 seconds.

> ℹ️ The order of rows is from newest to oldest — the most important (newly arriving) tickets will therefore always appear at the top without the need for manual sorting.

## Ticket Types

The system can record issues of various natures. The type is not explicitly marked with a separate label but is derived from the project and content. **Task** is a standard work item for someone on the team — typically an internal matter. **Bug** represents a recorded system failure that needs to be fixed. **Feature Request** is a proposal for a new function or improvement. **Customer Inquiry** is incoming external communication that requires a response, typically originating from a contact form. **Sub-task** is a ticket linked to a parent ticket — used to break down larger tasks into smaller ones.

## Priorities

Priority determines how quickly a ticket should be resolved and helps focus the team's attention on what is truly urgent. The system distinguishes five levels: **1 — Low** for issues that can be postponed, **2 — Normal** for routine agenda (default value), **3 — High** for cases requiring priority resolution, **4 — Critical** for tickets blocking a significant portion of users, and **5 — Blocker** for complete operational shutdown, which is addressed immediately. Each level has its own color label for quick visual orientation in the list.

> 💡 When creating a ticket without an explicitly set priority, the value **Normal (2)** is automatically assigned. This means the team doesn't have to decide how urgent every common task actually is.

## Statuses

Statuses express the current stage of resolution a ticket is in, and each specific status belongs to one of four system categories. **New** is a freshly created ticket that no one has yet taken on. **In Progress** means active processing. **Waiting** signals that the resolver is awaiting external input — typically a customer or supplier response — and cannot proceed. **Done** indicates a closed ticket. Below these categories, there are specific statuses defined separately for each project: "For Analysis", "In Testing", "Ready for Deployment". The category determines how statistics and automation interact with the ticket, while the specific status helps the team with more precise orientation.

> ℹ️ Transitions between statuses are performed using a switch in the ticket detail. Allowed transitions are determined by the project workflow — not every status is accessible from everywhere, which prevents skipping steps.

## Assignment

Each ticket has two participants with distinct roles. **Reporter** is the person who created the ticket — typically a customer for external inquiries or a colleague for internal tasks. The reporter remains permanently on the ticket, even if they have moved to another department in the meantime, as they are the source of the issue and the recipient of the final response. **Assignee**, on the other hand, is the person currently responsible for progress and can be changed at any time — handing over a ticket between colleagues is a common part of the workflow, and previous assignments remain visible in the activity history. If no one is assigned, the ticket awaits triage. Such tickets are visually distinguishable in the filter, so the team knows what needs to be distributed.

> 💡 The reporter is typically an external contact (customer), while the assignee is always an internal team member. In the detail view, both roles are displayed side-by-side with clear labeling to avoid confusion in communication.

## Creating a New Ticket

The **Add** button opens a form with a mandatory subject and an optional description (supporting formatting — bold text, bullet points, links). You can pre-fill the reporter and assignee, enter a parent key to create a sub-task, and insert internal notes visible only to the team. After submission, the system assigns a key within the project (e.g., `PROJ-124`) and initiates an AI workflow (see below), which can enrich the ticket proposal with classification, a suggested response, or a recommended resolver.

## Ticket Detail

Clicking on a row opens the detail view with complete context. At the top is the ticket **description** in HTML format, which the reporter wrote, and below it are **internal notes** for the team — these are never seen by the customer and serve for internal communication within the organization. To the right are **details** (project, priority, reporter, assignee, parent ticket, deadline, activity), a **status switcher** for one-click phase change, any **links** to testing environments or documentation, and a **comments** section, which forms a chronological discussion among participants. For sub-tasks, a link to the **parent ticket** is also displayed, making it easy to navigate between the main task and its sub-tasks. When a comment is added, an email notification is sent to relevant parties — the reporter and the assignee — so no one waits unnecessarily long for missing information.

> ℹ️ The comment author is automatically determined from the logged-in identity. If a user does not have their own profile (e.g., a technical account), the system uses the ticket reporter as the author to ensure attribution does not fail.

## Deadline

A completion deadline can be set for a ticket, which is displayed in the detail view next to other metadata and is included in statistics for uncompleted tasks. For an approaching or overdue deadline, the deadline is visually highlighted to ensure it doesn't go unnoticed. It serves for capacity planning and for monitoring commitments to customers — "we promise a reply by Friday" can thus be retrospectively checked and evaluated in aggregate.

> ⚠️ An overdue deadline does not automatically change the ticket status — the resolver must close the ticket themselves. The system only provides a warning so that the delayed ticket is not forgotten.

## SPAM Filter

Tickets originating from website contact forms are sometimes generated by bots or spammers, and it would be a problem if they overwhelmed the team. The system therefore automatically classifies new tickets, and if it identifies them as spam, it hides them from the main overview. Any ticket can be manually marked as spam from the context menu, and similarly, the tag can be removed — it will then be moved back to the normal list. Spam tickets remain stored in the system (they are not deleted) and can be viewed using a separate toggle in the top bar. The context menu on each row and in the detail view offers three key actions for routine work:

- **Report SPAM** — marks the ticket as spam and hides it from the overview.
- **Unmark SPAM** — unmarks the ticket and returns it to the regular list.
- **Run AI workflow** — manually initiates AI processing if automatic processing was insufficient.

> 💡 The SPAM filter protects the team from being overwhelmed by automatically generated messages. If you need to view the list of spam tickets, a separate toggle in the top bar serves this purpose.

## AI Workflow

For each ticket, the system automatically runs a set of AI steps that handle the routine part of triage. First, **SPAM classification** occurs, which evaluates whether the issue is genuine. Then, **atomic analysis** assesses whether the ticket contains a single request or is a combination of multiple items — in the latter case, it suggests splitting it into separate tickets. For simple, recurring inquiries, AI prepares a **quick response** in the form of a suggestion that the resolver can simply review and send. **Routing**, based on content, recommends which team or specific person the ticket should be assigned to. Finally, the system sends an **email notification** to the reporter and assignee, so they know the ticket has started processing. The AI workflow starts automatically immediately after each new ticket is created and can also be run manually from the context menu — typically if the ticket has changed in the meantime and you want the AI to re-evaluate its content.

> ℹ️ AI processing occurs in the background. The result will appear with a short delay — the ticket may change its SPAM classification, have a suggested response added, or a recommended resolver changed. The process is transparent and remains recorded in the activity history.
> ⚠️ In some organizations, AI processing is forbidden (in "disable experiments" mode). In such a case, only SPAM classification and email notification will occur — other AI steps are skipped, and triage remains entirely in the hands of the team.

## Statistics and Filtering

Above the table, there can be summary counts by status categories — how many tickets are new, in progress, waiting for input, and done, plus the total number of open and SPAM tickets. Statistics serve for the team's morning overview: they show how much work is in the system and how much is waiting for an external response. Filtering then allows the list to be narrowed down by project, status category, assigned resolver (typically "my tickets"), reporter, or SPAM flag.

> 💡 For efficient work with tickets, we recommend adhering to a consistent convention in subjects (for example, "[Module] Brief Description"). This way, the team can easily navigate even hundreds of tickets and quickly find what they are looking for.

---
id: "rWktIswXewbDhozp"
category: "sales/complaint"
tags: []
published_at: "2026-04-24T06:57:25.614Z"
---


Complaint
=========

Complaints represent the most sensitive moment in the customer relationship — the customer has encountered a problem and is watching how quickly and professionally the organization resolves it. The `/complaint` module therefore manages the entire process of complaints and returns from their creation through assessment to final closure, while connecting contact, original order, payments, and internal communication into a single comprehensive dossier. Each step is recorded on an audit timeline, so the staff has available not only tools for handling the case itself, but also a verifiable history in case of disputes and for back analysis of the complaints team's performance.

## Overview of Complaints

The main page displays a list of all complaint cases of the organization and is designed so that the staff can see at a glance what is urgent and what can wait. The status column can be changed directly in the row, so there is no need to open the detail just to advance the case. Individual columns convey:

- **Complaint ID** — a unique identifier of the case; the link leads to the details.
- **Customer** — name and email of the person who submitted the complaint.
- **Type of Complaint** — variant defined by the organization (for example, complaint about a defect, return within the deadline, exchange).
- **Status** — dropdown list (New, In Progress, Waiting, Resolved, Rejected, Closed); the status can be changed directly in the table.
- **Resolved** — yes / no with the date of case closure.
- **Creation Date** — when the complaint was created.
- **Deadline** — optional date by which the complaint should be resolved.

The table automatically refreshes every 5 seconds, and complaints approaching the deadline are visually highlighted in the overview so that no one forgets about an upcoming deadline.

## Types of Complaints

Each organization defines its own variants of complaints, as the nature of handling varies significantly from case to case — defective goods are dealt with differently than cancellation of the contract or a request to exchange the size. The usual trio therefore looks like this:

- **Complaint** — the goods have a defect or do not match the description; it most often ends with repair or exchange.
- **Return of Goods** — cancellation of the contract within the deadline; the usual resolution is a refund.
- **Exchange** — the customer requests a different piece, typically a different size or color.

Variants are managed in the settings — each has its own code, description, and optional complaint policy (see below). Inactive variants cannot be used for new cases, but existing cases remain preserved in them, so retroactive audits are not disrupted by type changes.

## States of Complaints

A complaint goes through a sequence of states over its lifetime, which corresponds to actual processing — from acceptance through active resolution to final closure. The separation of “resolved” and “closed” allows capturing the situation where the matter is substantively finished but administratively still awaits review or invoicing.

- **New** — just created, no one has processed it yet.
- **Open / In Progress** — taken over by the staff, assessment is ongoing.
- **Waiting** — paused due to reasons outside the control of the staff (waiting for goods delivery from the customer, for service assessment, etc.).
- **Resolved** — the staff acknowledged the complaint and completed its resolution (repair, exchange, refund).
- **Rejected** — the complaint was not recognized as valid; the reason is recorded in the report upon transition.
- **Closed** — final state after resolution, does not allow further editing of items.

> ℹ️ Setting the status to **Resolved** or **Closed** automatically records the "resolved" flag and saves the closure date. Transitioning to other states removes this flag.

## Transitions Between States

Each status change is immediately reflected in the complaint overview, records a new entry in the timeline, saves the author of the change (the staff member who made the transition), and allows adding a message with the reason or note visible to the customer. Thanks to this trail, it is always verifiable who and when decided on the direction of processing — which is crucial in potential disputes with customers or audits.

> 💡 Typical workflows are *New → Open → Resolved → Closed* or *New → Open → Rejected → Closed*. Use the *Waiting* status for interruptions in the process due to reasons outside the control of the staff — so it is clear from the overview why nothing is happening with the case.

## Creating a New Complaint

A complaint can arise either from the customer through the customer portal, or it is created by the staff via the **Add** button in the top right corner — typically at the moment when the complaint claim arrives via email, by phone, or at the branch. The dialog allows searching for an existing customer with autocomplete by name, email, and phone; if the customer does not exist in the system, the data can be filled in manually. By entering the order number, the items are automatically pre-filled from the original purchase, so the staff does not have to re-enter what exactly is being complained about. Next, the type of complaint, method of resolution (repair, exchange, refund, credit note — the choice is optional and can be specified during the process), banking details for potential refunds, and the resolution deadline are selected. The system automatically creates the first event in the timeline after creation, and the case is ready for further processing.

## Complaint Details

Clicking on the ID opens details divided into tabs according to which aspect of the case the staff is currently addressing.

### Overview

The **Overview** tab aggregates the summary of the complaint — basic data, connection to the order, list of items with prices, and optional fields for service, branch, or assigned staff member. Here, the description, customer contact information, deadline, and refund details can be adjusted. Editing is limited for closed complaints to prevent interference with archived cases.

### Events (Timeline)

The **Events** tab is a complete chronological audit of everything that has happened with the complaint. Each record includes the author, time, subject, and body of the message and is color-coded according to whether it is an automatic system event, internal note, or communication shared with the customer.

- **Status Changes** — automatically upon transition between individual states.
- **Internal Notes** — visible only to staff, intended for team coordination.
- **Messages Shared with the Customer** — marked with the **Shared with Customer** flag and also sent via email.
- **Attached Files** — documents, photos of defects, service assessments.

> 💡 An event can be marked as *internal* or *shared* upon creation. Carefully separate both categories — internal work notes are not visible to the customer, and vice versa, shared messages will be sent to them via email and in their portal.

### Files

The **Files** tab contains all documents attached to the case — photos of defects, invoices, service protocols, or email correspondence. Files are uploaded to storage and subsequently linked to the complaint, ensuring they remain structured and auditable even after years. Each new file automatically generates an event in the timeline, so it is always clear who and when added which document.

### Satisfaction

After the complaint is closed, the system offers the customer the opportunity to rate the resolution process with a score from 1 to 10 and an optional text comment. Feedback is aggregated into team statistics and serves as a basis for improving the complaint process. Ratings are available only for resolved or closed cases — it would be premature for open complaints.

## Refund

If the method of resolution involves a refund, banking details must be added to the details — specifically the country code of the bank (CZ, SK, DE, etc.), which determines the account control format, the account number in the format of the respective country (for example, `123456789/0100` or IBAN), and a variable symbol for accounting reconciliation, which is typically the number of the original order. An icon for copying is available for each detail, allowing the value to be transferred directly to the banking system without any typos.

> ⚠️ Enter bank details only after the complaint has been acknowledged. The system never attempts to transfer automatically — the refund is always performed manually by the staff in their banking interface to prevent unauthorized automatic sending of money.

## Timeline and Audit

Every action regarding the complaint — status change, data adjustment, item addition, file upload, communication with the customer — is recorded in a permanent timeline, which serves as the source of three key benefits: verifiability in disputes (when exactly and who decided), retrospective reconstruction of the process (why the case developed as it did), and metrics for evaluating team performance (how quickly it was resolved, where there were delays). Records cannot be deleted or overwritten, ensuring the integrity of the audit log.

## Complaint Items

Items represent the specific goods or services related to the complaint and are the core of the case. Each has a name, quantity, and price, and can be added or removed during the complaint through the context menu in the table row. When linked to the original order, a bond to a specific line of the original document is preserved, so the system can trace which order the item comes from and at what price it was originally sold. This significantly simplifies the accounting processing of refunds and credit notes.

## Filtering and Searching

The list of complaints tends to be extensive for active organizations, which is why a combination of filters that can be layered is available above the table. Full-text search works with names, emails, order numbers, and text descriptions; in addition, the selection can be limited by the type of complaint, status, "resolved" flag (only resolved / only open), and the range of creation dates. Thanks to this combination, one can quickly isolate for example "open complaints of the return type from the last week."

## Complaint Policy

A structured document — complaint policy — can be assigned to each type of complaint, clearly describing the rules of the game for the staff and for the customer. The policy serves as a reference text in administration and is also displayed on the customer portal, so any dispute about the terms can always be backed by a specific version of the document.

- **Validity** — from when until when the version of the policy is valid (upon a legal change, a new version is created, the old remains available for historical cases).
- **Deadlines** — for example, the number of hours before the action within which free cancellation is possible.
- **Cancellation Fees** — a percentage of the order price for late cancellations.
- **Scope** — the policy can apply to the entire range, a category, or a specific product.

## Additional Features

Several small tools are available directly in the overview and in the details that save time in routine work — copying the complaint ID, customer name, email, and bank account to the clipboard, a status dropdown available in both the row and the detail for quick changes, deleting individual items from the context menu in the items table, and visual reminders for complaints approaching the resolution deadline.

> 💡 For effective management of a larger number of complaints, we recommend going through the filter *Open + approaching deadline* every day. It will help keep the complaints team on a planned pace and keep customers satisfied — nothing diminishes the impression of a complaint as much as silence after the deadline.

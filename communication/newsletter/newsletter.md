---
id: "ysIBEaOR9V7odYMs"
category: "communication/newsletter"
tags: []
published_at: "2026-04-24T06:57:27.809Z"
---


Newsletter
==========

A newsletter is a typical gateway to a long-term customer relationship — the customer voluntarily requests regular information and, in exchange, receives offers, news, and useful content. The `/newsletter` module therefore manages a list of all subscribers, regardless of whether they signed up from the web, came via import, or were manually entered by an operator. It separates the signup phase from the confirmation phase, tracks the source of each subscription, and links with the **Contacts** module as a unified database of recipients and with **Newsletter Campaigns**, which carry out the mailings themselves. A clean and verified subscriber list is a fundamental condition for campaigns to even reach recipients' inboxes and not fall into spam.
## Subscriber Overview
The main table is a working tool for daily list hygiene. Each row shows the status of the subscription, where the customer comes from, and when individual events occurred. This combination allows the operator to immediately detect systemic problems — subscribers stuck in the *pending* state signal an issue with confirmation emails, while a mass occurrence of the *canceled* state suggests that the campaign content did not meet audience expectations.
Individual columns convey:
- **Customer** — subscriber's name and email; the link leads to the contact detail in the Contacts module.
- **Status** — current phase of the subscription (approved, pending, canceled, ignored) along with the date of the last transition.
- **Source of addition** — text label indicating where the subscriber signed up (e.g., "web-footer", "event-2026-03", "bulk import").
- **Hash** — internal security identifier used in confirmation and unsubscribe links.
- **Date added** — when the subscriber was added to the list.
- **Date approved** — when consent was confirmed via double opt-in.
- **Date canceled** — when the subscription was terminated, if it occurred.
The table automatically refreshes every 20 seconds so that the operator can see the current results of ongoing imports and currently confirmed subscriptions. If the same email attempts to sign up a second time for the same contact, the system recognizes the situation and does not process the duplicate subscription.
## Signup Process and Double Opt-in
Simply filling out a form in the system is not enough — the subscriber must explicitly confirm their interest by clicking a link in an email that is sent immediately. This two-phase mechanism, known as double opt-in, is both a legal obligation under GDPR and a practical condition for good relationships with large email providers such as Gmail, Outlook, or Seznam. In addition, it filters out typos and fake signups with foreign addresses, which would otherwise unnecessarily burden the list. Until the subscriber confirms, their record remains in the *pending* state, and campaigns are not sent to that address.
The entire flow takes place in two steps:
1. **Add contact** — the subscriber is added to the list with the status *waiting for approval*, and a welcome email with a confirmation link containing a unique hash is immediately sent to them.
2. **Confirmation (double opt-in)** — by clicking the link, the subscriber confirms their consent. The system sets the **Authorized by user** flag for them and moves them to the *approved* state.
> ℹ️ Double opt-in is essential not only from a legal perspective but also for the reputation of the sending domain. Emails to unconfirmed addresses are a frequent source of complaints and unwanted feedback that harms the deliverability of all your future campaigns.
## Subscriber Statuses
The subscriber's lifecycle is described by four statuses that unequivocally determine whether a given contact is usable for campaigns. Transitions between them occur either automatically (link confirmation, expiration of the waiting period) or by operator action, or by the subscriber themselves via an unsubscribe link in the campaign footer.
- **Approved** — the contact has passed two-phase confirmation and is included in selections for campaigns.
- **Pending** — the contact has been added but has not yet confirmed consent; after a specified period without response, it transitions to *ignored*.
- **Canceled** — the subscriber actively unsubscribed; the record retains the date and an optional message with the reason.
- **Ignored** — system status for unconfirmed contacts or permanently undeliverable addresses.
## Hash Identifier
A hash is a sixteen-character unique identifier that the system assigns to each subscriber and uses as a secure replacement for direct referencing of an email address. Thus, sensitive data never appears in the URL — instead of a readable parameter `?email=customer@example.com`, the link contains an opaque string that cannot be derived or guessed. This approach protects subscriber privacy even if the link ends up in a server log or browser history.
The hash is used in three situations:
- **In the confirmation link** — the subscriber clicks the link in the welcome email, thereby activating double opt-in.
- **In the unsubscribe link** — the footer of each campaign contains a link with a hash, which, when opened, results in immediate unsubscribing.
- **In the API for tracking** — campaign opens and clicks are tied to the hash, not the email.
> 💡 The hash is immutable for the entire duration of the subscription. If a subscriber unsubscribes and later resubscribes, they will receive a new hash, and a new record will be created in the list — the historical passage through the list will remain traceable.
## Bulk Import
Manually adding addresses one by one only makes sense in isolated cases; most organizations need to insert hundreds or thousands of contacts at once — typically when migrating from an old system, after a conference, or when taking over a list from a partner. For these situations, bulk import is designed, which is launched by the **Add** button in the upper right corner and guides the operator through four steps that prevent the introduction of poor-quality data.
1. **Enter email list** — manually, from CSV, or by pasting from clipboard; there is no upper limit, but it is recommended to batch in a maximum of 5,000 addresses.
2. **Analysis** — the system checks the email format, flags invalid ones, and counts duplicates.
3. **Select contacts for import** — the operator sees an overview of new, duplicate, and invalid records and can remove specific items before importing.
4. **Confirmation with source of addition** — a text description of the source is entered (e.g., "eventbrite-export-2026-04"), which is saved for each imported subscriber.
During import, the system automatically creates missing contacts in the **Contacts** module as guests, removes any "ignore bulk emails" flag from them, and sends a welcome email with a confirmation link to each new subscriber.
> ⚠️ Imported subscribers **never immediately enter the "approved" state** — all must first confirm consent via double opt-in. This ensures compliance with legal regulations and postal provider rules, and also eliminates the risk of addresses entering a campaign that are not actually interested.
## Unsubscribe
Every sent campaign contains an unsubscribe link in the footer, opening which is a definitive action — the subscriber immediately transitions to the *canceled* state, the date and any message with the reason are saved, and the contact is automatically removed from all planned and future campaigns. The record itself does not disappear, only becomes inactive; it remains in the list so that it can be retroactively proven that consent existed and was properly terminated. This trail is crucial for GDPR audit and for deciding on re-engagement in future campaigns.
## Approval and Moderation
Automatic double opt-in covers the vast majority of common situations, but the operator must also be able to intervene in edge cases. In the detail of each subscriber, consent can be manually confirmed (e.g., after a written customer request that arrived outside the standard form), the subscription can be terminated with a specified reason, or the linked contact can be opened for deeper management including trustworthiness score, purchase history, and credit. These interventions are always recorded in the contact's audit trail, so it is traceable at any time who made the change and why.
> 💡 For subscribers who do not confirm themselves, we recommend performing a cleanup once a month. Undeliverable addresses and long-inactive contacts unnecessarily reduce campaign deliverability and degrade the sending domain's reputation with mail servers.
## Link to Campaigns
Only subscribers in the *approved* state are usable for the **Newsletter Campaigns** module; other states are automatically excluded from every campaign, even if the operator attempts to manually add them. At the same time, a contact with an active "ignore bulk emails" flag or a blocked contact never enters a campaign — these rules are enforced at the system level and cannot be bypassed. The newsletter module thus functions as a quality filter that protects the deliverability and reputation of the sending domain regardless of how a particular campaign is prepared.

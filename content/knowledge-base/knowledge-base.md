---
code: "knowledge-base-overview"
category: "content"
tags: ["type-overview", "knowledge-base", "ai"]
published_at: "2026-11-24T00:00:00.000Z"
---


Knowledge base
==============

The **Knowledge base** holds your organisation's internal notes, procedures and answers: the things a new colleague would ask about and the AI assistant cannot know on its own. Typical entries are "How do we handle a complaint about a damaged parcel?", "Which supplier do we order packaging from?" or "What discount can a sales representative give without approval?".

The AI assistant in the administration searches these entries when you ask about your organisation's own rules, and it uses them when it drafts replies to issues. The knowledge base is internal: it is not published on your website and is not used by the public API.

## When you would use it

- Write down internal procedures once, so colleagues and the AI assistant give the same answer.
- Keep question and answer pairs for recurring customer questions, so the assistant can prepare reply drafts that match your policy.
- Review facts the assistant picked up from your chats before it is allowed to use them.
- Find entries that have not been checked for a long time and confirm that they are still true.

## Where to find it in the admin

Open **Knowledge Base** in the main menu of the administration. Every member of the organisation can read, create and edit entries; there is no separate permission. Each organisation sees only its own entries.

## Core concepts

### Entry kinds

| Kind | Use it for |
|---|---|
| `Q/A pair` | A question with its answer. Entries the assistant saves from a chat are always of this kind. |
| `Note` | A short free-form note. This is the default kind. |
| `Web chunk` | A passage copied from your public website. |
| `Curated article` | A longer, hand-written article. |

### Entry statuses

| Status | Visible to the assistant | Meaning |
|---|---|---|
| `Draft` | No | Waiting for approval. |
| `Active` | Yes | Approved and in use. |
| `To verify` | Yes, ranked slightly lower | The entry has not been verified for a long time. The assistant tells you that it may be outdated. |
| `Archived` | No | Kept for reference, no longer used. |

### Language

Each entry has an **Entry language**: Czech, English, Polish or Slovak. You do not need to translate entries. Search works across languages, so a note written in Czech is found by a question asked in English.

## Creating an entry

1. Open **Knowledge Base** and click **New entry**.
2. Choose the **Kind** and the **Status**. The default is `Note` and `Active`.
3. Optionally fill in a **Title** (up to 500 characters). For a `Q/A pair`, fill in **Question (for Q/A kind)** (up to 500 characters).
4. Write the **Body**: exactly what the assistant should know, up to 100,000 characters. The body is required.
5. Add **Tags**, separated by commas, for example `complaint, discount, supplier`.
6. Choose the **Entry language** and save.

An entry saved as `Active` is available to the assistant immediately.

Tags are normalised when you save: they are converted to lower case, spaces become hyphens, and every character other than `a` to `z`, digits, `-` and `_` is removed. Write tags without accents; an accented letter is dropped, not replaced.

### A good entry

Write one fact or one procedure per entry, in full sentences, and include the conditions under which it applies. Compare:

- Weak: "Discount max 10 %."
- Strong: "A sales representative may give a customer a discount of up to 10 % on a single order without approval. Higher discounts must be approved by the head of sales. The rule does not apply to products already on sale."

The assistant quotes entries and tells you their approximate date, so a precise entry produces a precise answer.

## The entry list

The list shows **Kind**, **Title**, **Status**, **Tags** and **Updated**, newest change first, 50 entries per page. When an entry has no title, the question is shown instead. The list refreshes every 30 seconds.

- **Search** matches any part of the title, question or body and ignores accents, so `vraceni` finds `vrácení`.
- **Kind** and **Status** filters narrow the list.

Right-click an entry for its actions:

- **Approve** (drafts only) makes the entry `Active`.
- **Edit** opens the form. Clicking the title does the same.
- **Archive** stops the assistant from using the entry but keeps it in the list under the `Archived` filter.
- **Delete** removes the entry from the list and from the assistant. Deleted entries cannot be restored from the administration.

## Entries saved from the AI assistant

When you tell the AI assistant something general about how your organisation works, for example "We never ship to Slovakia on Fridays", it can save that fact as a new `Q/A pair` in the `Draft` status. A draft is not used by the assistant until a person approves it. The assistant does not save a draft when it looked up records during that turn, and it does not save text that looks like an attempt to manipulate it.

Drafts are saved exactly as written. Before you approve one, remove customer names, e-mail addresses and other personal details that do not belong in a shared note.

## Review queue

The **Review queue** page (`/knowledge-base/review` in the administration) collects entries that need a decision, in three sections:

| Section | Contents |
|---|---|
| **Drafts** | Notes the assistant saved from chats. Invisible to the assistant until approved. |
| **To verify** | Entries whose verification period has passed. Still used, ranked slightly lower. |
| **GDPR flag** | Entries that mention a customer who has since been anonymised. Candidates for deletion; some can be false positives. |

Tick the entries you want to process. **Approve** makes up to 100 entries `Active` at once and records them as verified today. **Delete** removes the selected entries after a confirmation. Each section shows up to 100 entries.

## Verification periods

An active entry moves to `To verify` when it has not been verified for:

| Kind | Period |
|---|---|
| `Q/A pair` | 180 days |
| `Note` | 180 days |
| `Web chunk` | 30 days |
| `Curated article` | 365 days |

The platform checks entries every few hours. To reset the period, select the entry in the **To verify** section of the review queue and click **Approve**. Changing the status to `Active` in the edit form does not reset the period, so the entry returns to `To verify` at the next check.

## How the AI assistant uses entries

- When you ask about your organisation's policies, procedures or history, the assistant searches the knowledge base first. When a question could concern either your organisation or the platform itself, it searches the knowledge base and the product documentation together.
- The assistant reads the whole entry before quoting it and tells you its approximate date. Entries written by a person rank higher than entries saved from a chat.
- When sources disagree, the product documentation wins on how the platform works, your knowledge base wins on your own policy, and live records (orders, invoices, contacts) win on the current state of a record.
- When the assistant prepares a reply to an [issue](/issue-overview) with **Draft an AI reply**, it searches the knowledge base and summarises the relevant entries. The result is an internal draft; nothing is sent to the customer.

Searching the knowledge base uses AI processing that counts towards your organisation's AI usage. Identical searches are reused for 24 hours.

## Personal data and anonymisation

When a contact is anonymised (see [Contacts](/contact-overview)), the platform checks the knowledge base within a few minutes:

- Entries that the assistant saved from a chat and linked to that contact are deleted permanently.
- Other entries whose text contains the contact's e-mail address, phone number, company name or full name are flagged and appear in the **GDPR flag** section of the review queue.

A flagged entry stays visible to the assistant until someone deletes it. Check the **GDPR flag** section after every anonymisation request.

## Related

- [Issues](/issue-overview): AI reply drafts use knowledge base entries.
- [Contacts](/contact-overview): anonymisation and its effect on entries.
- [Conversations](/conversations-overview): the history of AI assistant chats.
- [Team chat](/team-chat-overview): where colleagues discuss procedures before they are written down.

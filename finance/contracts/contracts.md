---
id: "K04jRlYbjg1a6Zbt"
category: "finance/contracts"
tags: []
published_at: "2026-04-24T06:57:25.954Z"
---


Contracts
=========

Contracts are a formal record of agreements that an organization enters into with other parties — with employees, clients, suppliers, and business partners. The `/contract` module unifies this area: it provides a single central place where a contract can be drafted, reviewed, finalized into an unalterable PDF, its validity tracked, and after its term ends, transferred to the archive. This eliminates fragmented document storage across emails and shared drives, and each agreement has a clear history from draft to signature.
The module handles both standard documents (employment contracts, NDAs, service agreements, supplier contracts) and one-off customized legal texts. Integration with the contact directory ensures that the identity of the contracting parties is always current and consistent with other system modules.
## Contract Overview
The main page shows a clear table of the organization's contracts. The goal is to reveal at a glance which agreements are awaiting revision, which are currently undergoing signature, and which are approaching their expiration date. The columns are chosen to provide information about the agreement's status without needing to open the detail view.
- **Contract Name** — a clickable link to the detail, serving as the main identifier for the agreement in daily communication.
- **Status** — a colored label indicating the contract's lifecycle phase (draft, pending review, approved, signed, active, expired, cancelled, archived).
- **Number of Parties** — how many entities (natural or legal persons) the agreement binds; for multi-party contracts, this is key information.
- **PDF** — an indicator of the availability of the finalized PDF document, ready for signing or archiving.
- **Validity from / to** — the contractually agreed period during which the agreement produces effects.
- **Last Modified Date** — for quick orientation, which contract was recently changed.
The table automatically refreshes every 5 seconds, so the current status of revisions and signatures is visible in real time without the need for manual refresh.
## Filtering
Above the list, contracts can be narrowed down by a filter by status, which quickly separates active agreements from archived ones, and by full-text search in the name, which is useful when searching for a specific contract among hundreds of records.
## Contract Lifecycle
A contract in the system is not a static document, but a process. Each phase determines which operations are allowed — a draft can be freely edited, an approved contract cannot. Transitions between states are intentionally designed as one-way to prevent mishaps and maintain an audit trail.
- **Draft** (`draft`) — a working version that can be freely edited; it is the default state of every newly created contract.
- **Pending Review** (`pending_review`) — the document has been sent for comments, and editing is generally suspended to prevent changes from being lost during review.
- **Approved** (`approved`) — the contract has been approved and finalized into a PDF, the content is now locked against further edits.
- **Signed** (`signed`) — all parties have signed the contract, and the system has recorded the signature date.
- **Active** (`active`) — the contract is within its validity period and is legally producing effects.
- **Expired** (`expired`) — the agreed validity date has passed; the content remains available for audit, but the agreement is no longer effective.
- **Cancelled** (`cancelled`) — the agreement was terminated before its fulfillment, for example, by mutual agreement to terminate.
- **Archived** (`archived`) — a historical document moved to the archive; it does not change and is not included in active overviews.
> ℹ️ Transitions between states are governed by fixed rules — a contract in the *Approved* state cannot be reverted to *Draft*. Moving to a higher state is irreversible, which is intentional and serves to protect the authenticity of the document.
## Creating a New Contract
The **Create** button in the top right corner opens a wizard offering two paths. The first leads through a **template** — the content is pre-filled from one of the prepared samples, which is the fastest way for standard documents. The second path is an **empty document**, where you start with a blank markdown editor and write the text from scratch.
The subsequent form asks for the contract name, document language (e.g., `cs`, `en`, `de` — according to which dates and texts in the PDF are formatted), content in the markdown editor, selection of contracting parties from the directory, and optionally the validity period. The issuing organization is automatically added to the contract as the issuer (`issuer`), other contacts enter as contracting parties (`party`).
> 💡 **Tip:** If you repeatedly create a similar type of contract, it pays to set up a template once — it will save you tens of minutes of copying and editing for every subsequent contract.
## Templates
Templates are reusable patterns that solve the biggest weakness of manually written contracts: susceptibility to typos and inconsistency in legal formulations. They are suitable for standard documents such as employment contracts, non-disclosure agreements, or order forms, where only a few details change across hundreds of cases.
Each template has a name, a short description of its purpose, categorization (e.g., *Employment Contracts* or *Terms and Conditions*), language, the content itself in markdown format, and a flag indicating whether it is active. Inactive templates are not offered in the selection when creating a new contract, but remain in the system for eventual reactivation. Template management takes place in a separate section accessible from a link in the top right corner of the contract overview.
> ⚠️ Editing the content of a template does not affect contracts already created from it. The template is copied into the contract only at the moment of its creation — later changes to the template are not reflected in existing contracts.
## Contract Detail
Clicking on the name opens the detail view, divided into logical sections that correspond to different phases of working with the contract — writing text, managing parties, and tracking validity.
### Contract Content
The main editor displays the contract text in markdown format, which allows writing formatted text (headings, paragraphs, lists, tables) without knowledge of HTML or TeX. In **draft** mode, the text can be freely edited and formulations experimented with. In **pending review**, there is mainly space for comments from reviewing parties. After **finalization**, the content is locked and serves exclusively for reading — this is intentional, as a signed contract must remain unchangeable.
### Contracting Parties
This section records all contacts attached to the contract with an assigned role. Available roles are issuer, contracting party, witness, and guarantor, covering common legal constellations including multi-party agreements. For each party, the name, email, and possibly the company name for legal entities are visible. The number of parties is not limited, so multi-party memorandums or consortium agreements can be created without problems.
> ℹ️ The user's organization is automatically added to the contract as the issuer, and this party cannot be removed from the agreement — it is a fundamental design element that defines who issued the contract.
### Validity
The validity period is expressed by a pair of dates: **Valid from** indicates when the contract begins to take effect, **Valid to** the date of its expiration (for timeless agreements, it remains blank). The **Signature Date** is automatically recorded upon finalization and serves as proof of the moment the agreement was concluded.
## Revisions and Edits
As long as the contract is in *Draft* or *Pending Review* status, its name, content, language, validity period, and list of contracting parties can be changed. All changes are saved with the **Save** button and recorded in the audit log, so it is later possible to track who edited what and when.
> ⚠️ Once a contract is finalized into a PDF by transitioning to the *Approved* state, content editing is no longer possible — without exception. If it is necessary to correct the final document (e.g., due to an error in numerical data), a new contract must be created and the original one cancelled; this preserves the integrity of signed documents.
## PDF Preview and Generation
When working with a draft, the system offers two buttons that handle document review and finalization. **PDF Preview** generates the current version of the contract into a PDF and displays it directly in the browser. The preview is only temporarily saved and serves to check formatting before actual completion. **Finalize** converts the contract to *Approved* status, saves the PDF to central storage, and records the signature date. This operation is irreversible.
The generated document contains a header with the contract name, a summary of contracting parties with their role, name, email, and possibly company name, the body of the contract converted from markdown to formatted text, the validity period, the signature date, and the contract identifier in the footer.
> 💡 **Tip:** For printing on paper, use the standard browser function (`Cmd+P` / `Ctrl+P`). PDF dimensions are optimized for A4 format.
## Context Menu
The context menu on each row offers the **Delete** action, which removes the contract from overviews. This is a so-called soft delete — the contract is marked as deleted and excluded from regular listings, but physically remains in the database for audit purposes.
## Tips for Daily Work
- When repeatedly working with standard documents, create a **template**; the time saved for each new contract amounts to tens of minutes.
- Finalize only after agreement by all parties — as long as the contract is in *Draft* status, it can be freely edited, but not after finalization.
- For long-term agreements, fill in **Valid to**, as the system will notify you of impending expiration and allow time to prepare for renewal.
- Do not delete old contracts, but **archive** them — they will remain available for audit but will not clutter the main overview.

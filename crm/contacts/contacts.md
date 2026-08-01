---
id: "EmHNQpk5UHan3f5c"
category: "crm/contacts"
tags: []
published_at: "2026-04-24T06:57:25.835Z"
---


Contacts
========

Contacts are the core of every customer-oriented organization — they represent a unified record of all individuals and companies you communicate or do business with. The `/contact` module therefore brings together registered accounts, guests created during one-time orders, business partners, test accounts, and archived records into a single overview, which is followed by orders, complaints, newsletters, credit, and email communication history. Thanks to this, a contact is not just a row in a database, but a living profile where the entire customer relationship converges.
## Contact Overview
The main page is designed as a working tool for daily management of the customer base. The table therefore shows not only the person's identification in each row, but also the business context — how much money the customer has already spent, their reliability score, and when they were last active in the system. This information allows you to quickly distinguish a key client from a one-time guest without having to open the detail.
Individual columns state:
- **Name** — full name of the person, or company name.
- **Email** — primary address for login and all communication.
- **Phone** — formatted according to national rules for easy readability.
- **Credit** — current balance maintained in parallel in credits and monetary value.
- **Trust Score** — automatically calculated customer quality rating in the range of 0 to 100.
- **Registration Date** — the moment the contact was created in the system.
- **Newsletter** — current subscription status (approved, pending, cancelled, or ignored).
- **Revenue** — lifetime spending from paid orders.
- **Number of Orders** — sum of new, in-progress, paid, and completed cases.
- **Refunds** — total value of returned or cancelled items.
- **Last Activity** — time of last login or significant action.
The table automatically refreshes every 5 seconds, reflecting the status as close to real-time as possible. On mobile devices, it switches to a condensed view, showing only the most important data.
## Filtering and Searching
Because customer databases typically grow to thousands of records, the list is equipped with a combination of filters that can be layered — each selected filter further narrows the selection. This allows you to instantly isolate, for example, "VIP customers from the Czech Republic with positive credit who are subscribed to the newsletter".
The following filtering axes are available:
- **Registered / Guest** — a registered contact has a password set and their own account, while a guest was created without registration.
- **Premium Status** — designation for VIP customers with special conditions.
- **Blocking** — prohibition of access to the user portal.
- **Test Account** — non-production contacts excluded from business overviews.
- **Credit Status** — positive balance, zero, or debt.
- **Newsletter Subscription** — filter by subscription status.
- **Registration Date and Last Activity** — any time range.
- **Language Version** — CZ, SK, EN, and other communication languages.
Full-text search covers name, email, phone, and company name, and ignores diacritics and case, so "Novak", "novák", and "NOVÁK" will return the same result.
> 💡 Contacts can also be grouped into custom tags ("VIP", "Wholesale", "Ambassadors"). The filter accepts multiple groups at once; the special value "No Tags" finds contacts without any designation.
## How the Trust Score works
The trust score is an integer between 0 and 100, which the system continuously recalculates based on customer behavior. It expresses how reliable a business partner the given contact is — a higher value means a better customer. The score cannot be adjusted manually; it is a derived metric intended to serve as an objective basis for decisions such as "who to offer preferential invoice payment to".
A combination of factors is included in the calculation:
- **Account Age** — accounts older than one year receive 20 points, older than six months 10 points, newer 5 points.
- **Paid Order Ratio** — a customer paying more than 90% of orders receives a 20-point bonus; persistently low payment discipline below 50% means a 10-point deduction.
- **Credit** — a positive balance adds 10 points, a negative balance subtracts 5 points.
- **Premium Status** — VIP customers receive a 10-point bonus.
- **Registration** — a contact with their own account receives an additional 5 points compared to a guest.
- **Cancelled Orders** — more than 5 cancellations means a 15-point deduction, between 3 and 5 cancellations a 5-point deduction.
> ℹ️ A blocked contact has its score set to -1 and is automatically excluded from all overviews and selection campaigns.
## Registered Contact vs. Guest
Two types of contacts coexist in the system, differing in the depth of the customer relationship. A registered contact has a password set, a separate profile, and access to the user portal, where they can view order history and manage their data; registration also earns them 5 points towards their score. A guest (anonymous customer), on the other hand, is automatically created during their first order without registration — they cannot access the portal, but the system still pairs their history based on their email address. A guest can turn into a registered account at any time simply by setting a password, without losing any of their existing history.
> 💡 If a duplicate contact is created (for example, manually created in the administration and also automatically from an order), both records can be merged using the **Merge Customers** action — orders, credit, and all history will be transferred to the main account.
## Blocking and Test Accounts
Blocking serves as a strict measure against problematic customers. It denies the contact access to the portal, blocks their newsletter and automatic messages, and upon activation, a reason can be entered, which will remain in the audit log. The action is fully reversible — blocking can be cancelled at any time. A test account, on the other hand, is purely an administrative flag for internal QA and integration tests; such a contact is automatically hidden in reports, campaigns, and statistics, thus not creating noise in business data.
> ⚠️ Blocking takes effect immediately. If the customer has an open login on a mobile device or browser, they can also be forcibly logged out using the **Invalidate Sessions** action — they will then have to log in again, which, of course, they will no longer be able to do.
## Credit
Credit is an internal payment method that can be used to hold prepaid funds, loyalty bonuses, credit notes, or gift vouchers for a customer. In the system, it is maintained in two parallel values: as **number of credits** (a whole positive or negative number) and as a **monetary equivalent** in the organization's currency, which serves for accounting overviews. Thanks to this dual tracking, the actual value of the liability to the customer can be shown in accounting, even if the credits themselves are used as a universal unit.
In the contact detail, the following are available:
- **Current Balance** — instant status of both the number of credits and monetary value.
- **Transaction History** — sorted from newest, with author and reason for change.
- **Order Link** — for each transaction, it is clear in which order the credit was used or generated.
- **Optional Validity** — credit can have an expiration date, after which the unused balance is written off.
Manual credit addition is performed by the operator via the **Add Credit** action in the detail. Each record includes the amount, description, author of the change, and is stored in the audit log.
> ℹ️ For order payment, the system always uses a ratio of 1 credit = 1 unit of currency. The monetary value is only for accounting records and may differ from the number of credits — for example, with gift vouchers that had a zero acquisition cost.
## Monthly Usage Limits
Each contact has two independent limits for maximum credit usage in a calendar month, which prevent uncontrolled depletion of the balance. A **soft limit** displays a warning to the operator when exceeded, but does not block the transaction, while a **hard limit** stops further usage immediately, and manual approval is required to continue. A zero value in any field means that the limit is not active.
## Order History
Every order is automatically recorded with the contact and forms the basis for analytics — revenue, number of orders, refunds, first and last order. The system materializes these numbers into a so-called read model, which is refreshed with every change in order status. Thanks to this, revenue and retention overviews are immediately available without the need for recalculation across thousands of rows.
## Organizational Hierarchy
Contacts can be linked by a superior-subordinate relationship to create an organizational tree — typically for corporate customers where there is a parent company and its branches, or for family accounts. Each contact has at most one direct superior and any number of subordinates.
In the detail, the hierarchy is displayed at four levels:
- **Superior** — direct parent in the hierarchy, clicking on it goes to their profile.
- **Subordinates** — direct descendants of the given contact.
- **Colleagues** — contacts sharing the same superior.
- **Organizational Tree** — Microsoft Teams-style visualization with ancestors and the entire subtree.
The maximum tree depth is 32 levels in each direction, and the system ensures that no cycles are created (a parent cannot also be a descendant of their own descendant).
## Custom Fields
Every organization has its specific needs — some need to record company size, others a supplier's Company ID or preferred clothing size. For these cases, custom fields of type text, number, or selection can be attached to any contact. Fields can be mandatory, can have a hint, placeholder text, and a regular expression for validation. The values are then stored and displayed for contacts directly in the detail alongside standard data.
## Bulk Import Process
Bulk import serves for quickly creating tens to thousands of contacts — typically after an event, trade fair, or during migration from an old system. The wizard guides the operator step by step and ensures that no duplicates are created:
1. **Data Entry** — list of emails, and optionally names, manually or via CSV.
2. **Parsing** — the system automatically separates email and name, cleans diacritics, and capitalizes first and last names.
3. **Duplicate Check** — comparison with existing contacts in the organization; duplicate emails are skipped.
4. **Preview and Confirmation** — the operator sees the number of new and skipped records and can add an internal note to all imported contacts.
5. **Completion** — contacts are created with the organization's default language and without a password, i.e., as guests.
> 💡 When importing, we recommend writing the data source in the internal note (for example, 'Trade Fair 2026-03') — later you can easily find the group by it and target them with a specific campaign.
## Sessions, Passwords, and API Keys
The contact detail includes a separate section dedicated to login security. The operator can see active sessions, forcibly log out a specific device, view the password change log, and generate a reset if needed. For technically oriented contacts, API keys and workspaces are also available, color-coded by workspace.
Specifically, you will find here:
- **Sessions** — a list of logged-in devices with the option of forced logout.
- **Password Change Log** — dates of all password changes (not the hashes themselves).
- **Password Reset** — generates a one-time link and sends it to the contact's email.
- **API Keys and Workspaces** — keys for technical integrations, color-coded by workspace.
## Consents
The system separately records consents for newsletter subscription, marketing communication, and personal data processing according to GDPR. Every change — meaning granting or revoking consent — is stored with a timestamp, source (administrator / web), and an optional note, making it verifiable at any time when and how consent was given or withdrawn.
## Deletion with Reason
Deleting a contact from the row's context menu is a so-called soft delete — the contact remains stored but is hidden from all overviews and cannot be used for login again. A **reason** is always required when deleting, which is saved in the audit log. This mechanism protects history and allows auditing of who deleted the contact and why.
> ⚠️ A contact cannot be deleted repeatedly, and restoring a deleted record is no longer available in the regular administration. If you need to restore a contact, please contact technical support.
## In-row Actions
Several operations can be performed directly from the overview without opening the detail, saving time during routine work. The row's context menu offers:
- **Open Detail** — complete customer profile with all tabs.
- **Add Credit** — quick balance adjustment with a mandatory reason.
- **Block / Unblock** — immediate change of access to the portal.
- **Invalidate Sessions** — forced logout of the customer from all devices.
- **Delete Contact** — soft delete with a mandatory reason.

---
code: "core-concepts"
category: "platform"
tags: ["type-concept", "getting-started"]
published_at: "2026-11-24T00:00:00.000Z"
---


Core concepts
=============

A handful of terms appear on almost every page of the documentation and the administration. This article defines them once, and explains how they relate, so the rest of the documentation can use them without repeating the explanation.

## Organisation

An **organisation** is the unit everything else belongs to: a company, a shop, a club or any other entity you run on BizKitHub. Each organisation has its own data, settings, branding, plan and members. Nothing is shared between organisations, not even when the same people work in both.

One person can belong to several organisations and switch between them in the administration. Each switch changes the whole context: menus, data and permissions all follow the selected organisation.

## User account

A **user account** is how a person signs in to the administration. There is one account per e-mail address on the whole platform, with one password and one profile (name and avatar). A user account on its own gives access to nothing: access comes from membership in an organisation.

When you register without creating an organisation, or when all your memberships end, the administration takes you to a start page where you can accept a pending invitation or create a new organisation.

## Member

A **member** is a user account that belongs to an organisation. Membership carries the member's **roles** and **permissions** in that organisation. The same person can be an administrator in one organisation and have read-only access to a single module in another.

Members join by invitation. An invitation is sent to an e-mail address; if the person has no account yet, they create one when they accept, and the invitation becomes a membership.

## Roles and permissions

**Permissions** decide which modules a member can open and what they can change there. **Roles** are named sets of permissions that you assign instead of ticking permissions one by one.

The **root** role has full access to the organisation, including members, billing and API keys. Every organisation always keeps at least one active root member: the platform refuses to remove the root role from, or block, the last one, so an organisation can never lock itself out.

## Contact

A **contact** is a record in the CRM of one organisation: a customer, a supplier, a company or any other person or business you deal with. Contacts hold the history of everything that happened with that person: orders, invoices, payments, e-mails, tickets and bookings.

A contact is not a user account. Most contacts never sign in anywhere. When a contact does sign in, it is to **your** website or shop with a customer account that belongs to your organisation only, with its own password that has nothing to do with the administration.

## API key

An **API key** identifies an organisation to the public API. Every request made with a key reads and writes only that organisation's data. Keys are created in the administration and passed as the `apiKey` query parameter. See [API key](/api-key-overview).

## Module

A **module** is one area of the administration, such as Orders, Invoices or Newsletter. Modules appear in the menu according to the member's permissions and the organisation's plan, and they all work on the same shared records.

## How the concepts fit together

<table>
<thead>
<tr><th>Concept</th><th>Belongs to</th><th>Used for</th></tr>
</thead>
<tbody>
<tr><td>User account</td><td>The platform</td><td>Signing in to the administration</td></tr>
<tr><td>Organisation</td><td>The platform</td><td>Owning all business data and settings</td></tr>
<tr><td>Member</td><td>One organisation</td><td>Giving a user account access, with roles and permissions</td></tr>
<tr><td>Contact</td><td>One organisation</td><td>Customers and partners in the CRM, optionally with a customer account on your website</td></tr>
<tr><td>API key</td><td>One organisation</td><td>Access for websites and integrations</td></tr>
</tbody>
</table>

## Related

- [BizKitHub at a glance](/bizkithub-at-a-glance)
- [New organization](/new-overview)
- [Organization](/organisation-overview)
- [Contacts](/contact-overview)
- [API key](/api-key-overview)

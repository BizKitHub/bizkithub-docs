---
code: "team"
category: "system"
tags: ["type-overview", "permissions", "members", "security"]
published_at: "2026-11-24T00:00:00.000Z"
---


Members, roles and permissions
==============================

Every person who works in your organisation's administration is a **member**. A member signs in with their own BizKitHub account and sees only the modules their permissions allow. This article explains how you invite people, how roles and permissions decide what each member can do, and which safeguards keep the organisation from locking itself out.

The single most important rule: **every organisation always keeps at least one active member with the Root permission.** The platform refuses any change that would leave the organisation without one, so there is always someone who can manage access.

## Where to find it in the admin

Open **CRM → Team**. The page has three tabs:

- **List**: every member and every pending invitation, with role, presence, contact details, current workload, time zone and the date they joined.
- **Chart**: the organisation chart built from each member's superior person.
- **Structure**: the same reporting lines as a navigable structure.

Click a name to open the member detail. The detail has the tabs **Profile**, **Permissions**, **Activity**, **Work** and **Notes**. Managing members requires the **Members** permission; members with **Root** have it implicitly.

## Core concepts

- **Permission**: access to one module, for example **Contacts**, **Orders** or **Logs**. Each permission in the list has a label and a short description of what it unlocks.
- **Role**: a predefined bundle of permissions. Assigning a role grants every permission inside it. Roles are defined by the platform; you assign them, but you do not create new ones.
- **Direct permission**: a permission given to one member specifically, outside any role.
- **Permission template**: a named bundle of roles and permissions that your organisation creates, for example "Sales rep" or "Accountant", so you can set up a new colleague in one click.
- **Root**: the highest permission. A Root member bypasses every permission check and can see and change everything in the organisation, including billing and other members.

## Inviting a member

1. Open **CRM → Team** and click **Add**.
2. Enter the **Work email**. This is the address the person signs in with, so it must be a real mailbox that can receive messages.
3. Optionally fill in **First name (optional)**, **Last name (optional)** and an internal note. The names pre-fill the registration form; the invitee can still change them.
4. Click **Invite new member**.

The platform e-mails an invitation link. A person without a BizKitHub account sets a password and completes registration. A person who already has an account accepts the invitation on their start screen, where all **Pending invitations** are listed with **Accept** and **Accept all** buttons.

Until the invitee accepts, the row shows the badge **Awaiting activation**. The invitation is valid for **7 days**. From the row's context menu you can:

- **Resend invitation**: e-mails a new link and resets the 7-day validity.
- **Cancel invitation**: the link in the e-mail stops working immediately; you must invite the person again to give them access.

Inviting the same e-mail address again replaces the previous invitation, and the older link stops working.

New members have **no permissions** by default. You do not have to wait for them to accept: open the pending row and assign roles and permissions straight away. They take effect the moment the invitee completes registration.

## Assigning roles and permissions

Open a member and switch to **Permissions**. The overview at the top counts roles and direct permissions, and a search box filters both lists.

- Under **Roles**, tick the roles the member should hold. **Show role contents** lists the permissions a role includes.
- Under **Direct Permissions**, tick individual permissions. Permissions that come from a role are marked **Granted by role** and cannot be removed one by one; remove the role instead.
- Each role and permission can carry an **expiry date**. For example, a temporary accountant can receive **Documents** until 31 December. After that date the grant stops applying. Leave the date empty for an indefinite grant.
- **Apply template…** adds a permission template to the member, either merged with the current selection (**Add to existing**) or replacing it (**Replace selection**).
- **Clone from…** copies the current roles and direct permissions of another member, which is useful when someone joins an existing team.

Save the changes when you are done; until then the screen shows that you have unsaved changes.

Permission templates are managed in **Settings → Permission templates**. Deleting a template does not remove permissions from members who already received it.

### Who may change permissions

- Changing permissions requires the **Members** permission.
- A member without Root cannot change their own permissions, cannot change the permissions of a Root member, and cannot grant Root or the permission to switch into a colleague's view.
- Only a Root member can grant Root.

### Granting Root

Granting Root opens a confirmation dialog that lists the consequences: full access to every module and setting, the ability to delete data irreversibly, to change billing and payment settings, and to manage other administrators. You must tick the acknowledgement before **Activate root permission** becomes available. Keep Root for the one or two people who administer the whole organisation; everyone else works better with specific roles.

When Root is granted, the event is recorded at critical severity in the [system log](/log-overview) and every existing Root member receives an e-mail with the details: who granted it, to whom, and what else was assigned.

## Sharing individual records

Some records can be shared with a member one by one instead of through a whole module: calendars, order groups, customers and customer groups. On the member's **Permissions** tab, **Manage shared access** shows how many records of each type the member sees and lets you tick individual ones. Shared access can expire after 1, 7, 30 or 90 days, or never. A member who has shared records but not the module permission does not see the module in the menu; the screen warns you about this case.

## Blocking a member

To remove someone's access, choose **Block User** from the row's context menu, or from the menu at the top of the member detail. Blocking:

- signs the member out of every session and disconnects any AI agent connected on their behalf,
- deactivates every API key the member created,
- sends the member an e-mail informing them about the block,
- keeps their history, notes and authored records intact.

Blocked members are marked with a red badge in the list. The administration does not offer an unblock action, so block only when you mean it.

## Safeguards against lock-out

The platform enforces two rules on every change:

1. **The last active member cannot be blocked.** At least one active member must remain.
2. **The last active Root member cannot lose Root.** Removing Root from a member, or blocking a Root member, is refused unless another active, non-blocked member still holds Root (directly or through a role).

If you need to hand over administration, grant Root to the new administrator first, then remove it from yourself. The refused operation returns an error explaining that another member must hold Root first.

## Switching into a colleague's view

Members with Root, or with the dedicated impersonation permission that only a Root member can grant, can choose **Switch to {name}** on a member detail to see the administration exactly as that colleague does. The switch ends automatically after 4 hours or when you click **Exit** in the banner. Every action is recorded under both names. You cannot switch into a member who holds Root or the impersonation permission themselves.

## Member activity and profile

- **Activity** lists the member's audit trail with severity and component filters, plus a 90-day chart of admin usage.
- **Profile** shows presence, session history with location, a weekly activity heatmap, job title, superior person, tags and the description that the ticket assistant uses to route tickets (see [AI assistant and agents](/ai-assistant)).
- **Work** sums up open items assigned to the member: unpaid invoices, managed contacts and open issues.

## Your own account

A BizKitHub account is global: one sign-in gives you access to every organisation you are a member of. Change your password under **Account security**; the new password applies to all your organisations. A person with no membership lands on a welcome screen where they can create their own organisation or accept pending invitations.

## Related articles

- [Access requests](/access-request): how members ask for a permission they are missing.
- [Organization](/organisation-overview): profile and branding of the organisation.
- [Support access to your organisation](/administrace-systemu-overview): how BizKitHub staff may access your data.
- [API key](/api-key-overview): keys are tied to the member who created them.
- [Password](/password-overview) and [Security](/security-overview).

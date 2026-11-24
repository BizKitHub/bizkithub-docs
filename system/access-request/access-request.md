---
code: "access-request"
category: "system"
tags: ["type-guide", "permissions", "members"]
published_at: "2026-11-24T00:00:00.000Z"
---


Access requests
===============

When a member opens a module they have no permission for, they can ask for access directly from that screen. The request reaches every Root member of the organisation by e-mail and appears in the **Access requests** module, where it is approved or rejected with one click. Approval grants the permission immediately, and every decision is kept in the audit trail.

This article covers both sides: how a member asks for access and how an administrator decides.

## What you need before you start

- **To ask for access**: you are an active member of the organisation. No permission is needed.
- **To decide on requests**: you hold the permission for the **Access requests** module. Root members have it automatically.

## Asking for access

1. Open the module you need. If you lack the permission, the screen **You do not have permission to view this module** appears. **Show details** lists the permissions the module requires and the permissions your account currently has.
2. Click **Request access**.
3. In **Reason for the request**, explain why you need access and what you plan to do. The text must be between 10 and 1000 characters. For example: "Customer Novák asked me to send out the spring campaign, I need access to the Newsletter module."
4. Click **Send request**.

The confirmation reads "Your request has been sent to the administrators." From then on, the same screen shows **Your request is awaiting approval** instead of the button.

You can have only one open request per permission. Sending the request again while it is still open does not create a duplicate; the platform returns the existing request.

A request can be made for any module permission and for Root. A request for Root can only be approved by a member who already holds Root.

## Who is notified

Each new request is recorded in the [system log](/log-overview) and sent by e-mail to every active Root member and to the organisation's notification copy addresses. The e-mail names the requester, the permission and the reason, so the administrator can decide without opening the admin first.

## Reviewing requests

Open **Access requests** in the administration. The list shows:

| Column | Meaning |
|---|---|
| **Submitted** | When the member sent the request. |
| **Requester** | Name and e-mail of the member. |
| **Requested permission** | The permission code the member asked for, for example `module-newsletter`. |
| **Reason** | The member's justification. |
| **Status** | **Awaiting decision**, **Approved** or **Rejected**. |
| **Resolved by** | Who decided, when, and the optional note. |

The filter above the list switches between **Pending** (the default), **Approved**, **Rejected** and **All**.

### Approving

1. Tick one or more requests.
2. Click **Approve selected** and confirm.

The requesters receive the permission immediately. Approval uses the same mechanism as editing permissions on the member detail, so the change appears in the member's activity and in the audit trail like any other permission change. The decision cannot be undone from this screen; to take the permission away later, edit the member's permissions in [Members, roles and permissions](/team).

### Rejecting

1. Tick one or more requests.
2. Click **Reject selected**.
3. Optionally type an **Audit note**, for example "Missing justification, please specify the project." The note is stored with the decision.

The request is closed without granting anything. The member can send a new request later.

## What can go wrong

| Symptom | Cause | What to do |
|---|---|---|
| "Some rows were skipped; see details." | One of the selected requests was no longer pending (another administrator decided it first), or the rule below applied. | Reload the list and check the status of the skipped rows. |
| Your own request is skipped. | Nobody may approve their own request. | Another administrator must decide it. |
| A request for Root or for switching into a colleague's view is skipped. | Only a Root member can grant these permissions. | Ask a Root member to approve it. |
| "Select at least one request." | You clicked a bulk action with nothing selected. | Tick the rows first. |
| The reason is refused. | It is shorter than 10 or longer than 1000 characters. | Adjust the text. |

## Joining an organisation from outside

Access requests are for people who are already members. A person who is not yet a member of your organisation cannot use them. They need an invitation from an administrator, as described in [Members, roles and permissions](/team).

## Related

- [Members, roles and permissions](/team)
- [System logs](/log-overview)
- [Security](/security-overview)

---
id: "Etqb3gWWI2284rsS"
category: "system/system-administration"
tags: []
published_at: "2026-04-24T06:57:24.759Z"
---


Support access to your organisation
===================================

BizKitHub staff sometimes need to look into an organisation to resolve a support ticket or an incident. This article explains who can do that, what they can do, and which safeguards apply, so you know exactly how your data is handled.

## Who has access

Access across organisations is limited to a small group of BizKitHub operators. It is a separate role that is not connected to membership in any customer organisation: being the owner or a root member of your own organisation does not grant it, and operators do not appear in your member list.

## When operators look into an organisation

- **You asked for help.** A ticket in [support](https://support.bizkithub.com) describes a problem that can only be diagnosed with your data in view.
- **An incident.** Monitoring reports errors that affect your organisation, for example a failing bank synchronisation or rejected e-mails.
- **Abuse or a legal obligation.** For example a reported phishing campaign sent through the platform, or a valid request from an authority.

## What operators can do

- **See organisation details and the system log**, which lists errors and events that concern your organisation. This is usually enough to diagnose a problem.
- **Switch into the organisation** to see the administration exactly as a member would. Operators do this only when the problem cannot be diagnosed otherwise, and they do not change your data without your consent, except to stop ongoing abuse.
- **Block a member account** in the case of a compromised account or abuse. Blocking also disables that member's API keys. It can be reversed, and the last active member of an organisation can never be blocked.
- **Revoke a leaked API key** immediately, without waiting for your organisation to notice. Create a new key afterwards in the administration.

## Safeguards

- Every switch into an organisation and every action taken there is recorded in the organisation's activity history under the operator's own identity. It is never attributed to one of your members.
- Operators never need, and never ask for, your password. If someone claiming to be BizKitHub support asks for it, report it to [support](https://support.bizkithub.com).
- Processing of personal data follows the [privacy policy](/zasady-ochrany-soukromi-a-gdpr) and the data processing terms.

## Related

- [Security](/security-overview)
- [Organization](/organisation-overview)
- [Password](/password-overview)

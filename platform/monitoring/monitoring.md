---
id: "5iYUoGB88lb85hw3"
category: "platform/monitoring"
tags: ["type-concept"]
published_at: "2026-07-24T19:26:38.006Z"
---


Monitoring
==========

BizKitHub monitors the platform around the clock and publishes its state openly. This article explains what is monitored, where you can see the current status yourself and how to read the errors the platform reports to your organisation.

## Status page

[status.bizkithub.com](https://status.bizkithub.com) shows the live availability of the API, the administration and the supporting services, together with current and past incidents. Check it first whenever something does not work as expected. The small status indicator in the footer of every BizKitHub website reflects the same data.

## What the platform watches

- **Health of every service.** Each instance of the API and the administration is probed continuously. An unhealthy instance stops receiving traffic automatically, so most failures never reach users.
- **Scheduled jobs.** Every background job (bank synchronisation, e-mail processing, imports, reminders and others) reports each run. A job that fails, runs too long or does not start on time raises an alert.
- **Backups.** The freshness of database snapshots and of the continuous change archive is checked twice a day.
- **Second copies.** A daily check confirms that every stored file has its copy in the second datacentre; a file that waits longer than 24 hours raises an alert.
- **Backup copies.** Every backup sent to the backup service must reach the second datacentre within 1 hour after the upload plus 1 hour per 8 GiB; a late copy alerts the operations team.
- **Your backups.** The [backup service](/backup-service) e-mails your organisation when an expected backup does not arrive, an upload fails, a backup fails its integrity check or its size changes by more than 20 %.
- **Errors.** Unexpected errors in the API are recorded with a request identifier and reviewed by the engineering team.
- **Abuse.** Request rates per API key and per network address are tracked, and abusive traffic is blocked at the edge.

Alerts go to the operations team, which responds to incidents and publishes updates on the status page.

## What your organisation can see

- **System log.** The administration lists events and errors that concern your organisation, for example a failed e-mail delivery, a rejected bank synchronisation or a payment gateway error. Each entry carries a code; the [system code reference](/system-codes) explains every code and what to do about it.
- **API errors.** Every error response from the API carries a stable `errorCode` and a `requestId`. The [API error code reference](/errors) lists all codes.
- **Request identifier.** When you contact [support](https://support.bizkithub.com) about a specific request, quote its `requestId`. It lets the team find the exact request in seconds.

## Related

- [Infrastructure](/infrastructure-overview)
- [SLA](/sla-overview)
- [System codes](/system-codes)
- [API error codes](/errors)

---
id: "6Cn39Y54FJdgz9AH"
category: "legal-and-company/sla"
tags: []
published_at: "2026-07-24T18:26:40.065Z"
---


SLA
===

## Scope

This SLA covers the **CMS, CRM, REST API and CORE** services of the BizKitHub platform and applies to every customer on the Pro tier from the date of subscription.

**Effective date:** July 8, 2025.

## Headline commitments

- **99.90 %** monthly uptime guarantee (SLO target: 99.99 %).
- **11 nines** annual data durability (99.999999999 %).
- **15 minutes** initial response for P1 (critical) incidents.

## Key metrics defined

- **Availability** — percentage of time services are available in a calendar month (Monthly Uptime Percentage).
- **Data Durability** — probability of never losing data; currently 11 nines annually.
- **RTO (Recovery Time Objective)** — maximum time to restore service after an outage.
- **RPO (Recovery Point Objective)** — maximum data loss (in time) when restoring from backup.
- **Incident** — an unplanned event causing service degradation or outage.
- **Scheduled maintenance** — planned maintenance announced at least 48 hours in advance.

## Availability calculation

Availability is measured with a standardised formula:

<pre><code>Uptime % = Uptime / (Total minutes − Excused Downtime) × 100</code></pre>

### Measurement methods

- **BetterStack** — active request monitoring from multiple regions.
- **Cloudflare** — edge-level health checks.
- **Vercel** — platform-side performance metrics.
- **Interval** — near-minute measurement cadence.

### Status pages

- Primary: [status.bizkithub.com](https://status.bizkithub.com/)
- Backup: [status.baraja.cz](https://status.baraja.cz/)

## Service credits

If we miss the availability commitment we apply credits to the next invoice automatically — no customer request required.

<table>
<thead>
<tr><th>Monthly uptime</th><th>Service credit</th></tr>
</thead>
<tbody>
<tr><td>&lt; 99.9 % but ≥ 99.0 %</td><td><strong>10 %</strong></td></tr>
<tr><td>&lt; 99.0 % but ≥ 95.0 %</td><td><strong>25 %</strong></td></tr>
<tr><td>&lt; 95.0 %</td><td><strong>50 %</strong></td></tr>
</tbody>
</table>

## Data retention &amp; protection

### Accidental deletion protection

Every delete operation keeps a complete copy of the data for up to **7 days** — protection against human error, attacks, and enabling fast recovery.

### Insider threat protection

Multi-layer access controls prevent a rogue employee from executing bulk deletions against production data.

### Offline backups

Production data is backed up to a separate, undisclosed storage location: S3-compatible storage in a different data centre, end-to-end encrypted.

## Incident categories

We reserve the right to determine the incident type and priority — and to revise it as an incident unfolds. AI-assisted classification may be used to speed up triage.

<table>
<thead>
<tr><th>Priority</th><th>Severity</th><th>Description</th><th>Impact</th></tr>
</thead>
<tbody>
<tr><td><strong>P1</strong></td><td>Critical</td><td>Complete service outage.</td><td>All users affected; all data unavailable.</td></tr>
<tr><td><strong>P2</strong></td><td>Major</td><td>Severe incident.</td><td>Key features unavailable; limited workflows possible.</td></tr>
<tr><td><strong>P3</strong></td><td>Minor</td><td>Moderate degradation.</td><td>Slower response times; non-critical features affected.</td></tr>
<tr><td><strong>P4</strong></td><td>Low</td><td>Inquiries and cosmetic issues.</td><td>Documentation, UI, minor bugs not blocking usage.</td></tr>
</tbody>
</table>

## Response times

<table>
<thead>
<tr><th>Priority</th><th>Label</th><th>90 % response</th><th>First action</th></tr>
</thead>
<tbody>
<tr><td>P1</td><td>Critical</td><td>15 min</td><td>2 hours</td></tr>
<tr><td>P2</td><td>Major</td><td>1 hour</td><td>4 hours</td></tr>
<tr><td>P3</td><td>Minor</td><td>4 hours</td><td>100 hours</td></tr>
<tr><td>P4</td><td>Low</td><td>48 hours</td><td>as agreed</td></tr>
</tbody>
</table>

## Escalation

Escalated incidents are forwarded to the internal Incident Manager first, then to the CTO if the situation is not resolved within the response window.

## Monitoring &amp; transparency

Real-time service status is available on the status pages above. Historical data — monthly availability reports, incident analyses, service performance trends, and post-mortem reports — is published there as it becomes available.

## Contact

Questions about this SLA go to [/support](/support-overview).

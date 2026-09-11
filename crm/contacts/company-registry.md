---
category: "crm/contacts"
tags: ["companies", "ares", "registries", "compliance"]
published_at: "2026-09-11T00:00:00.000Z"
---


Company registry data
=====================

Whenever a contact represents a Czech legal entity or a self-employed trader (OSVČ), the platform enriches its profile with everything the public business registers publish about that subject. This gives an operator a clean *Firma* tab that shows the statutory body, partners with their shares, procurators, trade licenses, establishments, and the classification codes an accountant needs — without leaving the contact detail and without querying multiple government websites by hand.

This article catalogues what the platform actually stores, where each field originates, and how the refresh keeps the data current without ever losing what a previous successful sync collected.

## What triggers the enrichment

Enrichment activates when a contact carries a **company registration number** (`companyRegistrationNumber`, known in Czech as *IČO*) and a **company country** matching a supported registry. The platform currently supports Czech registries (ARES) for company data and VIES for EU cross-border VAT verification. For any other country, the *Firma* tab renders the basic fields you entered and skips the automated sections.

An OSVČ (self-employed trader) is a valid subject: their IČO exists in the trade-license register and the statistical register, but not in the business register. The platform handles this by asking each sub-registry independently and rendering only the sections that returned data.

## Sources of truth

The platform reads from four separate ARES sub-registries and one EU-wide service:

| Source | What it provides |
| --- | --- |
| **ARES basic** (`ekonomicke-subjekty`) | Official business name, registered address, legal form code, tax office code, incorporation date, VAT registration flag, and per-registry presence markers. |
| **ARES VR** (Veřejný rejstřík — public business register) | Statutory body, supervisory board, procurators, partners with shares (s.r.o.), shareholders (a.s.), way-of-acting text, share capital, file number, management structure. Populated only for legal entities registered in the business register. |
| **ARES RES** (statistical register) | CZ-NACE activity codes, institutional sector code, employee-count band. Present for every economic subject including OSVČ. |
| **ARES RŽP** (živnostenský rejstřík — trade-license register) | Individual trade licenses, business establishments (provozovny), and the persons registered as trade-license responsible representatives. |
| **VIES** | EU-wide VAT ID validation for cross-border counterparties. Not used for Czech subjects. |

Each source is fetched independently and cached in the platform's own database, so a subsequent refresh of one source does not disturb the others.

## Basic identity

The following fields land on the contact from the ARES basic subject record:

- **Official business name** — the registered legal name, which may differ from the marketing name the contact uses.
- **Registered address** — street, city, postal code, country. Overwrites the contact's invoice address when the operator has not marked it as manually maintained.
- **Legal form code** — a three-digit code (e.g. `112` = s.r.o., `121` = a.s.) that maps to the platform's legal-form dictionary and determines the label shown in the UI.
- **Tax office code** — the three-digit code of the Czech tax office assigned to the subject.
- **Incorporation date** — when the subject was created.
- **VAT registration flag** — `AKTIVNI`, `NEEXISTUJICI`, or `NEURCENO`; feeds the VAT registration type resolution described in [VAT handling and registration types](/vat).

## Statutory bodies and governance

For a subject present in the business register (Veřejný rejstřík), the platform captures every mandate ever recorded — current and historical. Each mandate is one row and carries:

- **Role** — statutory body member, statutory body chair, supervisory board member, supervisory board chair, procurator, partner, shareholder, or trade-license responsible representative.
- **Person type** — natural person (with first name, last name, birth date, nationality, address) or legal entity (with business name, IČO, and address).
- **Role label** — the exact function name as filed in the register (e.g. *"předseda představenstva"*, *"jednatel"*).
- **Validity range** — the effective start (`validFrom`) and end (`validUntil`) of the mandate itself. A missing `validUntil` means the mandate is still in force.
- **Registration range** — when the mandate was written into (`registeredFrom`) and removed from (`registeredUntil`) the public register. Rarely differs from the validity range by more than a few days; when it does, the register lagged behind the actual event.

For partners in a s.r.o., three additional numeric fields carry the equity position:

- **Share percentage** — the partner's holding, e.g. `50.0000` for a 50 % share.
- **Share amount** — the contribution in the company's registration currency (typically CZK).
- **Paid-up percentage** — how much of the contribution has been paid up.

The `isActive` flag on every row is the direct answer to *"is this person a current officer of the company?"* — true when both `validUntil` and `registeredUntil` are empty. The admin renders current mandates first and hides historical ones under a collapsible section per role, so a company like OTE a.s. with 106 historical statutory members over two decades does not overwhelm the page.

## Way of acting

Alongside the statutory body, the business register records the *way of acting* — a free-text description of how the company is legally bound (e.g. *"Each member of the board acts on behalf of the company independently"* or *"Two members of the board act jointly"*). The platform stores every historical variant with its own effective range. The current version renders above the statutory-body table so an operator drafting a contract can tell at a glance who is authorised to sign.

## Share capital, file number, management structure

Three headline metadata items are lifted out of the business register onto the record itself:

- **Share capital** — amount and currency of the registered capital (`základní kapitál`).
- **File number** — the court file reference in the form `B 8573 (MSPH)` that uniquely identifies the entry in the business register and is often quoted on contracts.
- **Management structure** — `DUAL` (dualistic — board plus supervisory board) or `MONISTIC` (single board) for joint-stock companies, `INDIVIDUALNI_SRO` for limited liability companies.
- **Registered date** — when the subject was first entered into the business register (may differ from the incorporation date for older subjects predating the current register).

## Trade licenses and establishments

For subjects present in the trade-license register (RŽP), the platform stores two kinds of records:

- **Trade licenses** (`živnosti`) — one row per licensed subject of business, with the trade type (`V` = free, `R` = craft, `K` = concession, `O` = notified bound), start date, and end date. Active licenses have no end date.
- **Establishments** (`provozovny`) — one row per registered place of business, with the identification number (IČP), full address, notes on placement inside a larger building, and validity range.

Both lists render active-first with historical entries hidden behind a collapse. This is essential for retail chains and franchise operators whose trade-license history can run to hundreds of establishments over the years.

## Statistical classification

The statistical register contributes three classification fields useful for reporting and segmentation:

- **CZ-NACE codes** — activity codes according to the EU statistical classification. The primary NACE (`czNacePrevazujici`) is stored first, then any secondary codes; duplicates are stripped. Each code deep-links to the Czech Statistical Office's classification page for the operator to look up.
- **Employee-count band** — a code representing the number of employees (e.g. `110` = 0 employees, `120` = 1–5, `310` = 50–99, `440` = 5000+). The band is coarse but reveals whether the subject is a solo trader or a large employer without needing sensitive payroll data.
- **Institutional sector code** — the EU institutional-sector classification (S.11002 = domestic private non-financial enterprises, S.13110 = central government, S.14200 = self-employed). Useful for automatic segmentation of B2B versus government versus micro-business customers.

## Refresh cadence

The platform refreshes every synced company approximately every four weeks. The refresh is a low-priority background job that runs every four hours, picks a batch of contacts whose last sync is older than four weeks or whose last sync failed more than a day ago, and updates them one at a time with a short pause between calls to avoid overloading ARES.

A manual **Refresh from ARES** button on the *Firma* tab bypasses the cache and forces an immediate refresh. Use it when you have corrected an IČO, when the counterparty told you they have restructured, or when you need the latest state before drafting a contract.

## Per-source freshness

Each of the four registries is refreshed independently and carries its own timestamp:

- `lastSyncedDate` — the basic subject record.
- `vrLastSyncedDate` — the business register (VR).
- `resLastSyncedDate` — the statistical register (RES).
- `rzpLastSyncedDate` — the trade-license register (RŽP).

The *Firma* tab shows all four stamps under the refresh button so an operator can tell at a glance which sub-registry is stale. If any single sub-registry fails, its stamp keeps the last successful value and a small amber note next to it names the failure. The platform does not overwrite valid rows with an empty set on a failed fetch; the previous snapshot stays visible until a subsequent refresh succeeds.

## Reachable versus present

A failed fetch and a legitimate empty response are different situations that the platform tracks separately:

- **Not reachable** — a network error, a 5xx from ARES, or a malformed response. The platform treats this as a real failure, keeps the last successful data on disk, and shows the error text to the operator.
- **Reachable but no record** — ARES answered with a `404` or an empty `zaznamy` array. This is a valid answer, not an error: an OSVČ has no record in the business register, a foreign subject has no record in the trade-license register. The platform caches the empty answer so subsequent refreshes do not hammer ARES for the same absent record, and marks the source as successfully synced with no data to show.

The result is that an OSVČ profile syncs cleanly with three green timestamps and no fake error messages; the *Firma* tab simply skips the sections for which the registers hold nothing.

## Related

- [Contacts](/contacts) — the enclosing module and how registry enrichment fits into the wider automatic-profile-update pipeline.
- [VAT handling and registration types](/vat) — how the VAT registration flag from ARES is interpreted and how it drives invoice output.
- [Invoices](/invoices) — how the buyer's company data lands on issued documents.

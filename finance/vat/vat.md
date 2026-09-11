---
category: "finance/vat"
tags: ["vat", "invoicing", "compliance"]
published_at: "2026-09-11T00:00:00.000Z"
---


VAT handling and registration types
===================================

Value-added tax drives what appears on every invoice you issue and how much you actually owe the tax office at the end of a filing period. The platform captures VAT context in two places — on your own organisation and on every company contact you invoice — and combines them at the moment a document is generated. This article explains what the platform models, where it learns each fact, and where the honest limits of the source registries lie.

The one thing worth internalising up front: the VAT rate on an invoice is driven by **your** registration type, not the buyer's. The buyer's status is stored for audit and cross-border reasoning, but the domestic invoice rate is decided by whether the seller is a full payer, an identified person, or a non-payer.

## The three registration types

The platform recognises three mutually exclusive VAT categories, mapped to Czech tax law:

| Type | Legal reference | What it means |
| --- | --- | --- |
| **Payer** | §94 ZDPH | Full VAT payer. Charges output VAT on every domestic invoice, deducts input VAT, files a monthly or quarterly return. Registration is mandatory once turnover exceeds 2 000 000 CZK / 12 rolling months, or elective below that threshold. |
| **Identified person** | §6i ZDPH | A partial VAT registrant. Holds a VAT ID for cross-border purposes (reverse charge on services from EU providers, provision of services to EU businesses), but does **not** charge output VAT on domestic sales. Common for micro-companies and freelancers who buy digital services from abroad. |
| **Non-payer** | — | No VAT registration. Invoices are issued without VAT reporting, no VAT ID appears on the document. |

Every organisation you operate carries exactly one of these three values, and every company contact you record carries a copy of the same field so an accountant can tell at a glance what tax treatment the counterparty received.

## Where the platform learns the registration type

For contacts with a Czech company registration number (IČO), the platform reads the DPH flag from ARES's basic subject record on every refresh. ARES publishes one of three states in `stavZdrojeDph`:

- **`AKTIVNI`** — the subject is registered in the VAT register.
- **`NEEXISTUJICI`** — the subject is not in the VAT register.
- **`NEURCENO`** — ARES has no data (rare, transient).

`NEURCENO` leaves the field unset. `NEEXISTUJICI` maps to `NON_PAYER` with source `ARES` — a hard signal, safe to trust. `AKTIVNI` maps to `IDENTIFIED_PERSON` with source `ARES_DEFAULT`. The default is a deliberate conservative choice, and the next section explains why.

An operator can override any of these values from the contact detail's *Firma* tab and pin the choice with a manual lock. A manual lock is honoured by every subsequent ARES refresh, so once you correct a §6i to a full payer the cron never reverts you.

## What ARES cannot tell you

ARES does not distinguish a §94 full payer from a §6i identified person. Both surface the same `AKTIVNI` state, because the underlying VAT register at MFČR uses one shared flag for the presence of a VAT ID and does not publish the sub-category through the ARES API.

This is a limitation of the Czech public data infrastructure, not of the platform. Commercial accounting suites (Pohoda, Money, iDoklad, Fakturoid, ABRA Flexi) all handle the distinction the same way: they read the ARES flag and then present a manual toggle to the operator. The platform mirrors that convention with a twist — instead of leaving `AKTIVNI` blank, it defaults to `IDENTIFIED_PERSON` because misclassifying a §6i as a full payer produces an invoice with an invalid 21 % rate, whereas the reverse mistake produces an invoice with a defensible 0 % rate and a §6i annotation. The safer default wins, and the operator promotes to `PAYER` when they know the counterparty is a full registrant.

The distinction between the two `AKTIVNI` sub-categories is stored on the record via the `vatRegistrationTypeSource` field:

- `ARES` — ARES gave an unambiguous answer (`NEEXISTUJICI` → `NON_PAYER`).
- `ARES_DEFAULT` — ARES said `AKTIVNI`, platform defaulted to `IDENTIFIED_PERSON` awaiting operator confirmation.
- `MANUAL` — operator overrode the value; ARES sync will not touch it again.

## Verification against MFČR

When you need an authoritative answer for a specific counterparty, the *Firma* tab in the contact detail exposes a **Verify at MFČR** link. The link opens the official Czech VAT register at `adisspr.mfcr.cz/dpr/DphReg` with the counterparty's DIČ pre-filled. The MFČR portal shows the exact registration category — `plátce` or `identifikovaná osoba` — and the effective date, and this is the source you cite in an audit.

MFČR does not currently publish this information through a stable machine API, so the check remains manual. Once you have the answer, set the correct type in the *Firma* tab and pin it with a manual lock.

## Unreliable payer cross-check

Alongside the registration type, the platform performs an automated check against MFČR's list of *unreliable VAT payers* (nespolehlivý plátce). The list is synchronised daily and cross-referenced by DIČ. When a counterparty appears on it, the *Firma* tab shows a red warning badge and every invoice issued against that counterparty carries a note visible in the internal invoice log.

An unreliable-payer flag matters because your organisation becomes jointly liable for the counterparty's unpaid VAT if you knowingly transact with them without safeguards. The badge is your reminder to require payment to the counterparty's registered bank account (also published by MFČR) and to keep the correspondence as evidence.

## How the type affects invoice output

The platform renders the invoice differently based on the **seller's** registration type — that is, your organisation's:

- **Payer §94** — every domestic line carries the applicable VAT rate (0 %, 12 %, or 21 % under current Czech law). The seller's DIČ appears in the header. Cross-border sales to an EU B2B counterparty with a valid VIES-verified VAT ID switch to 0 % reverse charge with a note on the invoice.
- **Identified person §6i** — every line carries 0 % VAT. The seller's DIČ appears in the header. The invoice includes a fixed footer note: *"Dodavatel je identifikovaná osoba dle §6i ZDPH, ne plátce DPH"*. Cross-border sales to an EU B2B counterparty follow the same reverse-charge logic as a full payer.
- **Non-payer** — no VAT column, no DIČ in the header, no VAT reporting on the document. The invoice is a simple accounting document.

The rate is not a per-line configuration; it is derived from the organisation's type at the moment of issuance and locked into the document. Changing the organisation's type later does not retroactively re-render historical invoices.

## Whose VAT status matters — seller vs. buyer

This is the single most frequent source of confusion for operators who come from a bookkeeping background. On any given invoice:

- The **seller's** registration type decides the rate on domestic lines and the presence of DIČ / §6i annotations.
- The **buyer's** registration type is stored on the contact for audit and to inform cross-border reasoning, but on a **domestic** invoice it does not change the rate. A full payer selling to a §6i counterparty domestically still applies 21 %. A §6i selling to another §6i domestically still applies 0 %.
- Where the buyer's type does change the invoice is **cross-border B2B**: an EU counterparty with a valid VAT ID (verified through VIES) triggers reverse charge regardless of the seller's category (payer or §6i). An EU counterparty without a valid VAT ID gets the seller's domestic rate.

The buyer's classification therefore matters for VIES verification and reverse-charge routing, not for the numeric rate on a domestic line. That is why the platform stores the buyer's type but does not treat it as authoritative for domestic-rate decisions.

## Reverse charge for cross-border sales

For counterparties outside the Czech Republic, the platform switches to a separate verification path. Every EU DIČ can be checked against VIES (VAT Information Exchange System), an EU-wide validation service maintained by the European Commission. The contact detail exposes a **Verify via VIES** action that queries the service in real time and stores the result — valid or invalid — with a timestamp for audit.

A valid VIES result on an EU counterparty triggers reverse charge on subsequent invoices: the line carries 0 % VAT, the invoice header shows both parties' VAT IDs, and a fixed footer note names the reverse-charge basis. An invalid VIES result falls back to the seller's domestic rate — the platform does not silently issue a 0 % invoice against an unverifiable EU counterparty.

VIES does not distinguish §94 from §6i either, and the distinction does not matter for reverse charge: both categories carry valid VAT IDs eligible for the mechanism. The relevant fact is only that the VAT ID resolves to a business in another EU member state.

## Related

- [Invoices](/invoices) — how VAT rates surface on issued documents and how the automatic pairing with bank transactions works.
- [Company registry data](/company-registry) — what the platform stores about a Czech company alongside VAT status, and how it refreshes from ARES.

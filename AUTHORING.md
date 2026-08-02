# AUTHORING — How to Write Documentation for BizKitHub

> **Scope of this document.** `INSTRUCTIONS.md` covers the mechanical rules of
> this repository — frontmatter fields, the `id` invariant, round-trip
> semantics with the platform. **This file covers the content** — voice,
> structure, what to write, what NOT to write, how deep to go, when to split
> an article, and how to reach 100 % coverage of the platform without leaking
> internal implementation details. Read both before you write your first
> article; keep both open while you write.

Everything in this repository is authored in **English**. The primary locale
of the organisation is `en`; translations to other locales are produced by
the platform on import and must never be hand-authored here.

---

## Table of contents

1. [Mission and coverage goal](#1-mission-and-coverage-goal)
2. [Who reads this documentation](#2-who-reads-this-documentation)
3. [The one thing you must never do](#3-the-one-thing-you-must-never-do)
4. [Repository structure](#4-repository-structure)
5. [File and directory naming](#5-file-and-directory-naming)
6. [Frontmatter authoring](#6-frontmatter-authoring)
7. [Article anatomy](#7-article-anatomy)
8. [When to split a module into multiple articles](#8-when-to-split-a-module-into-multiple-articles)
9. [Voice, tone, and language](#9-voice-tone-and-language)
10. [Formatting conventions](#10-formatting-conventions)
11. [Section templates](#11-section-templates)
12. [Cross-linking](#12-cross-linking)
13. [Media, screenshots, and code samples](#13-media-screenshots-and-code-samples)
14. [Multi-locale — how it works, and what to avoid](#14-multi-locale--how-it-works-and-what-to-avoid)
15. [Research checklist before you write](#15-research-checklist-before-you-write)
16. [Review checklist before you commit](#16-review-checklist-before-you-commit)
17. [Anti-patterns](#17-anti-patterns)
18. [Worked example — anatomy of a good article](#18-worked-example--anatomy-of-a-good-article)

---

## 1. Mission and coverage goal

The goal of this repository is **100 % coverage** of every user-facing and
administrator-facing feature of the BizKitHub platform. That means:

- **Every module** an operator can open in the admin UI is documented.
- **Every public API endpoint** an external integrator can call is documented.
- **Every configuration option** an administrator can toggle is documented.
- **Every non-trivial workflow** (onboarding, order lifecycle, invoicing,
  translations, etc.) has an end-to-end walk-through.
- **Edge cases and rarely-used features** are covered — they are precisely
  the ones users cannot figure out on their own.
- **Errors, failure modes, and recovery paths** are documented alongside the
  happy path. A user who hits an error should be able to search the docs and
  find the exact meaning of that error plus what to do about it.

Documentation is treated as a **product surface**, not an afterthought. A
missing article is a bug. A shallow article is a bug. An article that
describes only the happy path is a bug.

**A good article is long.** Prefer 500–2000 words of concrete, example-rich
prose over a terse 100-word stub. Length is not the goal on its own — but
the shortest article that actually answers every question a user has about
the feature is almost always long. Do not artificially trim to hit a word
count; do not artificially pad to look thorough. Cover the topic.

---

## 2. Who reads this documentation

Write for four overlapping audiences at the same time:

- **End users** — the person clicking around in the customer-facing surface
  of a BizKitHub-powered site (visitor, buyer, subscriber). Cares about
  outcomes, not mechanics.
- **Business managers / operators** — the person running the admin dashboard
  for an organisation. Cares about "what does this setting do, when should I
  toggle it, what breaks if I do?".
- **Developers / integrators** — the person calling the public REST API from
  their own product. Cares about contracts, examples, error shapes, edge
  cases, and stability guarantees.
- **System administrators / IT** — the person responsible for security,
  compliance, keys, permissions, backups. Cares about who can do what, how
  data is protected, and how to audit.

**Structure an article so each audience finds what it needs early.** The
opening two paragraphs should be readable by any of the four. Deeper
sections can specialise — a "Configuration" section is for operators, an
"API reference" section is for developers — but the introduction always
belongs to everyone.

If a topic is genuinely dev-only (e.g. webhook signature verification), put
it under `developers/` and mention it briefly from any operator article that
crosses paths with it.

---

## 3. The one thing you must never do

**Never leak internal implementation.** Not table names, not column names,
not function names, not file paths, not Git commit references, not
microservice names, not queue names, not internal HTTP endpoints (`/bff/*`
is internal — never mention it), not schema migration numbers, not names of
internal libraries, not names of internal cron jobs, not names of feature
flags. **Not even in an "example" or a "for the curious" aside.**

The rule holds even when the internal name would be helpful. Users must not
learn to depend on internal shapes. The platform reserves the right to
rename, restructure, split, or delete any internal component at any time.

**What you CAN describe:**

- **Behaviour** an admin sees in the dashboard or an integrator sees in the
  public API. "The order list can be filtered by status" is fine; "the
  `shop__order.status_id` column drives the filter" is not.
- **Algorithms as features.** "When an order sits in `waiting_for_payment`
  for more than 72 hours, the platform automatically cancels it and
  releases any reserved stock" is a feature description — describe it in
  those user-facing terms. Do not name the cron job, the queue, or the
  table.
- **Public API surfaces.** URL, method, parameters, response shape, error
  codes, rate limits, examples. Everything under `api.bizkithub.com/api/v1/*`
  is fair game. Everything else is not.
- **User-visible identifiers.** Order codes, invoice numbers, external IDs
  emitted in API responses — these are contracts and are documented. Never
  the internal numeric primary keys.

**A useful test.** Before you write a sentence, ask: "Would this sentence
still be true and still be helpful if the platform team refactored the
whole underlying implementation next week?" If no, rewrite it in
behavioural terms or delete it.

---

## 4. Repository structure

The layout is **`department/module/article-slug.md`**. Directories mirror
the category tree of the platform. The importer ignores the on-disk
directory — the authoritative category is the `category:` field in the
frontmatter — but keep the directory in sync so a human browsing the tree
sees the same organisation as an admin browsing the CMS.

```
sales/                              ← department (top-level responsibility)
  orders/                           ← module (a coherent product area)
    orders.md                       ← the overview article
    order-create-api.md             ← a focused how-to for the API path
    order-status-lifecycle.md       ← the "how does an order move between states" article
    order-cancellation.md           ← edge cases: cancellations, refunds, partial deliveries
    troubleshooting-stuck-orders.md ← recovery playbook
```

Some observations:

- **Every module has an "overview" article** — usually named after the
  module folder (`orders/orders.md`). It answers the "what is this?" and
  "why does it exist?" questions, and links out to the more focused
  articles.
- **Focused articles** cover one logical area each — an API path, a
  lifecycle, a specific workflow, a specific integration.
- **The category slug path** (`sales/orders`) is what actually gets stored
  in the frontmatter and shown in the URL. The article filename is a
  descriptive slug and does not affect the public route.
- **Top-level departments are stable.** The current set:
  `about`, `communication`, `content`, `crm`, `developers`, `finance`,
  `legal-and-company`, `platform`, `sales`, `system`, `whats-new`. Do
  not invent a new top-level department without agreement — pick the
  closest existing one and add a module under it.
- **Modules are added freely** as the platform grows. Prefer a new
  module folder over dumping loosely related articles into an existing one.

---

## 5. File and directory naming

- **Kebab-case only.** `order-create-api.md`, not `orderCreateApi.md`,
  `order_create_api.md`, or `OrderCreateApi.md`.
- **Descriptive over cute.** `order-status-lifecycle.md` beats
  `order-life.md`. Someone doing a `grep` should recognise the filename.
- **Match the category slug depth to the folder depth.** If the article
  lives in `sales/orders/`, then `category: "sales/orders"`. If a filename
  would collide because two departments have a similarly named module,
  rename one — do not disambiguate with prefixes.
- **The overview article for a module is named after the module folder.**
  `sales/orders/orders.md`, `crm/contacts/contacts.md`. Focused articles
  use a longer descriptive slug (`orders-status-lifecycle.md`).
- **Do not include the department name in the article slug** —
  `sales/orders/orders-list.md`, not `sales/orders/sales-orders-list.md`.
  The path already carries the context.
- **Numeric prefixes for ordering (`01-`, `02-`) are forbidden.** Ordering
  is decided by the platform via the frontmatter and category configuration,
  not by filenames.

---

## 6. Frontmatter authoring

The `INSTRUCTIONS.md` file covers the mechanics. Below is what you need
in day-to-day authorship:

| Field           | When you set it                                                                   |
| --------------- | --------------------------------------------------------------------------------- |
| `id`            | **Never.** Omit when creating a new post; the importer assigns and writes it back. Never edit an existing one — it is the immutable link to the DB row. |
| `code`          | Only when the URL slug needs to differ from the filename slug, or when an external integration needs a stable idempotency key. Otherwise leave empty. |
| `category`      | **Always.** Slash-separated slug path matching the intended category tree (e.g. `sales/orders`). This — not the folder — is what the platform reads. |
| `tags`          | Zero, one, or many tag codes. Tags cross-cut the category tree and drive filters / related-article widgets. Prefer tags that a reader would actually filter by (e.g. `webhooks`, `security`, `beta`). |
| `published_at`  | ISO date of first publication. Omit for drafts. Do not backdate to game the sort order. |

Do NOT add fields the importer does not recognise (`title:`, `author:`,
`draft:`, `visibility:`, `meta_title:`, `meta_description:`, `perex:`).
Anything not in the table above is silently ignored on import, which means
it looks like it works but silently does nothing. SEO fields and visibility
are administered from the admin UI, not from this repository.

---

## 7. Article anatomy

Every article has the same top-to-bottom shape:

```
---
id: "…"                    ← frontmatter (may be absent on brand-new files)
code: "…"
category: "sales/orders"
tags: ["orders", "api"]
published_at: "2026-08-14T09:00:00.000Z"
---


Order Create API           ← H1, underlined with '==='. This is the title.
================

One or two paragraphs of introduction. Written for anyone in the four
audiences. Explain what the article is about, why the reader would care,
and — in one sentence — the single most important thing to know.

## First real section

Body starts here. Every subsequent heading is `##` or lower.
```

**Rules:**

- **Exactly one H1**, underlined with `===`. Do not use `#` for the title.
  Every subsequent heading uses `##`, `###`, `####`.
- **Two blank lines after the frontmatter closer**, then the H1. This is
  the shape the exporter emits and the importer expects.
- **The first two paragraphs are the "lede".** After reading only the
  lede, a reader must know whether this article is what they need. If
  they close the tab after two paragraphs, the article still gave them
  something.
- **Structure body by responsibility.** Each `##` is a topic that stands
  on its own. A reader linking to `#configuration` from another article
  should land in a section that is self-contained.
- **Progressive disclosure.** General → specific. Fundamental principle
  first, then the concrete mechanics, then edge cases, then advanced /
  rarely-used features. A reader who stops halfway still gets the most
  important half.
- **No trailing "conclusion" or "summary" section.** The last section is
  the last real topic. If the last topic is short, that is fine.

---

## 8. When to split a module into multiple articles

**Split by responsibility, not by size.** A module with three independent
responsibilities (create, lifecycle, cancellation) gets three articles
even if each is short. A module with one responsibility (login) gets
one article even if it is long.

Split when:

- **Two independent audiences** need overlapping but different information.
  Operator setup and developer API integration for the same feature belong
  in separate articles that cross-link.
- **A section grew past ~600 words** and its heading naturally reads as
  its own article title.
- **A troubleshooting or migration topic** would otherwise dilute the
  main article's happy-path narrative.
- **A rarely-used feature** would clutter the main article if included and
  is easier to find as its own searchable article.

Do NOT split when:

- Splitting would create articles that only exist to link to each other.
- The pieces have no independent value — a reader would always have to
  read both.
- The split is by lifecycle-of-a-thing chronology (draft, published,
  archived) rather than by responsibility. Chronology within one feature
  belongs in one article as sequential sections.

**Always keep an overview article** that stitches the module together and
links out to every focused article. New readers land there first.

---

## 9. Voice, tone, and language

- **Second person, active voice.** "You configure the setting in…" beats
  "The setting can be configured in…". Address the reader directly.
- **Present tense, indicative mood.** "The platform sends a webhook"
  beats "The platform will send a webhook" or "A webhook is sent".
- **Concrete beats abstract.** "The order stays in `waiting_for_payment`
  for up to 72 hours" beats "The order remains in a pending state for
  some time". Give numbers, thresholds, formats.
- **Every claim is falsifiable.** If a reader could disprove your sentence
  by trying it, that is a good sentence. "Fast" is not a claim; "under
  200 ms at p95" is.
- **No marketing language.** "Powerful", "seamless", "robust",
  "cutting-edge", "next-generation", "world-class" are forbidden. If a
  feature deserves the label, describe why in plain terms and let the
  reader draw the conclusion.
- **No hedging.** "Generally", "usually", "typically", "in most cases"
  are red flags — they signal you have not tested the edge case. Either
  document the edge case or drop the hedge.
- **No idioms, no slang, no cultural references.** Documentation is read
  by non-native English speakers, translated automatically to five
  locales, and quoted in support tickets. Straight literal prose only.
- **UK vs US English:** use **British English** (`organisation`, not
  `organization`; `colour`, `centre`). This matches the platform's own
  copy.
- **Sentence length.** Aim for 15–25 words. Sentences over 35 words are
  a smell; break them up.
- **Paragraph length.** 2–5 sentences. Wall-of-text paragraphs kill
  scannability.
- **Do not apologise for the platform** ("unfortunately", "sadly", "we
  know this is not ideal"). If a limitation exists, state it plainly
  and, if there is a workaround, describe it.

---

## 10. Formatting conventions

### Headings

- H1 (`===` underline) — the article title. Exactly one.
- H2 (`##`) — top-level sections of the body. Use to structure the article.
- H3 (`###`) — subsections within an H2. Use sparingly; if you need many,
  the H2 probably wants to be its own article.
- H4 (`####`) — rare. Almost always a signal to restructure.
- Never skip a level (no `##` followed directly by `####`).
- Headings are in **sentence case** — "Configuration options", not
  "Configuration Options".
- No trailing punctuation in headings.

### Lists

- **Ordered lists (`1.`, `2.`)** for procedures — steps that must happen
  in order.
- **Unordered lists (`-`)** for enumerations — things that have no
  ordering.
- Each list item is a complete thought. If a bullet is a fragment ("faster"),
  either expand it into a sentence or move it into prose.
- Nested lists to at most two levels. Deeper nesting is unreadable in the
  rendered output.

### Tables

- Use for reference material — parameter/field/error tables. Not for
  narrative content.
- Every table has a header row.
- Every column has a short, sentence-case label.
- Cells contain phrases, not full paragraphs. If a cell needs a paragraph,
  the table is the wrong shape — use a `### Field name` heading with a
  paragraph below.

### Code blocks

- Always fenced with triple backticks.
- Always with a language hint (` ```json`, ` ```bash`, ` ```http`,
  ` ```javascript`, ` ```typescript`, ` ```yaml`, ` ```sql`).
- URLs shown in code blocks use the real host (`https://api.bizkithub.com`),
  not `example.com`.
- Example values use realistic-looking but obviously fake data (`cus_abc123`,
  `PROD1234567890abcdefghijklmnop`), never real customer data.
- Requests/responses are shown as compilable examples — copy-paste must
  work when the reader substitutes their own credentials.
- Do not put commentary inside code blocks as comments. Put commentary in
  prose before or after the block.

### Emphasis

- **Bold** for terms being introduced for the first time in the article
  and for genuine emphasis. Never for whole paragraphs.
- *Italic* for the title of an external work or an unusual foreign word.
  Do not use italic for emphasis.
- `Monospace` for identifiers the reader will type, click, or paste:
  parameter names, response field names, URL segments, error codes,
  file names, exact button labels.

### Callouts

Use blockquotes for meaningful callouts. Prefix with a single word so
the intent is unambiguous:

```markdown
> **Note.** The rate limit is per organisation, not per API key.

> **Warning.** Rotating a production key invalidates every request in
> flight; schedule the rotation for a low-traffic window.

> **Deprecated.** The `legacy_id` field will be removed in the next major
> API version. Use `id` instead.
```

Do not overuse. If half the article is callouts, the callouts stop
carrying signal.

### Links

- **Internal links to other articles use `/route` format — leading slash,
  the article slug, nothing else.** No file extensions (`.md`), no
  relative paths (`./`, `../`), no directory prefixes. The docs site
  publishes every article as a flat route under
  `https://docs.bizkithub.com/{slug}`, and the renderer does not resolve
  markdown-style paths. A link written as `./post-editor.md` or
  `../post-categories/post-categories.md` will publish as a broken link.
  The correct forms are `/post-editor` and `/post-categories`. The
  slug portion is either the value of the `code:` frontmatter field or,
  when `code:` is empty, the platform-generated slug from the article
  title.
- Prefer descriptive link text. `See [API keys](/api-key)` beats `See
  [here](/api-key)`.
- The locale prefix is added automatically by the renderer per visitor;
  do NOT hardcode `/en/…`, `/cs/…`, etc. into internal links. The
  platform inserts the right locale on render.
- External links use the full absolute URL (`https://…`). Do not add
  `(external link)` markers or icons.

---

## 11. Section templates

The following section skeletons repeat across dozens of articles. Use them
as scaffolds — not as a straitjacket. Adapt to the topic.

### Overview article (module `.md`)

```markdown
## What this module does

One paragraph. Plain English. Answer "what problem does this solve, and
for whom?".

## When you would use it

Concrete use cases, one bulleted line each. Three to six items.

## How it fits with the rest of the platform

How this module relates to adjacent ones. Which modules feed data into
it, which consume its output.

## Where to find it in the admin

The exact navigation path — top-level section, then submenu — so a
first-time reader can locate the UI without guessing.

## Core concepts

The two or three vocabulary terms a reader must understand before diving
in. Definitions in the reader's language, not the platform's.

## Related articles

Bulleted list of focused articles in this module, each with a one-line
description of when to read it.
```

### How-to article

```markdown
## What you need before you start

Preconditions — permissions, other configured modules, minimum plan tier
if any.

## Steps

Ordered list. Each step is a single verb-first sentence describing one
click, one field, one API call. If a step needs sub-explanation, put it
directly under that step, not later in the article.

## Verifying it worked

How to check the outcome — which admin screen to open, which API endpoint
returns the confirming data, which event to expect.

## What can go wrong

Named failure modes with the exact symptom + fix per row.

## Related
```

### Reference article (API endpoint, configuration field, entity)

```markdown
## Purpose

One or two sentences. What the endpoint / field / entity is for.

## Contract

For an API endpoint: method, path, query parameters, request body,
response body, error codes.

For a configuration field: type, allowed values, default, effect,
constraints.

For an entity: fields, types, meanings, immutability, lifecycle.

Use tables for parameter/field/error reference. Use fenced code blocks
for request/response examples.

## Examples

Minimum three real-shape examples. A minimal happy path, a realistic
common case, and one edge case (error, empty state, etc.).

## Semantics

Any non-obvious behaviour — ordering, timing, idempotency, side effects
on adjacent modules.

## Compatibility

What is a stable contract vs. what may change. Deprecation status.

## Related
```

### Troubleshooting article

```markdown
## Symptom

Describe what the user sees — exact error message, exact UI state.
Optimise for search: a user copy-pasting the error string must find
this article.

## What causes it

Root cause in plain terms. Enumerate the two or three most common
causes.

## How to fix it

Ordered steps. Include commands, URLs, or admin paths the reader can
follow verbatim.

## How to prevent it

If applicable — settings, monitoring, safeguards.

## When to escalate

The exact conditions under which this needs platform support (rare —
most things are self-serve).
```

---

## 12. Cross-linking

- **Every article links out.** Zero-outbound-link articles are dead ends.
- **Link format is `/slug` — always.** Leading slash, article slug,
  nothing else. No `.md`, no `./`, no `../…/`. The docs site
  (`https://docs.bizkithub.com`) renders every article as a flat top-
  level route; markdown-style relative paths publish as broken links.
  See the [Links formatting rules](#links) for the full explanation.
- **Link the first mention of an adjacent concept.** If your article on
  order creation mentions payments, link to the payments overview the
  first time. Later mentions do not need to link.
- **Link both directions.** When you write article B that depends on
  article A, add a link back from A to B in a `## Related` section (or
  wherever it fits naturally).
- **Use canonical article titles as link text.** `[Order status
  lifecycle](/orders-status-lifecycle)` beats `[read more](/orders-status-lifecycle)`.
- **Cross-department links are encouraged** — a `sales/` article
  referencing a `finance/` article helps readers follow the natural flow
  of the business process. The link format stays the same (`/slug`) —
  the directory the article lives in on disk does not appear in the URL.
- **Never link to admin-only URLs, internal-tool URLs, source control,
  Notion, Slack, or issue trackers.** Documentation must stand alone on
  the public docs site.

---

## 13. Media, screenshots, and code samples

### Media

- Reference images by their **absolute HTTPS URL** as emitted by the
  platform. Never commit binary assets to this repository — they are not
  round-tripped and would just bloat Git history.
- To add new media: upload from the admin UI first, then reference the
  URL the admin emits.
- Every image has descriptive alt text. Alt text is a full sentence
  describing what the image conveys, not a caption ("Screenshot of the
  order detail page with the status dropdown expanded", not "Order
  detail").

### Screenshots

- Take screenshots at 2× density. The docs site downscales; source
  crispness matters.
- Crop tightly to the UI area under discussion. Do not include the
  browser chrome, tabs, or unrelated sidebar.
- Do not include real customer data. Use the demo organisation, or
  redact.
- Prefer a static screenshot over an animated GIF. Animation belongs in
  a video, not inline.
- Screenshots go stale. Only add one when it materially helps
  understanding. If the article makes sense without it, skip.

### Code samples

- Prefer language-agnostic samples (`curl`, `HTTP`, `JSON`) for API docs
  — every reader understands them.
- Provide a second sample in one popular language (JavaScript or
  Python) when the setup is non-trivial (auth, pagination, streaming).
- Every code sample is copy-paste-runnable after credential substitution.
  Do not use placeholders that do not exist (`YOUR_MAGIC_TOKEN_HERE` is
  fine; `TODO` is not).
- Error responses are shown alongside success responses, with the same
  fidelity.

---

## 14. Multi-locale — how it works, and what to avoid

- The **primary locale of this repository is English** (`en`). Every file
  is authored in English.
- The platform maintains translations to `cs`, `de`, `pl`, `sk` (and
  potentially others as they are enabled by the organisation). Those
  translations are **generated automatically** on import from this
  repository's English source, using the platform's own translation
  pipeline.
- **Do not hand-author translations here.** There is nowhere in the file
  format to put them, and even if there were, they would be overwritten
  by the next auto-translate run.
- **When editing an existing article**, the auto-translate pipeline
  detects the change (via a content-fingerprint against the last
  translated version) and refreshes every locale. You do not need to
  trigger anything manually — the admin surface has a dashboard to see
  what is out of date and force a refresh if needed.
- **Translations are not perfect.** If you notice that a particular
  English phrasing translates badly (idiom, ambiguous acronym), rewrite
  the English to be less ambiguous. Do not annotate translation hints
  inline — they are noise for English readers.

---

## 15. Research checklist before you write

Do not open a blank file. First:

1. **Search this repository** for existing coverage of the topic. `grep`
   the module name across all `.md` files. If an article already exists,
   extend it or split it — do not create a duplicate.
2. **Open the admin UI** and click through the feature end to end. Note
   every screen, every field, every error you can trigger. Screenshot as
   you go; you will delete most of them but you will use a few.
3. **Read the public API surface** at `docs.bizkithub.com/api` (the
   Swagger explorer) for every endpoint related to the feature. Note
   the URL, method, parameters, response, and error codes verbatim —
   these are contracts and your prose must match.
4. **Talk to the source of truth.** If you have code access, read the
   feature module in the platform source to confirm the behaviour of
   edge cases. But: **document the behaviour, not the code**. Never
   copy code excerpts, type names, or internal identifiers into the
   article.
5. **Look up the release notes / changelog** for the feature — a "why
   does this exist?" sentence in your intro is often lifted straight
   from the launch announcement.
6. **Skim adjacent articles** to make sure your terminology matches
   theirs. Two articles calling the same concept by different names is
   worse than one article missing.
7. **Draft the H2 outline first.** Before writing any prose, list the
   headings the article will have. If the outline covers the topic,
   the prose will too. If the outline has gaps, fill them before
   writing.

---

## 16. Review checklist before you commit

Read your article through, top to bottom, then check each item:

- [ ] Frontmatter is valid YAML; `category` matches the on-disk folder.
- [ ] Exactly one H1, underlined with `===`.
- [ ] All subsequent headings are `##` or lower and use sentence case.
- [ ] The first two paragraphs stand on their own as an executive summary.
- [ ] The article contains no internal identifiers (table names, column
      names, function names, cron job names, internal URLs, feature-flag
      names). Do a `grep -Ei 'shop__|content__|/bff/|src/features/'` on
      your article before you commit.
- [ ] Every claim is falsifiable — no hedging, no marketing adjectives.
- [ ] At least one concrete example, ideally three.
- [ ] Every code block has a language hint and a realistic-looking value.
- [ ] Every image has a descriptive alt text and uses an absolute HTTPS URL.
- [ ] At least one outbound link.
- [ ] Every internal link uses the `/slug` format (leading slash, no
      `.md`, no `./` or `../`, no `/en/` or other locale prefix).
      A quick grep before commit: `grep -oE '\]\([^)]+\)' your-article.md`
      — every result should start with `](/` or `](https://`.
- [ ] Sentence length feels human — no 45-word monsters.
- [ ] Ran through spell-check (British English).
- [ ] Filename is kebab-case and matches the topic.
- [ ] If this is a new post: frontmatter has NO `id` field (the importer
      assigns one on the next round-trip).
- [ ] If this is an edit to an existing post: the `id` is unchanged.

---

## 17. Anti-patterns

Every entry below is something you should NOT do. If you find yourself
doing it, stop and rewrite.

- **Marketing copy.** "BizKitHub's powerful order engine seamlessly
  handles even the most complex workflows." Delete and describe what it
  actually does.
- **Table-of-contents in the article body.** The rendering pipeline
  produces its own from the H2s. Do not hand-write one.
- **"Coming soon" or "TODO" placeholders.** Either write the section or
  do not add the heading. Ship the finished section, add the empty one
  in a follow-up.
- **Version history / changelog inside an article.** The docs site is
  a live view of the current platform. Changes over time belong in
  `whats-new/`, not in the feature article.
- **Screenshots of the admin as a substitute for prose.** A picture is
  not worth 1000 words — the picture and the paragraph work together.
- **Copy-pasting the code snippet the API returns for its own errors
  and calling it "documentation".** Explain what the error means in
  business terms and how to recover.
- **Explaining an internal decision** ("we chose Postgres because…").
  Readers do not care about the internal history; they care about what
  they can do today.
- **Empty "Introduction" or "Overview" sections.** If the first section
  says "This article covers…", delete the section — the H1 and the lede
  already said that.
- **Duplicated content across articles.** Cross-link, do not copy. When
  the underlying behaviour changes, one authoritative article is much
  easier to keep correct than three parallel ones.
- **Assumed context from a prior article.** Every article stands alone.
  Someone landing from Google search or an in-app "learn more" link has
  not read the module overview first.
- **Time-relative language** ("recently", "the new version"). The
  documentation is read months and years after you wrote it. Use
  absolute dates or version numbers.
- **First person plural** ("we recommend", "our approach"). Use direct
  guidance ("Use the …", "Configure …") or attribute to the platform
  ("The platform enforces …").
- **Comparing to competitor products.** Not the audience, not the
  purpose. Describe what the platform does; the reader decides how it
  compares to their alternatives.
- **Adding a `title:` field to the frontmatter.** The H1 IS the title.
  A `title:` field is silently ignored on import and creates confusion
  about which is authoritative.
- **Renaming an existing file to "clean up naming".** The file path is
  cosmetic, the DB link is by `id`. If you rename, do not also change
  the `code` or `category` in the same commit — one change per commit
  makes reviews sane and rollbacks safe.

---

## 18. Worked example — anatomy of a good article

Below is a shortened, annotated skeleton of what a well-authored article
looks like. Compare against `developers/api-key/api-key.md` for a real
one in the repository.

```markdown
---
id: "aBcDeFgH12345678"
code: "orders-cancel-api"
category: "sales/orders"
tags: ["orders", "api", "cancellation"]
published_at: "2026-08-14T09:00:00.000Z"
---


Cancelling an order via the API
===============================

Every order in BizKitHub can be cancelled from the moment it is created
until it enters a terminal state. This article documents the API path
for cancellation — when it is available, what happens to reserved stock
and issued invoices, and how to interpret the response. If you are
looking for the admin UI equivalent, see [Cancelling an order from the
dashboard](/orders-cancel-admin).

## When cancellation is allowed

Cancellation is available while the order is in any of the following
states: `draft`, `waiting_for_payment`, `paid`, `preparing`. Once the
order transitions to `shipped`, it becomes non-cancellable — from that
point the correct flow is a return or a complaint, not a cancellation.

## The cancellation call

Method and path:

    POST https://api.bizkithub.com/api/v1/order/cancel

Body:

```json
{
  "apiKey": "PROD1234567890abcdefghijklmnop",
  "orderCode": "ORD-2026-000123",
  "reason": "customer_request"
}
```

… (continues with response shape, side effects, error table,
verification, related articles) …
```

Notice how the article:

- **Opens with a lede** that would be readable by any of the four
  audiences.
- **Immediately cross-links** to the sibling admin-UI article.
- **States the constraint** ("allowed while …") in behavioural terms,
  not by naming internal state columns.
- **Gives a concrete, runnable request example** with a realistic-looking
  API key format and order code.
- **Refers to states by their public, contract-guaranteed names**
  (`paid`, `preparing`) — those names appear in API responses, so
  documenting them is safe.
- **Never mentions** which table stores the state, which function
  computes the transition, or which internal event fires when the
  cancellation succeeds. The reader does not need any of that; the
  platform reserves the right to change all of it.

---

**Any question this document does not answer?** Read
[`INSTRUCTIONS.md`](./INSTRUCTIONS.md) for the mechanical rules, then
open an existing well-authored article (e.g.
`developers/api-key/api-key.md`) and use it as a live template. When in
doubt, prefer longer, more concrete, more example-rich over shorter and
more abstract.

---
id: "rjUkyo20qm6giz7b"
category: "content/post-management"
tags:
  - "posts"
  - "translations"
  - "i18n"
  - "multilingual"
published_at: "2026-08-02T17:11:10.179Z"
---


Translations
============

Multi-language content is a first-class feature of the Posts module. Every organisation configures which locales it publishes in, and the platform maintains a translation of each article in every configured locale — automatically produced from the primary-language source, kept in sync as the source is edited, and surfaced in the admin so an operator can see at a glance which articles are current, which have gone stale, and which are missing entirely.

This article covers the full translation surface: how the model decides what needs translating, how automatic translation works, how staleness is detected and fixed, the analytics dashboard on the **Translations** tab, and the terminal-based tooling for bulk operations.

## The mental model

At the core is a simple invariant: **the primary locale is the source of truth, every other locale is a derivative**. When you write or edit an article, you write in the primary locale. When you save, the platform records a snapshot of that primary-locale version. Every translation in every other locale is stamped with a reference to the exact source snapshot it was generated from.

Later, when the source is edited again, a new snapshot is recorded. The old reference on each translation now points at an outdated snapshot — the platform recognises this and marks the translation **stale**, meaning "still there, but the source has moved on." Regenerating from the current source refreshes the translation and updates its reference to the new snapshot.

That is the whole model. Everything below is a consequence.

## The three per-locale states

Every translation of every article is in one of three states relative to a given locale:

- **Fresh** — a translation row exists and its reference matches the

current source snapshot. In sync.

- **Stale** — a translation row exists but its reference points at an

older source snapshot, or the reference is missing entirely (a legacy row from before the platform tracked references). Out of date; the source has been edited since translation.

- **Missing** — no translation row exists in this locale at all. The

article has never been translated to it.

The article grid renders these three states as coloured badges next to each article title:

- **Green** — fresh
- **Amber** — stale
- **Grey** — missing

Hovering a badge tells you which state it is and (for stale) why.

## Automatic translation

Any time an article has at least one missing or stale target locale, the auto-translate button appears in the article detail sidebar (in the **Languages** section) and in the row context menu of the article grid.

Clicking the button triggers the translation pipeline for that article:

1. The platform reads the current primary-locale title and body.
2. For every enabled locale that is either missing or stale:
- It sends the primary-locale text plus the target locale code to

the translation model.

- It receives back a translated title and body.
- It validates the response — non-empty content when the source

had content, plausible length ratio versus the source, and that the model did not simply echo the source verbatim.

- On failure of any validation, it retries against the next model

in a fallback chain (three models total, spanning two providers). The failure of one model does not abort the run — only the failure of every model does.

- On success, it upserts the translation into the article's

locale row and stamps the current source-snapshot reference.

3. The article's canonical URL routes are ensured for every locale

that received a translation.

The whole operation is atomic per locale: either the translation for a given locale is saved in full and stamped as fresh, or nothing lands for that locale and the row keeps its previous state (missing or old-stale) so the next run can retry it. Partial writes are impossible.

### Length ratio and language safety

The response-validation step rejects two common failure modes that would otherwise produce silent bad data:

- **Empty translation** — the model returned a title but no content

for a source that had substantial content. Historically this was the cause of "titles-only" translations in the corpus and the most damaging failure mode because it looks successful.

- **Extreme length mismatch** — the translated content is either

less than 30 % or more than 300 % of the source (measured in UTF-8 bytes, so CJK targets are compared fairly). Usually indicates truncation, hallucination, or a refusal to translate.

Both trigger a rejection, the run moves to the next model, and if every model fails the target locale is left untouched.

### Source-echo detection

If the model returns text that is byte-identical to the source, the platform rejects the response as a "refused to translate" case. This mostly matters for languages that share the source's alphabet — a Slovak translation that happens to be identical to the Czech source because the model didn't actually translate.

Below very short sources (about one paragraph), the check is skipped — trivially short content can legitimately be identical (product names, `<img>`-only bodies, single-word titles).

## Editing behaviour and staleness

The moment you save any change to the article in the primary locale, the platform records a new source snapshot and every existing translation becomes stale. The Translations section in the article sidebar shows amber badges for each affected locale, and the auto-translate button reappears.

You control when to regenerate. The stale badges are a **signal**, not a trigger — nothing happens automatically. Two reasons for that:

- **Cost control** — every translation call uses AI credits. You

might edit an article five times in one editing session, and you want to regenerate once at the end, not five times.

- **Editorial discretion** — some edits are minor (typo fixes) and

the existing translations are still fine to leave as-is until the next major refresh.

That said, the recommended default workflow is: edit, save, click auto-translate at the end of the session. For bulk cases across many articles, use the tooling on the Translations tab (see below).

## The Translations tab

The **Translations** tab on `/post` is the operator's dashboard for multi-language content health across the whole organisation. It opens with an overview card, three aggregate counters, a per-locale coverage table, and a diagnostics panel.

### Header

Shows the organisation's primary locale (marked with a star), the full list of enabled locales as coloured badges, and the total number of live posts. This is your at-a-glance context — before you look at the numbers, you know what "100 %" would mean.

### Aggregate cards

Three coloured cards summarise how many articles are in each state, with a percentage of the total:

- **Fully translated** (green) — every non-source locale is fresh.
- **Partially translated** (amber) — at least one locale is fresh

and at least one is missing, stale, or suspiciously short.

- **Untranslated** (rose) — no translation exists in any non-source

locale.

For a single-locale organisation, every article counts as fully translated (nothing to translate to).

### Per-locale coverage table

One row per enabled locale, showing:

| Column | What it counts |
| --------------- | --------------------------------------------------------------------------------------- |
| **Locale** | The locale code, with a star for the source locale. |
| **Fresh** | Translations in sync with the current source snapshot. |
| **Stale** | Translations that exist but point at an older source snapshot. |
| **Missing** | Articles with no translation in this locale. |
| **Short** | Diagnostic: translations whose content is under 30 % of source length (probable truncation). Overlaps with fresh/stale — does not double-count. |
| **With** | Total articles that have a row in this locale (fresh + stale + short). |
| **Routes** | Canonical article URLs pointing at this locale. |
| **Orphan routes** | Canonical routes whose referenced translation has been deleted — the route survived but the content is gone. |

The source-locale row shows dashes for fresh/stale/missing because these concepts do not apply to it (the source is by definition the authority).

When a locale row has any stale or missing counts, a small **opravit** link appears next to the locale label. Clicking it opens the terminal and runs the appropriate refresh command for the whole organisation (not just that locale — the underlying command processes everything in one pass).

### Tooling bar

A horizontal bar of one-click actions, each of which opens the admin terminal and streams the command output live:

- **Show overview** — lists every article with per-language status

in a table view. No writes.

- **Show missing** — lists articles that are entirely missing every

non-source locale.

- **Show broken** — lists articles with any locale not in the fresh

state (missing, stale, or short). Broader than "missing".

- **Translate missing** — regenerates translations only for

entirely-missing locales. Skips stale and short rows. Fastest, cheapest.

- **Translate all broken** — regenerates translations for every

missing, stale, or short locale on every article. Longer and more expensive; use for a full refresh.

- **Fix routes** — creates canonical URLs for existing translations

that do not yet have one. No AI call, cheap.

- **Refresh statistics** — invalidates the dashboard cache and

reloads the numbers.

Every action executes as a streaming command in the admin terminal panel — you see progress in real time, per-article and per-locale counters tick up as work happens, errors surface immediately, and you can leave the panel open to watch or close it and let the command run in the background.

### Diagnostics section

An expandable panel below the table shows deeper metrics:

- **Posts with version history** vs **without (legacy)** — how many

articles have at least one recorded snapshot. Legacy articles without any snapshot cannot have their translations marked stale (there is nothing to compare against). Running any translate action once on such an article seeds a snapshot and enables stale detection going forward.

- **Average versions per post** — a health signal about editing

activity.

- **Orphan canonical routes total** — safe to leave, but they

occupy URL slugs that new articles cannot reuse. Delete translations you no longer want, then either recreate or leave the route to redirect.

- **Suspiciously short translations** — the count from the "Short"

column across every locale, summed. Non-zero usually means an older bulk translation run failed halfway; "Translate all broken" clears these.

## Terminal tooling

Everything the Translations tab does can also be driven manually from the admin terminal. The terminal command is `post`, with several subcommands:

### `post list [filter]`

Prints a table of every article with per-locale status glyphs:

- `★` — source locale (this article's origin language)
- `✓` — fresh translation
- `↻` — stale (source edited since translation)
- `◐` — partial (title only, or content dramatically shorter than

source)

- `✗` — missing (no translation row)

The optional filter narrows the output:

- `all` (default) — every article.
- `missing` — articles with every non-source locale missing.
- `partial` — articles with any partial-by-length locale.
- `stale` — articles with any stale locale.
- `broken` — union of missing + partial + stale (anything not fully

translated).

- `ok` or `translated` — fully translated only.

At the top of the output is a summary line: `📊 X posts — ✓ N translated · ◐ N partial · ✗ N missing`. Below is the article table, and at the bottom a legend and a hint when there is work to do.

### `post translate [postId] [--missing]`

Runs the translation pipeline. Without arguments, processes every non-fresh locale on every article that needs work — missing, partial, and stale. With `--missing`, only fully-missing locales are translated (fastest, cheapest).

With a `postId` argument, only that specific article is processed. Useful for targeting a single article for a one-off refresh.

The command streams progress live. For each article and each target locale you see:

- The plan (which mode: fresh translation, refresh, content-only

repair, title-only repair).

- A payload size hint and expected duration.
- A heartbeat tick every five seconds while the AI is generating,

so a slow response does not look frozen.

- The success confirmation with the final title, content length,

and elapsed time.

- On failure, the error message and which model in the chain was

responsible.

A summary table at the end lists every article touched, whether the result was ok or partial, and which locales succeeded or failed.

### `post fix-routes [postId]`

Creates canonical routes for existing translations that do not have one. Idempotent — existing routes are left alone. No AI call, so the operation is nearly free.

Use when:

- You imported translations from an external system and only the

content rows were created, not the routes.

- A previous translate run crashed after saving the content but

before creating the route.

- A route was accidentally deleted.

Without arguments, processes every article. With a `postId`, only that article's missing routes are created.

### Combining commands

A typical bulk-refresh session looks like:

post list broken # see what needs work post translate --missing # cheap first pass post list broken # see what remains post translate # cover partials and stale post fix-routes # ensure every translation has a URL

All of this can also be driven from the Translations tab buttons without typing.

## Manual editing of a translation

You can edit any locale's translation directly by opening the article detail, switching the content locale in the header, and editing the fields. The save behaves the same as an original-locale save for that locale: it records a per-locale history entry, updates the content, and does not touch other locales.

**A caveat:** the platform does not track "this row was hand-edited, do not overwrite". If you later click auto-translate for that article, your hand-edit will be regenerated from the source — losing your changes. The reasoning: the source is the authority, and a hand-edited translation that drifts from the source is more misleading than useful.

If you have edits that must survive a translate run, the workflow is to instead:

1. Make the change in the source locale.
2. Save.
3. Click auto-translate.

The result reflects your source-side edit uniformly across every locale.

## What is not translated

Some fields are locale-independent and are not translated. They apply to every locale equally:

- **Category assignment** — the same category tree serves every

locale, though category names themselves are translated separately in the category module.

- **Tags** — the same tag chips apply to every locale, though tag

labels are translated in the tag library.

- **Authors** — the same author list.
- **Publication date and visibility.**
- **Main image and gallery** — the same images.
- **Attachments** — the same files.
- **Custom metadata** — the same key–value pairs.

Only **title**, **content**, **perex**, **meta title**, and **meta description** are per-locale.

## The primary locale can change

Rare but supported. If your organisation switches primary locale (for example, from Czech to English), the switch happens at the organisation level and takes effect immediately: what was the source becomes another target, and what was a target becomes the source.

The existing translations do NOT reshuffle — every row keeps its content. What changes is which row is treated as the authority for future auto-translate runs. The dashboard will show every article as stale for the new source, because their references now point at the old-source history that is no longer the authority. Running "Translate all broken" from the Translations tab regenerates everything from the new source.

## Related

- [Post management overview](/post-management)
- [Post editor](/post-editor)
- [Post history and versioning](/post-history-and-versioning) — how

source snapshots are stored.

- [Routing and URLs](/post-routing-and-urls) — how per-locale

canonical routes are generated and healed.

- [Bulk actions](/post-bulk-actions)
- [API integration](/post-api-integration) — how the public API

exposes per-locale content.

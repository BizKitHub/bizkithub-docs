---
category: "content/post-management"
tags: ["posts", "analytics", "views"]
published_at: "2026-08-02T09:59:43.000Z"
---


Views and analytics
===================

Every time an article is served on the public site or via the
public API, the platform records a read. Aggregated over time,
those reads become the view count you see on the article grid,
the daily-views chart on the article detail, and the trend arrow
that tells you whether an article is gaining or losing traction.

This article covers what counts as a view, how the count is
buffered and flushed, the daily snapshots that power the chart,
the rolling-window trend arrow, and the caveats worth knowing.

## What counts as a view

A view is a successful read of the article via one of the
customer-facing surfaces:

- Reading the article on the public site (article page).
- Fetching the article via the public REST API's `/api/v1/post/*`
  endpoints.
- Reading the article via an RSS-feed reader that requests the
  full body (rare — most readers only fetch the feed's summary,
  which does not count).

Not counted:

- Loading the admin post detail — the operator's own reads never
  inflate the counter.
- Reads by internal automation (crawlers, bots identified by
  known user-agents).
- Serving the sitemap or the RSS feed itself — those aggregate
  many articles but do not read individual bodies.

The counter is per-article and cumulative across all locales. If
an article has Czech and English translations, both count toward
the same article's total. Per-locale view breakdown is not
currently exposed in the admin grid.

## Buffering and flushing

For performance, the platform buffers view increments in a fast
in-memory store and flushes them to the persistent counter every
five minutes. Practical consequences:

- **Grid view count lags reality by up to five minutes.** A
  viral article read a thousand times in the last minute may
  still show yesterday's count for a few minutes before the
  flush arrives.
- **Counter drift is bounded.** In the very rare case of a
  platform restart with unflushed reads in memory, at most five
  minutes of reads can be lost. Not zero, but never many.
- **The buffer is per-organisation.** Reads across organisations
  do not compete for the same buffer; a spike in one org does
  not affect another's counter accuracy.

For most editorial purposes the lag is invisible. If you need
precise real-time view counts (e.g. for a live A/B test),
consider integrating a dedicated analytics tool alongside the
platform.

## Where the numbers appear

Three places surface view data:

### 1. Article grid column

The **Views** column on `/post` shows each article's cumulative
count formatted with locale-appropriate thousands separators
(`12,345` in en, `12 345` in cs). Numbers are right-aligned with
tabular figures so they line up column by column.

### 2. Trend arrow next to the grid count

For articles with enough history (see below), the count is
accompanied by an arrow:

- **↗ Green** — reads in the last few days are meaningfully higher
  than the equivalent window before. Trending up.
- **↘ Red** — reads are meaningfully lower. Trending down.
- **→ Grey** — reads are flat within a small tolerance.
- **No arrow** — no baseline for comparison (very new article, or
  an article with too little history).

The trend is a rolling-window comparison — reads in the most
recent N days versus reads in the N days immediately before that.
The default window is short (a few days) so the arrow reflects
current momentum, not lifetime averages. A ±10 % band (with a
minimum of ~2 views absolute) is treated as flat to prevent a
single accidental refresh from flipping the arrow.

Hovering the count shows the exact numbers on the tooltip: how
many reads in the recent window, how many in the prior window,
and how the trend was decided.

### 3. Article-detail view chart

Opening any post from the grid loads the detail page, whose
sidebar shows a small line chart of daily reads over the last
few weeks — one point per day, with the current cumulative count
displayed above the chart.

The chart is populated from daily snapshots taken by an internal
reporting job. Snapshots roll up at end of day (UTC), so today's
data point appears after midnight. Very new articles (created
today) show a placeholder until the first snapshot lands.

## The daily snapshot model

Under the hood, the platform records one snapshot per (post,
day) with the cumulative read count as of that day's end. That
gives every article a full time series:

- **The chart** on the detail page reads directly from these
  snapshots.
- **The trend arrow** compares two snapshots — the one N days ago
  and the one 2N days ago — to compute the two-window delta.
- **The current cumulative count** is a live counter (buffered
  and flushed as described above) — not a snapshot.

Snapshots are lightweight and retained indefinitely. There is no
admin pruning; historical trend analysis over years remains
available.

## What the trend arrow does NOT tell you

- **Overall popularity** — an article with 100 views/day trending
  down still has more absolute reads than a new article with 5
  views/day trending up. The arrow measures direction, not
  magnitude.
- **Comparison across articles** — the arrow is per-article.
  Sorting the grid by the arrow is not meaningful; sort by the
  view count instead.
- **Referrer or geography** — the platform does not (currently)
  break down where the reads came from. For that, integrate a
  general-purpose analytics tool.
- **Reader time on page or scroll depth** — engagement metrics
  beyond "did they load the article" require an external tool.

## The reader-facing surface

Depending on the site theme, the public article page may or may
not display the view count to readers. Themes that show it
typically render "N reads" or "N views" near the article's
byline or footer. Themes for editorial-first sites often hide
the count.

The count shown on the public page is the same cumulative
counter the admin sees, subject to the same five-minute flush
lag.

## Filtering and sorting the grid by views

The Views column is sortable. Click the header to sort ascending
(fewest views first — useful for finding neglected content) or
descending (most-read first — useful for identifying popular
work worth promoting or updating).

There is no per-time-window filter (e.g. "articles most read this
week"). To answer that question, sort by the trend arrow's
recent-window numbers via the API, or export the snapshot data.

## API exposure

The public API surfaces:

- **`viewsCount`** on the article list and detail — cumulative
  reads, five-minute delayed.
- **`viewsRecentDelta`** — reads in the recent trend window (if
  available).
- **`viewsPriorDelta`** — reads in the prior trend window (if
  available).

Integrators building custom dashboards can use these to render
their own trend visualisations.

The daily snapshot series is not currently exposed on the public
API. It is admin-only, powering the sidebar chart.

## Tips

- **Do not chase individual-day spikes.** A viral post is
  wonderful, but "why did this article get 500 views on Tuesday"
  is rarely knowable without an external referrer report. Watch
  the trend arrow over weeks.
- **A stale-content signal:** articles with a green trend arrow
  are your workhorses. Articles with a red arrow that used to
  be workhorses often need refreshing — check the publication
  date, review the accuracy, consider a rewrite.
- **Correlate with SEO score.** An article with high views AND a
  low SEO health-score pill is a hint that content quality is
  carrying it despite the SEO gap; fixing the SEO gap could
  unlock more.
- **Compare cross-locale performance.** If the Czech translation
  of an article has 10× the views of the English translation,
  that is a signal about your audience mix that informs which
  markets to prioritise.

## Related

- [Post management overview](/post-management)
- [Post editor](/post-editor) — the sidebar's view chart.
- [Translations](/post-translations) — cross-locale view
  comparison context.
- [API integration](/post-api-integration) — the view fields on
  the API.

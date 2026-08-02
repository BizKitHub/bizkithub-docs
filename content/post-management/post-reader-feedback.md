---
category: "content/post-management"
tags: ["posts", "feedback", "ratings"]
published_at: "2026-08-02T09:59:43.000Z"
---


Reader feedback
===============

Readers of a published article can rate it on a 1–5 star scale from
the article page. Feedback is aggregated per article and surfaced
in the admin grid as an average score, letting editors identify
articles readers loved and articles that fell flat — signals for
what topics resonate, which authors reliably deliver, and which
posts might benefit from a refresh.

This article covers how readers submit feedback, what the aggregate
score means, how it is presented to editors, and how to interpret
the numbers in the article grid.

## Where readers submit feedback

Every published article on the public site has a feedback widget at
the bottom of the body — five clickable stars, a submit button, and
a short thank-you confirmation after submission. The widget appears
after the article content and before any comments section.

The widget is:

- **Anonymous by default.** No login required. The platform
  records the rating but not who submitted it (an anonymous
  browser fingerprint prevents the same visitor from stuffing the
  ballot, but the identity behind the rating is never exposed).
- **One rating per visitor per article.** A visitor who tries to
  rate a second time sees their previous rating and can update
  it, but cannot inflate the count.
- **Optional per site theme.** Some organisations disable the
  widget for editorial reasons (news articles where reader
  approval is not the goal); check with your theme configuration.

## What the numbers mean

Each rating is a number from 1 to 5. The article's aggregate score
is the arithmetic mean of every rating received, rounded to one
decimal place for display.

A companion count — how many ratings the score is based on — is
tracked alongside. A 5.0 average from three ratings is different
from a 4.7 average from 200; the admin surfaces both so operators
can judge confidence.

## Where the aggregate appears

### Article grid column

The **Rating** column on `/post` shows a coloured pill for every
article that has received any feedback:

- **Green pill (≥ 4.0)** — well-liked. The article resonated with
  its readers.
- **Amber pill (3.0–3.9)** — mixed. Some readers found value,
  some did not.
- **Rose pill (< 3.0)** — poorly received. Consider reviewing.

Articles with zero ratings show a grey dash (`—`) rather than a
number — a zero average would mislead, since zero from no data is
different from zero from lots of one-star ratings.

Hovering the pill shows the tooltip with the exact numbers:
"4.7 average from 23 ratings", plus the aggregate age (when the
first rating landed).

### Sortable

The column is sortable. Sort ascending (worst first) to identify
articles that might need improvement; sort descending (best first)
to identify articles worth featuring more prominently or using as
templates for what worked.

Note: sorting by rating is asymmetric because unrated articles are
excluded from the sort direction — they show at the top or bottom
depending on ordering. Use the rating column in combination with
the view-count column to focus on articles that have both traffic
AND enough feedback to interpret.

## What the aggregate does NOT tell you

Interpret with care.

- **Selection bias.** Only readers who chose to rate are counted.
  Casual readers who liked the article but did not click stars
  are invisible. Enthusiasts and complainers are over-represented.
- **Small samples.** A 5.0 average from four ratings is not
  statistically meaningful. Wait for at least 20 ratings before
  drawing conclusions.
- **Cultural variance.** Different reader populations rate
  differently. A 3.5 average from technical readers may indicate
  the same article that would receive 4.5 from casual readers.
- **Zero-star as a protest.** Some readers use a one-star rating
  as a way to disagree with the article's thesis rather than to
  judge its quality. Read the accompanying comments (see
  [Comments and moderation](/post-comments)) for context.

## Tips

- **Combine with view count.** High views + low rating = worth
  investigating (perhaps traffic finds the article via search
  but leaves disappointed). Low views + high rating = candidate
  for promotion (the few who found it loved it; get it in front
  of more people).
- **Combine with comment sentiment.** The rating aggregate is a
  single number; comments are prose. Reading a handful of
  comments alongside the rating tells you WHY readers scored the
  way they did.
- **Do not chase the aggregate as a KPI.** Editorial teams tempted
  to make every article "safe" to protect the rating tend to
  produce dull content that never delights. The bold article
  that alienates some but delights others is often more
  valuable than the middle-of-the-road piece nobody hates.
- **Re-rate after a rewrite.** After significantly updating an
  article, the historical rating stays — new readers rate the
  new version but their votes are mixed with old votes on the
  old version. To reset the counter for a major overhaul,
  contact support (rare; typically the mix is fine).

## Public API exposure

The public API exposes:

- **`ratingAverage`** — the aggregate score, or undefined if the
  article has no ratings.
- **`ratingCount`** — the number of ratings the average is based
  on.

An integrator can present the aggregate however they like — as
stars, as a numeric badge, or as an editorial signal — on their
own product.

See [API integration](/post-api-integration).

## Moderation

The rating itself has no free-text component — a visitor cannot
attach a written explanation to their rating. For that, use the
comments section (see [Comments and moderation](/post-comments)).

Ratings cannot be individually deleted or moderated by editors.
The aggregate reflects real reader input; interventions would
undermine the signal's honesty. If a specific rating is clearly
spam or abuse (very rare for a five-star system), contact support
for platform-level removal.

## Related

- [Post management overview](/post-management)
- [Comments and moderation](/post-comments) — for the free-text
  companion.
- [Views and analytics](/post-views-and-analytics) — the other
  reader-signal to combine with ratings.
- [API integration](/post-api-integration)

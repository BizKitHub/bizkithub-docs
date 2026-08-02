---
category: "content/post-management"
tags: ["posts", "ai", "automation"]
published_at: "2026-08-02T09:59:43.000Z"
---


AI tools
========

The Posts module bundles several AI-assisted features that help
editorial teams work faster without sacrificing quality — automatic
category suggestion for new articles, topic suggestions for what to
write next, fact-checking on saved content, image generation from a
reference-image library, and the automatic translation pipeline
that keeps every locale in sync.

This article gives an inventory of the AI-assisted surface, when
each feature helps, when it hurts, and what to consider when
enabling them for your editorial workflow. Deeper coverage of the
biggest one — translation — lives in [Translations](/post-translations);
the image-generation flow is in [Gallery and images](/post-gallery-and-images).

## Automatic category suggestion

Every post editor has a **Suggest category** button next to the
main-category dropdown. Click it and the platform:

1. Reads the current article title and body.
2. Sends both to the AI along with a list of your active
   categories and their descriptions.
3. Returns the single best-matching category.
4. Displays the suggestion — one click accepts and populates the
   main-category field.

Practical notes:

- **Only active categories are candidates.** Deactivated
  categories are excluded so a suggestion never nominates a
  section you have deliberately retired.
- **Category descriptions steer the model.** The description you
  write for each category is what the AI reads to understand
  what "belongs" there. Vague descriptions produce vague
  suggestions; concrete descriptions with keywords produce
  reliable ones. See [Post categories](/post-categories) for
  best practices on writing category descriptions.
- **The suggestion is not automatic.** Nothing is set until you
  click accept. Suggestions are always human-reviewed.
- **Suggestions are one-shot.** There is no ongoing "watch this
  article and re-suggest if it changes"; the suggestion happens
  when you click, using the current article content at that
  moment.

Use for the first draft of a new article, or when reorganising an
imported batch of unclassified content. Skip when you already
know exactly where the article belongs.

## Topic suggestions

The **AI-suggested topics** button in the top-right corner of
`/post` (next to the Add button) opens a modal that suggests new
article ideas your editorial team could pursue.

The suggestion flow:

1. The platform reads the current category tree, the topics of
   recent articles, and (optionally) any competitor sites you
   have configured as reference.
2. It analyses coverage gaps — categories that are under-served,
   topics competitors write about but you do not.
3. It returns a list of 5–15 concrete article-title suggestions,
   each paired with a target category, a suggested angle, and a
   short reasoning ("Category X has no article about Y since
   2024; competitor A published a piece on this last week.").

Click a suggestion to open a pre-filled create-post modal with
the title, category, and angle already populated. From there the
flow is a normal post creation.

Suggestions are a discovery tool, not a mandate. They surface
opportunities your editorial team can accept, reject, or ignore
based on strategic judgement.

## Fact-check

The **Fact-check** button in the post detail's header runs the AI
fact-checker on the article's body content. It:

1. Extracts specific factual claims from the article — dates,
   numbers, quotes, names, causal statements.
2. For each claim, evaluates whether it is likely true, likely
   false, or unverifiable with confidence.
3. Returns a table of findings: category (error / falsehood /
   recommendation), severity (low / medium / high), the excerpt
   from the article that triggered the finding, the issue
   description, justification, and a suggested fix.

A clean article shows "no findings". An article with issues
shows the table for editorial review; each finding is a
suggestion, never an automatic edit.

Practical caveats:

- **The AI is not an oracle.** Fact-checker output is a
  starting point. Every finding should be validated by a human
  before an edit is made.
- **Coverage varies by domain.** Well-known facts about
  established topics (history, standard science) fact-check
  reliably. Niche technical claims, very recent events, and
  in-house proprietary information may produce false positives
  or false negatives.
- **Run before publishing, not after.** Fact-check is a
  pre-publication safety net. Running it on an already-live
  article that turns out to have issues does not automatically
  correct them; you have to make the edits yourself.

Use for articles with a high risk of factual error — investigative
pieces, technical explainers with specific numbers, news
summaries. Skip for opinion pieces where the "facts" are
subjective by design.

## AI image generation

Covered in depth in [Gallery and images](/post-gallery-and-images).
The short version: the gallery tab has a **Generate with AI** form
that produces an image from a prompt, steered by the
organisation-wide reference-image library. Generated images can be
added to the gallery like any manually uploaded image.

The generation uses the mood prompt and active reference images
from the organisation's library (managed at `/settings/posts`) to
produce visually consistent output across every author's articles.

## Automatic translation

The biggest AI surface in the Posts module — an automatic
translation pipeline that keeps every enabled locale in sync with
the primary-language source. Covered in full detail in
[Translations](/post-translations); the summary here:

- **Trigger** — click the **Auto-translate** button in the post
  detail sidebar (or the row context menu) when target locales
  are missing or stale.
- **Model chain** — every translation is attempted against three
  models from two providers in fallback order; the first
  successful validated response wins.
- **Validation** — the platform rejects empty content when the
  source had content, extreme length mismatches, and source-echo
  responses. Failed validation retries the next model.
- **Atomicity** — either a translation lands in full and is
  stamped as fresh, or nothing lands and the row stays in its
  previous state for the next attempt.
- **Freshness** — the platform tracks which source version each
  translation was generated from and marks translations stale
  when the source is edited. See [History and
  versioning](/post-history-and-versioning) for how source
  snapshots interact.

The **Translations** tab on `/post` is the operator's dashboard
for translation status across the whole organisation, with
one-click actions for bulk translate, refresh stale, and route
repair.

## Combining AI tools

The AI tools cover four discrete moments in the editorial flow:

1. **Discovery** — topic suggestions surface what to write about.
2. **Classification** — category suggestion places an article in
   the right section of the tree.
3. **Fact validation** — fact-check catches errors before
   publication.
4. **Distribution** — auto-translate makes the article available
   in every language.

Used together, they collapse work that would otherwise take a
person hours into decisions the editor still owns but no longer
originates from scratch.

## What AI does NOT do

To set expectations honestly:

- **Write full articles.** There is no "generate an article on
  topic X" button. The topic suggester proposes titles;
  execution stays with the writer.
- **Rewrite for tone.** No "make this more casual / more
  formal / more concise" transformation is exposed in the
  editor. Voice and tone remain manual.
- **Moderate comments.** Comment moderation is fully manual
  (see [Comments and moderation](/post-comments)); no AI
  spam-scoring is applied to visible comments.
- **Score reader feedback.** The 1–5 star ratings are raw human
  input, unfiltered.
- **Replace a human editor.** Everything AI-generated in the
  Posts module is a suggestion or a starting point that a
  human accepts, edits, or rejects. Nothing lands on the
  public site without a human clicking a button.

## Cost considerations

Every AI call consumes credits from the organisation's AI budget:

- **Category suggestion** — one call per click. Cheap.
- **Topic suggestions** — one call per Suggest-topics modal open.
  Moderate cost (larger context including the full category tree).
- **Fact-check** — one or a few calls per run, depending on
  article length. Moderate cost.
- **Image generation** — one call per Generate click. Higher
  cost than text calls.
- **Auto-translate** — one call per (article, target locale). At
  scale (hundreds of articles × several locales) this is the
  biggest driver.

Auto-translate is careful about cost — it skips locales already
in sync (fresh), and the `Translate missing` action further
narrows to only fully-missing locales. Both are visible in the
[Translations](/post-translations) tab. When you have budget
constraints, prefer `Translate missing` and hand-pick individual
articles for full refresh.

## Configuration

The AI features are enabled per-organisation. Check with your
platform administrator whether all features are turned on. Some
features (image generation, fact-check) may be tier-gated on
certain subscription plans.

Configuration surfaces:

- **`/settings/posts`** — the reference-image library and mood
  prompt for image generation.
- **Organisation AI settings** — general AI provider and model
  preferences (usually managed by the platform administrator, not
  the editorial team).

## Related

- [Post management overview](/post-management)
- [Translations](/post-translations) — the biggest AI feature.
- [Gallery and images](/post-gallery-and-images) — image
  generation detail.
- [Post categories](/post-categories) — how category descriptions
  steer the classifier.
- [Post editor](/post-editor)

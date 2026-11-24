---
code: "newsroom-overview"
category: "content"
tags: ["type-overview", "newsroom", "ai", "rss"]
published_at: "2026-11-24T00:00:00.000Z"
---


Newsroom
========

The **Newsroom** module turns the RSS feeds you follow into a short daily list of the most important stories and helps you write an article about each of them. The AI assistant reads new articles from your feeds, classifies them, and the platform scores them by fixed rules. The five best stories of the day form a **shortlist**. For any story on the shortlist you can generate a draft article with a fact-check, social media texts and cover image prompts, and publish the draft as a post in one step.

The scoring and the draft templates are built for cyber-security and technology news with a Czech and European focus. Drafts are always written in **Czech**, whatever the language of the source article. Read the section [Limits](#limits) before you decide whether the module fits your editorial work.

## When you would use it

- Run a news website and want a daily overview of the five stories most worth covering, instead of reading dozens of feeds.
- Prepare a first draft of an article about a security incident with facts separated from unconfirmed claims.
- Get ready-to-copy LinkedIn and Instagram texts for each article.
- Check a draft for factual errors before an editor reviews it.

## How it fits with the rest of the platform

- **Input:** the [RSS feeds](/rss-feed-overview) your organisation follows. The Newsroom has no sources of its own.
- **Output:** a regular post in [Post management](/post-management-overview), placed in one of your [post categories](/post-category-overview).
- **AI usage:** generating drafts and running the pipeline count towards the AI limits of the member who clicks the button.

## Where to find it in the admin

Open **Newsroom** in the main menu of the administration. The **RSS Feeds** button in the top-right corner opens your feed list. The feed list, in turn, shows a badge with the number of each feed's articles on today's shortlist, and every feed detail has a **Newsroom** tab.

## Enabling the Newsroom

There is no separate switch. The Newsroom is enabled as soon as your organisation follows at least one **active** RSS feed. Without one, every AI action ends with this message:

> Newsroom is not enabled for this organisation: follow at least one active RSS feed first.

An organisation can follow up to 50 feeds. When you deactivate a feed, its articles stop entering the shortlist and the AI analysis; drafts already created from it stay available.

## How a story reaches the shortlist

### 1. Collection

The platform fetches each feed on its own schedule, between every 15 minutes and every 5 days, depending on how often the feed publishes and whether recent fetches succeeded. New feeds are fetched more often during their first 7 days.

### 2. Analysis

The AI assistant reads articles from the last 72 hours (up to 200 per run) and records, for each one:

- **Topic type:** incident, vulnerability, regulation, data leak, malware or other.
- **Severity:** low, medium, high or critical.
- **Scope:** global, EU or Czech Republic.
- Whether the threat is **active** and whether it is **confirmed**.
- Vendors, countries, organisations and CVE identifiers mentioned in the article.
- A one-sentence summary of up to 240 characters.

The assistant is instructed to record only what the article states. Each article is analysed once per organisation.

### 3. Scoring

The scores are calculated by fixed rules, not by the AI:

| Score | Range | What raises it |
|---|---|---|
| **Hotness** | 1 to 10 | Higher severity, wider scope, incidents and vulnerabilities, an active threat, a confirmed report, CVE identifiers. |
| **CZ relevance** | 1 to 10 | A mention of the Czech Republic, a mention of the EU, Czech or EU scope. |
| **Topic fit** | 1 to 5 | One point each for: confirmed, a specific topic type, severity medium or higher, a known scope, a CVE or vendor mentioned. |
| **Score** | up to 25 | The sum of the three. |

For example, a confirmed, actively exploited critical vulnerability affecting Czech organisations, with two CVE identifiers, reaches the top of all three scales.

### 4. Shortlist

The platform sorts the candidates by **Score**, then by date, skips duplicates with the same title or URL, and keeps the top five. Each item gets a rank from 1 to 5 and a **selection reason** that shows how it scored, for example:

```text
severity=high • type=leak • hotness=8 • cz=7 • fit=4
```

Click **Run pipeline** to collect due feeds, analyse new articles and build the shortlist for today. Running it again rebuilds the shortlist: items that already have a draft stay, all other items for that day are replaced by a fresh selection.

## Working with the shortlist

Use **Date** to look at another day and **Status** to filter items. The list refreshes every 30 seconds. Each item shows its rank, a topic icon, the title linked to the source, the feed, a severity badge (`Critical`, `High`, `Medium`, `Low`), the four scores and the selection reason.

| Item status | Meaning |
|---|---|
| `Pending` | Selected, no draft yet. |
| `Generating` | A draft is being written. |
| `Generated` | A draft exists; the button changes to **Open draft**. |
| `Dismissed` | You decided not to cover the story. |

Click **Generate article** on a pending item to start a draft. Generation takes 30 to 60 seconds. Click **Dismiss** to grey out a story you will not cover.

## What a draft contains

The assistant fetches the full source page and writes the draft in three passes: it first separates confirmed facts from unconfirmed claims, then writes the article, and finally fact-checks it. The draft page has four tabs:

- **Article.** A title, a perex of two or three sentences (up to 320 characters) and a body with sections on what happened, details and timeline, technical context, impact, current status, and sources. Unconfirmed claims are labelled as such.
- **Thumbnails.** Two text prompts for an image-generation tool, one for a 16:9 web cover and one for a 9:16 story cover, each with an alt-text description. The platform does not create the images; use **Copy prompt** and paste the prompt into your image tool.
- **Social.** A LinkedIn text (500 to 900 characters) and an Instagram text (220 to 330 characters), each ending with a sign-off line that names your organisation. Use **Copy** to take them; nothing is posted to social networks.
- **Fact-check.** Findings grouped into factual errors, falsehoods and recommendations, each with a severity. The fact-check also corrects its own errors and falsehoods directly in the article body. When it finds nothing, the tab shows `Fact-check did not surface any notes.`

| Draft status | Meaning |
|---|---|
| `Generating` | The page checks for the result every 5 seconds. |
| `Ready` | The draft can be published. |
| `Published` | A post has been created from the draft. |
| `Error` | Generation failed; the message is shown on the page and the shortlist item returns to `Pending`, so you can try again. |

**Regenerate** writes a new draft for the same story. Open it again from the shortlist to see the new version.

## Publishing a draft as a post

1. Open a draft in the `Ready` state and click **Create post**.
2. Choose the **Main Category**. If you leave it empty, the first active post category is used.
3. Choose the **Visibility**. The default is `Unlisted`, so an editor can review the post before it goes public.
4. Click **Create post**. The post editor opens.

The post contains the title, the perex, the article, a line with the source link and, below a horizontal rule, an **AI assets** section with the cover prompts and the social texts. The post language is your organisation's primary language and the author is your organisation's default author.

> **Warning.** Delete the AI assets section in the post editor before you make the post public. Choosing `Public` in the publishing dialog makes the post visible immediately, including that section.

## Limits

- Scoring is tuned for cyber-security news with a Czech and European focus. Stories from other fields receive low scores.
- Drafts and social texts are always in Czech.
- The shortlist has five items per day.
- The pipeline, **Generate article** and **Regenerate** count towards the member's AI limits of 30 requests per 10 minutes and 300 requests per day.
- Every draft is a starting point for an editor. Read the article and the fact-check before you publish.

## Related

- [RSS feeds](/rss-feed-overview): the sources the Newsroom reads.
- [Post management](/post-management-overview): where published drafts are edited.
- [Post categories](/post-category-overview): where published drafts are placed.
- [Markdown](/markdown-overview): the format of the article body.

---
id: "0utsc1ABKHCVKqM1"
category: "content/rss-feeds"
tags: []
published_at: "2026-04-24T06:57:28.800Z"
---


RSS feeds
=========

RSS feeds are still a vibrant way to deal with the scattering of content across the internet — industry news, competitor blogs, press agencies, and internal corporate reports all publish their updates through this channel. The `/rss-feed` module therefore serves as a central place where an organization connects all external sources it needs to monitor. Each such source has its own pace and structure, and the module's task is to consolidate them all so that the editorial team doesn't have to open dozens of browser tabs. The downloaded content remains in the system as source data for further processing — typically serving as inspiration, a basis for curatorial work, or input into a subsequent workflow that can turn an RSS item into a full-fledged article in the editorial system, for example.

## RSS Feed Overview

The main table displays all feeds connected by the organization, showing information necessary for ongoing monitoring for each of them. In the row, the administrator will see the source's name and URL, its status (active / inactive), **last synchronization** in a relative format along with the HTTP response code, **number of imported articles** and the date of the newest one, **date of the oldest available article** (useful for estimating coverage history), and the date the feed was added to the system. The table automatically refreshes every 30 seconds, so the result of a currently running synchronization will appear without manual intervention.

### Sorting during bulk synchronization

When initiating bulk synchronization, the system prioritizes feeds that have never been downloaded before — these are processed first to start producing data as quickly as possible. These are followed by feeds with successful last synchronization, and finally feeds with errors. Within a group, the source that was last synchronized earliest is always processed first. Thanks to this schedule, every feed gets its chance after some time, and none of them remain without an update for long.

## Adding a New Feed

The **Add** button in the upper right corner opens a form for entering the URL of a new RSS source and naming it. The module has an interesting optimization when adding: **RSS feeds are shared across organizations**. Upon creation, the system checks if the given URL already exists, and if so, it only creates a new link between the organization and the existing feed, so you connect to already accumulated data. If the URL is not yet in the system, a completely new record is created. In both cases, the feed is activated for the given organization. The first synchronization is not performed automatically — it needs to be started either individually with the **Synchronize this feed** button in the context menu, or by bulk with **Synchronize all feeds** in the top bar. The reason for this caution is that the source might be unavailable at the moment of creation, and this pause gives the administrator time to consider.

> ℹ️ Sharing feeds is intentional and advantageous — if a given source is already in use by someone else in the system, your organization will connect to already downloaded data, saving network traffic and demands on the target server.

## Feed Detail

Clicking on a feed opens its detail with the **Articles** tab, which displays all posts imported from this source. For each article, the title, author, URL, **publication date** taken from RSS, and **discovery date** (i.e., the moment the system first downloaded it) are visible. The difference between these two dates is often useful: the publication date indicates when the source itself published the article, while the discovery date corresponds to when our system learned about it. If an RSS feed is added with a delay, these two pieces of information are significantly different and help understand the temporal context.

## How Synchronization Works

Synchronization is a process in which the system downloads the current content of an RSS address and updates the local database. It begins by downloading the URL with a strict **15-second timeout** — if the source does not respond within that time or returns an error, the system stores the HTTP code and the attempt time, but the content is not changed. When the content arrives successfully, the system calculates its checksum (hash) and compares it with the hash from the last successful synchronization. If the content has not changed since the last time, only the time and HTTP code are updated, and articles are not re-processed at all — this optimization saves computational power during frequent synchronizations of sources that publish irregularly. If the content is new, the system parses it as XML (RSS or Atom — both formats are supported) and processes all items. Each article is identified by its **unique GUID**, or URL if the GUID is missing. New articles are added, existing ones are updated (title, description, author, publication date). An article that is no longer in the new XML (for example, because the source only archives the last ten items) remains in the database — the system does not actively delete history, so that the editorial team has a complete timeline available.

## Supported Formats

The system recognizes and parses two formats. **RSS 2.0** is the classic RSS format with a `<channel><item>` structure, which is a standard for news websites. **Atom** is an alternative format used, for example, by WordPress. For both, the same fields are extracted: title, description or summary, author (including `dc:creator`), publication date, and article URL. Other formats — such as JSON Feed — are not supported.

## Actions on a Feed

The module offers actions in several places that cover routine administration. **Synchronize all feeds** in the top bar initiates a check of all active organization feeds at once — this is a typical action an administrator performs in the morning or as needed. **Synchronize this feed** in the row's context menu updates only one selected feed (useful after adding a new source or when attempting to fix an error). **Delete** removes the feed from the organization — only the link is removed, while the feed record itself may continue to exist for other organizations.

## Error Monitoring

Each synchronization records an HTTP response code, which quickly reveals if something is wrong with the source. **200** means everything went well. **301 and 302** are redirects that the system automatically follows. **403** indicates that the server denied access (often due to User-Agent or IP address restrictions). **404** means the source does not exist and the URL needs to be corrected or the feed deleted. Codes **500, 502, and 503** indicate an error on the source server side, which usually means waiting and trying again later. An empty column means the feed has never been synchronized. If XML parsing fails (for example, due to an invalid format or corrupted content), the system stores the downloaded data in a cache for later analysis but does not add new articles. All such errors are written to an internal log with a warning level, so they can be easily tracked.

## Inactive Feeds

A feed can be deactivated for an organization without being deleted. Inactive feeds are not included in bulk synchronization, remain visible in the list with a gray flag, and their previously downloaded articles are still searchable. Deactivation is suitable wherever a source is temporarily not working and you don't want to repeatedly flood the log with errors, or where a feed has long been producing content that is no longer interesting — yet you don't want to permanently remove it because the history might be useful in the future.

## Duplicate Articles

Articles are identified by a combination of feed and GUID. If different feeds publish the same article (for example, when a website publishes to its own feed and also to an aggregator), the system imports it separately for each feed — duplication is checked only within a single feed. If the source does not provide a GUID, the article's URL is used as the identifier.

> ⚠️ If a source unexpectedly changes its GUID structure (for example, switches to a different identifier format), the system will treat all its articles as new and perform a complete re-import. In such a case, it is recommended to delete the feed and recreate it to keep the history clear.

## Possible Errors During Addition

The system will refuse to add a feed with an empty URL. If the URL does not contain valid RSS or Atom content, the feed will be created, but it will receive an error HTTP code during the first synchronization. The validity of the source is therefore only verified during the first download attempt — for this reason, it is recommended to immediately initiate synchronization after adding a new feed and check the result.

## Utilizing Imported Articles

Imported articles are not automatically converted into the **Posts** module — they remain in the RSS feed table as source data. They can be further processed (e.g., automatically converted into a custom post), but that is a matter of workflow and is not part of this page. An article from RSS is thus a potential raw material, not a finished editorial output.

## Recommended Practices

Several rules prove useful when working with RSS feeds. **Run bulk synchronization regularly** — the frequency depends on the rhythm of the sources; for news servers, several times a day; for corporate blogs, once a day or less is sufficient. **Monitor HTTP codes** — if a source repeatedly shows 403 or 500, it should be checked or deactivated to avoid burdening the system with unnecessary attempts. **Name feeds clearly** — while the system takes the name from the RSS, it may differ from how you internally name the source in the administration. And finally, **do not add feeds with identical content** — this unnecessarily burdens both the system and the source servers.

### Structure of Downloaded Data

Each downloaded article stores a set of metadata that together forms the minimum description required for further processing. This includes the **unique identifier (GUID)** taken from the RSS, the **link URL** leading to the original, the **title**, **description or summary** (depending on the source, this may be an excerpt or full text), the **author** (if the source provides this information), the **publication date** taken from the RSS, and the **discovery date**, which is the moment the system first downloaded the article.

## Security and Protection

Downloading content from external sources carries risks, against which the module defends with several measures. A **fifteen-second timeout** is set for the source's response to prevent synchronization from getting stuck on a slow or non-functional server. The system stores **only article metadata**, not the full HTML content of target pages — that remains accessible only via URL. Furthermore, all synchronization errors are logged with a warning level, allowing them to be tracked in the log overview and the health of the feeds to be regularly monitored.

> ⚠️ If an RSS source requires authentication (e.g., HTTP Basic Auth or login), the system cannot download it. Only publicly available RSS and Atom feeds without an authentication layer are supported.

## Troubleshooting

Several typical problems may recur during module operation that an administrator might encounter. If a **feed does not synchronize**, the first step is to check the HTTP code of the last synchronization — this usually indicates what is wrong. The next step is to open the URL in a browser and verify if it returns valid XML; if so, manually start synchronization and observe the change in the HTTP code. If **articles are not being added** despite successful synchronization, verify that the XML contains either the `<guid>` field or at least `<link>` for each item. Without an identifier, the system ignores the item. Also, check the format — RSS and Atom are supported, others (e.g., JSON Feed) are not. If **articles are duplicating**, the cause is almost certainly that the source changes its GUIDs between synchronizations (generating random identifiers each time the feed is generated). Such sources are not recommended for use, as they inflate the database with non-existent duplicates during each synchronization.

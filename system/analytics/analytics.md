---
id: "zRIztoAOfmWyFnCV"
category: "system/analytics"
tags: []
published_at: "2026-04-24T06:57:24.870Z"
---


Analytics
=========

Every organization needs answers to recurring business questions — how much did we sell this year, which customers are most valuable, how busy are bookings, where is credit accumulating, which emails are opened. The `/analytics` module gathers these answers in one place in the form of pre-prepared reports that refresh without user intervention. Instead of manually downloading data from various parts of the system, management, controlling, and operations receive a quick overview that can be shared via a link or exported for further processing. Analytics are available to all roles that have insight into the given topic — management sees business metrics, IT sees technical reports.
## Introductory Hub
Upon opening the page, the data itself is not displayed, but rather a hub leading to individual reports. The intention is practical: the list of analytics in the system is extensive, and without structured navigation, the user would get lost. Therefore, reports are divided into categories according to thematic area, and at the top, **favorite analytics** are offered — tiles with the most frequently used views, for one-click access.
Categories are clearly separated thematically:
- **Users and Members** — overviews of activity, registrations, and customer base behavior.
- **Bookings and Utilization** — calendar utilization, seasonal trends, resource occupancy.
- **Finance and Revenue** — turnovers, credit, refunds, currency breakdowns.
- **System Performance** — operational metrics of infrastructure and integrations.
- **Emails and Communication** — mailing success, opens, unsubscribes.
> ℹ️ Categories and specific reports are defined centrally at the system level. With each update, new reports relevant to the given organization automatically appear — the user does not need to manually activate anything.
## Dashboard Structure
Each report is built from three building blocks that are assembled automatically. The **header** contains the report name and a brief description of what it covers, making it clear what the user is about to study. The **control panel** below it groups the time range selection, filters, and buttons for refreshing or sharing. The **data table** then forms the actual result — columns are derived from the data structure, and the system chooses the correct display method for each according to its type (currencies according to local conventions, dates in a readable format, numbers with the correct thousands separator).
This consistent pattern has a pragmatic reason: whether you open a report on credits, bookings, or emails, the controls are always in the same places. This eliminates the need to learn each report anew.
## Analytics Detail
Clicking on a tile opens a detail with a fixed layout. Data is loaded in the background and automatically refreshed every 20 seconds — freshness is one of the main benefits, as where traditionally a daily manual export would be necessary, we have a real-time view. In addition to automatic refreshing, the detail offers several control functions:
- **Refresh** — manually force fresh data outside the regular cycle, useful when fine-tuning settings.
- **Share** — copies a link directly to the current view, including all set filters, so the recipient sees exactly what you are currently studying.
- **Column Sorting** — clicking on the header sorts ascending or descending.
- **Text Search** — filters rows by any expression across columns.
> 💡 The link obtained via **Share** retains all filter and time range settings. This is useful, for example, during a meeting — instead of saying "look at report X and set it like this," you just send the URL.
## Time Ranges
Most reports offer a built-in time range selection, as management questions almost always ask "for what period." Presets are designed to cover typical evaluation periods — **today** and **yesterday** for operations, **last 7 days** and **last 30 days** for weekly and monthly reports (30 days is the default value), **last 90 days** for a quarterly view, **this year** for a cumulative overview, and **custom period** for ad-hoc queries.
> ⚠️ Some reports work with a fixed period (e.g., aggregation for the last fiscal year or metrics for a closed quarter) and do not allow time range selection. In such a case, the control element is hidden, and the data refers to a fixed interval defined by the report.
## Filtering
Beyond the time range, specific reports may include additional filtering axes — typically **segmentation** (branch, channel, project), **entity type** (e.g., restricting to only invoiced customers or only canceled bookings), or **currency** for reports with a multi-language or multi-market dimension. All filters are stored in the URL, so the view can be shared via a link or saved to browser bookmarks and returned to later in the same form.
## Favorite Analytics
Tiles on the home page marked as favorites are highlighted to keep the most important reports at hand. This is a centrally maintained list — the designation comes from the system configuration, not from individual user settings. Typically, this includes metrics that form the basic management view of the organization: customer credit overview, monthly turnover, pending refunds.
> 💡 If you are missing a favorite report that you regularly use, please tell your system administrator. The addition is central and can be used by the entire organization.
## Sharing and Export
In addition to the link, a report can also be exported outside the system. **Export** downloads the results to a file (usually CSV), which opens in a spreadsheet program for further processing — for financial analysis, presentations, or archiving. **Print** prints the page in an optimized format suitable for a meeting where it's more convenient to have reports on paper. Both methods respect the current filter and sorting, so exactly what is visible in the table is exported.
> ℹ️ The export format is governed by the current filter settings. So, if you first filter the data and then initiate an export, you will only download the filtered rows — not the entire dataset.
## Automatic Refresh
The refresh strategy differs depending on the page level. The overview page with categories and tiles does not refresh — its content is static and loads with each opening. The report detail, on the other hand, refreshes data every 20 seconds to reflect reality. For very long calculations (weekly aggregation over millions of records), the system displays a loading indicator, and the report appears as soon as it is available; in practice, this can take tens of seconds, in extreme cases minutes.
> ⚠️ If you still see the same data even after pressing **Refresh**, the report likely uses an intermediate calculation with a longer validity (typically an hour to a day), and fresh data will only appear after the next scheduled update. In such a situation, the correct response is to wait, not to repeatedly initiate a refresh.
## Localization
Analytics respects the user's language and regional preferences. Column names and button labels are displayed in the user's language, currencies and numbers are formatted according to regional settings, and dates respect the organization's time zone. As a result, a German-speaking colleague sees the report in their language version, while management in Prague opens the same view in Czech — the data is the same, only the labels and formats adapt.
> 💡 To compare the same data in two language versions, simply open the view in two browser windows with different settings. Reports are always generated fresh according to current preferences, so differences are immediately visible.

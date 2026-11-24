---
code: "board-overview"
category: "communication"
tags: ["type-overview", "board", "team"]
published_at: "2026-11-24T00:00:00.000Z"
---


Board
=====

The **Board** is the internal wall of your organisation. It is the first page you see after you sign in to the administration, with the subtitle *What is happening in the organisation*. Members publish short posts with photos or files, colleagues react and comment, and managers publish announcements that everyone has to confirm as read. Around the wall, the page shows your own day: calendar events, assigned issues and the colleagues who are online.

The Board is visible only to members of your organisation. Customers never see it, and posts are not available through the public API.

## When you would use it

- Share news that does not need a reply in a chat: a new colleague, a finished project, a photo from a trade fair.
- Publish a rule change that every employee must confirm, for example a new returns procedure, and see who has not read it yet.
- Address an announcement to one department, for example only the warehouse team.
- Pin an important post to the top of the wall for a few days.
- Start your day with one view of your calendar, your issues and recent activity in the organisation.

## How it fits with the rest of the platform

- **[Team chat](/team-chat-overview)** is for conversations; the Board is for posts that the whole organisation, or a whole department, should see.
- **[Issues](/issue-overview)** and the **calendar** feed the side cards of the Board.
- **[Team](/team-overview)** defines the departments used as announcement audiences and the members who appear in the presence card.
- Some posts are published automatically by the platform, for example a kudos one colleague gives to another, or a periodic organisation report.

## Where to find it in the admin

Click **Board** in the main menu, or the logo, to open the start page. A single post opens on its own page when you click its date; use this link to point a colleague to one specific post.

## Writing a post

1. Click into the box with the text *What's new?*.
2. Write the post. Posts support Markdown and can be up to 10,000 characters long; a counter appears when you are 200 characters from the limit.
3. Optionally attach files with **Attach a file** or drag them onto the box. A post can carry up to 20 attachments.
4. Click **Publish**.

The post appears at the top of the wall for all colleagues. Older posts load with **Load older** at the bottom of the wall.

You can **Edit** and **Delete** your own posts from the post menu. Deleting removes the post for everyone and cannot be undone. You cannot edit or delete a colleague's post.

## Reactions and comments

Each post offers four reactions: **Like**, **Celebrate**, **Thanks** and **Question**. Use **Question** to signal that something in the post is unclear without writing a comment. The line *Reacted:* under the post shows who reacted.

Comments can be up to 4,000 characters long. Use **Reply** under a comment to answer it directly. You can edit and delete your own comments; an edited comment shows the label *edited*. The wall shows the newest comment of each post; **Show all comments** opens the full thread.

## Pinned posts

Root members of the organisation can **Pin to top** any post. A pinned post carries the **Pinned** badge and stays above newer posts until a root member clicks **Unpin**.

## Announcements with read confirmation

An announcement is a post that its audience must confirm as read. Only members with the permission to manage members can publish announcements.

1. Write the post as usual.
2. Turn on **Announcement with read confirmation**.
3. In **Who the announcement is for**, keep **Whole organisation** or pick a department. A department includes all of its sub-departments.
4. Click **Publish**.

An announcement is pinned automatically. Every member of the audience sees an **I have read it** button under the post and a card *Announcements to confirm* on the Board until they confirm. Blocked members are not part of the audience.

The post shows the progress, for example *12 of 15 confirmed*. The author and members who manage members can open **Read confirmations** to see two lists: *Confirmed* and *Waiting for confirmation*. Other members see only the progress.

> **Note.** A confirmation cannot be taken back. If the content of an announcement changes materially, publish a new announcement rather than editing the old one, so that every reader confirms the new version.

## Automated posts

Not every post comes from a colleague. The author line tells you the source:

| Label | Source |
|---|---|
| **Post** | A member of your organisation. |
| **System** | An event recorded by the platform. |
| **Bot** | A recurring automated summary, for example a periodic organisation report. |
| **Agent** | A result produced by the AI assistant. |

Posts marked **ROOT** are operator digests. They are shown only to root members of the organisation; other members do not receive them.

## Side cards

The cards next to the wall give you a personal overview:

- **My day** lists today's calendar events and the issues assigned to you. Private events of colleagues show only as *Private event*.
- **My month** compares the number of your posts, comments and reactions with the previous month.
- **Active colleagues** shows who is online now, who was active in the last 4 hours and how many members the organisation has. A flame badge marks members who hold the root permission.
- **Happening now** lists recent activity, such as new orders and issues, and refreshes every 20 seconds.
- **Issues** shows your open requests and other open issues in the organisation, with counters for *New*, *In progress*, *Waiting* and *Done*.

If you are the only member of the organisation, the presence card offers **Invite a teammate** instead.

## Related

- [Team chat](/team-chat-overview): conversations in rooms and direct messages.
- [Team](/team-overview): members, departments and permissions.
- [Issues](/issue-overview): the requests shown in the side cards.
- [Notifications](/notifications-overview): how the platform informs you about events outside the Board.

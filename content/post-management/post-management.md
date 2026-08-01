---
id: "d4i21CrECN9V2yKs"
category: "content/post-management"
tags: []
published_at: "2026-04-07T15:18:08.877Z"
---


Post Management
===============

The `/post` page is used for managing articles, categories, and comments. It is divided into three tabs: **Posts**, **Categories**, and **Comments**.
## Posts Overview
The main tab displays a table of all posts with the following information:
- Thumbnail image
- Post title with favorite indicator (star)
- Main category
- Author
- Visibility (public, private, unlisted, for subscribers)
- Number of comments
- Publication date (relative format)
For each post, colored labels (tags) and language translations with flags (🇨🇿 🇬🇧 🇵🇱 🇸🇰) are displayed. A green flag means translated, a grey flag means missing translation. Deleted posts are marked with a red "Deleted" label.
The table automatically refreshes every 20 seconds.
### Context Menu (right-click)
- **Automatic Translation** — translates the post into all missing languages
- **Delete** — soft-deletes the post with a confirmation dialog
- **Restore** — restores a deleted post
## Creating a New Post
The **Add** button in the top right corner opens a form with the following fields:
- **Post Title** (required)
- **Content** — markdown editor (required)
- **Main Category**
- **Language**
- **Visibility** — public / private / unlisted / for subscribers
After creation, the detail page of the new post opens automatically.
## Post Detail
Clicking on a post opens its detail page, divided into four tabs.
### Content
**Main Editor (left column):**
- Post Title
- Excerpt / Summary
- Content in markdown editor
- Star to mark a favorite post
**Sidebar (right column):**
- Internal Post ID (read-only)
- Visibility
- Main Category with **AI Suggestion** button — the system analyzes the content and suggests a suitable category
- Post Authors (multiple author selection)
- Publication Date (date and time selection)
- Creation Date (read-only)
- Tags
- Translation Status with automatic translation button
- Button to delete the post
Changes are saved with the **Save** button.
### Gallery
Managing post images:
- **Upload Image** — file selection field (images only)
- **Thumbnail Grid** — display of all uploaded images
- **Set Main Image** — marking an image as the thumbnail
- **Change Order** — by dragging (drag & drop)
- **Delete Image**
- **Lightbox** — clicking on an image opens a full-screen viewer with navigation
### Tags
Managing tags assigned to the post:
- **Assigned Tags** — colored chips with a remove button
- **Available Tags** — list of unassigned tags with an add button
- **New Tag** — form for creating a new tag (name, code, color)
- Changes are saved with the **Save** button
### Routing
Setting the post's URL address (slug).
## Comments
The **Comments** tab displays an overview of all comments across posts:
- Post title (link)
- Comment author
- Author's email
- Comment text
- Status (active / deleted)
- Date
Comments can be deleted via the context menu with a confirmation dialog.
## Categories
The **Categories** tab is used to manage the hierarchical structure of post categories.
## Multilingual Content
If the system is configured for multiple languages:
- In the post detail, the language of the edited content can be switched
- Translation status is visualized with color-coded flags
- The **Automatic Translation** function translates content into all missing languages (available in both the list and detail views)

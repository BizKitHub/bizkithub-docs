---
id: "aZ0ryTFiDVWHdBem"
category: "communication/email-layouts"
tags: []
published_at: "2026-04-24T06:57:26.255Z"
---


Email layouts
=============

The `/emailer-layout` page is used to set the general appearance — the so-called layout — of all outgoing emails. A layout is a framework into which the content of individual messages is inserted. It typically contains a header with a logo, body border, and a footer with contact and legal information. By separating the layout from individual templates, you achieve a consistent visual across all communication. You set up a single header and footer once, and it will automatically be used by all transactional emails and newsletter campaigns.

## What is a layout

A layout is an HTML document with one required placeholder `htmlBody`, where the system inserts the body of a specific message (e.g., an order confirmation) when sending. Everything else in the layout — header, margins, fonts, colors, footer — remains the same. Simply put:

```
<layout>
<header> <!-- logo, navigation -->
{{htmlBody}} <!-- the email content will be inserted here -->
<footer> <!-- footer with contacts and unsubscribe -->
</layout>
```

The resulting sent message is thus a combination of *layout* (global) + *template* (specific event) + substituted *variables* (customer data).

## Editor and preview

The page offers two modes:

- **Edit** — editing the HTML code of the layout and the footer text in two separate fields.
- **Preview** — a live preview where the system inserts sample message content into the layout. You immediately see how the final email will look.

A switch at the top allows you to toggle the preview between **desktop** (standard monitor width) and **mobile** (narrowed width) display. It is always necessary to check the email's appearance in both modes — most recipients read mail on their phone.

> 💡 Many email clients (Outlook, Gmail in various versions) do not fully support modern CSS. For a reliable appearance, traditional table-based HTML and inline styles are proven effective.

## Available variables

The following variables can be used in the layout:

- **`htmlBody`** — a mandatory placeholder where the content of a specific message is inserted. A layout without this variable would prevent any email from being displayed.
- **`logoUrl`** — the URL address of the organization's logo. An image uploaded in the storage module will be automatically propagated here.
- **`footer`** — footer text (HTML). Used for contact details, legal clauses, social media links, and the mandatory unsubscribe link for marketing messages.

A detailed description and an example value are displayed for each variable in the editor.

## Organization logo

The logo is uploaded as an image to storage and then linked to the layout using the **Set Logo** function. The system checks that the file is an image (does not allow PDF, documents, executable files) and saves the URL to the configuration. Once saved, it is automatically propagated to the `logoUrl` variable for all future sent messages.

> ℹ️ The recommended logo size is around 200×60 pixels; larger dimensions cause slow loading, and they will be resized anyway in mobile clients. Prefer PNG with a transparent background.

## Email footer

The footer is common text placed at the end of each message. It usually contains:

- **Organization name and address** — required in many jurisdictions (Company ID, registered office).
- **Contact information** — technical support email, phone.
- **Social media links** — icons or text links.
- **Link to terms and conditions / privacy policy**.
- **Unsubscribe link** — for marketing campaigns, a machine-recognizable unsubscribe link is also automatically added to the footer (the system adds it separately).

You can write the footer as pure HTML. When sending, it is saved to the `footer` variable and inserted into the layout at the appropriate place.

## Saving changes

The **Save** button saves both fields — layout and footer. Changes will apply to all emails sent **after** saving. Messages already in the queue carry a snapshot of the previous version and will be sent with the original appearance.

> ⚠️ Before saving a significant change, we recommend sending a **test message** (function available from the **Email Templates** page — "Send test email" button). This verifies that the layout correctly wraps the content of a specific template and that all variables are working.

## Template testing

Although the Email Layouts page itself offers a live preview with sample data, you can test actual delivery to the inbox as follows:

1. Open any template in the **Email Templates** module.
2. Use the **Send test email** action.
3. The message will arrive at the address of the currently logged-in user with the wrapped layout.

If the test does not arrive, the problem may be in the SMTP configuration (see **Emailer** module — System Status), not in the layout.

## Fullscreen mode

The button to enlarge the editor switches the field to full-screen mode. In this mode, you have more space to work with HTML, and you can see both the editing and the preview side-by-side. Exit the mode with the minimize button or the **Esc** key.

## Tips for a well-functioning layout

- **Maximum width 600 px** — a safe value for most email clients.
- **Fallback font** — in addition to the main font, specify a system font (Arial, Helvetica, sans-serif). Many clients do not load custom webfonts.
- **No JavaScript** — email clients ignore or block JS.
- **Inline styles** — styles placed directly on elements are more reliable than classes in `<style>`.
- **Alt text for images** — if image loading is disabled, the recipient will at least see a text description.

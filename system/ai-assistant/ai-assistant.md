---
code: "ai-assistant"
category: "system"
tags: ["type-overview", "ai", "permissions"]
published_at: "2026-11-24T00:00:00.000Z"
---


AI assistant and agents
=======================

BizKitHub includes AI features that read your organisation's data and help you answer questions, draft replies and route work. This article explains each of them: the built-in assistant **Kit**, your own external AI agent connected to the organisation, the AI support for tickets, and the shared organisation context. It also explains what data each feature can see, where you see what AI costs, and how to switch the features off.

The rule that applies everywhere: **AI never sees more than the member who uses it.** The assistant and connected agents work with the permissions of the member who started them, and nothing the AI drafts is sent to a customer until a person confirms it.

## The built-in assistant (Kit)

Kit is a chat window available in every module. Open it with **Chat with Kit** in the applications menu, with **Ask Kit** in the search, or with the keyboard shortcut listed under **Keyboard shortcuts**.

Ask in plain language, for example:

- "Show me the order status for the last 30 days."
- "How much do customers owe us? Summarise the invoices past their due date."
- "We have 14 open tickets. Which are the oldest and still without a reply?"
- "Where did new contacts come from this month?"

While Kit works, the chat shows each step, for example **Browsing orders** or **Loading invoice**, so you can see which data it is reading.

### What Kit can see

Kit reads orders, invoices, contacts, products, calendar events, e-mails, issues, files in Drive, the activity history, dashboard statistics, organisation settings and the documentation. Each source requires the same permission as the module itself. A member without the **Contacts** permission gets a Kit that cannot look up contacts; a Root member gets a Kit that can read everything. See [Members, roles and permissions](/team).

### What Kit can do

In the chat, Kit **only reads data**. It does not change records. When an action makes sense, Kit prepares a draft and you decide:

- **E-mail**: Kit proposes an e-mail with recipients, subject and text. Nothing is sent until you click **Confirm and run**. The proposal is valid for a limited time, and Kit warns you when a recipient is not one of your contacts.
- **Task for your organisation**: Kit drafts an issue for your colleagues. It appears in issues only after you click **Create task**.
- **BizKitHub support ticket**: Kit drafts a ticket for BizKitHub support. Support receives it only after you click **Send to support**.

When you ask Kit to change something, it does not make the change. It answers in one of these ways:

- **Where to do it yourself.** Kit finds the right page in the admin, links it and lists the steps from the documentation. This is the usual answer for a single edit, such as an address, a status or a price.
- **Your own AI agent.** For bulk edits, imports, cleanups and recurring work, Kit shows a card with the task already described. **Connect AI agent** on the card opens the connection dialog with that task included in the prompt. See [Connecting your own AI agent](#connecting-your-own-ai-agent).
- **A ticket.** Only when a person has to act: BizKitHub support for things only the BizKitHub team can do (recovering deleted data, a migration from another system), or a task for a colleague when you do not have the permission yourself.

You can rate each answer as helpful or not helpful.

### Conversations

Kit keeps your conversations, and only you see them. In the chat window header:

- **New chat** starts an empty conversation. The previous one stays in the history. The keyboard shortcut is Ctrl+Shift+O (Cmd+Shift+O on a Mac).
- The **history** button opens the list of your chats, grouped by date, with search. Click a chat to continue it. Each chat can be renamed or deleted.
- **Delete this chat** in the ⋮ menu deletes the open conversation and starts a new one. A deleted chat cannot be restored.

### Limits

Each member can send a limited number of AI requests within a short window and within a day. When the limit is reached, Kit answers "Too many requests. Please wait a moment and try again." The limit is per member, so one colleague hitting it does not affect others.

## Connecting your own AI agent

For larger tasks you can connect an AI client that runs on your own computer, such as an AI coding assistant. Unlike Kit, such an agent works across the whole BizKitHub API, can change data and uses your own AI subscription. That makes it the right tool for bulk operations (repricing hundreds of products, merging duplicate contacts, importing orders from a spreadsheet) and for automating routine work across the company.

1. Open the user menu and choose **Connect AI agent**.
2. Click **Copy prompt**. The platform creates a dedicated access credential for this organisation and copies a ready-made prompt that contains it. When you open the dialog from a Kit card, the prompt also contains the task Kit described.
3. Paste the prompt into your AI client. On first use the client asks whether it may use the key; confirm it.

The credential:

- works only inside the organisation where you created it,
- carries your own permissions, so the agent can do exactly what you can do,
- is valid for 30 days; after that, generate a new prompt,
- is replaced when you copy a new prompt, so only one agent is active at a time,
- stops working when you sign out of the browser, when you click **Disconnect active agent**, or when your membership is blocked.

Every action the agent performs is recorded in the activity history under your name.

## AI in tickets

AI supports the issues module in several ways:

- **Assignment.** New tickets are assigned to the member whose description matches the topic. Fill in each member's AI description under **AI ticket assignment settings** in the issues module (or on the member's profile), for example "Handles invoicing and payment complaints." Members with an empty AI description are never picked.
- **AI summary.** Each ticket can carry a short machine-generated summary of its description. It cannot be edited by hand.
- **Draft an AI reply.** On a ticket detail, this button reads the ticket, the reporter's own profile, their orders and previous tickets, and the internal knowledge base, then leaves one **internal** draft reply as a comment. The customer never receives it by e-mail, and the ticket status, priority and assignee do not change. A member reviews the draft and decides whether to send a public reply. Tickets flagged as spam, as human-only, or already closed are skipped.
- **Confirmation e-mails.** For tickets from your contact form, and for e-mails recognised as a support request, the platform can send the reporter a short AI-written confirmation that the ticket was received.

### AI agent runs

Each run of the ticket agent is recorded in **AI agent runs**. The list shows the status (**Running**, **Succeeded**, **Failed**, **Cancelled**), the agent, the subject, the parent run, the duration and the start time. **Only runs without a parent (top-level)** hides the steps a run delegated to other agents. The detail of a ticket run offers a re-run, which creates a new run and keeps the original as a historical record.

Automatic agent runs on every new ticket are an early-access feature that is off unless it has been enabled for your organisation. The **Draft an AI reply** button works regardless.

## Organisation context

**Settings → AI → Organisation context** holds shared notes for AI: short facts, rules and procedures every colleague's agent should know, for example "Invoices are due in 14 days; orders from Slovakia ship on Mondays." Kit and every connected agent load these notes when they start, and connected agents can add new findings themselves, so what one member's agent learns becomes available to the team. Notes can be pinned to the top and viewed as one document. Do not store passwords, API keys or sensitive personal data here.

## AI spend

**Settings → AI** shows what AI costs your organisation:

- **Usage** lists each AI request with the prompt, the answer, the number of tokens, the estimated cost and who paid for it. Summaries cover the last 24 hours, 7, 30 and 365 days. Click a row to see the full prompt and answer.
- **Analytics** breaks spend down by payer and by day for the last 30 days, lists the ten most expensive requests and groups similar requests into templates, so you can see which kind of question costs the most.
- **Pricelists** shows the current price per million tokens for each AI model available on the platform, in your organisation's default currency.
- **Providers** lets you add your own AI provider keys. When a key is set, requests through that provider are billed to your organisation by the provider; without a key, the platform's shared access is used. The **Payer** column in **Usage** shows which of the two applied to each request.

AI tokens are also one of the metrics on the [Usage and plan limits](/usage) page.

## Switching AI off

- **Kit** runs only when a member asks it something. Close the chat window and it does nothing.
- **A connected agent**: click **Disconnect active agent** under **Connect AI agent**, or sign out. Blocking a member disconnects their agent too.
- **AI confirmation e-mails to ticket reporters**: turn off **Automatic AI ticket processing** in **Settings → Notifications**.
- **AI assignment of tickets**: leave the members' AI descriptions empty.
- **A single ticket**: flag it as human-only, and the ticket agent skips it.
- **Access for one member**: AI features can only reach the modules the member has permission for. Remove a permission and the AI loses access to that data for that member.

## Related

- [Members, roles and permissions](/team)
- [Usage and plan limits](/usage)
- [Settings](/settings-overview)
- [Security](/security-overview)

---
code: "conversations-overview"
category: "communication"
tags: ["type-overview", "conversations", "ai", "api"]
published_at: "2026-11-24T00:00:00.000Z"
---


Conversations
=============

The **Conversations** module is the archive of every AI and customer chat thread in your organisation. Each thread keeps its messages in order, together with the author role, token usage and any problem flags. Threads come from three places: the AI assistant in the administration, chat widgets or apps that you connect through the public API, and threads an operator creates by hand.

Use the module to read what customers asked your chatbot, to find questions it could not answer, and to measure how much AI usage each thread consumed. Team chat between colleagues is a separate module and never appears here; see [Team chat](/team-chat-overview).

## When you would use it

- Review the questions customers asked the chatbot on your website during the last week.
- Find threads the chatbot flagged as unanswered, so you can see which questions your website or bot does not cover yet.
- Open every thread of one customer from the contact filter before you reply to a complaint.
- Record a chat from another system (for example a mobile app) through the API so all customer conversations live in one place.
- Check how many tokens a long thread used before you change the size of your AI plan.

## Where to find it in the admin

Open **Communication → Conversations**. The list refreshes every 10 seconds, so a thread that is in progress on your website appears without a manual reload. Click a thread title to open its detail.

## Core concepts

### Conversation kinds

| Kind | Label in the admin | What it holds |
|---|---|---|
| AI | `AI chat` | A thread between a person and the AI assistant. Each question is followed by the assistant's answer. |
| External | `External` | A thread recorded by an outside system, for example a chat widget that already has its own answering logic. BizKitHub stores the messages but does not answer them. |

### Source

The **Source** column tells you where a thread came from. Threads started from the AI assistant in the administration show `admin`. Threads created through the public API show `api` unless the integration sends its own short label (up to 32 characters, for example `web-widget` or `mobile-app`). Use distinct source labels per channel so you can filter and compare them later.

### Message roles

Every message carries a role, shown as a small label above the message bubble:

| Role | Label | Meaning |
|---|---|---|
| `user` | User | The person asking, typically a customer or a website visitor. |
| `member` | Operator | A member of your organisation writing into the thread. |
| `assistant` | Agent | The answer of the AI assistant or of your own bot. |
| `system` | System | An instruction or notice that is part of the thread but not written by a person. |
| `tool` | Tool | The output of a tool the assistant used while answering. |

Messages from the user and from operators are aligned to the right; all other roles are aligned to the left. Message text is rendered as Markdown, so lists, links and code blocks keep their formatting.

### Problem flags

A conversation can be marked as **problematic**. This is how a chatbot reports that it could not answer a question. There are two levels:

- **Problematic conversation.** The whole thread is flagged. The list shows a red icon and a red title. The flag can be set and cleared again, for example when a later answer resolves the question.
- **Problematic message.** One single answer is flagged. The list shows an amber warning icon next to the title, and the message itself is framed in red with a `Problematic message` badge. A message flag is permanent and cannot be removed.

Flags are set by the integration that records the thread, not by the AI assistant in the administration.

## Working with the conversation list

The list has these columns: **Title**, **Kind**, **Source**, **Contact**, **Model**, **Messages**, **Tokens** and **Last activity**. It is sorted by the most recent activity, 50 threads per page.

- **Search.** The full-text box matches the conversation title.
- **Filter by kind.** Choose `All`, `AI chat` or `External`.
- **Filter by contact.** The menu lists only contacts that own at least one thread, ordered by activity, with the number of threads in brackets, for example `Jane Novak (12)`.

The **Contact** column links to the contact detail when the thread was started by a logged-in customer. Anonymous threads show a dash. The **Model** column shows the identifier the integration reported for the AI that answered; it is informational only.

## Conversation detail

The detail page has two sections.

**Metadata** shows the kind, source, model, contact, external user, message count and total tokens. The **External user** field is the reference your integration used to identify an anonymous visitor (for example a session token), up to 64 characters. You can rename the thread in **Conversation title** and confirm with **Save title**. New AI threads are titled automatically after the first question, shortened to 80 characters.

**Messages** shows the full thread. Below each message you see its token count when the integration reported one. When the assistant used tools while answering, a collapsible line such as `2 tool calls` reveals the name, input and result of each call. Use it to understand why an answer looks the way it does.

At the bottom of the detail you can write a message and press **Send** (or `Ctrl+Enter`, `Cmd+Enter` on a Mac):

- In an **AI chat** thread, your text is sent as a new question and the AI assistant's answer is appended right below it.
- In an **External** thread, your text is appended as an operator message. Nothing is sent to the customer automatically; the external system decides whether to display it.

## Creating and deleting conversations

Click **New conversation**, enter a **Title**, pick the **Conversation kind** and confirm with **Create**. The admin opens the new thread so you can write the first message.

To delete a thread, use **Delete** in the row menu of the list or in the page menu of the detail. A deleted thread disappears from the list and from the API, but it is marked as removed rather than erased.

## Recording conversations through the API

Integrations use the public API with an [API key](/api-key-overview). All endpoints live under `https://api.bizkithub.com/api/v1/chat/` and are listed in the [API explorer](/swagger).

| Method and path | Purpose |
|---|---|
| `GET /chat/room` | List threads, newest activity first. Filters: `kind`, `source`, `externalUserRef`, `contactExternalId`, `q` (title search), `limit` (1 to 200, default 50), `offset`. |
| `POST /chat/room` | Create a thread. Returns its 24-character `id`. |
| `GET /chat/room/{id}` | Read a thread with all its messages. |
| `POST /chat/room/{id}/message` | Append one message. |
| `POST /chat/room/{id}/title` | Rename a thread (1 to 200 characters). |
| `POST /chat/room/{id}/problem` | Set (`true`) or clear (`false`) the conversation-level problem flag. |
| `DELETE /chat/room/{id}` | Delete a thread. |
| `POST /chat/ai-turn` | Ask the AI assistant one question; stores the question and the answer in one call. |

### Example: record a widget conversation

Create the thread first. Pass `contactExternalId` when the visitor is a logged-in customer, so the thread appears on the contact; an unknown contact ID is ignored and the thread is created without an owner.

```bash
curl -X POST "https://api.bizkithub.com/api/v1/chat/room?apiKey=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"kind":"external","title":"Delivery question","source":"web-widget","externalUserRef":"visitor-7f3a91"}'
```

```json
{ "id": "ZUiVZuKwAaXNoT4nGUbnKR75" }
```

Then append each message as it happens. The `role` defaults to `user`.

```bash
curl -X POST "https://api.bizkithub.com/api/v1/chat/room/ZUiVZuKwAaXNoT4nGUbnKR75/message?apiKey=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"role":"assistant","content":"I could not find the delivery time for this product.","markProblematic":true}'
```

```json
{ "state": "ok", "id": "Qm7XcR2pLk9sVb4NtY8wHe1A", "position": 2 }
```

The optional fields `inputTokens`, `outputTokens`, `model` and `toolCalls` fill the token counts, the model label and the tool-call panel in the admin.

### Example: let BizKitHub answer

`POST /chat/ai-turn` sends a `question` to the AI assistant and returns its `answer`. Omit `roomId` to start a new thread; pass the returned `roomId` in the next call to continue it.

```bash
curl -X POST "https://api.bizkithub.com/api/v1/chat/ai-turn?apiKey=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"question":"What are your opening hours on Saturday?","source":"web-widget"}'
```

```json
{
  "roomId": "ZUiVZuKwAaXNoT4nGUbnKR75",
  "userMessageId": "Hk2LpQ9rTz4XcV7bNm1sWe3D",
  "assistantMessageId": "Pa8YtR3kLm6QwE2zXc9vBn4F",
  "answer": "On Saturdays we are open from 9:00 to 13:00."
}
```

### Errors

When a thread ID does not exist in your organisation, the endpoints that take `{id}` return HTTP 200 with an error envelope instead of data:

```json
{ "state": "error", "message": "Room \"ZUiVZuKwAaXNoT4nGUbnKR75\" not found.", "code": 200 }
```

Check `state` before reading the response. A deleted thread also returns this error.

## Related

- [Team chat](/team-chat-overview): real-time chat between members of your organisation.
- [Knowledge base](/knowledge-base-overview): the notes the AI assistant in the administration consults when it answers.
- [Contacts](/contact-overview): the customer records that own conversations.
- [API keys](/api-key-overview): how to create the key the integration uses.

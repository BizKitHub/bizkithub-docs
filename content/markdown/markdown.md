---
id: "5dKmxfPZpM9x67j3"
code: "docs-migration-markdown"
category: "content/markdown"
tags: []
published_at: "2026-07-26T18:33:18.465Z"
---


Markdown
========

## What Markdown is

Markdown is a lightweight plain-text formatting syntax that converts cleanly to HTML. It is readable in a plain editor and unambiguous when rendered.

## Headings

```
# H1
## H2
### H3
#### H4
##### H5
###### H6
```

Reserve a single H1 per document. Content fields that already render a title heading should start their body at H2.

## Text emphasis

| Syntax | Result |
|--------|--------|
| `**bold**` | Bold text |
| `*italic*` | Italic text |
| `~~strikethrough~~` | Strike-through text |
| `` `inline code` `` | Inline code |

## Lists

Unordered:

```
- First item
- Second item
- Third item
```

Ordered:

```
1. First step
2. Second step
3. Third step
```

Task lists:

```
- [ ] Not done
- [x] Done
```

## Links and images

```
[Link text](https://example.com)
![Alt text](https://example.com/image.png)
```

Reference-style links keep long URLs out of the body:

```
[Docs][docs]

[docs]: https://docs.bizkithub.com
```

## Blockquotes

```
> Multi-line quotes and callouts use a leading ">".
> Consecutive quoted lines join into one block.
```

## Code blocks

Fenced code blocks preserve indentation and can specify a language for syntax highlighting.

````
```ts
const hello = 'world';
```
````

## Tables

```
| Column A | Column B |
|----------|----------|
| Cell     | Cell     |
```

## Horizontal rules

Three or more dashes on their own line render as a divider:

```
---
```

## Cheatsheet

| Element | Syntax |
|---------|--------|
| Heading | `# Heading` |
| Bold | `**text**` |
| Italic | `*text*` |
| Link | `[title](url)` |
| Image | `![alt](url)` |
| Unordered list | `- item` |
| Ordered list | `1. item` |
| Inline code | `` `code` `` |
| Code block | Triple backticks |

## Best practices

- Keep paragraphs separated by a blank line.
- Prefer reference-style links for URLs that appear more than once.
- Use fenced code blocks with a language tag so highlighting is deterministic.
- Keep tables narrow — most rendered surfaces cap width around 900 pixels.

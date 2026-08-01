---
id: "nz0KkmDgE1uDc1TI"
category: "developers/viki-tron-bot"
tags: []
published_at: "2026-07-24T19:26:33.987Z"
---


VikiTron Bot
============

VikiTronBot is the public-internet crawler behind [VikiTron](https://vikitron.com). It continuously visits websites to build the technical record VikiTron opens as free tools and a public JSON API — DNS records, TLS certificates, IPs, subdomains and `robots.txt` files.

## Identification

- **User-Agent:** `VikiTronBot/1.0 (+https://vikitron.com/bot)`
- **Contact for webmasters:**
    - `abuse@bizkithub.com` — DMCA and abuse reports
    - `support@bizkithub.com` — technical questions
- **IP ranges:** will be published on this page. We recommend whitelisting at CIDR level once ranges are announced.

## Crawling policies

VikiTronBot respects `robots.txt`, `noindex` and `nofollow` directives.

### Crawl politeness

- Adaptive speed, default 1–2 requests per second per host
- Considers response time and error rates before increasing pressure
- Exponential backoff with a maximum of 3 retry attempts

### Freshness

- Key pages are checked more frequently
- Multi-tier schedule based on how often each source changes

## Collected data

**We collect**

- DNS records (public zones only)
- `robots.txt` files
- Certificates from the TLS handshake
- Public HTTP metadata (headers, status codes)
- Certificate Transparency log excerpts
- Reverse DNS data

**We do NOT store**

- Content behind authentication
- Personal data submitted through forms

## Opt-out and restrictions

### Block VikiTronBot in robots.txt

```
User-agent: VikiTronBot
Disallow: /
```

### Reduce crawl rate

Use the `Crawl-delay` directive.

### Protect sensitive directories

Combine `Disallow` with server-side rules (401/403) so blocked paths cannot be reached even if a client ignores `robots.txt`.

### Test your robots.txt

You can validate how VikiTronBot interprets your rules with the [Robots.txt Checker](https://vikitron.com/robots-txt-checker) on vikitron.com.

## Bot verification

VikiTronBot sends `From:` and `User-Agent` headers as documented under Identification above.

On request, we can fetch a verification token from a well-known URL on your domain, for example:

```
https://example.com/.well-known/vikitron-verify.txt
```

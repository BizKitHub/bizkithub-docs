---
id: "koORQ3HzrP7YZu8V"
category: "developers/rate-limiting"
tags: []
published_at: "2026-07-24T19:26:28.827Z"
---


Rate limiting
=============

Fair usage policies ensure optimal performance for all users. Learn how rate limits work and implement graceful handling in your applications.

## Overview

- **Sliding window** — Rate limits use a sliding window algorithm for smooth, predictable throttling without sudden resets.
- **Burst allowance** — Handle traffic spikes with burst limits that allow short-term usage above your base rate.
- **Per API key** — Limits are applied per API key, allowing you to distribute load across multiple keys if needed.

## Rate Limits by Plan

Choose a plan that matches your application's needs. Upgrade anytime as your usage grows.

<table>
<thead>
<tr><th>Plan</th><th>Requests</th><th>Period</th><th>Burst Limit</th><th>Features</th></tr>
</thead>
<tbody>
<tr><td>Free</td><td>1,000</td><td>per hour</td><td>50</td><td>Basic API access, community support, standard endpoints</td></tr>
<tr><td>Starter</td><td>10,000</td><td>per hour</td><td>200</td><td>Priority API access, email support, all endpoints</td></tr>
<tr><td>Professional</td><td>100,000</td><td>per hour</td><td>1,000</td><td>Dedicated pool, phone support, custom webhooks</td></tr>
<tr><td>Enterprise</td><td>Custom</td><td>negotiable</td><td>Unlimited</td><td>Dedicated infrastructure, SLA guarantee, custom limits</td></tr>
</tbody>
</table>

## Rate Limit Headers

Every API response includes headers to help you monitor and manage your usage in real-time.

<table>
<thead>
<tr><th>Header</th><th>Description</th><th>Example</th></tr>
</thead>
<tbody>
<tr><td><code>X-RateLimit-Limit</code></td><td>Maximum requests allowed in the current time window</td><td><code>1000</code></td></tr>
<tr><td><code>X-RateLimit-Remaining</code></td><td>Requests remaining in the current time window</td><td><code>999</code></td></tr>
<tr><td><code>X-RateLimit-Reset</code></td><td>Unix timestamp when the rate limit window resets</td><td><code>1640995200</code></td></tr>
<tr><td><code>Retry-After</code></td><td>Seconds to wait before retrying (only on 429 responses)</td><td><code>3600</code></td></tr>
</tbody>
</table>

## Handling Rate Limits

### 429 Too Many Requests

When you exceed your rate limit, the API returns a 429 status code. Implement retry logic with exponential backoff for graceful handling.

### Error Response

<pre><code>HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1640995200
Retry-After: 3600

{
"error": {
"code": "RATE_LIMIT_EXCEEDED",
"message": "Too many requests",
"retry_after": 3600
}
}</code></pre>

### Retry Logic Example

<pre><code>async function fetchWithRetry(url, options, retries = 3) {
for (let i = 0; i &lt;= retries; i++) {
const res = await fetch(url, options);

if (res.status === 429) {
const wait = res.headers.get('Retry-After');
const delay = wait
? parseInt(wait) * 1000
: Math.pow(2, i) * 1000;

if (i &lt; retries) {
await new Promise(r =&gt; setTimeout(r, delay));
continue;
}
}
return res;
}
}</code></pre>

## Best Practices

- **Monitor rate limit headers** — Track `X-RateLimit-Remaining` in every response to proactively manage your usage before hitting limits.
- **Implement exponential backoff** — When rate limited, wait progressively longer between retries to avoid overwhelming the API.
- **Cache responses** — Store frequently accessed data locally to minimize redundant API calls and conserve your quota.
- **Use batch endpoints** — Combine multiple operations into single requests using our batch APIs when available.

### Pro tip

Use webhooks instead of polling when possible. This eliminates unnecessary API calls and provides real-time updates without consuming your rate limit.

## Need Higher Limits?

Enterprise customers get custom rate limits tailored to their specific requirements, dedicated infrastructure, and priority support. See the [API documentation](/api) or contact sales through [support](/support-overview).

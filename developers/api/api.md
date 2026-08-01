---
id: "qN8XzbOmBgBddQ5m"
category: "developers/api"
tags: []
published_at: "2026-07-24T19:26:29.648Z"
---


API
===

BizKitHub provides a REST API that allows you to integrate our services into your applications. All communication is done via HTTPS requests with JSON responses.

## Basics

- **Base URL:** `https://api.bizkithub.com`
- **Authentication:** API key as query parameter (`?apiKey=...`)
- **Response format:** All responses are in JSON.

## How It Works

### 1. Get your API key

First, you need to obtain an API key from your BizKitHub admin panel. The API key authenticates all your requests. See [How to get an API key](/api-key).

### 2. Make HTTPS requests

All API calls are made as standard HTTPS requests. The `apiKey` parameter is always required and must be included as a URL query parameter.

### 3. Process JSON response

Every API endpoint returns a JSON response. The exact structure depends on the endpoint and is documented in detail in our Swagger documentation.

## Example Request

<pre><code>fetch('https://api.bizkithub.com/api/v1/calendar/detail?apiKey=YOUR_API_KEY&amp;code=EVENT_CODE')
.then(response =&gt; response.json())
.then(data =&gt; console.log(data));</code></pre>

## Required Parameter

The `apiKey` query parameter is mandatory for all API requests. Requests without a valid API key will be rejected.

## API Endpoints

For a complete list of all available endpoints, including request parameters and response formats, please refer to our interactive [Swagger documentation](/swagger). You can also [get an API key](/api-key) from the admin panel.

## Related Topics

- [Error Codes](/errors) — Learn about API error responses and how to handle them in your application.
- [Rate Limiting](/rate-limiting) — Understand API rate limits and best practices for optimal performance.

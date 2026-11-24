---
code: "product-reviews"
category: "sales"
tags: ["type-overview", "reviews", "api"]
published_at: "2026-11-24T00:00:00.000Z"
---


Product reviews
===============

The Reviews module collects ratings and comments from your customers, both about your shop as a whole and about individual products. Only customers who actually received an order can write a review, so every review written through BizKitHub is a verified purchase. New reviews appear on your website immediately; in the administration you can reply to them publicly, hide unsuitable ones or delete them.

Your storefront shows the reviews and the review form through the public API. BizKitHub decides who may write a review and when, checks the input and computes the average rating and the star distribution.

## When you would use it

- You want star ratings and comments on product pages and product listings.
- You want a shop rating ("4.8 out of 5 from 312 reviews") on your homepage.
- You want to answer criticism publicly under the review.
- You need assurance that reviews come from real customers, not from anyone who opens the form.

## Where to find it in the admin

Open **Shop → Reviews**. The list shows every review with its **Rating**, **Review** text, what was **Reviewed** (the shop or a product), the **Order** it belongs to and the **Date**. Reviews brought in from another system carry the label **Imported**.

Filter the list by **Type** (`Shop` or `Product`), by **Visibility** (`On the website`, `Unanswered` or `Hidden`) and by **Rating** (one to five stars).

## Who can write a review

A customer can write a review when all of these apply:

1. The customer is logged in on your storefront.
2. The customer has an order that was delivered. An order counts as delivered while it is in the status with the code `done` or in the automatic **Delivered** status set by shipment tracking (see [Shipments and carriers](/shipments-and-carriers)). Cancelled orders never count.
3. At least **3 days** have passed since the order entered that status. This gives the customer time to try the goods.
4. For a product review, the order contains that product (and the item was not cancelled).
5. The order has not been used for this review yet. Each delivered order entitles the customer to **one shop review** and **one review per product** in the order.

A review is always tied to the newest delivered order that has not been reviewed yet. A customer with three delivered orders containing the same product can therefore write three reviews of that product, one per order.

**Example.** A customer receives an order with a starter set and a food pack on 10 March. From 13 March, they can write one review of the shop, one of the starter set and one of the food pack. If they order the starter set again, the second order unlocks another starter-set review after its delivery.

## What a review contains

| Field | Rules |
|---|---|
| Rating | Whole number of stars from 1 to 5. Required. |
| Author name | The name shown with the review, up to 128 characters. Required. The API suggests the name from the customer profile. |
| Text | Optional, up to 1,000 characters. |
| Language | Optional language code of the text, for example `cs`. |

A review is rejected as spam when its text contains more than one link or a run of 15 or more identical characters.

## Managing reviews

Each row of the list offers these actions:

- **Reply** / **Edit reply.** Write a public reply from the shop. It appears on the website under the review. Save an empty reply to remove it. The **Unanswered** filter shows reviews without a reply.
- **Hide from the website** / **Show on the website.** A hidden review stays in the administration, keeps the order "used" and is excluded from the public list and from the average rating.
- **Delete.** Removes the review from the website and the administration. The customer can then write a new review for the same order. If you only want to stop showing a review, hide it instead.

Reviews cannot be edited by the shop; only the reply is yours.

## Public API

All endpoints authenticate with your API key in the `apiKey` query parameter (see [API keys](/api-key-overview)). Products are identified by their slug. The full schemas are in the [API explorer](/swagger).

### List reviews

```http
GET https://api.bizkithub.com/api/v1/shop/review/list?apiKey=YOUR_API_KEY&productSlug=starter-set&page=1&limit=20
```

Without `productSlug`, the endpoint returns reviews of the shop; with `scope=products` it returns all product reviews. The response contains visible reviews, newest first, and a summary over all visible reviews in scope:

```json
{
  "items": [
    {
      "id": "aB3dE5fG7hJ9kL1m",
      "author": "Jana Nováková",
      "initials": "JN",
      "rating": 5,
      "text": "Arrived in two days, everything as described.",
      "date": "2026-11-18T09:12:00.000Z",
      "reply": "Thank you, Jana!",
      "replyDate": "2026-11-18T12:40:00.000Z",
      "locale": "cs",
      "isVerifiedPurchase": true
    }
  ],
  "summary": { "average": 4.7, "count": 38, "distribution": [1, 0, 2, 5, 30] },
  "page": 1,
  "limit": 20
}
```

`distribution` counts reviews per star, starting with one star. `limit` is 1 to 100, default 20. Hidden reviews are never returned.

### Rating summary for listings

```http
GET https://api.bizkithub.com/api/v1/shop/review/summary?apiKey=YOUR_API_KEY&productSlugs=starter-set,food-pack
```

Returns one summary (average, count, distribution) per product slug, for up to 200 slugs. Use it on category pages and product cards. Unknown slugs get a count of `0`.

### Check whether the customer can review

```http
GET https://api.bizkithub.com/api/v1/shop/review/allowance?apiKey=YOUR_API_KEY&identityId=Z9CPkS2o3UV163VQn5OUv0T8BQi8Fvdg&productSlug=starter-set
```

`identityId` is the identity of the logged-in customer from your storefront session. The response says whether a review is possible now (`canReview`), how many reviews the customer can write (`remaining`), how many orders will unlock a review later (`pending`), how many were already used (`reviewed`), the waiting period (`delayDays`), the maximum text length (`maxTextLength`) and a `suggestedAuthor` name. Call it before showing the form.

### Write a review

```http
POST https://api.bizkithub.com/api/v1/shop/review/create?apiKey=YOUR_API_KEY
Content-Type: application/json

{
  "identityId": "Z9CPkS2o3UV163VQn5OUv0T8BQi8Fvdg",
  "productSlug": "starter-set",
  "rating": 5,
  "authorName": "Jana Nováková",
  "text": "Arrived in two days, everything as described.",
  "locale": "cs"
}
```

Omit `productSlug` for a review of the shop. Send `customerRealIp` with the visitor's IP address when you call the API from your server. The response is the created review in the same shape as in the list.

### Errors

| Code | Error | Meaning |
|---|---|---|
| `403` | `REVIEW_NOT_ALLOWED` | No order entitles the customer to this review: nothing delivered, the waiting period has not passed, the product was not in a delivered order, or every order was already used. |
| `400` | `REVIEW_INVALID` | The rating is not 1 to 5, the author name is missing or too long, the text is longer than 1,000 characters, or the text looks like spam. |

See [Errors](/errors) for the common error format.

## Related

- [Products](/product-overview): product slugs used by the review API.
- [Orders](/order-overview): order statuses that unlock reviews.
- [Contacts](/contact-overview): the customer behind each review.

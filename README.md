# Creator Card API

Creator Card microservice for the Resilience 17 Node.js Backend Engineer assessment.

Live service:

```text
https://creator-card-api-6zui.onrender.com
```

The service is deployed on Render and uses MongoDB Atlas for persistence.

## Stack

- Node.js
- Vanilla JavaScript
- Express
- MongoDB / Mongoose
- Render Web Service
- MongoDB Atlas

## Endpoints

The assessment requires root-level endpoints only. This service does not use `/api`, `/v1`, or `/api/v1` prefixes.

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/creator-cards` | Create a Creator Card |
| `GET` | `/creator-cards/:slug` | Retrieve a published Creator Card |
| `DELETE` | `/creator-cards/:slug` | Soft-delete a Creator Card |

## Create Creator Card

```http
POST /creator-cards
Content-Type: application/json
```

Required fields:

| Field | Type | Rules |
| --- | --- | --- |
| `title` | string | 3-100 chars |
| `creator_reference` | string | exactly 20 chars |
| `status` | string | `draft` or `published` |

Optional fields:

| Field | Type | Rules |
| --- | --- | --- |
| `description` | string | max 500 chars |
| `slug` | string | 5-50 chars, letters/numbers/underscore/hyphen only |
| `links` | array | each URL must start with `http://` or `https://` |
| `service_rates` | object | `currency` is `NGN`, `USD`, `GBP`, or `GHS`; rates need integer `amount >= 1` |
| `access_type` | string | `public` or `private`; defaults to `public` |
| `access_code` | string | required for private cards; exactly 6 alphanumeric chars |

If `slug` is omitted, the service generates one from `title`.

Example:

```bash
curl -X POST "https://creator-card-api-6zui.onrender.com/creator-cards" \
  -H "Content-Type: application/json" \
  --data '{
    "title": "R17 Render Timeout Smoke",
    "description": "Render timeout smoke test",
    "slug": "r17-render-timeout-smoke-1781691104",
    "creator_reference": "crt_timeout123456789",
    "status": "published"
  }'
```

## Get Creator Card

```http
GET /creator-cards/:slug
```

For private cards, pass the access code as a query parameter:

```http
GET /creator-cards/:slug?access_code=A1B2C3
```

Draft cards are not publicly retrievable.

## Delete Creator Card

```http
DELETE /creator-cards/:slug
Content-Type: application/json
```

Required body:

```json
{
  "creator_reference": "crt_timeout123456789"
}
```

Delete is a soft delete. The record is marked with a `deleted` timestamp.

## Response Format

Success responses use:

```json
{
  "message": "Creator Card Created Successfully.",
  "status": "success",
  "data": {}
}
```

Error responses use:

```json
{
  "message": "Creator card not found",
  "status": "error",
  "code": "NF01"
}
```

## Business Error Codes

| Code | Meaning |
| --- | --- |
| `SL02` | Slug is already taken |
| `AC01` | Private card requires `access_code` |
| `AC03` | Private card access code is required on read |
| `AC04` | Invalid private card access code |
| `AC05` | Public cards cannot include `access_code` |
| `NF01` | Creator card not found |
| `NF02` | Creator card exists but is a draft and cannot be retrieved publicly |

Validation failures return HTTP `400`.

## Cold Starts

This service currently runs on Render Free. Render may spin down the service after inactivity, and the next request can take 50 seconds or more while the service wakes up.

Server-side timeout handling has been configured to tolerate slow cold-start paths:

| Variable | Default |
| --- | --- |
| `REQUEST_TIMEOUT_MS` | `120000` |
| `HEADERS_TIMEOUT_MS` | `125000` |
| `KEEP_ALIVE_TIMEOUT_MS` | `65000` |

These values make the Node HTTP server wait long enough for slow requests once the process is running. Client-side tools may still have their own shorter timeouts. For cold-start testing, use a client timeout of at least 120 seconds.

Example:

```bash
curl --max-time 130 "https://creator-card-api-6zui.onrender.com/creator-cards/some-slug"
```

Using curl without `--max-time` is also valid because curl does not impose a short total timeout by default.

## Environment Variables

Required:

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas connection string |

Runtime:

| Variable | Purpose |
| --- | --- |
| `PORT` | Server port; Render provides this automatically |
| `NODE_ENV` | Runtime environment |
| `USE_MOCK_MODEL` | Use real MongoDB when set to `0` |
| `LOG_APP_REQUEST` | Request logging toggle |
| `CAN_LOG_ENDPOINT_INFORMATION` | Endpoint metadata logging toggle |
| `REQUEST_TIMEOUT_MS` | Total request timeout |
| `HEADERS_TIMEOUT_MS` | Header parsing timeout |
| `KEEP_ALIVE_TIMEOUT_MS` | Keep-alive socket timeout |

Do not commit `.env` files or database credentials.

## Proven Deployed Results

The following verification was run against the deployed Render service after commit `6708ec1 fix: extend server timeouts` was live.

Command:

```bash
slug="r17-render-timeout-smoke-$(date +%s)"
ref="crt_timeout123456789"
base="https://creator-card-api-6zui.onrender.com"
printf 'SLUG=%s\n' "$slug"
printf '\n---POST---\n'
curl --max-time 130 -s -w '\nCURL_RESULT http_code=%{http_code} time_namelookup=%{time_namelookup} time_connect=%{time_connect} time_appconnect=%{time_appconnect} time_starttransfer=%{time_starttransfer} time_total=%{time_total}\n' -X POST "$base/creator-cards" -H 'Content-Type: application/json' --data "{\"title\":\"R17 Render Timeout Smoke\",\"description\":\"Render timeout smoke test\",\"slug\":\"$slug\",\"creator_reference\":\"$ref\",\"status\":\"published\"}"
printf '\n---GET---\n'
curl --max-time 130 -s -w '\nCURL_RESULT http_code=%{http_code} time_namelookup=%{time_namelookup} time_connect=%{time_connect} time_appconnect=%{time_appconnect} time_starttransfer=%{time_starttransfer} time_total=%{time_total}\n' "$base/creator-cards/$slug"
printf '\n---DELETE---\n'
curl --max-time 130 -s -w '\nCURL_RESULT http_code=%{http_code} time_namelookup=%{time_namelookup} time_connect=%{time_connect} time_appconnect=%{time_appconnect} time_starttransfer=%{time_starttransfer} time_total=%{time_total}\n' -X DELETE "$base/creator-cards/$slug" -H 'Content-Type: application/json' --data "{\"creator_reference\":\"$ref\"}"
printf '\n---GET_AFTER_DELETE---\n'
curl --max-time 130 -s -w '\nCURL_RESULT http_code=%{http_code} time_namelookup=%{time_namelookup} time_connect=%{time_connect} time_appconnect=%{time_appconnect} time_starttransfer=%{time_starttransfer} time_total=%{time_total}\n' "$base/creator-cards/$slug"
```

Output:

```text
SLUG=r17-render-timeout-smoke-1781691104

---POST---
{"message":"Creator Card Created Successfully.","status":"success","data":{"id":"01KVAH1F8MYA62FZYZVY8XQP6Z","title":"R17 Render Timeout Smoke","description":"Render timeout smoke test","slug":"r17-render-timeout-smoke-1781691104","creator_reference":"crt_timeout123456789","links":[],"service_rates":null,"status":"published","access_type":"public","created":1781691104532,"updated":1781691104532,"deleted":null,"access_code":null}}
CURL_RESULT http_code=200 time_namelookup=0.018585 time_connect=0.038768 time_appconnect=0.067285 time_starttransfer=0.316361 time_total=0.317494

---GET---
{"message":"Creator Card Retrieved Successfully.","status":"success","data":{"id":"01KVAH1F8MYA62FZYZVY8XQP6Z","title":"R17 Render Timeout Smoke","description":"Render timeout smoke test","slug":"r17-render-timeout-smoke-1781691104","creator_reference":"crt_timeout123456789","links":[],"service_rates":null,"status":"published","access_type":"public","created":1781691104532,"updated":1781691104532,"deleted":null}}
CURL_RESULT http_code=200 time_namelookup=0.003094 time_connect=0.021338 time_appconnect=0.047625 time_starttransfer=0.269268 time_total=0.269397

---DELETE---
{"message":"Creator Card Deleted Successfully.","status":"success","data":{"id":"01KVAH1F8MYA62FZYZVY8XQP6Z","title":"R17 Render Timeout Smoke","description":"Render timeout smoke test","slug":"r17-render-timeout-smoke-1781691104","creator_reference":"crt_timeout123456789","links":[],"service_rates":null,"status":"published","access_type":"public","created":1781691104532,"updated":1781691105231,"deleted":1781691105231,"access_code":null}}
CURL_RESULT http_code=200 time_namelookup=0.002867 time_connect=0.047310 time_appconnect=0.089276 time_starttransfer=0.369349 time_total=0.369536

---GET_AFTER_DELETE---
{"message":"Creator card not found","status":"error","code":"NF01"}
CURL_RESULT http_code=404 time_namelookup=0.003158 time_connect=0.022538 time_appconnect=0.049203 time_starttransfer=0.259498 time_total=0.259586
```

Result summary:

| Step | Expected | Actual |
| --- | --- | --- |
| Create card | HTTP `200` | HTTP `200` |
| Retrieve card | HTTP `200` | HTTP `200` |
| Delete card | HTTP `200` | HTTP `200` |
| Retrieve deleted card | HTTP `404` with `NF01` | HTTP `404` with `NF01` |

## Local Development

Install dependencies:

```bash
npm install
```

Run tests:

```bash
npm test
```

Start the service:

```bash
npm start
```

The test suite currently verifies the assessment route contract, validation rules, business error codes, serialization, slug generation, deployment scaffold, and timeout configuration.

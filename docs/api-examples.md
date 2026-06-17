# Creator Card API Examples

Use the deployed base URL only in the assessment form, such as `https://creator-card-api.onrender.com`.

## Create Public Card

```bash
curl -X POST "$BASE_URL/creator-cards" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "George Cooks",
    "description": "Weekly cooking podcast",
    "slug": "george-cooks",
    "creator_reference": "crt_8f2k1m9x4p7w3q5z",
    "links": [{"title": "YouTube", "url": "https://youtube.com/@georgecooks"}],
    "service_rates": {
      "currency": "NGN",
      "rates": [{"name": "IG Story Post", "description": "One story mention", "amount": 5000000}]
    },
    "status": "published"
  }'
```

## Create Private Card

```bash
curl -X POST "$BASE_URL/creator-cards" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "VIP Rate Card",
    "creator_reference": "crt_x9y8z7w6v5u4t3s2",
    "status": "published",
    "access_type": "private",
    "access_code": "A1B2C3"
  }'
```

## Retrieve Public Card

```bash
curl "$BASE_URL/creator-cards/george-cooks"
```

## Retrieve Private Card

```bash
curl "$BASE_URL/creator-cards/vip-rate-card?access_code=A1B2C3"
```

## Delete Card

```bash
curl -X DELETE "$BASE_URL/creator-cards/ada-designs-things" \
  -H "Content-Type: application/json" \
  -d '{"creator_reference":"crt_a1b2c3d4e5f6g7h8"}'
```

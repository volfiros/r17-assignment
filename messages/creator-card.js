const CreatorCardMessages = {
  SLUG_TAKEN: 'Slug is already taken',
  ACCESS_CODE_REQUIRED: 'access_code is required when access_type is private',
  ACCESS_CODE_PUBLIC_CARD: 'access_code can only be set on private cards',
  CARD_NOT_FOUND: 'Creator card not found',
  PRIVATE_ACCESS_CODE_REQUIRED: 'This card is private. An access code is required',
  INVALID_ACCESS_CODE: 'Invalid access code',
  INVALID_SLUG: 'slug may only contain letters, numbers, hyphens, and underscores',
  INVALID_LINK_URL: 'links.url must start with http:// or https://',
  INVALID_ACCESS_CODE_FORMAT: 'access_code must be exactly 6 alphanumeric characters',
  INVALID_RATE_AMOUNT: 'service_rates.rates.amount must be a positive integer',
  EMPTY_SERVICE_RATES: 'service_rates.rates must contain at least one rate',
};

module.exports = CreatorCardMessages;

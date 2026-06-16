const { expect } = require('chai');
const {
  ensureAccessCodeRules,
  ensureSlugFormat,
  ensureNestedBusinessRules,
} = require('@app/services/creator-cards/creator-card-validation');

describe('creator card business validation', () => {
  it('throws AC01 when a private card has no access_code', () => {
    expect(() => ensureAccessCodeRules({ access_type: 'private' })).to.throw(
      'access_code is required when access_type is private'
    );
  });

  it('throws AC05 when a public card includes access_code', () => {
    expect(() =>
      ensureAccessCodeRules({ access_type: 'public', access_code: 'A1B2C3' })
    ).to.throw('access_code can only be set on private cards');
  });

  it('accepts a six-character alphanumeric private access_code', () => {
    expect(() =>
      ensureAccessCodeRules({ access_type: 'private', access_code: 'A1B2C3' })
    ).to.not.throw();
  });

  it('rejects invalid slug characters', () => {
    expect(() => ensureSlugFormat('bad slug!')).to.throw(
      'slug may only contain letters, numbers, hyphens, and underscores'
    );
  });

  it('rejects links that do not start with http or https', () => {
    expect(() =>
      ensureNestedBusinessRules({
        links: [{ title: 'Site', url: 'ftp://example.com' }],
      })
    ).to.throw('links.url must start with http:// or https://');
  });

  it('rejects non-integer service rate amounts', () => {
    expect(() =>
      ensureNestedBusinessRules({
        service_rates: {
          currency: 'NGN',
          rates: [{ name: 'IG Story Post', description: 'One story mention', amount: 10.5 }],
        },
      })
    ).to.throw('service_rates.rates.amount must be a positive integer');
  });

  it('rejects service_rates with an empty rates array', () => {
    expect(() =>
      ensureNestedBusinessRules({
        service_rates: {
          currency: 'NGN',
          rates: [],
        },
      })
    ).to.throw('service_rates.rates must contain at least one rate');
  });
});

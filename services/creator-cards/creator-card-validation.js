const { throwAppError, ERROR_CODE } = require('@app-core/errors');
const { CreatorCardMessages } = require('@app/messages');

const SLUG_PATTERN = /^[A-Za-z0-9_-]+$/;
const ACCESS_CODE_PATTERN = /^[A-Za-z0-9]{6}$/;

function ensureSlugFormat(slug) {
  if (!SLUG_PATTERN.test(slug)) {
    throwAppError(CreatorCardMessages.INVALID_SLUG, ERROR_CODE.INVLDDATA);
  }
}

function ensureAccessCodeRules(data) {
  const accessType = data.access_type || 'public';

  if (accessType === 'private' && !data.access_code) {
    throwAppError(CreatorCardMessages.ACCESS_CODE_REQUIRED, 'AC01');
  }

  if (accessType !== 'private' && data.access_code) {
    throwAppError(CreatorCardMessages.ACCESS_CODE_PUBLIC_CARD, 'AC05');
  }

  if (data.access_code && !ACCESS_CODE_PATTERN.test(data.access_code)) {
    throwAppError(CreatorCardMessages.INVALID_ACCESS_CODE_FORMAT, ERROR_CODE.INVLDDATA);
  }
}

function ensureLinkRules(links = []) {
  links.forEach((link) => {
    if (!/^https?:\/\//.test(link.url)) {
      throwAppError(CreatorCardMessages.INVALID_LINK_URL, ERROR_CODE.INVLDDATA);
    }
  });
}

function ensureServiceRateRules(serviceRates) {
  if (!serviceRates) return;

  if (!Array.isArray(serviceRates.rates) || serviceRates.rates.length === 0) {
    throwAppError(CreatorCardMessages.EMPTY_SERVICE_RATES, ERROR_CODE.INVLDDATA);
  }

  serviceRates.rates.forEach((rate) => {
    if (!Number.isInteger(rate.amount) || rate.amount < 1) {
      throwAppError(CreatorCardMessages.INVALID_RATE_AMOUNT, ERROR_CODE.INVLDDATA);
    }
  });
}

function ensureNestedBusinessRules(data) {
  ensureLinkRules(data.links || []);
  ensureServiceRateRules(data.service_rates);
}

module.exports = {
  ensureSlugFormat,
  ensureAccessCodeRules,
  ensureNestedBusinessRules,
};

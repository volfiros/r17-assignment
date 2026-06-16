const validator = require('@app-core/validator');
const { throwAppError, ERROR_CODE } = require('@app-core/errors');
const { appLogger } = require('@app-core/logger');
const CreatorCard = require('@app/repository/creator-card');
const { CreatorCardMessages } = require('@app/messages');
const serializeCreatorCard = require('./serialize-creator-card');
const { generateAvailableSlug } = require('./slug');
const {
  ensureAccessCodeRules,
  ensureNestedBusinessRules,
  ensureSlugFormat,
} = require('./creator-card-validation');

const createCreatorCardSpec = `root {
  title string<trim|lengthBetween:3,100>
  description? string<trim|maxLength:500>
  slug? string<trim|lengthBetween:5,50>
  creator_reference string<trim|length:20>
  links[]? {
    title string<trim|lengthBetween:1,100>
    url string<trim|maxLength:200>
  }
  service_rates? {
    currency string(NGN|USD|GBP|GHS)
    rates[] {
      name string<trim|lengthBetween:3,100>
      description string<trim|maxLength:250>
      amount number<min:1>
    }
  }
  status string(draft|published)
  access_type? string(public|private)
  access_code? string<trim|length:6>
}`;

const createSpec = validator.parse(createCreatorCardSpec);

async function slugExists(slug) {
  const count = await CreatorCard.raw().countDocuments({ slug });
  return count > 0;
}

async function createCreatorCard(serviceData, options = {}) {
  const data = validator.validate(serviceData, createSpec);

  try {
    const accessType = data.access_type || 'public';
    let slug = data.slug;

    ensureAccessCodeRules({ ...data, access_type: accessType });
    ensureNestedBusinessRules(data);

    if (slug) {
      ensureSlugFormat(slug);

      if (await slugExists(slug)) {
        throwAppError(CreatorCardMessages.SLUG_TAKEN, 'SL02');
      }
    } else {
      slug = await generateAvailableSlug(data.title, slugExists);
    }

    const payload = {
      title: data.title,
      description: data.description || '',
      slug,
      creator_reference: data.creator_reference,
      links: data.links || [],
      service_rates: data.service_rates || null,
      status: data.status,
      access_type: accessType,
      access_code: accessType === 'private' ? data.access_code : null,
    };

    const card = await CreatorCard.create(payload, options);
    return serializeCreatorCard(card, { includeAccessCode: true });
  } catch (error) {
    if (error.errorCode === ERROR_CODE.DUPLRCRD) {
      throwAppError(CreatorCardMessages.SLUG_TAKEN, 'SL02');
    }

    appLogger.errorX(error, 'create-creator-card-error');
    throw error;
  }
}

module.exports = createCreatorCard;

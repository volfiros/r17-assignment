const validator = require('@app-core/validator');
const { throwAppError } = require('@app-core/errors');
const { appLogger } = require('@app-core/logger');
const CreatorCard = require('@app/repository/creator-card');
const { CreatorCardMessages } = require('@app/messages');
const serializeCreatorCard = require('./serialize-creator-card');
const { ensureSlugFormat } = require('./creator-card-validation');

const getCreatorCardSpec = `root {
  slug string<trim|lengthBetween:5,50>
  access_code? string<trim>
}`;

const getSpec = validator.parse(getCreatorCardSpec);

async function getCreatorCard(serviceData, options = {}) {
  const data = validator.validate(serviceData, getSpec);

  try {
    ensureSlugFormat(data.slug);

    const card = await CreatorCard.findOne({
      query: { slug: data.slug },
      options,
    });

    if (!card) {
      throwAppError(CreatorCardMessages.CARD_NOT_FOUND, 'NF01');
    }

    if (card.status === 'draft') {
      throwAppError(CreatorCardMessages.CARD_NOT_FOUND, 'NF02');
    }

    if (card.access_type === 'private' && !data.access_code) {
      throwAppError(CreatorCardMessages.PRIVATE_ACCESS_CODE_REQUIRED, 'AC03');
    }

    if (card.access_type === 'private' && data.access_code !== card.access_code) {
      throwAppError(CreatorCardMessages.INVALID_ACCESS_CODE, 'AC04');
    }

    return serializeCreatorCard(card);
  } catch (error) {
    appLogger.errorX(error, 'get-creator-card-error');
    throw error;
  }
}

module.exports = getCreatorCard;

const validator = require('@app-core/validator');
const { throwAppError } = require('@app-core/errors');
const { appLogger } = require('@app-core/logger');
const CreatorCard = require('@app/repository/creator-card');
const { CreatorCardMessages } = require('@app/messages');
const serializeCreatorCard = require('./serialize-creator-card');
const { ensureSlugFormat } = require('./creator-card-validation');

const deleteCreatorCardSpec = `root {
  slug string<trim|lengthBetween:5,50>
  creator_reference string<trim|length:20>
}`;

const deleteSpec = validator.parse(deleteCreatorCardSpec);

async function deleteCreatorCard(serviceData, options = {}) {
  const data = validator.validate(serviceData, deleteSpec);

  try {
    ensureSlugFormat(data.slug);

    const card = await CreatorCard.findOne({
      query: {
        slug: data.slug,
        creator_reference: data.creator_reference,
      },
      options,
    });

    if (!card) {
      throwAppError(CreatorCardMessages.CARD_NOT_FOUND, 'NF01');
    }

    const deletedAt = Date.now();

    await CreatorCard.updateOne({
      query: { _id: card._id },
      updateValues: { deleted: deletedAt },
      options,
    });

    return serializeCreatorCard(
      {
        ...card,
        updated: deletedAt,
        deleted: deletedAt,
      },
      { includeAccessCode: true }
    );
  } catch (error) {
    appLogger.errorX(error, 'delete-creator-card-error');
    throw error;
  }
}

module.exports = deleteCreatorCard;

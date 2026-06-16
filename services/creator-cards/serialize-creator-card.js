function normalizeDeleted(value) {
  return value && value !== 0 ? value : null;
}

function serializeCreatorCard(card, options = {}) {
  const includeAccessCode = options.includeAccessCode === true;

  const response = {
    id: card._id,
    title: card.title,
    description: card.description || '',
    slug: card.slug,
    creator_reference: card.creator_reference,
    links: Array.isArray(card.links) ? card.links : [],
    service_rates: card.service_rates || null,
    status: card.status,
    access_type: card.access_type || 'public',
    created: card.created,
    updated: card.updated,
    deleted: normalizeDeleted(card.deleted),
  };

  if (includeAccessCode) {
    response.access_code = card.access_code || null;
  }

  return response;
}

module.exports = serializeCreatorCard;

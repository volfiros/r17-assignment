const { randomBytes } = require('@app-core/randomness');

function normalizeSlugSource(title) {
  return String(title || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9_-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function appendRandomSuffix(base) {
  const prefix = (base || 'card').slice(0, 43).replace(/-+$/g, '') || 'card';
  return `${prefix}-${randomBytes(6)}`;
}

async function generateAvailableSlug(title, slugExists) {
  const baseSlug = normalizeSlugSource(title).slice(0, 50).replace(/-+$/g, '');
  let candidate = baseSlug;

  if (candidate.length < 5 || (await slugExists(candidate))) {
    candidate = appendRandomSuffix(baseSlug);
  }

  while (await slugExists(candidate)) {
    candidate = appendRandomSuffix(baseSlug);
  }

  return candidate;
}

module.exports = {
  normalizeSlugSource,
  generateAvailableSlug,
};

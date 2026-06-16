const { expect } = require('chai');
const { normalizeSlugSource, generateAvailableSlug } = require('@app/services/creator-cards/slug');

describe('creator card slug helpers', () => {
  it('generates the assessment slug from title text', () => {
    expect(normalizeSlugSource('Ada Designs Things')).to.equal('ada-designs-things');
  });

  it('removes characters outside letters numbers hyphens and underscores', () => {
    expect(normalizeSlugSource('George Cooks!!! #1')).to.equal('george-cooks-1');
  });

  it('appends a six-character suffix when the clean title slug already exists', async () => {
    const slug = await generateAvailableSlug('Ada Designs Things', async (candidate) => {
      return candidate === 'ada-designs-things';
    });

    expect(slug).to.match(/^ada-designs-things-[a-f0-9]{6}$/);
  });

  it('uses a safe base when the title cleans to fewer than five characters', async () => {
    const slug = await generateAvailableSlug('A!', async () => false);

    expect(slug).to.match(/^a-[a-f0-9]{6}$/);
  });

  it('keeps generated slugs within the fifty character limit', async () => {
    const title = 'Ada Designs Premium Interactive Campaign Strategy Packages';
    const slug = await generateAvailableSlug(title, async () => false);

    expect(slug).to.have.lengthOf.at.most(50);
    expect(slug).to.equal('ada-designs-premium-interactive-campaign-strategy');
  });

  it('keeps suffixed generated slugs within the fifty character limit', async () => {
    const title = 'Ada Designs Premium Interactive Campaign Strategy Packages';
    const slug = await generateAvailableSlug(title, async (candidate) => {
      return candidate === 'ada-designs-premium-interactive-campaign-strategy';
    });

    expect(slug).to.have.lengthOf(50);
    expect(slug).to.match(/^ada-designs-premium-interactive-campaign-st-[a-f0-9]{6}$/);
  });
});

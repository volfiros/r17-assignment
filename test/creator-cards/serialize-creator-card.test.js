const { expect } = require('chai');
const serializeCreatorCard = require('@app/services/creator-cards/serialize-creator-card');

describe('serializeCreatorCard', () => {
  const card = {
    _id: '01JG8XYZA2B3C4D5E6F7G8H9J0',
    title: 'George Cooks',
    description: 'Weekly cooking podcast',
    slug: 'george-cooks',
    creator_reference: 'crt_8f2k1m9x4p7w3q5z',
    links: [{ title: 'YouTube', url: 'https://youtube.com/@georgecooks' }],
    service_rates: {
      currency: 'NGN',
      rates: [{ name: 'IG Story Post', description: 'One story mention', amount: 5000000 }],
    },
    status: 'published',
    access_type: 'private',
    access_code: 'A1B2C3',
    created: 1767052800000,
    updated: 1767052800000,
    deleted: 0,
  };

  it('maps _id to id and maps an active deleted marker to null', () => {
    const response = serializeCreatorCard(card, { includeAccessCode: true });

    expect(response).to.deep.equal({
      id: '01JG8XYZA2B3C4D5E6F7G8H9J0',
      title: 'George Cooks',
      description: 'Weekly cooking podcast',
      slug: 'george-cooks',
      creator_reference: 'crt_8f2k1m9x4p7w3q5z',
      links: [{ title: 'YouTube', url: 'https://youtube.com/@georgecooks' }],
      service_rates: {
        currency: 'NGN',
        rates: [{ name: 'IG Story Post', description: 'One story mention', amount: 5000000 }],
      },
      status: 'published',
      access_type: 'private',
      access_code: 'A1B2C3',
      created: 1767052800000,
      updated: 1767052800000,
      deleted: null,
    });
    expect(response).to.not.have.property('_id');
  });

  it('omits access_code for public retrieval serialization', () => {
    const response = serializeCreatorCard(card);

    expect(response).to.not.have.property('access_code');
  });
});

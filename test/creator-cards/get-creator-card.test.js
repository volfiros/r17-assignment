process.env.USE_MOCK_MODEL = '1';
process.env.MODEL_MOCK_SESSION = 'default';

const { expect } = require('chai');
const createMockServer = require('@app-core/mock-server');
const { MockModelStubs } = require('@app/mock-models');

describe('GET /creator-cards/:slug', () => {
  let server;
  let findOneStub;

  const publishedPublicCard = {
    _id: '01JG8XYZA2B3C4D5E6F7G8H9J0',
    title: 'George Cooks',
    description: 'Weekly cooking podcast',
    slug: 'george-cooks',
    creator_reference: 'crt_8f2k1m9x4p7w3q5z',
    links: [{ title: 'YouTube', url: 'https://youtube.com/@georgecooks' }],
    service_rates: null,
    status: 'published',
    access_type: 'public',
    access_code: null,
    created: 1767052800000,
    updated: 1767052800000,
    deleted: 0,
  };

  beforeEach(() => {
    server = createMockServer(['endpoints/creator-cards/get.js']);
  });

  afterEach(() => {
    if (findOneStub) {
      findOneStub.revert();
      findOneStub = null;
    }
  });

  it('retrieves a published public card without access_code', async () => {
    findOneStub = MockModelStubs.CreatorCard.configureStubs({
      method: 'findOne',
      docConfig: publishedPublicCard,
    });

    const response = await server.get('/creator-cards/george-cooks');

    expect(response.statusCode).to.equal(200);
    expect(response.data.message).to.equal('Creator Card Retrieved Successfully.');
    expect(response.data.data).to.include({
      id: '01JG8XYZA2B3C4D5E6F7G8H9J0',
      slug: 'george-cooks',
      status: 'published',
      access_type: 'public',
      deleted: null,
    });
    expect(response.data.data).to.not.have.property('access_code');
    expect(response.data.data).to.not.have.property('_id');
  });

  it('returns NF01 when no card exists', async () => {
    findOneStub = MockModelStubs.CreatorCard.configureStubs({
      method: 'findOne',
      mockNull: true,
    });

    const response = await server.get('/creator-cards/does-not-exist-123');

    expect(response.statusCode).to.equal(404);
    expect(response.data.code).to.equal('NF01');
  });

  it('returns NF02 when the card is a draft', async () => {
    findOneStub = MockModelStubs.CreatorCard.configureStubs({
      method: 'findOne',
      docConfig: { ...publishedPublicCard, status: 'draft' },
    });

    const response = await server.get('/creator-cards/george-cooks');

    expect(response.statusCode).to.equal(404);
    expect(response.data.code).to.equal('NF02');
  });

  it('returns AC03 for a private card without access_code query', async () => {
    findOneStub = MockModelStubs.CreatorCard.configureStubs({
      method: 'findOne',
      docConfig: { ...publishedPublicCard, access_type: 'private', access_code: 'A1B2C3' },
    });

    const response = await server.get('/creator-cards/george-cooks');

    expect(response.statusCode).to.equal(403);
    expect(response.data.code).to.equal('AC03');
  });

  it('returns AC04 for a private card with the wrong access_code', async () => {
    findOneStub = MockModelStubs.CreatorCard.configureStubs({
      method: 'findOne',
      docConfig: { ...publishedPublicCard, access_type: 'private', access_code: 'A1B2C3' },
    });

    const response = await server.get('/creator-cards/george-cooks?access_code=WRONG1');

    expect(response.statusCode).to.equal(403);
    expect(response.data.code).to.equal('AC04');
  });

  it('retrieves a private card with the correct access_code and omits access_code', async () => {
    findOneStub = MockModelStubs.CreatorCard.configureStubs({
      method: 'findOne',
      docConfig: { ...publishedPublicCard, access_type: 'private', access_code: 'A1B2C3' },
    });

    const response = await server.get('/creator-cards/george-cooks?access_code=A1B2C3');

    expect(response.statusCode).to.equal(200);
    expect(response.data.data.access_type).to.equal('private');
    expect(response.data.data).to.not.have.property('access_code');
  });
});

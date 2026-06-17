process.env.USE_MOCK_MODEL = '1';
process.env.MODEL_MOCK_SESSION = 'default';

const { expect } = require('chai');
const createMockServer = require('@app-core/mock-server');
const { MockModelStubs } = require('@app/mock-models');

describe('DELETE /creator-cards/:slug', () => {
  let server;
  let findOneStub;
  let updateOneStub;

  const card = {
    _id: '01JG8XYZA2B3C4D5E6F7G8H9J0',
    title: 'Ada Designs Things',
    description: '',
    slug: 'ada-designs-things',
    creator_reference: 'crt_a1b2c3d4e5f6g7h8',
    links: [],
    service_rates: null,
    status: 'published',
    access_type: 'public',
    access_code: null,
    created: 1767052800000,
    updated: 1767052800000,
    deleted: 0,
  };

  beforeEach(() => {
    server = createMockServer(['endpoints/creator-cards/delete.js']);
  });

  afterEach(() => {
    if (findOneStub) findOneStub.revert();
    if (updateOneStub) updateOneStub.revert();
    findOneStub = null;
    updateOneStub = null;
  });

  it('soft deletes a card and returns the deleted card with access_code included as null', async () => {
    findOneStub = MockModelStubs.CreatorCard.configureStubs({
      method: 'findOne',
      docConfig: card,
    });
    updateOneStub = MockModelStubs.CreatorCard.configureStubs({
      method: 'updateOne',
      overrideFn() {
        return { acknowledged: true, modifiedCount: 1 };
      },
    });

    const response = await server.delete('/creator-cards/ada-designs-things', {
      body: { creator_reference: 'crt_a1b2c3d4e5f6g7h8' },
    });

    expect(response.statusCode).to.equal(200);
    expect(response.data.message).to.equal('Creator Card Deleted Successfully.');
    expect(response.data.data).to.include({
      id: '01JG8XYZA2B3C4D5E6F7G8H9J0',
      slug: 'ada-designs-things',
      creator_reference: 'crt_a1b2c3d4e5f6g7h8',
      access_code: null,
    });
    expect(response.data.data.deleted).to.be.a('number');
  });

  it('returns NF01 when the card is missing', async () => {
    findOneStub = MockModelStubs.CreatorCard.configureStubs({
      method: 'findOne',
      mockNull: true,
    });

    const response = await server.delete('/creator-cards/does-not-exist-123', {
      body: { creator_reference: 'crt_q1w2e3r4t5y6u7i8' },
    });

    expect(response.statusCode).to.equal(404);
    expect(response.data.code).to.equal('NF01');
  });
});

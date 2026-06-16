process.env.USE_MOCK_MODEL = '1';
process.env.MODEL_MOCK_SESSION = 'default';

const { expect } = require('chai');
const createMockServer = require('@app-core/mock-server');
const CreatorCard = require('@app/repository/creator-card');

describe('POST /creator-cards', () => {
  let server;
  let originalCountDocuments;

  beforeEach(() => {
    server = createMockServer(['endpoints/creator-cards/create.js']);
    originalCountDocuments = CreatorCard.raw().countDocuments;
  });

  afterEach(() => {
    CreatorCard.raw().countDocuments = originalCountDocuments;
  });

  it('creates a public published card and defaults access_type to public', async () => {
    const response = await server.post('/creator-cards', {
      body: {
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
      },
    });

    expect(response.statusCode).to.equal(200);
    expect(response.data.status).to.equal('success');
    expect(response.data.message).to.equal('Creator Card Created Successfully.');
    expect(response.data.data).to.include({
      title: 'George Cooks',
      slug: 'george-cooks',
      creator_reference: 'crt_8f2k1m9x4p7w3q5z',
      status: 'published',
      access_type: 'public',
      access_code: null,
      deleted: null,
    });
    expect(response.data.data).to.have.property('id');
    expect(response.data.data).to.not.have.property('_id');
  });

  it('auto-generates slug from title when slug is omitted', async () => {
    const response = await server.post('/creator-cards', {
      body: {
        title: 'Ada Designs Things',
        creator_reference: 'crt_a1b2c3d4e5f6g7h8',
        status: 'published',
      },
    });

    expect(response.statusCode).to.equal(200);
    expect(response.data.data.slug).to.equal('ada-designs-things');
  });

  it('creates a private card and returns access_code in the creation response', async () => {
    const response = await server.post('/creator-cards', {
      body: {
        title: 'VIP Rate Card',
        creator_reference: 'crt_x9y8z7w6v5u4t3s2',
        status: 'published',
        access_type: 'private',
        access_code: 'A1B2C3',
      },
    });

    expect(response.statusCode).to.equal(200);
    expect(response.data.data).to.include({
      slug: 'vip-rate-card',
      access_type: 'private',
      access_code: 'A1B2C3',
    });
  });

  it('returns SL02 for a duplicate client-provided slug', async () => {
    CreatorCard.raw().countDocuments = async () => 1;

    const response = await server.post('/creator-cards', {
      body: {
        title: 'Another George',
        slug: 'george-cooks',
        creator_reference: 'crt_m1n2b3v4c5x6z7l8',
        status: 'published',
      },
    });

    expect(response.statusCode).to.equal(400);
    expect(response.data).to.deep.include({
      status: 'error',
      message: 'Slug is already taken',
      code: 'SL02',
    });
  });

  it('returns AC01 when a private card omits access_code', async () => {
    const response = await server.post('/creator-cards', {
      body: {
        title: 'Secret Card',
        creator_reference: 'crt_q1w2e3r4t5y6u7i8',
        status: 'published',
        access_type: 'private',
      },
    });

    expect(response.statusCode).to.equal(400);
    expect(response.data.code).to.equal('AC01');
  });

  it('returns AC05 when a public card includes access_code', async () => {
    const response = await server.post('/creator-cards', {
      body: {
        title: 'Public Card',
        creator_reference: 'crt_q1w2e3r4t5y6u7i8',
        status: 'published',
        access_type: 'public',
        access_code: 'A1B2C3',
      },
    });

    expect(response.statusCode).to.equal(400);
    expect(response.data.code).to.equal('AC05');
  });

  it('returns HTTP 400 for validator failures', async () => {
    const response = await server.post('/creator-cards', {
      body: {
        title: 'Bad Status Card',
        creator_reference: 'crt_q1w2e3r4t5y6u7i8',
        status: 'archived',
      },
    });

    expect(response.statusCode).to.equal(400);
    expect(response.data.status).to.equal('error');
  });
});

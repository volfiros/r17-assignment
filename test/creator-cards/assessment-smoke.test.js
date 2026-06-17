process.env.USE_MOCK_MODEL = '1';
process.env.MODEL_MOCK_SESSION = 'default';

const { expect } = require('chai');
const createMockServer = require('@app-core/mock-server');

describe('assessment route registration smoke tests', () => {
  const server = createMockServer(['endpoints/creator-cards']);

  it('exposes POST /creator-cards without a version prefix', async () => {
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

  it('does not expose /v1/creator-cards', async () => {
    try {
      await server.post('/v1/creator-cards', {
        body: {
          title: 'Ada Designs Things',
          creator_reference: 'crt_a1b2c3d4e5f6g7h8',
          status: 'published',
        },
      });
      throw new Error('versioned endpoint should not resolve');
    } catch (error) {
      expect(error.message).to.include('Cannot POST /v1/creator-cards');
    }
  });
});

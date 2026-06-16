const { expect } = require('chai');
const createMockServer = require('@app-core/mock-server');

describe('business error response contract', () => {
  it('returns the assessment code as a top-level response property', async () => {
    const server = createMockServer(['test/support/mock-endpoints/throw-business-error.js']);

    const response = await server.get('/test-business-error');

    expect(response.statusCode).to.equal(403);
    expect(response.data).to.deep.include({
      status: 'error',
      message: 'Invalid access code',
      code: 'AC04',
    });
  });
});

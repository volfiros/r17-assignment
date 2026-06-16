const { createHandler } = require('@app-core/server');
const { throwAppError } = require('@app-core/errors');

module.exports = createHandler({
  path: '/test-business-error',
  method: 'get',
  middlewares: [],
  async handler() {
    throwAppError('Invalid access code', 'AC04');
  },
});

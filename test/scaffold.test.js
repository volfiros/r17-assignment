const { expect } = require('chai');
const pkg = require('../package.json');

describe('project scaffold', () => {
  it('uses the creator card assessment package metadata', () => {
    expect(pkg.name).to.equal('creator-card-api');
    expect(pkg.description).to.equal(
      'Creator Card microservice API for the R17 backend engineer assessment'
    );
  });
});

const { expect } = require('chai');
const fs = require('fs');
const http = require('http');
const path = require('path');
const { createServer } = require('@app-core/server');
const pkg = require('../package.json');

describe('project scaffold', () => {
  it('uses the creator card assessment package metadata', () => {
    expect(pkg.name).to.equal('creator-card-api');
    expect(pkg.description).to.equal(
      'Creator Card microservice API for the R17 backend engineer assessment'
    );
  });

  it('defines the deployment start command', () => {
    expect(pkg.scripts.start).to.equal('node bootstrap.js');
  });

  it('defines a Render web service blueprint without secrets', () => {
    const renderYaml = fs.readFileSync(path.join(__dirname, '../render.yaml'), 'utf8');

    expect(renderYaml).to.include('type: web');
    expect(renderYaml).to.include('runtime: node');
    expect(renderYaml).to.include('startCommand: npm start');
    expect(renderYaml).to.include('key: MONGODB_URI');
    expect(renderYaml).to.include('sync: false');
    expect(renderYaml).to.not.include('mongodb+srv://');
  });

  it('keeps HTTP requests open long enough for slow cold-start paths', () => {
    const originalListen = http.Server.prototype.listen;

    try {
      http.Server.prototype.listen = function listen() {
        return this;
      };

      const server = createServer({
        port: 0,
        requestTimeout: 120000,
        headersTimeout: 125000,
        keepAliveTimeout: 65000,
      }).startServer();

      expect(server.requestTimeout).to.equal(120000);
      expect(server.headersTimeout).to.equal(125000);
      expect(server.keepAliveTimeout).to.equal(65000);
    } finally {
      http.Server.prototype.listen = originalListen;
    }
  });
});

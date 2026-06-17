/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
if (!process.env.__ALREADY_BOOTSTRAPPED_ENVS) require('dotenv').config();

const fs = require('fs');
const { createServer } = require('@app-core/server');
const { createConnection } = require('@app-core/mongoose');
const { createQueue } = require('@app-core/queue');

const canLogEndpointInformation = process.env.CAN_LOG_ENDPOINT_INFORMATION;
const requestTimeout = Number(process.env.REQUEST_TIMEOUT_MS || 120000);
const headersTimeout = Number(process.env.HEADERS_TIMEOUT_MS || 125000);
const keepAliveTimeout = Number(process.env.KEEP_ALIVE_TIMEOUT_MS || 65000);

const ENDPOINT_CONFIGS = [
  {
    path: './endpoints/creator-cards/',
  },
];

function logEndpointMetaData(endpointConfigs) {
  const endpointData = [];
  const storageDirName = './endpoint-data';
  const EXEMPTED_ENDPOINTS_REGEX = /onboarding/;

  endpointConfigs.forEach((endpointConfig) => {
    const { path: basePath, options } = endpointConfig;

    const dirs = fs.readdirSync(basePath);

    dirs.forEach((file) => {
      const handler = require(`${basePath}${file}`);

      if (!EXEMPTED_ENDPOINTS_REGEX.test(basePath) && handler.middlewares?.length) {
        const entry = { method: handler.method, endpoint: handler.path };
        entry.name = file.replaceAll('-', ' ').replace('.js', '');
        entry.display_name = `can ${entry.name}`;

        if (options?.pathPrefix) {
          entry.endpoint = `${options.pathPrefix}${entry.endpoint}`;
          entry.name = `${entry.name} (${options.pathPrefix.replace('/', '')})`;
        }

        endpointData.push(entry);
      }
    });
  });

  if (!fs.existsSync(storageDirName)) {
    fs.mkdirSync(storageDirName);
  }

  fs.writeFileSync(`${storageDirName}/endpoints.json`, JSON.stringify(endpointData, null, 2), {
    encoding: 'utf-8',
  });
}

function setupEndpointHandlers(server, basePath, options = {}) {
  const dirs = fs.readdirSync(basePath);

  dirs.forEach((file) => {
    const handler = require(`${basePath}${file}`);

    if (options.pathPrefix) {
      handler.path = `${options.pathPrefix}${handler.path}`;
    }

    server.addHandler(handler);
  });
}

async function startApp() {
  await createConnection({
    uri: process.env.MONGODB_URI,
  });

  createQueue();

  const server = createServer({
    port: process.env.PORT,
    JSONLimit: '150mb',
    enableCors: true,
    requestTimeout,
    headersTimeout,
    keepAliveTimeout,
  });

  if (canLogEndpointInformation) {
    logEndpointMetaData(ENDPOINT_CONFIGS);
  }

  ENDPOINT_CONFIGS.forEach((config) => {
    setupEndpointHandlers(server, config.path, config.options);
  });

  server.startServer();

  return server;
}

module.exports = startApp();

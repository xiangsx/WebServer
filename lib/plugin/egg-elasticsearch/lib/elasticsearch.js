'use strict';

const assert = require('assert');
const elasticsearch = require('@elastic/elasticsearch');
let count = 0;
const createOneClient = (config, app) => {
  const { host } = config;
  // check key & secret
  assert(host, '[egg-elasticsearch] host is required.');
  const client = new elasticsearch.Client(config);

  app.beforeStart(async () => {
    const index = count++;
    await client.ping(
      {
        // ping usually has a 3000ms timeout
        requestTimeout: 1000,
      },
      function (error) {
        if (error) {
          app.coreLogger.info('elasticsearch cluster is down!');
        } else {
          app.coreLogger.info(`[egg-elasticsearch] instance[${index}] status Ok.`);
        }
      }
    );
  });
  return client;
};

module.exports = app => {
  app.addSingleton('elasticsearch', createOneClient);
};

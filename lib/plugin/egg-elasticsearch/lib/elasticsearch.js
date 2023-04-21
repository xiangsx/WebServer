'use strict';

const assert = require('assert');
const elasticsearch = require('@elastic/elasticsearch');
const count = 0;
const createOneClient = (config, app) => {
  const { node } = config;
  // check key & secret
  assert(node, '[egg-elasticsearch] host is required.');
  const client = new elasticsearch.Client(config);

  app.beforeStart(async () => {
    await client.ping(null, { requestTimeout: 1000 });
  });
  return client;
};

module.exports = app => {
  app.addSingleton('elasticsearch', createOneClient);
};

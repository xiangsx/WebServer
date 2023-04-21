'use strict';

const path = require('path');
/** @type Egg.EggPlugin */
module.exports = {
  superRouter: {
    enable: true,
    package: 'egg-super-router',
  },
  redis: {
    enable: true,
    package: 'egg-redis',
  },
  mysql: {
    enable: true,
    package: 'egg-mysql',
  },
  elasticsearch: {
    enable: true,
    path: path.resolve(__dirname, '../lib/plugin/egg-elasticsearch'),
  },
  elk: {
    enable: true,
    path: path.resolve(__dirname, '../lib/plugin/egg-elk'),
  },
};

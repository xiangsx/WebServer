/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + 'nidecookiesignkey';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
    elasticsearch: {
      clients: {
        default: {
          node: 'http://host:port',
        },
      },
    },
    redis: {
      client: {
        port: 6379,
        host: 'host',
        password: 'password',
        db: 0,
      },
    },
    mysql: {
      clients: {
        read: {
          host: 'host',
          port: 3306,
          database: 'db',
          user: 'user',
          password: 'password',
          dateStrings: true,
        },
        write: {
          host: 'host',
          port: 3306,
          database: 'db',
          user: 'user',
          password: 'password',
          dateStrings: true,
        },
      },
    },
    elk: {
      host: 'host',
      port: 5000,
      logType: 'egg',
      categories: [ 'logger', 'errorLogger', 'coreLogger', 'scheduleLogger' ],
      tcp: {
        maxConnections: 10,
        retryInterval: 500,
        timeout: 10 * 60 * 1000,
      },
    },
  };
};

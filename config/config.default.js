/* eslint valid-jsdoc: "off" */

'use strict';
const chalk = require('chalk');
const { EnumError } = require('../app/constant/error');

const duartionRegexp = /([0-9]+ms)/g;
// eslint-disable-next-line no-useless-escape
const categoryRegexp = /(\[[\w\-_.:]+\])/g;
const httpMethodRegexp = /(GET|POST|PUT|PATH|HEAD|DELETE) /g;

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
  config.keys = appInfo.name + '_gptgodserversx';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.onerror = {
    json(err, ctx) {
      // 在此处定义针对所有响应类型的错误处理方法
      // 注意，定义了 config.all 之后，其他错误处理方法不会再生效
      // 注意这里不能适合用config.all 监控错误，只能使用json 原因如下
      // 请求需求的格式	环境	errorPageUrl 是否配置	返回内容
      // HTML & TEXT	local & unittest	-	onerror 自带的错误页面，展示详细的错误信息
      // HTML & TEXT	其他	是	重定向到 errorPageUrl
      // HTML & TEXT	其他	否	onerror 自带的没有错误信息的简单错误页（不推荐）
      // JSON & JSONP	local & unittest	-	JSON 对象或对应的 JSONP 格式响应，带详细的错误信息
      // JSON & JSONP	其他	-	JSON 对象或对应的 JSONP 格式响应，不带详细的错误信息
      // https://eggjs.org/zh-cn/core/error-handling.html
      ctx.wrap(null, EnumError.ERR_UNKNOWN);
    },
  };

  config.logger = {
    // 日志分为 NONE，DEBUG，INFO，WARN 和 ERROR 5 个级别。
    // 日志文件级别
    level: 'DEBUG',
    // 终端打印日志级别
    consoleLevel: 'DEBUG',
    allowDebugAtProd: true,
    disableConsoleAfterReady: false,
    contextFormatter: meta => {
      const { ctx } = meta;
      let msg = `[${meta.date}] [${meta.level}] [${meta.pid}] [${ctx.sn}] ${meta.message}`;

      if (meta.level === 'ERROR') {
        return chalk.red(msg);
      } else if (meta.level === 'WARN') {
        return chalk.yellow(msg);
      }

      msg = msg.replace(duartionRegexp, chalk.green('$1'));
      msg = msg.replace(categoryRegexp, chalk.blue('$1'));
      msg = msg.replace(httpMethodRegexp, chalk.cyan('$1 '));
      return msg;
    },
  };

  const extenalConfig = {
    elasticsearch: {
      host: 'host:port',
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
      categories: ['logger', 'errorLogger', 'coreLogger', 'scheduleLogger'],
      tcp: {
        maxConnections: 10,
        retryInterval: 500,
        timeout: 10 * 60 * 1000,
      },
    },
  };

  return {
    ...config,
    ...userConfig,
    ...extenalConfig,
    superRouter: {
      access: {
        enable: true,
        path: 'app/constant/access',
      },
      error: {
        path: 'app/constant/error',
      },
    },
  };
};

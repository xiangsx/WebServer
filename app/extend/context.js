'use strict';
const { EnumError } = require('../constant/error');
const fs = require('fs');
const ES = Symbol('CONTEXT#ES');
const Stream = require('stream');
const dbWrap = async (sqlPromise, ctx, handleErr = true) => {
  return sqlPromise.catch(err => {
    ctx.logger.error(`${err.sql} [${err.errno}] [${err.message}]`);
    if (handleErr) {
      switch (err.errno) {
        case 1062:
          ctx.wrap(null, EnumError.ERR_DB_DUPLICATE);
          break;
        default:
          ctx.wrap(null, EnumError.ERR_DB);
          break;
      }
      ctx.reqEnd = true;
    }
    throw err;
  });
};

module.exports = {
  dbGet(...rest) {
    return dbWrap(this.app.dbRead.get(...rest), this);
  },
  dbSelect(...rest) {
    return dbWrap(this.app.dbRead.select(...rest), this);
  },
  dbInsert(...rest) {
    return dbWrap(this.app.dbWrite.insert(...rest), this);
  },
  dbUpdate(...rest) {
    return dbWrap(this.app.dbWrite.update(...rest), this);
  },
  dbDelete(...rest) {
    return dbWrap(this.app.dbWrite.delete(...rest), this);
  },
  dbQuery(...rest) {
    return dbWrap(this.app.dbRead.query(...rest), this);
  },
  dbQueryWrite(...rest) {
    return dbWrap(this.app.dbWrite.query(...rest), this);
  },
  dbInsertErrNotDeal(...rest) {
    return dbWrap(this.app.dbWrite.insert(...rest), this, false);
  },
  async downloadFile(filePath) {
    const existed = fs.existsSync(filePath);
    if (!existed) {
      this.wrap(null, EnumError.ERR_DOWNLOAD_FAILED);
      return;
    }
    const fileSize = await fs.statSync(filePath);
    this.attachment(filePath);
    this.set('Content-Length', fileSize);
    this.set('Content-Type', 'application/octet-stream');
    this.body = fs.createReadStream(filePath);
  },

  async wrapStream(data, code = 0, { msg } = {}) {
    this.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    });
    const res = {
      code,
      msg: msg || 'ok',
      data,
    };
    this.body = ([ `data: ${JSON.stringify({
      choices: [
        {
          delta: res,
        },
      ],
    })}`, 'data: [DONE]' ].join('\n\n') + '\n\n');

  },

  /**
   * @return {API}
   */
  get es() {
    if (!this[ES]) {
      this[ES] = this.app.elasticsearch.get('default');
    }
    return this[ES];
  },

  wrapWithStream(endCB) {
    this.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    });
    this.body = 'event: message\n';
    const stream = this.body = new Stream.PassThrough(); // 创建一个 PassThrough 流
    stream.on('close', endCB);
    return [ data => {
      const res = { code: 0, data };
      stream.write(`data: ${JSON.stringify(res)}\n\n`);
    }, () => {
      stream.write('data: [DONE]\n\n');
    } ];
  },
};

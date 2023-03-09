'use strict';
const { EnumError } = require('../constant/error');
const fs = require('fs');
const dbWrap = async (sqlPromise, ctx) => {
  return sqlPromise.catch(err => {
    ctx.logger.error(`${err.sql} [${err.errno}] [${err.message}]`);
    switch (err.errno) {
      case 1062:
        ctx.wrap(null, EnumError.ERR_DB_DUPLICATE);
        break;
      default:
        ctx.wrap(null, EnumError.ERR_DB);
        break;
    }
    ctx.reqEnd = true;
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
};

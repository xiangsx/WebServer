'use strict';
const DB_READ = Symbol('Application#DB_READ');
const DB_WRITE = Symbol('Application#DB_WRITE');


module.exports = {
  get dbRead() {
    if (!this[DB_READ]) {
      this[DB_READ] = this.mysql.get('read');
    }
    return this[DB_READ];
  },
  get dbWrite() {
    if (!this[DB_WRITE]) {
      this[DB_WRITE] = this.mysql.get('write');
    }
    return this[DB_WRITE];
  },
};

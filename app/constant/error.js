const { SRError: BaseError, EnumError: BaseEnumError } = require('egg-super-router');

const EnumError = {
  ...BaseEnumError,
};

class Error extends BaseError {
  constructor() {
    super();
    this.addError(EnumError.ERR_LIMIT, { msg: '我滴孩来，你搞慢点，小破站顶不住', status: 200 });
  }
}

module.exports = { SRError: Error, EnumError };

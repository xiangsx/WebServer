const { SRError: BaseError, EnumError: BaseEnumError } = require('egg-super-router');

const EnumError = {
  ...BaseEnumError,
};

class Error extends BaseError {

}

module.exports = { SRError: Error, EnumError };

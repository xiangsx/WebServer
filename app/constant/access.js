const { SRAccess: BaseAccess, EnumAccess: BaseEnumAccess } = require('egg-super-router');

const EnumAccess = {
  ...BaseEnumAccess,
};

class Access extends BaseAccess {

}

module.exports = { SRAccess: Access, EnumAccess };

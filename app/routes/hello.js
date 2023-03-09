const { EnumMethod } = require('egg-super-router');
const { EnumAccess } = require('../constant/access');

/**
 * @param {Egg.Application} app
 */
module.exports = app => {
  app.srRouter.addRoutes([
    {
      url: '/hello',
      method: EnumMethod.get,
      access: EnumAccess.ACC_NONE,
      handle: app.controller.home.index,
    },
  ]);
};

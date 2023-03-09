'use strict';

const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
    ctx.logger.info('hi')
    ctx.wrap({ msg: 'hi' });
  }
}

module.exports = HomeController;

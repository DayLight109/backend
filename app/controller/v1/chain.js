'use strict';

const Controller = require('egg').Controller;

class ChainController extends Controller {
  async info() {
    const { app, ctx } = this;
    ctx.body = await app.fab.channel.info();
  }
  async peers() {
    const { app, ctx } = this;
    ctx.body = await app.fab.channel.peers();
  }
  async chaincodes() {
    const { app, ctx } = this;
    const { type } = ctx.params;
    ctx.validate({ type: [ 'installed', 'instantiated' ] }, { type });
    ctx.body = await app.fab.chaincode.list(type);
  }
  async invoke() {
    const { app, ctx } = this;
    const { name, fnc, args } = ctx.request.body;
    ctx.body = await app.fab.chaincode.invoke(name, fnc, args);
  }
  async query() {
    const { app, ctx } = this;
    const { name, fnc, args } = ctx.request.body;
    ctx.body = await app.fab.chaincode.query(name, fnc, args);
  }
  async user() {
    const { app, ctx } = this;
    const { name } = ctx.query;
    ctx.body = await app.fab.user.getRegisteredUser(name);
  }
}
module.exports = ChainController;

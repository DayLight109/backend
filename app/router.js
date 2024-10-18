'use strict';

module.exports = app => {
  const { router, controller } = app;

  // 登陆接口
  router.post('/api/v1/user/login', controller.v1.user.login);
    // 注册接口
  router.post('/api/v1/user/register', controller.v1.user.register);
  // 交易接口
  router.post('/api/v1/user/token/transfer', app.jwt, controller.v1.user.transferToken);

  // user信息接口
  router.get('/api/v1/user/info', app.jwt, controller.v1.user.info);
  router.get('/api/v1/user/role', app.jwt, controller.v1.user.role);
  router.post('/api/v1/user/update',app.jwt,controller.v1.user.update);

  // 上传征信信息
  router.post('/api/v1/data/upload', app.jwt, controller.v1.data.upload);
  // 添加征信信息
  router.post('/api/v1/data/add', app.jwt, controller.v1.data.add);
  // 列出所有征信信息
  router.post('/api/v1/data/list/all', app.jwt, controller.v1.data.listAll);
  // 获取征信信息
//   router.get('/api/v1/data/fetch', app.jwt, controller.v1.data.fetch);
//   router.get('/api/v1/data/fetch', app.jwt, controller.v1.data.inspect);
  // router.put('/api/v1/data/update', app.jwt, controller.v1.data.update);
  router.get('/api/v1/data/inspect', app.jwt, controller.v1.data.inspect);
  router.get('/api/v1/data/info', app.jwt, controller.v1.data.info);
  // 下载征信信息
  router.post('/api/v1/data/download', app.jwt, controller.v1.data.download);
  router.post('/api/v1/data/apply', app.jwt, controller.v1.data.apply);
  // 列出购买的征信信息
  router.post('/api/v1/data/list/bought', app.jwt, controller.v1.data.listBought);
  // 列出自身的征信信息
  router.post('/api/v1/data/list/own', app.jwt, controller.v1.data.listOwn);
 
  router.post('/api/v1/data/list/sold', app.jwt, controller.v1.data.listSold);

  router.get('/api/v1/config/type', app.jwt, controller.v1.config.type);

  router.get('/api/v1/config/level', app.jwt, controller.v1.config.level);

  router.post('/api/recharge/submit', controller.recharge.submitRecharge);
  };


'use strict';

module.exports = appInfo => {
  const config = {};

  // should change to your own
  config.keys = appInfo.name + '_credit_data';
//   config.hello = 'world';
  config.mysql = { 
    client: {
      database: 'fabric',
      host: '127.0.0.1',
      port: '3306',
      user: "root",
      password: "root",
    },
    app: true,
    agent: false,
  };

  config.security = {
    csrf: false,
  };
  

  config.onerror = {
    accepts: () => 'json',
  };
  config.jwt = {
    secret: appInfo.name,
  };
  config.cors = {
    origin: '*',
    credentials: true,
    maxAge: 10 * 24 * 60 * 60,
  };
  config.multipart = {
    mode: 'file',
    whitelist: () => true,
  };
  config.TOKEN_NAME = 'Credit_Data';
  
  return config;
};

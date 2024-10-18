'use strict';

const Controller = require('egg').Controller;

class ConfigController extends Controller {
	
    async type() {
        const { app, ctx } = this;
//        const { category } = ctx.query;
//	  const typeInfo = ctx.service.dataInfo.allTypeInfo();
//	  const typeInfo = JSON.parse(typeInfo);
	  
        const resInfo = [{
            "creator": "admin",
            "grade": 1,
            "id": "5f1a5b15-862f-90c8-0afd-412c-fd1d5ef2",
            "name": "个人基本信息"
        }, {
            "creator": "admin",
            "grade": 2,
            "id": "5f1a5b1f-e205-59e8-ac10-fb3b-82c0c041",
            "name": "信用记录"
        }, {
            "creator": "admin",
            "grade": 3,
            "id": "5f1a5b2b-d608-543b-3760-92b1-0a1fef28",
            "name": "资产信息"
        }, {
            "creator": "admin",
            "grade": 4,
            "id": "5f1a5b36-c8f7-45ed-d60b-2f47-299d4934",
            "name": "行为数据"
        }];


        ctx.body = resInfo;
    }

   async level() {
        const { app, ctx } = this;
//        const { category } = ctx.query;
    
//        ctx.validate({ category: ['confidential-level' ] }, { category });

//	  const levelInfo = ctx.service.dataInfo.allLevelInfo();
//	  const levelInfo = JSON.parse(levelInfo);
	  
        const resInfo = [{
            "creator": "admin",
            "grade": 1,
            "id": "5f1a5b15-862f-90c8-0afd-412c-fd1d5ef2",
            "name": "公开"
        }, {
            "creator": "admin",
            "grade": 2,
            "id": "5f1a5b1f-e205-59e8-ac10-fb3b-82c0c041",
            "name": "秘密"
        }, {
            "creator": "admin",
            "grade": 3,
            "id": "5f1a5b2b-d608-543b-3760-92b1-0a1fef28",
            "name": "机密"
        }, {
            "creator": "admin",
            "grade": 4,
            "id": "5f1a5b36-c8f7-45ed-d60b-2f47-299d4934",
            "name": "绝密"
        }];


        ctx.body = resInfo;
    }

}
module.exports = ConfigController;
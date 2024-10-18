'use strict';

const Controller = require('egg').Controller;
// const sequelize = require('sequelize');

class UserController extends Controller {

	//注册
	async register() {
		const { app, ctx, config } = this;
		const { name, password, email } = ctx.request.body;
		ctx.validate({ name: 'string', password: 'password', email: 'string' }, { name, password, email });

		// 检查用户是否已存在
		const userinfo = await ctx.service.user.findUserByName(name);  // 确保 userinfo 已定义


		if (userinfo) {
			ctx.throw(403, 'user already exists.');
		}

		const user = await ctx.service.user.addUser({ name, password, email });
		ctx.body = user;
	}

	//登陆
	async login() {
		const { app, ctx, config } = this;
		const { name, password } = ctx.request.body;
		ctx.validate({ name: 'string', password: 'password' }, { name, password });

		const userpdJson = await ctx.service.user.findPd(name);
		const userpd = JSON.parse(userpdJson)[0].password;
		if (password !== userpd) {
			ctx.throw(403, 'user password is incorrect.');
		}

		const token = app.jwt.sign({ name }, config.jwt.secret, { expiresIn: '10000h' });

		ctx.body = { token };
	}

	//转移token, from id to accountaddress.
	async transferToken() {
		const { app, ctx } = this;
		const { id } = ctx.state.user;
		const { accountAddress, name, amount } = ctx.request.body;

		ctx.validate({
			accountAddress: 'string',
			name: ['EXP', 'WEALTH'],
			amount: 'number',
		}, {
			accountAddress,
			name,
			amount,
		});

		const fromUserInfoAmount = await ctx.service.user.findAmount(id);
		const toUserInfoAmount = await ctx.service.user.findAmount(name);
		const fromUserAmount = fromUserInfoAmount - amount;
		const toUserAmount = toUserInfoAmount + amount;
		let idUpdateAmount = { amount: fromUserAmount };
		let idoptions = { name: id };
		const fromUserUpdateAmount = await ctx.service.user.update(idUpdateAmount, idoptions);
		let nameUpdateAmount = { amount: toUserAmount };
		let nameOptions = { name: user }
		const toUserUpdateAmount = await ctx.service.user.update(nameUpdateAmount, nameOptions);

		if (fromUserUpdateAmount && toUserUpdateAmount) {
			ctx.body = { msg: "Transfer successfully." };
		}
	}

	// 获取用户信息的控制器
	async info() {
		const { ctx } = this;

		// 从查询参数获取 userName
		const { userName } = ctx.query;

		// 打印接收到的请求数据
		console.log('Request query:', ctx.query);

		if (!userName) {
			ctx.throw(400, 'Missing user name in query parameters'); // 如果没有 userName，抛出错误
		}

		// 使用 userName 获取用户信息
		const userinfo = await ctx.service.user.find(userName);
		const userInfo = JSON.parse(userinfo); // 假设 userinfo 是 JSON 格式字符串

		const resinfo = {
			name: userInfo.name ? userInfo.name : '',
			nickName: userInfo.nickName ? userInfo.nickName : '',
			sex: userInfo.sex ? userInfo.sex : '',
			amount: userInfo.amount ? userInfo.amount : '',
			organization: userInfo.organization ? userInfo.organization : '',
			department: userInfo.department ? userInfo.department : '',
			staffingLevel: userInfo.staffingLevel ? userInfo.staffingLevel : '',
			manager: userInfo.manager ? userInfo.manager : '',
			director: userInfo.director ? userInfo.director : '',
			mobileNo: userInfo.mobileNo ? userInfo.mobileNo : '',
			workPhone: userInfo.workPhone ? userInfo.workPhone : '',
			email: userInfo.email ? userInfo.email : '',
			wechatNo: userInfo.wechatNo ? userInfo.wechatNo : '',
			accountAddress: userInfo.accountAddress ? userInfo.accountAddress : '',
			points: userInfo.points !== undefined ? userInfo.points : 0, // 使用 !== undefined 检查以避免错误
			role: "客户",
			//上传权限
			uploadPermissions: [
				"公开",
				"秘密",
				"机密",
				"绝密"
			],
			//访问权限
			accessPermissions: [
				"公开",
				"秘密",
				"机密",
				"绝密"
			]
		};
		ctx.body = resinfo;
	}

	// 更新用户信息的方法
	async update() {
		const { ctx } = this;

		// 从请求体获取数据
		//	    const { name, password, email,organization,amount,sex,nieckName,staffingLevel,department,director,manager,mobileNo,workPhone,wechatNo } = ctx.request.body;
		const userInfo = ctx.request.body;
		// 打印接收到的数据
		console.log('Received update Name:', userInfo.name);

		// 验证数据是否包含 userName
		if (!userInfo.name) {
			ctx.throw(400, 'Missing user name'); // 如果没有 userName，抛出错误
		}

		const resinfo = {
			name: userInfo.name ? userInfo.name : '',
			//password
			organization: userInfo.organization ? userInfo.organization : '',
			amount: userInfo.amount ? userInfo.amount : '',
			email: userInfo.email ? userInfo.email : '',
			nickName: userInfo.nickName ? userInfo.nickName : '',
			sex: userInfo.sex ? userInfo.sex : '',
			staffingLevel: userInfo.staffingLevel ? userInfo.staffingLevel : '',
			department: userInfo.department ? userInfo.department : '',
			director: userInfo.director ? userInfo.director : '',
			manager: userInfo.manager ? userInfo.manager : '',
			mobileNo: userInfo.mobileNo ? userInfo.mobileNo : '',
			workPhone: userInfo.workPhone ? userInfo.workPhone : '',
			wechatNo: userInfo.wechatNo ? userInfo.wechatNo : '',
		};
		// 定义 options，用于指定更新条件
		const options = {
			where: { name: userInfo.name }, // 根据 userName 查找用户
		};

		// 调用服务更新用户信息
		try {
			const result = await ctx.service.user.userUpdate(resinfo, options); // 传递 options

			if (result) {
				ctx.body = { success: true, message: '用户信息已更新' };
			} else {
				ctx.throw(500, '更新用户信息失败');
			}
		} catch (error) {
			console.error('更新用户信息时发生错误:', error);
			ctx.throw(500, '服务器错误');
		}
	}


	async role() {
		const res = JSON.stringify({
			"name": "管理员",
			"functionPermissions": [
				"dataManagement",
				"overview",
				"dataDeposit",
				"dataTransaction",
				"personalCenter",
				"recharge"
			]
		});
		this.ctx.body = res;
	}
}
module.exports = UserController;

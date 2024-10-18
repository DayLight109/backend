// app/controller/recharge.js
const Controller = require('egg').Controller;

class RechargeController extends Controller {
  async submitRecharge() {
    const { ctx } = this;
    const { amount, paymentMethod } = ctx.request.body;

    // 验证请求体中的参数
    if (!amount || parseFloat(amount) <= 0) {
      ctx.body = {
        status: 400,
        message: '请输入有效的充值金额',
      };
      return;
    }

    if (!['wechat', 'alipay'].includes(paymentMethod)) {
      ctx.body = {
        status: 400,
        message: '请选择有效的支付方式',
      };
      return;
    }

    try {
      // 处理充值逻辑，比如调用第三方支付接口、更新数据库等
      const result = await this.processRecharge(amount, paymentMethod);

      if (result.success) {
        ctx.body = {
          status: 200,
          message: '充值成功',
        };
      } else {
        ctx.body = {
          status: 500,
          message: '充值失败，请稍后再试',
        };
      }
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = {
        status: 500,
        message: '服务器错误，请稍后再试',
      };
    }
  }

  // 模拟的充值处理函数
  async processRecharge(amount, paymentMethod) {
    // 这里可以调用第三方支付接口，或者处理业务逻辑
    // 例如微信、支付宝支付集成等
    console.log(`Processing recharge: ${amount} with ${paymentMethod}`);

    // 假设处理成功，返回成功状态
    return { success: true };
  }
}

module.exports = RechargeController;

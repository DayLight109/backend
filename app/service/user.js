const Service = require('egg').Service;
class UserService extends Service {
  //  通过name发现user信息
  async find(name) {
    const user = await this.app.mysql.get('users', { name: name });
    return JSON.stringify(user);
  }
  async sayHello() {
    return "hello";
  }

  //添加用户
  async addUser(userInfo) {
  	const { name, password, email } = userInfo;
    // 确保 name, password, email 已定义并传入
    if (!name || !password || !email) {
      throw new Error('用户信息不完整');
    }
	  // 调试输出
	  console.log('Adding user:', userInfo);

    const user = {
      name,
      password,
      email,
    };

    // 假设你用 MySQL 插入用户数据
    const result = await this.app.mysql.insert('users', user);
    return result; // 返回插入结果
  }
  
  //用用户名找用户
  async findUserByName(name) {
    const user = await this.app.mysql.get('users', { name }); // 假设你的用户表名为 `users`
    return user; // 返回查询到的用户，如果不存在则返回 null
  }

  // 通过name查找password
  async findPd(name) {
    const pd = await this.app.mysql.select('users', {
      where: { name: name },
      columns: ['password'],
    });
    const pdJson = JSON.stringify(pd);
    return pdJson;
  }

  // 通过name查找amount
  async findAmount(name) {
    const amount = await this.app.mysql.select('users', {
      where: { name: name },
      columns: ['amount'],
    });
    const amountJson = JSON.stringify(amount);
    return amountJson;
  }
  // 更新信息
  async userUpdate(userinfo, options) {
    const updateRes = await this.app.mysql.update('users', userinfo, options);
    const updateSuccess = updateRes.affectedRows === 1;
    return updateSuccess;
  }

  // 更新用户amount
  async updateAmount(a, n) {
    let sql = 'update users set amount = ? where name = ?';
    const updateRes = await this.app.mysql.query(sql, [a, n]);
    // const updateSuccess = updateRes.affectedRows === 1;
    return updateRes;
  }
}

// 输出user接口，可以在controller模块进行调用
module.exports = UserService;
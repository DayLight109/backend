const Service = require('egg').Service;
class TxService extends Service {
    // 通过name查找信息
    async findByName(name) {
        const tx = await this.app.mysql.get('transactions', { filename: name });
        const txJson = JSON.stringify(user);
        return txJson;
    }

    // 获取所有交易信息
    async allTxInfo() {
        const txInfo = await this.app.mysql.select('transactions');
        const txInfoJson = JSON.stringify(txInfo);
        return txInfoJson;
    }

    // 通过uuid查找信息
    async findByFileId(uuid) {
        const tx = await this.app.mysql.get('transactions', { txid: uuid });
        const txJson = JSON.stringify(tx);
        return txJson
    }

    // 通过trader查找信息
    async findByTrader(trader) {
	    console.log("trader:",trader);
        const txBought = await this.app.mysql.select('transactions', {
            where: {
                trader: trader,
            },
        });
console.log(txBought.length);  
        const txBoughtJson = JSON.stringify(txBought);
	    console.log("txBoughtJson",txBoughtJson.length);
        return txBoughtJson;
    }

    // 插入信息
    async insertTx(tx) {
        const result = await this.app.mysql.insert('transactions', tx);
        const resultSuccess = result.affectedRows === 1;
        return resultSuccess;
    }

    // 更新信息
    async updateTx(tx, options) {
        const resultUpdate = await this.app.mysql.update('transactions', tx, options);
        const updateSuccess = resultUpdate.affectedRows === 1;
        return updateSuccess;
    }
}

// 输出tx接口
module.exports = TxService;

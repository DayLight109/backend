const { app, assert } = require('egg-mock/bootstrap');
const path = require('path');
const fs = require('fs');

describe('test/other/chaincode.test.js', () => {
    it.skip('enrollAdmin', async () => {
        const ctx = app.mockContext();
        assert(await ctx.helper.enrollAdmin())
    });

    it('add', async () => {
        const ctx = app.mockContext();
        const { contract } = await ctx.helper.getFabricObj();
        const result = await contract.submitTransaction('add', "test2", "testfilename", "11024", "testfilehash", "testuser", "99");
        const tmp = result.toString();
        assert(tmp != "");

        let name = "tmp-add" + new Date().toISOString() + ".json";
        fs.writeFileSync(path.join(__dirname, name), tmp);
    });

    it('countAll', async () => {
        const ctx = app.mockContext();
        const { contract } = await ctx.helper.getFabricObj();
        const result = await contract.submitTransaction('countAll');
        assert(result != "");

        let name = "tmp-countAll" + new Date().toISOString() + ".json";
        fs.writeFileSync(path.join(__dirname, name), result.toString());
    });

    it.skip('channel', async () => {
        const ctx = app.mockContext();
        const { channel } = await ctx.helper.getFabricObj();
        // console.log('getChannelPeers:',await channel.getChannelPeers());
        // console.log('getMSPManager:',await channel.getMSPManager());
        // console.log('getName:',await channel.getName());
        // console.log('getOrderers:',await channel.getOrderers());
        // console.log('getOrganizations:',await channel.getOrganizations());
        // console.log('getPeers:',await channel.getPeers());
        let res = await channel.queryBlock(25, null, true);
        let name = "tmp-queryblock" + new Date().toISOString() + ".json";
        fs.writeFileSync(path.join(__dirname, name), JSON.stringify(res));

        name = "tmp-queryInfo" + new Date().toISOString() + ".json";
        res = await channel.queryInfo(null, true);
        fs.writeFileSync(path.join(__dirname, name), JSON.stringify(res));
    });
});
const { app, assert } = require('egg-mock/bootstrap');
describe('app/service/user.js', () => {
    it('sayHello', async () => {
        const ctx = app.mockContext();
        const result = await ctx.service.user.sayHello();
        assert(result == "hello");
    });

    it('find', async () => {
        const ctx = app.mockContext();
        const result = await ctx.service.user.find("user1");
        assert(result);
    });

    it('findPd', async () => {
        const ctx = app.mockContext();
        const result = await ctx.service.user.findPd("user1");
        assert(result);
    });


});
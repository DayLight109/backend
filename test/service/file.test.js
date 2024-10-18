const { app, assert } = require('egg-mock/bootstrap');
describe('app/service/file.js', () => {
    it('addFile', async () => {
        const ctx = app.mockContext();
        const fileRaw = {
            name: "1",
            filehash: "ed8195c3f4bd6ec4f3940d69977d472d",
            filesize: 180425,
            filename: "纸贵科技-北京技术部管理制度V101620453918391pdf",
            fileurl: "/home/ziggurat/newland/backend/uploads/纸贵科技 - 北京技术部管理制度 V1.0-1620453918391.pdf",
            owner: "user1",
            price: 1,
            fileid: "ed8195c3f4bd6ec4f3940d69977d472d",
          };

        const result = await ctx.service.file.addFile(fileRaw);
        assert(result);
    });
});
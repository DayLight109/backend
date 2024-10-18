const Service = require('egg').Service;

class dataInfoService extends Service {

	async allTypeInfo(){
		const typeInfo = await this.app.mysql.select('type_info');
		const typeInfoJson = JSON.stringify(typeInfo);
		return typeInfoJson;
	}

	async allLevelInfo(){
		const levelInfo = await this.app.mysql.select('level_info');
		const levelInfoJson = JSON.stringify(levelInfo);
		return levelInfoJson;
	}
		
//    // 查询全部信息
//    async allFileInfo() {
//        const fileInfo = await this.app.mysql.select('files');
//        const fileInfoJson = JSON.stringify(fileInfo);
//        return fileInfoJson;
//    }
//
//    // 通过name查找信息
//    async fileInfoByName(name) {
//        const fileInfo = await this.app.mysql.select('files', {
//            where: {
//                owner: name,
//            },
//        });
//        const fileInfoJson = JSON.stringify(fileInfo);
//        return fileInfoJson;
//    }
//
//    // 通过name，id查找信息
//    async fileInfoByNameId(name, id) {
//        const fileInfo = await this.app.mysql.select('files', {
//            where: {
//                owner: name,
//                fileid: id,
//            },
//        });
//        const fileInfoJson = JSON.stringify(fileInfo);
//        return fileInfoJson;
//    }
//    // 通过owner，id查找文件信息
//    async fileInfoByOwnerId(owner, id) {
//        const fileInfo = await this.app.mysql.get('files', { owner: owner, fileid: id });
//        let fileInfoJson = JSON.stringify(fileInfo);
//        return fileInfoJson;
//    }
//    // 通过id查找信息
//    async fileInfoById(id) {
//        const fileInfo = await this.app.mysql.get('files', { fileid: id });
//        const fileInfoJson = JSON.stringify(fileInfo);
//        return fileInfoJson;
//    }
//    // 通过fileid查找owner
//    async fileOwnerByfileId(id) {
//        const owner = await this.app.mysql.get('files', { fileid: id });
//        let ownerJson = JSON.stringify(owner);
//        return ownerJson;
//    }
//
//    // 添加文件
//    async addFile(obj) {
//        const sql = `INSERT INTO fabric.files (fileid,name,filename,filehash,filesize,fileurl,owner,price) 
//                     VALUES ('${obj.filehash}','${obj.name}','${obj.filename}','${obj.filehash}',${obj.filesize},'${obj.fileurl}','${obj.owner}',${obj.price});`
//        const insertRes = await this.app.mysql.query(sql);
//        return insertRes.affectedRows === 1;;
//    }
//    // 更新文件
//    async updateFile(fileinfo, options) {
//        const updateRes = await this.app.mysql.insert('files', fileinfo, options)
//        // const updateSuccess = updateRes.affectedRows === 1;
//        return updateRes;
//    }
}

// 输出为dataInfo接口
module.exports = dataInfoService;
'use strict';

const Controller = require('egg').Controller;
const path = require('path');
const md5File = require('md5-file');
const fs = require('mz/fs');
const pump = require('mz-modules/pump');

class DataController extends Controller {
  //  上传文件
  async upload() {
    const { ctx, config } = this;
    const { id } = ctx.state.user;

    const file = ctx.request.files[0];
    if (!file) return ctx.throw(404);


    const ext = path.extname(file.filename);
    const base = path.basename(file.filename, ext);
    const filename = `${base}-${Date.now()}${ext}`;
    const stats = fs.statSync(file.filepath);
    const filesize = stats.size;
    const filehash = md5File.sync(file.filepath);

    const uploadPath = path.join(this.config.baseDir, `uploads/`);
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

    const targetPath = path.join(uploadPath, filename);
    const source = fs.createReadStream(file.filepath);
    const target = fs.createWriteStream(targetPath);
    const fileurl = targetPath;
    try {
      await pump(source, target);
    } finally {
      // delete those request tmp files
      await ctx.cleanupRequestFiles();
    }

    ctx.body = { filename, filesize, filehash, fileurl };

  }
  // 添加文件记录
  async add() {
    const { ctx } = this;
    const { name, fileName, fileSize, fileHash, fileUrl, price, } = ctx.request.body;
    const id = ctx.state.user.name;
    const fileRaw = {
      name: name,
      filehash: fileHash,
      filesize: fileSize,
      filename: fileName,
      fileurl: fileUrl,
      owner: id,
      price: price,
      fileid: fileHash
    };

    const { contract } = await ctx.helper.getFabricObj();
    const cddd = await contract.submitTransaction('add', name, fileName, fileSize.toString(), fileHash, id, price.toString());
    const tmp = cddd.toString();
    const payload = JSON.parse(tmp);

    await ctx.service.file.addFile(fileRaw);
    let resInfo = {
      success: true,
      message: "Successfully invoked the chaincode to the channel businesschannel.",
      txId: payload.id,
      payload: fileRaw
    };
    ctx.body = resInfo;
  }
  // 征信数据下载
  async download() {
    const { app, ctx, config } = this;
    const name = ctx.state.user.name;
    const id = ctx.request.body.id;
    // 数据文件下载
    const fileinfo = await ctx.service.file.fileInfoByNameId(name, id);
    const fileInfo = JSON.parse(fileinfo);

    const fileurl = fileInfo[0].fileurl;

    ctx.attachment(fileurl);
    ctx.set('Access-Control-Expose-Headers', 'Content-Disposition');
    ctx.set('Content-Type', 'application/octet-stream');
    ctx.body = fs.createReadStream(fileurl);
  }

  // 列出购买记录
  async listBought() {
    const { app, ctx } = this;
    const name = ctx.state.user.name;
    let filesinfo = await ctx.service.tx.findByTrader(name);
    console.log("---------------------------name = "+name+"---------------------");
    let filesInfo = JSON.parse(filesinfo);
    let num = filesInfo.length;

    const resInfo = {
      totalPage: 1,
      totalSize: num,
      transactions: filesInfo.map(fileinfo => ({
        id: fileinfo.txid,
        name: fileinfo.filename,
        version: '1',
        type: "文件资料",
        confidentialLevel: "",
        owner: fileinfo.owner,
        organization: "org1",
        timestamp: "2020-08-25 10:27:10"
      }))
    };
    ctx.body = resInfo;
  }
  // 列出所属记录
  async listOwn() {
    const { app, ctx } = this;
    const name = ctx.state.user.name;
    let fileOwnInfo = await ctx.service.file.fileInfoByName(name);
    let fileInfo = JSON.parse(fileOwnInfo);
    const resInfo = {
      datas: fileInfo.map(fileinfo => ({
        id: fileinfo.fileid,
        name: fileinfo.name,
        version: 1,
        type: "",
        confidentialLevel: "",
        tilestamp: "",
        price: fileinfo.price,
      })),
    };
    ctx.body = resInfo;
  }

  // 列出信息
  async listSold() {
    const { app, ctx } = this;
    let fileAllInfo = await ctx.service.tx.allTxInfo();
    let fileInfo = JSON.parse(fileAllInfo);
    const resInfo = {
      datas: fileInfo.map(fileinfo => ({
        id: fileinfo.fileid,
        name: fileinfo.name,
        buyer: fileinfo.trader,
//        dataPrice:fileinfo.amount,
        version: 1,
        type: "",
        confidentialLevel: "",
        tilestamp: "",
        price: fileinfo.amount,
      })),
    };
    ctx.body = resInfo;
  }
// 展示总体信息
  async info() {
    const { app, ctx } = this;
    const { id } = ctx.state.user;
    const name = ctx.state.user.name; //new 

    let fileAll = await ctx.service.file.allFileInfo();
    fileAll = JSON.parse(fileAll);
    let countAll = fileAll.length;

    let fileBought = await ctx.service.tx.findByTrader(name);

        let fileBoughtJson = JSON.parse(fileBought);

    let countBought = fileBoughtJson.length;
    

    console.log("1111111111111111111111",countBought);

    let txAll = await ctx.service.tx.allTxInfo();
    txAll = JSON.parse(txAll);
    let countTx = txAll.length;

    let fileOwn = await ctx.service.file.fileInfoByName(name);
    fileOwn = JSON.parse(fileOwn);
    let countOwn = fileOwn.length;

    const resInfo = {
      all: countAll,
      bought: countBought,
      traded: countTx,
      review: {
        all: "",
        pending: ""
      },
      own: countOwn,
      tort: ""
    };
    ctx.body = resInfo;
  }

  // 展示文件信息
  async inspect() {
    const { app, ctx } = this;
    const id = ctx.query.id;

    let fileinfo = await ctx.service.file.fileInfoById(id);
    let fileInfo = JSON.parse(fileinfo);
    const versions = [1];

    let data = {
      txId: fileInfo.fileid,
      id: fileInfo.fileid,
      name: fileInfo.name,
      version: "1",
      type: "",
      confidentialLevel: "",
      fileName: fileInfo.filename,
      fileSize: fileInfo.filesize,
      fileHash: fileInfo.filehash,
      fileUrl: fileInfo.fileurl,
      owner: fileInfo.owner,
      price: fileInfo.price,
      needApply: true,
      description: "",
      timestamp: "2021-03-10 10:06:27",
      originalFileName: "",
      free: true,
      organization: "组织部",
      blockHeight: "1"
    };

    ctx.body = { versions, data };
  }
  // 购买征信数据
  async apply() {
    const { app, ctx } = this;
    const fileid = ctx.request.body.id;
    const trader = ctx.state.user.name;

    let traderAmount = await ctx.service.user.findAmount(trader);
    let fileOwner = await ctx.service.file.fileOwnerByfileId(fileid);
    traderAmount = JSON.parse(traderAmount);
    fileOwner = JSON.parse(fileOwner);

    let price = fileOwner.price;

    let ownerAmount = await ctx.service.user.findAmount(fileOwner.owner);
    ownerAmount = JSON.parse(ownerAmount);

    let traderFileAmount = traderAmount[0].amount - price;
    let ownerFileAmount = ownerAmount[0].amount + price;

    let updateTraderRes = await ctx.service.user.updateAmount(traderFileAmount, trader);
    let updateOwnerRes = await ctx.service.user.updateAmount(ownerFileAmount, fileOwner.owner);

//    let file = await ctx.service.user.fileInfoByName(fileOwner);
//    file = JSON.parse(file);
    let txRaw = {
      txid: fileOwner.fileid,
      filename: fileOwner.filename,
      filehash: fileOwner.filehash,
      owner: fileOwner.owner,
      trader: trader,
      name:fileOwner.name,
      amount:fileOwner.price,
    };

    let insertTx = await ctx.service.tx.insertTx(txRaw);
    const resInfo = {
      success: true,
      message: "Successfully invoked the chaincode to the channel mychannel.",
      // ???
      txId: "b7dd6c708db80fa397b35d10440a0bd71cf7f1420aca13698e7a7edb211e20a1",
      payload: "",

    };
    ctx.body = resInfo;
  }
  // 列出所有征信数据
  async listAll() {
    const { app, ctx } = this;
    const { id } = ctx.state.user;

    let filesinfo = await ctx.service.file.allFileInfo();

    const filesInfo = JSON.parse(filesinfo);
    const number = filesInfo.length;

    ctx.body = {
      totalPage: 1,
      totalSize: number,
      transactions: filesInfo.map(fileinfo => ({
        id: fileinfo.fileid,
        name: fileinfo.name,
        version: 1,
        type: "",
        confidentialLevel: "",
        owner: fileinfo.owner,
        organization: "",
        timestamp: "2021-03-10 10:06:27",
        status: "",
        price: fileinfo.price,
        description: "",
        free: "",
      })),
    };
  }
}
// 导出data接口
module.exports = DataController;

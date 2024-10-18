'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const crypto = require('crypto');
const { X509WalletMixin, FileSystemWallet, Gateway } = require('fabric-network');

const config = yaml.load(fs.readFileSync(path.join(process.cwd(), 'connect-conf/nodejs-sdk-config.yaml'), 'utf8'));
const wallet = new FileSystemWallet(config.walletPath);
let fabricNetworkConn = null;

module.exports = {
  cipher(key, buf) {
    const cipher = crypto.createCipheriv('aes192', key);
    let encrypted = cipher.update(buf, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  },
  decipher(key, encrypted) {
    const decipher = crypto.createDecipheriv('aes192', key);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  },
  formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  },
  formatDateTime(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  },

  async enrollAdmin() {
    try {
      const credPath = path.join(config.fixtures.base, config.fixtures.toUser);
      const cert = fs.readFileSync(path.join(credPath, config.fixtures.signCert)).toString();
      const key = fs.readFileSync(path.join(credPath, config.fixtures.priKey)).toString();

      const identity = X509WalletMixin.createIdentity('Org1MSP', cert, key);
      await wallet.import(config.label, identity);
      return true;
    } catch (error) {
      console.error(error);
    }
  },

  async getFabricObj() {
    try {
      await this.enrollAdmin();
      if (fabricNetworkConn) {
        return fabricNetworkConn;
      }
      const gateway = new Gateway();
      const ccpath = path.join(process.cwd(), config.ccpPath);
      await gateway.connect(ccpath, {
        wallet,
        identity: config.label,
        discovery: {
          enabled: true,
          asLocalhost: true
        }
      });
      const network = await gateway.getNetwork(config.channel);

      fabricNetworkConn = {
        channel: network.getChannel(),
        contract: network.getContract(config.cc)
      }
      return fabricNetworkConn;

    } catch (error) {
      console.error(error);
    }
  }
};

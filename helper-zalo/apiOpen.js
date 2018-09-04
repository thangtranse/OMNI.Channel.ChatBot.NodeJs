// const ZaloSocial = require('zalo-sdk').ZaloSocial;
// const zsConfig = config.zalo;
// const ZSClient = new ZaloSocial(zsConfig);

const config = require('../config');
var ZaloOA = require('zalo-sdk').ZaloOA;
const code = config.zalotoken;
var zaConfig = {
    oaid: config.zalo.appId,
    secretkey: config.zalo.secretkey
}

const sending = (_userId, _message) => {
    var ZOAClient = new ZaloOA(zaConfig);
    return new Promise((resolve, reject) => {
        ZOAClient.api('sendmessage/text', 'POST', {uid: _userId, message: _message}, (response) => {
            resolve(response);
        })
    })
}

module.exports = {sending}
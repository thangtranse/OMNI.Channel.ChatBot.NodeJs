const ZaloSocial = require('zalo-sdk').ZaloSocial;
const config = require('../config');
// const zsConfig = config.zalo;
// const ZSClient = new ZaloSocial(zsConfig);
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
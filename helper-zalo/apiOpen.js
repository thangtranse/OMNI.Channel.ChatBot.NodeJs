// const ZaloSocial = require('zalo-sdk').ZaloSocial;
// const zsConfig = config.zalo;
// const ZSClient = new ZaloSocial(zsConfig);
const config = require('../config');

const ZaloOA = require('zalo-sdk').ZaloOA;
const zaConfig = {
    oaid: config.zalo.appId,
    secretkey: config.zalo.secretkey
}
const ZOAClient = new ZaloOA(zaConfig);

const sending = (_userId, _message) => {
    return new Promise((resolve, reject) => {
        ZOAClient.api('sendmessage/text', 'POST', {uid: _userId, message: _message}, (response) => {
            resolve(response);
        });
    })
}

const getInforUser = (_userId) => {
    return new Promise((resolve, reject) => {
        ZOAClient.api('getprofile', {uid: _userId}, function (response) {
            console.log('getprofile: ',response);
        })
    })
}

module.exports = {sending, getInforUser}
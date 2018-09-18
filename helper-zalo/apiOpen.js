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

/**
 * Thực hiện lấy thông tin User
 * @param _userId
 * @returns {Promise<any>}
 */
const getInforUser = (_userId) => {
    return new Promise((resolve, reject) => {
        ZOAClient.api('getprofile', {uid: _userId}, response => {
            if (response.errorCode == 1) {
                resolve(response.data);
            }else{
                console.log("error API ZALO: ", response);
            }
        })
    })
}

module.exports = {sending, getInforUser}
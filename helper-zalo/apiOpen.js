const ZaloSocial = require('zalo-sdk').ZaloSocial;
const config = require('../config');
const zsConfig = config.zalo;
const ZSClient = new ZaloSocial(zsConfig);
const code = config.zalotoken;

const sending = (_userId, _message) => {
    console.log("tmt: ", code);
    ZSClient.getAccessTokenByOauthCode(code, function (response) {
        if (response && response.access_token) {
            ZSClient.setAccessToken(response.access_token);
        }
    });
    return new Promise((resolve, reject) => {
        ZOAClient.api('sendmessage/text', 'POST', {uid: _userId, message: _message}, (response) => {
            resolve(response);
        })
    })
}

module.exports = {sending}
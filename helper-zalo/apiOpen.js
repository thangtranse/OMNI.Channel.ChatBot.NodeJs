var ZaloSocial = require('zalo-sdk').ZaloSocial;
var config = require('../config');

var zsConfig = config.zalo;

var ZSClient = new ZaloSocial(zsConfig);
var code = config.zalotoken;

ZSClient.getAccessTokenByOauthCode(code, function (response) {
    if (response && response.access_token) {
        ZSClient.setAccessToken(response.access_token);
    }
});


const sending = (_userId, _message) => {
    return new Promise((resolve, reject) => {
        ZOAClient.api('sendmessage/text', 'POST', {uid: _userId, message: _message}, (response) => {
            resolve(response);
        })
    })
}

module.exports = {sending}
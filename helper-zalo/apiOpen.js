var ZaloSocial = require('zalo-sdk').ZaloSocial;
var config = require('../config');

var zsConfig = config.zalo;

var ZSClient = new ZaloSocial(zsConfig);
var code = 'Your oauth code';

ZSClient.getAccessTokenByOauthCode(code, function(response) {
    if (response && response.access_token) {
        ZSClient.setAccessToken(response.access_token);
    }
});

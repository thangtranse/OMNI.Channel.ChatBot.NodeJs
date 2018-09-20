const request = require('request');
const config = require('../config');

const sendMsg = async (_url, _conversationId, _activityId, _dataMsg) => {
    let valueToken = await getToken();
    return new Promise((resolve, reject) => {
        request({
            url: `${_url}v3/conversations/${_conversationId}/activities/${_activityId}`,
            method: "POST",
            headers: {
                "Authorization": "Bearer " + valueToken,
                "Content-Type": "application/json"
            },
            json: _dataMsg
        }, (error, response, body) => {
            console.log("thang:: ", response.statusCode);
            console.log("body:: ", body);
            console.log("error:: ", error);
            if (!error && response.statusCode === 200) {
                resolve(body);
            } else {
                reject(error);
            }
        })
    })
}

const getToken = () => {
    return new Promise((resolve, reject) => {
        request({
            url: "https://login.microsoftonline.com/botframework.com/oauth2/v2.0/token",
            method: "POST",
            form: {
                "grant_type": config.azure.grant_type,
                "client_id": config.azure.client_id,
                "client_secret": config.azure.client_secret,
                "scope": config.azure.scope
            }
        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                let temp = JSON.parse(body);
                resolve(temp.access_token);
            }
            reject(body);
        })
    })
}

module.exports = {sendMsg}
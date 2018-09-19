const request = require('request');
const config = require('../config');

const sendMsg = (_url, _conversationId, _activityId, _dataMsg) => {
    return new Promise((resolve, reject) => {
        request({
            url: `${_url}/v3/conversations/${_conversationId}/activities/${_activityId}`,
            method: "POST",
            headers: {
                "Authorization": "Bearer " + config.azure.token,
                "Content-Type": "application/json"
            },
            json: _dataMsg
        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                resolve(body);
            } else {
                reject(error);
            }
        })
    })
}

module.exports = {sendMsg}
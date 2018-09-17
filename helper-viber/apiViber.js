const request = require('request');
const config = require('../config');

const sendMsg = (_userId, _dataMsg) => {
    return new Promise((resolve, reject) => {
        request({
            url: "https://chatapi.viber.com/pa/send_message",
            method: "POST",
            headers: {
                "X-Viber-Auth-Token": config.viber.token,
                "Content-Type": "application/json"
            },
            json: {
                receiver: _userId.trum(),
                min_api_version: 1,
                sender: {
                    name: "John McClane",
                    avatar: "http://avatar.example.com"
                },
                tracking_data: "tracking data",
                type: "text",
                text: _dataMsg
            }
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
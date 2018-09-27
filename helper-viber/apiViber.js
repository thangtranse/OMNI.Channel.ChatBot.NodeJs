const request = require('request');

const sendMsg = (_userId, _dataMsg) => {
    return new Promise((resolve, reject) => {
        request({
            url: "https://chatapi.viber.com/pa/send_message",
            method: "POST",
            headers: {
                "X-Viber-Auth-Token": process.env.VIBER_TOKEN,
                "Content-Type": "application/json"
            },
            json: {
                receiver: _userId.trim(),
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
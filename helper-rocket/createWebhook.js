"use strict"

const request = require('request');

class createWebhook {


    constructor() {
    }

    /**
     * Tạo incoming webhook
     */
    create_income() {
        request({
            "uri": process.env.ROCKET_URL_API_ROCKET + 'integrations.create',
            "qs": {"access_token": 'G9HvcSvqrkBcAmgz9/HXp6YNwzcD273PuCBk7PhnXgn3b33gFBjoS77rWztTyp7kPb'},
            "method": "POST",
            "json": request_body
        }, (err, res, body) => {
            if (!err) {
                console.log('message sent!')
            } else {
                console.error("Unable to send message:" + err);
            }
        });
    }

    /**
     * Gửi tin nhắn đến incoming webhook
     * @param _id
     * @param _msg
     */
    sendMsgToRocket(_id, _msg) {
        let request_body = {
            "text": _msg,
            "userId": _id
        }
        request({
            "uri": "https://ten-lua.herokuapp.com/hooks/G9HvcSvqrkBcAmgz9/HXp6YNwzcD273PuCBk7PhnXgn3b33gFBjoS77rWztTyp7kPb",
            "qs": {"access_token": 'G9HvcSvqrkBcAmgz9/HXp6YNwzcD273PuCBk7PhnXgn3b33gFBjoS77rWztTyp7kPb'},
            "method": "POST",
            "json": request_body
        }, (err, res, body) => {
            if (!err) {
                console.log('message sent!')
            } else {
                console.error("Unable to send message:" + err);
            }
        });
    }
}

module.exports = createWebhook;

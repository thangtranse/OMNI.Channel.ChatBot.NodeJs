"use strict"

const URL_API_ROCKET = 'http://ten-lua.herokuapp.com/api/v1/';
const request = require('request');
const TOKEN = '';

class createWebhook {


    constructor() {
    }

    create_income() {
        request({
            "uri": URL_API_ROCKET + 'integrations.create',
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
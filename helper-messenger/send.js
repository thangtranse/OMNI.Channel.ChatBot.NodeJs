// Sends response messages via the Send API
const callSendAPI = (sender_psid, response) => {
// Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }
    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": {"access_token": 'EAAG9mksIwrUBAGI7pm0p4X7rAS25WJNZBDCGS3XdnPX6Bsf0whRmnT2OdHZCFTZCgK7lAcJi8ZBn8hZC1WKxhTTS5VZBsSEZCamCMKje7ZCiPokxuhDEgbiFEXPlukU9rRm3uE0JzEO2oyxCcWpDIvZCYR4ATW6YZAkdZABQi7wUTtQVgZDZD'},
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

module.exports = {callSendAPI}

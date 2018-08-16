const request = require('request');
const PAGE_ACCESS_TOKEN = require('../config').PAGE_ACCESS_TOKEN;

/**
 * Sends response messages via the Send API
 * @param sender_psid: id người nhắn tin
 * @param response nội dung gửi
 * response: {
 *     text: "Nội dung trả gửi"
 * }
 */
const callSendAPI = (sender_psid, response) => {
// Construct the message body
    parameterSentGraph(sender_psid, response);
}


const sendMessengerTemplateList = (sender_psid, list) => {
    let test = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "list",
                "top_element_style": "compact",
                "elements": [
                    {
                        "title": "Classic T-Shirt Collection",
                        "subtitle": "See all our colors",
                        "image_url": "https://peterssendreceiveapp.ngrok.io/img/collection.png",
                        "buttons": [
                            {
                                "title": "View",
                                "type": "web_url",
                                "url": "https://peterssendreceiveapp.ngrok.io/collection",
                                "messenger_extensions": true,
                                "webview_height_ratio": "tall",
                                "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                            }
                        ]
                    }
                ]
            }
        }
    }
    parameterSentGraph(sender_psid, test);
}

const parameterSentGraph = (sender_psid, response) => {
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }
    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": {"access_token": PAGE_ACCESS_TOKEN},
        "method": "POST",
        "json": request_body
    }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            // Message has been successfully received by Facebook.
            console.log(
                `Successfully sent message to endpoint: `,
                JSON.stringify(body)
            );
        } else {
            console.error(
                `Failed calling Messenger API endpoint`,
                response.statusCode,
                response.statusMessage,
                body.error
            );
        }
    });
}

module.exports = {callSendAPI, sendMessengerTemplateList}

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
    parameterSentGraph("messages", sender_psid, response);
}


const sendMessengerTemplateList = (sender_psid, list) => {
    let test;
    if (list.users.length > 0) {
        test = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "list",
                    "top_element_style": "compact",
                    "elements": [],
                    "buttons": [
                        {
                            "title": "View More",
                            "type": "postback",
                            "payload": "payload"
                        }
                    ]
                }
            }
        }
        list.users.map(data => {
            test.attachment.payload.elements.push({
                "title": data.username,
                "subtitle": data._id
            })
        });
    } else {
        test = {"text": "Không tìm thấy"}
    }
    console.log("----------------------------------------------------------------------------11122");
    console.log(test);
    console.log(test.attachment.payload.elements);
    console.log("----------------------------------------------------------------------------11122");
    parameterSentGraph("messages?access_token=" + PAGE_ACCESS_TOKEN, sender_psid, test);
    parameterSentGraph("messages", sender_psid, test);
}

const parameterSentGraph = (endpoint, sender_psid, response) => {
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }
    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/" + endpoint,
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

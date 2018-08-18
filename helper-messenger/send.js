const graph = require('./graph');
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
    graph.parameterSentGraph("messages", sender_psid, response);
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
        // list.users.forEach(data => {
        test.attachment.payload.elements.push({
            "title": data.username,
            "subtitle": data._id
        })
        // });
    } else {
        test = {"text": "Không tìm thấy"}
    }
    graph.parameterSentGraph("messages?access_token=" + PAGE_ACCESS_TOKEN, sender_psid, test);
    graph.parameterSentGraph("messages", sender_psid, test);
}

module.exports = {callSendAPI, sendMessengerTemplateList}

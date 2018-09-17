const graph = require('./graph');
const mongodb = require("../database/mongodb");
const PAGE_ACCESS_TOKEN = require('../config').PAGE_ACCESS_TOKEN;
const config = require("../config");

const forwardFacebook = async (_data) => {
    var getDataUser = await mongodb.findOne(config.mongodb.collection, {"idRoomRocket": _data.channel_id}).then(data => data);
    if (getDataUser && _data.user_name.trim() != config.rocket.username) {
        let uidFacebook = getDataUser.userId;
        callSendAPI(uidFacebook, _data.text);
    }
}

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

module.exports = {callSendAPI, sendMessengerTemplateList, forwardFacebook}

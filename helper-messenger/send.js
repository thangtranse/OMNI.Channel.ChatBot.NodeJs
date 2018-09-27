const graph = require('./graph');
const mongodb = require("../database/mongodb");
const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN


const forwardFacebook = async (_data) => {
    var getDataUser = await mongodb.findOne(process.env.MONGODB_COLLECTION, { "idRoomRocket": _data.channel_id }).then(data => data);
    if (getDataUser && _data.user_name.trim() != process.env.ROCKET_USERNAME) {
        callSendAPI(getDataUser.uid, _data.text);
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
    console.log("sender_psid", sender_psid);
    console.log("response", response);
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
        test = { "text": "Không tìm thấy" }
    }
    graph.parameterSentGraph("messages?access_token=" + PAGE_ACCESS_TOKEN, sender_psid, test);
    graph.parameterSentGraph("messages", sender_psid, test);
}

module.exports = { callSendAPI, sendMessengerTemplateList, forwardFacebook }

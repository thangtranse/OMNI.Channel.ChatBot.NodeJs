const db = require('../database/connectDb');
const api = require('../helper-rocket/apiRest');
const MessengerSend = require('./send');

/**
 * Handles messages events
 * Phản hồi tin nhắn khách hàng
 * @param sender_psid id-user gửi tin nhắn
 * @param received_message nội dung tin nhắn
 */
const handleMessage = (sender_psid, received_message) => {
    let response = null;
    let pattern = /^(-){2}([a-zA-Z])\w+/g;
    // tin nhắn không chưa nội dung
    console.log("handleMessage", received_message.text);
    if (!received_message.text) return;
    // kiểm tra id đối tượng gửi tin đã đăng nhập hay chưa
    db.getDataUser(sender_psid, (data) => {
        console.log("kiểm tra sender_psid: ", sender_psid);
        if (typeof data != "undefined") { // khách hàng đã login
            console.log("Tồn tại: ", data);
            switch ((received_message.text).toLowerCase()) {
                case 'bắt đầu':
                    callSendAPI(sender_psid, {"text": "Bạn đã đăng nhập rồi!"});
                    break;
                default:
                    response = {
                        "text": received_message
                    }
            }
            if (!pattern.test(received_message.text.trim())) {
                api.sendMess('GENERAL', received_message.text, data.token_rocket.stringValue, data.id_rocket.stringValue,
                    data => {
                        console.log("tin nhắn được gửi đến rocket: ", data.status);
                    });
            } else {
                codeExecute(received_message);
            }
        } else { // khách hàng chưa login
            console.log("KH chưa tồn tại");
            switch ((received_message.text).toLowerCase()) {
                case 'bắt đầu':
                    loginRocketWithFacebook(sender_psid);
                    break;
                default:
                    response = {
                        "text": received_message
                    }
            }
        }
    });
}

// Handles messaging_postbacks events
const handlePostback = (sender_psid, received_postback) => {
    console.log("post_back", sender_psid);
    console.log("received_postback", received_postback);
}


/**
 * Thực hiện đăng nhập bằng tài khoản FB với ROCKET
 */
const loginRocketWithFacebook = (sender_psid) => {
    var response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Đăng nhập để trò chuyện cùng chúng tôi",
                    "subtitle": "Tài khoản FB của bạn sẽ liên kết đến ứng dụng của chúng tôi...",
                    "buttons": [
                        {
                            "type": "account_link",
                            "url": "https://ten-lua-webhook.herokuapp.com/auth/facebook"
                        }
                    ],
                }]
            }
        }
    }
    MessengerSend.callSendAPI(sender_psid, response);
}

const codeExecute = (data) => {
    console.log("thực thi câu lệnh", data);
}

module.exports = {
    handleMessage,
    handlePostback,
};

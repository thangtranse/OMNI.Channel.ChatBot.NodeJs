const db = require('./database/connectDb');
const api = require('./helper-rocket/apiRest');

/**
 * Handles messages events
 * Phản hồi tin nhắn khách hàng
 * @param sender_psid id-user gửi tin nhắn
 * @param received_message nội dung tin nhắn
 */
const handleMessage = (sender_psid, received_message) => {
    let response = null;
    // tin nhắn không chưa nội dung
    console.log("handleMessage", received_message.text);
    if (!received_message.text) {
        return;
    }
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
            api.sendMess('GENERAL', received_message.text, data.token_rocket.stringValue, data.id_rocket.stringValue,
                data => {
                    console.log("tin nhắn được gửi đến rocket: ", data.status);
                });
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
function handlePostback(sender_psid, received_postback) {
    console.log("post_back", sender_psid);
    console.log("received_postback", received_postback);
}

module.exports = {
    handleMessage,
    handlePostback,
};

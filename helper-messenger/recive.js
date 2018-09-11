const db = require('../database/connectDb');
const api = require('../helper-rocket/apiRest');
const graph = require('./graph');
const MessengerSend = require('./send');

/**
 * Handles messages events
 *
 * Nhận tin nhắn từ FACEBOOK
 *
 * Phản hồi tin nhắn khách hàng
 * @param sender_psid: id-user gửi tin nhắn
 * @param received_message: nội dung tin nhắn
 */
const handleMessage = (sender_psid, received_message) => {
    let response = null;
    let pattern = /^(-){2}([a-zA-Z])\w+/g;
    // tin nhắn không chưa nội dung
    console.log("handleMessage", received_message.text);
    if (!received_message.text) return;
    // kiểm tra id đối tượng gửi tin nhắn đã đăng nhập hay chưa
    db.getDataUser(sender_psid, (data) => {
        console.log("kiểm tra sender_psid: ", sender_psid);
        if (typeof data != "undefined") { // khách hàng đã login
            switch ((received_message.text).toLowerCase()) {
                case 'bat dau':
                case 'start':
                case 'dang nhap':
                case 'đăng nhập':
                case 'login':
                case 'bắt đầu':
                    MessengerSend.callSendAPI(sender_psid, {"text": "Bạn đã đăng nhập rồi!"});
                    break;
                case 'ket thuc':
                case 'kết thúc':
                case 'đăng xuất':
                case 'dang xuat':
                case 'end':
                    logoutRocketWithAccountFacebook(sender_psid);
                    break;
                default:
                    response = {
                        "text": received_message
                    }
            }
            // Kiểm tra xem người dùng có sử dụng câu lệnh không
            if (!pattern.test(received_message.text.trim())) { // không sử dụng câu lệnh
                console.log("thang không sử dụng câu lệnh: ", received_message.text.trim());
                api.sendMess('GENERAL',
                    received_message.text, data.token_rocket.stringValue, data.id_rocket.stringValue,
                    data => {
                        console.log("tin nhắn được gửi đến rocket: ", data.status);
                    });
            } else { // sử dụng câu lệnh
                codeExecute(data, received_message);
            }
        } else { // khách hàng chưa login
            console.log("KH chưa tồn tại");
            switch ((received_message.text).toLowerCase()) {
                case 'bat dau':
                case 'start':
                case 'dang nhap':
                case 'đăng nhập':
                case 'login':
                case 'bắt đầu':
                    loginRocketWithFacebook(sender_psid);
                    break;
                case 'ket thuc':
                case 'kết thúc':
                case 'đăng xuất':
                case 'dang xuat':
                    MessengerSend.callSendAPI(sender_psid, {"text": "Bạn chưa đăng nhập vui lòng gõ 'Bắt đầu' để đăng nhập"});
                    break;
                default:
                    privateCustomer(sender_psid, received_message);
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

/**
 * Đăng xuất
 * Xóa dữ liệu trên firebase
 * @param sender_psid
 */
const logoutRocketWithAccountFacebook = (sender_psid) => {
    db.deleteUser(sender_psid);
    MessengerSend.callSendAPI(sender_psid, {text: "Bạn đã đăng xuất thành công"});
}

/**
 * Thực thi các câu lệnh
 * --join tham :gia vào kênh
 * --listgroup :lấy danh sách group
 * --listuser :lấy danh sách user
 * --searchuser keyword :tìm kiếm user
 * @param
 * + user{
 *  id_fb : {stringValue: "giá trị", valueType: "loại dữ liệu"} -> id messenger của tin nhắn
 *  id_rocket: {stringValue: "giá trị", valueType: "loại dữ liệu"} -> id User trên Rocket
 *  name: {stringValue: "giá trị", valueType: "loại dữ liệu"} ->  tên người dùng
 *  token_facebook: {stringValue: "giá trị", valueType: "loại dữ liệu"} ->
 *  token_rocket: {stringValue: "giá trị", valueType: "loại dữ liệu"} ->
 * }
 * + data {
 *  mid : '',
 *  seq: '',
 *  text: 'nội dung câu lệnh'
 * }
 */
const codeExecute = (user, data) => {
    let key = data.text.substr(0, data.text.indexOf(" ")).trim();
    let keyword = data.text.substring((data.text.indexOf(" ")), data.text.length).trim();
    switch (key) {
        case '--searchuser':
            console.log("key word là : ", keyword);
            api.searchUser(keyword, user.token_rocket.stringValue, user.id_rocket.stringValue, data => {
                console.log("------------------------111-----------------", data);
                MessengerSend.callSendAPI(user.id_fb.stringValue, {"text": "thành công"});
                MessengerSend.sendMessengerTemplateList(user.id_fb.stringValue, data);
            });
            break;
        case '--help':
            let temp = {text: "--searchuser keyword -> Tìm user với keyword"}
            MessengerSend.callSendAPI(user.id_fb.stringValue, temp);
            break;
    }
}

/**
 * Khách hàng chưa đăng nhập
 * @param sender_psid
 * @param received_message
 */
const privateCustomer = (sender_psid, received_message) => {
    console.log("key word ctl + 2: ", sender_psid);
    db.getDataUserPrivate(sender_psid, async data => {
        let userAdmin = await api.login();
        console.log("data: ", data);
        console.log("data login: ", userAdmin);
        if (typeof data == "undefined") {
            let temp = await graph.getInforCustomerChatWithPage(sender_psid);
            if (temp != 404) {
                let conver = JSON.parse(temp);
                // Add Infor Database
                let nameChannel = conver.first_name.toLowerCase().trim().replace(/(\s)/g, ".") + "." + conver.last_name.toLowerCase().trim().replace(/(\s)/g, ".") + "." + sender_psid;
                api.createChannel(nameChannel, userAdmin.userId, userAdmin.authToken, data2 => {
                    if (data2.status == 200) {
                        api.createOutGoingWebhook(nameChannel, userAdmin.userId, userAdmin.authToken, data2 => {
                            console.log("thành công");
                        });
                        db.createUserPrivate(sender_psid, conver.first_name, conver.last_name, conver.profile_pic, nameChannel, data2.data.channel._id);
                        api.sendMess(data2.idChannel.stringValue, received_message.text, userAdmin.authToken, userAdmin.userId,
                            data => {
                                console.log("tin nhắn được gửi đến rocket: ", data.status);
                            });
                    }
                });
            }
            else {
                console.log("sai nè");
            }
        } else {
            api.sendMess(data.idChannel.stringValue, received_message.text, userAdmin.authToken, userAdmin.userId,
                data => {
                    console.log("tin nhắn được gửi đến rocket: ", data.status);
                });
        }
    })
}

module.exports = {
    handleMessage,
    handlePostback,
};

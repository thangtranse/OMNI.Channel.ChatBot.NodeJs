const db = require('../database/connectDb');
const apiRocket = require('../helper-rocket/apiRest');
const graph = require('./graph');
const ProcessStr = require('../libs/processStr');
const MessengerSend = require('./send');
const mongodb = require("../database/mongodb");
const config = require("../config");

/**
 * Handles messages events
 *
 * Nhận tin nhắn từ FACEBOOK
 *
 * Phản hồi tin nhắn khách hàng
 * @param sender_psid: id-user gửi tin nhắn
 * @param received_message: nội dung tin nhắn
 */
const handleMessage = async (sender_psid, received_message) => {
    let response = null;
    let pattern = /^(-){2}([a-zA-Z])\w+/g;

    console.log("handleMessage", received_message.text);

    // tin nhắn không chứa nội dung
    if (!received_message.text) return;

    var checkDataUser = await mongodb.findOne(config.mongodb.collection, {"uid": sender_psid}).then(data => data);

    var idRoomRocket = null;
    var inforUser = null;
    if (checkDataUser) { // tồn tại thông tin
        idRoomRocket = checkDataUser.idRoomRocket;
        inforUser = checkDataUser;
    } else { // chưa có thông tin User
        // Lấy thông tin USER FACEBOOK
        inforUser = await graph.getInforCustomerChatWithPage(sender_psid).then(data => data);
        inforUser = JSON.parse(inforUser);

        var nameSender = inforUser.first_name.toLowerCase().trim().replace(/(\s)/g, ".") + "." + inforUser.last_name.toLowerCase().trim().replace(/(\s)/g, ".");

        console.log("thang2: ", inforUser);

        nameSender = 'Facebook.' + nameSender;
        nameSender = ProcessStr.clearUnikey(nameSender);

        let infoRoomRocket = await apiRocket.infoChannel(nameSender).then(data => data).catch(data => data);

        if (infoRoomRocket.success) {
            idRoomRocket = infoRoomRocket.channel._id;
        } else {
            console.log("run this");
            let createRoomRocket = await apiRocket.createChannelRocket(nameSender).then(data => data).catch(data => data);
            console.log("createRoomRocket: ", createRoomRocket);
            // Phương thức không đồng bộ
            let createWebhookRocket = apiRocket.createOutGoingWebhookRocket_FACEBOOK(nameSender).then(data => data);
            idRoomRocket = createRoomRocket.success ? createRoomRocket.channel._id : undefined;
            console.log("idRoomRocket: ", idRoomRocket);
        }

        inforUser.localSent = "Facebook";
        inforUser.nameRoomRocket = nameSender;
        inforUser.idRoomRocket = idRoomRocket;
        inforUser.uid = sender_psid;
        console.log("inforUser: ", inforUser);
        var insertDataUser = await mongodb.insert(config.mongodb.collection, inforUser).then(data => data);

    }
    forwardRocket(idRoomRocket, received_message.text, inforUser);
    // // kiểm tra id đối tượng gửi tin nhắn đã đăng nhập hay chưa
    // db.getDataUser(sender_psid, (data) => {
    //     if (typeof data != "undefined") { // khách hàng đã login
    //         switch ((received_message.text).toLowerCase()) {
    //             case 'bat dau':
    //             case 'start':
    //             case 'dang nhap':
    //             case 'đăng nhập':
    //             case 'login':
    //             case 'bắt đầu':
    //                 MessengerSend.callSendAPI(sender_psid, {"text": "Bạn đã đăng nhập rồi!"});
    //                 break;
    //             case 'ket thuc':
    //             case 'kết thúc':
    //             case 'đăng xuất':
    //             case 'dang xuat':
    //             case 'end':
    //                 logoutRocketWithAccountFacebook(sender_psid);
    //                 break;
    //             default:
    //                 response = {
    //                     "text": received_message
    //                 }
    //         }
    //         // Kiểm tra xem người dùng có sử dụng câu lệnh không
    //         if (!pattern.test(received_message.text.trim())) { // không sử dụng câu lệnh
    //             console.log("dòng 48: ", data);
    //             apiRocket.sendMess('GENERAL',
    //                 received_message.text,
    //                 data.token_rocket.stringValue,
    //                 data.id_rocket.stringValue,
    //                 data => {
    //                     console.log("tin nhắn được gửi đến rocket: ", data.status);
    //                 });
    //         } else { // sử dụng câu lệnh
    //             codeExecute(data, received_message);
    //         }
    //     } else { // khách hàng chưa login
    //         switch ((received_message.text).toLowerCase()) {
    //             case 'bat dau':
    //             case 'start':
    //             case 'dang nhap':
    //             case 'đăng nhập':
    //             case 'login':
    //             case 'bắt đầu':
    //                 loginRocketWithFacebook(sender_psid);
    //                 break;
    //             case 'ket thuc':
    //             case 'kết thúc':
    //             case 'đăng xuất':
    //             case 'dang xuat':
    //                 MessengerSend.callSendAPI(sender_psid, {"text": "Bạn chưa đăng nhập vui lòng gõ 'Bắt đầu' để đăng nhập"});
    //                 break;
    //             default:
    //                 privateCustomer(sender_psid, received_message);
    //         }
    //     }
    // });
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
            apiRocket.searchUser(keyword, user.token_rocket.stringValue, user.id_rocket.stringValue, data => {
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
    db.getDataUserPrivate(sender_psid, async data => {
        let userAdmin = await apiRocket.login();
        let temp = await graph.getInforCustomerChatWithPage(sender_psid);
        let conver = JSON.parse(temp);

        if (typeof data == "undefined") {
            if (temp != 404) {
                let nameChannel = conver.first_name.toLowerCase().trim().replace(/(\s)/g, ".") + "." + conver.last_name.toLowerCase().trim().replace(/(\s)/g, ".") + "." + sender_psid;
                nameChannel = ProcessStr.clearUnikey(nameChannel);
                apiRocket.createChannel(nameChannel, userAdmin.userId, userAdmin.authToken, data2 => {
                    if (data2.status == 200) {
                        apiRocket.createOutGoingWebhook(nameChannel, userAdmin.userId, userAdmin.authToken, data2 => {
                            console.log("Tạo webhook Thành công: ", data2);
                        });
                        db.createUserPrivate(sender_psid, conver.first_name, conver.last_name, conver.profile_pic, nameChannel, data2.data.channel._id);
                        apiRocket.sendMess(data2.data.channel._id, received_message.text, userAdmin.authToken, userAdmin.userId,
                            conver.first_name, conver.last_name, conver.profile_pic,
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
            apiRocket.sendMess(data.idChannel.stringValue, received_message.text, userAdmin.authToken, userAdmin.userId,
                conver.first_name, conver.last_name, conver.profile_pic,
                data => {
                    console.log("tin nhắn được gửi đến rocket: ", data.status);
                });
        }
    })
}

// Chuyển tiếp tin nhắn ZALO sang Rocket
const forwardRocket = (_idRoomRocket, _dataMsg, _infoUser) => {
    apiRocket.sendMsgRock(_idRoomRocket,
        _dataMsg, _infoUser.first_name + " " + _infoUser.last_name, _infoUser.profile_pic);
}

module.exports = {
    handleMessage,
    handlePostback,
};

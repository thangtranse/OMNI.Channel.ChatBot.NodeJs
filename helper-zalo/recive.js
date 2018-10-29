const ProcessStr = require("../libs/processStr"),
    apiRocket = require("../helper-rocket/apiRest"),
    mongodb = require("../database/mongodb"),
    apiOpen = require("./apiOpen"),
    forwardRocket = require("../libs/forwardRocket"),
    msgRocketModel = require("../libs/models/msgRocket");

const handleMessage = async (_data) => {
    /**
     * _data: { fromoid, phone, appid, msgid, event, pageid, message, oaid, mac, timestamp }
     */
    var checkDataUser = await mongodb.findOne(process.env.MONGODB_COLLECTION, { "uid": _data.fromuid }).then(data => data).catch(data => data);

    let inforUser = null;
    let idRoomRocket;

    if (checkDataUser) {
        inforUser = checkDataUser;
        idRoomRocket = checkDataUser.idRoomRocket;
    } else {
        inforUser = await apiOpen.getInforUser(_data.fromuid).then(data => data);
        /**
         * inforUser { userGender:, userId:, userIdByApp:, avatar:, avatars: 120/240, displayName:, birthDate:, sharedInfo:, tagsAndNotesInfo:}
         */
        let displayName = inforUser.displayName.toLowerCase().trim().replace(/(\s)/g, ".");
        displayName = ProcessStr.clearUnikey(displayName);
        let nameRoomRocket = `Zalo.${displayName}`;
        let infoRoomRocket = await apiRocket.infoChannel(nameRoomRocket).then(data => data).catch(data => data);

        if (infoRoomRocket.success) {
            idRoomRocket = infoRoomRocket.channel._id;
        } else {
            let createRoomRocket = await apiRocket.createChannelRocket(nameRoomRocket).then(data => data).catch(data => data);
            // Phương thức không đồng bộ
            let createWebhookRocket = apiRocket.createOutGoingWebhookRocket(process.env.URL_WEBHOOK_ZALO, nameRoomRocket).then(data => data).catch(data => data);
            idRoomRocket = createRoomRocket.success ? createRoomRocket.channel._id : undefined;
        }
        // kiểm tra giá trị
        if (typeof idRoomRocket == "undefined") return;
        let msgRocket = new msgRocketModel.msgRocket("Zalo", idRoomRocket, nameRoomRocket, inforUser.userId, inforUser)
        mongodb.insert(process.env.MONGODB_COLLECTION, msgRocket.toJson()).then(data => data);
    }

    console.log("zalo msg: ", _data)
    switch (_data.event) {
        case 'sendgifmsg': // tin nhắn dạng gif
            break;
        case 'sendstickermsg': // tin nhắn dạng sticker
            break;
        case 'sendlocationmsg': //tin nhắn địa điểm
            break;
        case 'sendlinkmsg': // tin nhắn dạng liên kết
            break;
        case 'sendvoicemsg': // tin nhắn dạng âm thanh
            break;
        case 'sendimagemsg': // tin nhắn dạng hình
            console.log("zalo sms pic")
            break;
        case 'sendmsg': // tin nhắn dạng text
            console.log("zalo sms pic")
            break;
    }
    if (typeof inforUser == "undefined") return;

    let avatar = ''
    if (typeof inforUser.avatars != 'undefined' || inforUser.avatars) {
        avatar = Object.values(inforUser.avatars)[1];
    } else {
        avatar = typeof inforUser.userDetail.avatar != 'undefined' ? inforUser.userDetail.avatar : '';
    }
    console.log("zalo data infor: ", inforUser)

    let nametemp = typeof inforUser.displayName != 'undefined' ? inforUser.displayName : typeof inforUser.userDetail.displayName != 'undefined' ? inforUser.userDetail.displayName : '';
    forwardRocket.forwardRocket(idRoomRocket, _data.message, nametemp, avatar)
}

module.exports = { handleMessage }
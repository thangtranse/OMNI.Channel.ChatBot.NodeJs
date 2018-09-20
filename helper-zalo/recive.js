const ProcessStr = require("../libs/processStr");
const apiRocket = require("../helper-rocket/apiRest");
const mongodb = require("../database/mongodb");
const apiOpen = require("./apiOpen");
const forwardRocket = require("../libs/forwardRocket")
const msgRocketModel = require("../libs/models/msgRocket")
const config = require("../config");

const handleMessage = async (_data) => {
    /**
     * _data: { fromoid, phone, appid, msgid, event, pageid, message, oaid, mac, timestamp }
     */

    var checkDataUser = await mongodb.findOne(config.mongodb.collection, {"uid": _data.fromuid}).then(data => data).catch(data => data);

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
            let createWebhookRocket = apiRocket.createOutGoingWebhookRocket(config.url_webhook.URL_WEBHOOK_CALLBACK_ZALO, nameRoomRocket).then(data => data).catch(data => data);
            idRoomRocket = createRoomRocket.success ? createRoomRocket.channel._id : undefined;
        }
        // kiểm tra giá trị
        if (typeof idRoomRocket == "undefined") return;

        let msgRocket = new msgRocketModel.msgRocket("Zalo", idRoomRocket, nameRoomRocket, inforUser.userId, inforUser)

        mongodb.insert(config.mongodb.collection, msgRocket.toJson()).then(data => data);
    }

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
            break;
        case 'sendmsg': // tin nhắn dạng text
            break;
    }
    if (typeof inforUser == "undefined") return;

    if (inforUser.avatars) {
        inforUser.avatars = Object.values(inforUser.avatars)[1];
    } else {
        inforUser.avatars = "";
    }
    forwardRocket.forwardRocket(idRoomRocket, _data.message, inforUser.displayName, inforUser.avatars)
}

module.exports = {handleMessage}
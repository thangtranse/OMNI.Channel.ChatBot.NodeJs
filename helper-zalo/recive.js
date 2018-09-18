const ProcessStr = require("../libs/processStr");
const apiRocket = require("../helper-rocket/apiRest");
const mongodb = require("../database/mongodb");
const msgRocketModel = require("../libs/models/msgRocket")
const apiOpen = require("./apiOpen");
const config = require("../config");

const handleMessage = async (_data) => {
    /**
     * _data: { fromoid, phone, appid, msgid, event, pageid, message, oaid, mac, timestamp }
     */
<<<<<<< HEAD
    var checkDataUser = await mongodb.findOne(config.mongodb.collection, {"uid": _data.fromuid}).then(data => data);
=======
    let msgRocket = msgRocketModel.find({"uid": _data.fromuid}, (err, result) => {
        return new Promise((resolve, reject) => {
            if (err) reject(err)
            else resolve(result)
        })
    })
    var checkDataUser = await msgRocket.then(data => data).catch(data => data);
>>>>>>> f9f25aab6d5ab30646526be4c5d494a2fe3588e9

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
            let createWebhookRocket = apiRocket.createOutGoingWebhookRocket_ZALO(nameRoomRocket).then(data => data).catch(data => data);
            idRoomRocket = createRoomRocket.success ? createRoomRocket.channel._id : undefined;
        }
        // kiểm tra giá trị
        if (typeof idRoomRocket == "undefined") return;

        // var insertDataUser = await mongodb.insert(config.mongodb.collection, inforUser).then(data => data);
        msgRocketModel.create({
            localSent: "Zalo",
            idRoomRocket: idRoomRocket,
            nameRoomRocket: nameRoomRocket,
            uid: _data.fromuid,
            userDetail: inforUser
        }, (err, result) => {
            if (err) console.log("msgRocketModel.create error:", err)
        })
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
    forwardRocket(idRoomRocket, _data, inforUser);
}

// Chuyển tiếp tin nhắn ZALO sang Rocket
const forwardRocket = (_idRoomRocket, _dataMsg, _dataUser) => {
    if (_dataUser.avatars)
        _dataUser.avatars = Object.values(_dataUser.avatars)[1];
    else
        _dataUser.avatars = "";
    apiRocket.sendMsgRock(_idRoomRocket,
        _dataMsg.message, _dataUser.displayName, _dataUser.avatars);
}

module.exports = {handleMessage}
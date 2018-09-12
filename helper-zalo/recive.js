const db = require("../database/connectDb");
const ProcessStr = require("../libs/processStr");
const apiRocket = require("../helper-rocket/apiRest");
const apiOpen = require("./apiOpen");

const handleMessage = async (_data) => {
    /**
     * _data: { fromoid, phone, appid, msgid, event, pageid, message, oaid, mac, timestamp }
     */
    let inforUser = await apiOpen.getInforUser(_data.fromuid).then(data => data);
    /**
     * inforUser { userGender:, userId:, userIdByApp:, avatar:, avatars: 120/240, displayName:, birthDate:, sharedInfo:, tagsAndNotesInfo:}
     */
    inforUser.displayName = inforUser.displayName.toLowerCase().trim().replace(/(\s)/g, ".");
    inforUser.displayName = ProcessStr.clearUnikey(inforUser.displayName);
    let nameRoomRocket = `Zalo.v1.${inforUser.displayName}.${inforUser.userId}`;
    let infoRoomRocket = await apiRocket.infoChannel(nameRoomRocket).then(data => data).catch(data => data);
    let idRoomRocket;
    if (infoRoomRocket.success) {
        idRoomRocket = infoRoomRocket.channel._id;
    } else {
        let createRoomRocket = await apiRocket.createChannelRocket(nameRoomRocket).then(data => data).catch(data => data);
        idRoomRocket = createRoomRocket.success ? createRoomRocket.channel._id : undefined;
    }
    // kiểm tra giá trị
    if (typeof idRoomRocket == "undefined") return;

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
    forwardRocket(idRoomRocket, _data, inforUser);
}

// Chuyển tiếp tin nhắn ZALO sang Rocket
const forwardRocket = (_idRoomRocket, _dataMsg, _dataUser) => {
    apiRocket.sendMsgRock(_idRoomRocket,
        _dataMsg.message, _dataUser.displayName,
        _dataUser.avatars.length > 0 ? Object.values(_dataUser.avatars)[1] : "");
}

module.exports = {handleMessage}
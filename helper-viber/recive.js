const apiRocket = require("../helper-rocket/apiRest");
const ProcessStr = require("../libs/processStr");
const mongodb = require("../database/mongodb");
const config = require("../config");

const handleMessage = async (_data) => {
    /**
     * _Data: {event, timestamp, message_token, sender: {id, name, avatar, language, country, api_version}, message, silent}
     */

    /**
     * Chưa xử lý trường hợp seen, delivery
     */
    if (_data.event != 'message') return;

    var checkDataUser = await mongodb.findOne(config.mongodb.collection, {"uid": _data.sender.id}).then(data => data);

    let inforUser = {};
    var idRoomRocket = null;
    console.log("checkDataUser: ", checkDataUser);
    if (checkDataUser) {
        idRoomRocket = checkDataUser.idRoomRocket;
    } else { // chưa có nè
        let nameSender = _data.sender.name.toLowerCase().trim().replace(/(\s)/g, ".");
        nameSender = ProcessStr.clearUnikey(nameSender);
        let nameRoomRocket = `Viber.${nameSender}`;
        let infoRoomRocket = await apiRocket.infoChannel(nameRoomRocket).then(data => data).catch(data => data);

        if (infoRoomRocket.success) {
            idRoomRocket = infoRoomRocket.channel._id;
        } else {
            let createRoomRocket = await apiRocket.createChannelRocket(nameRoomRocket).then(data => data).catch(data => data);
            // Phương thức không đồng bộ
            let createWebhookRocket = apiRocket.createOutGoingWebhookRocket_VIBER(nameRoomRocket).then(data => data).catch(data => data);
            idRoomRocket = createRoomRocket.success ? createRoomRocket.channel._id : undefined;

        }

        inforUser.infor = _data.sender;
        inforUser.localSent = "Viber";
        inforUser.nameRoomRocket = nameRoomRocket;
        inforUser.idRoomRocket = idRoomRocket;
        inforUser.uid = _data.sender.id;


        var insertDataUser = await mongodb.insert(config.mongodb.collection, inforUser).then(data => data);
    }
    // kiểm tra giá trị
    if (typeof idRoomRocket == "undefined") return;

    forwardRocket(idRoomRocket, _data);
}

// Chuyển tiếp tin nhắn ZALO sang Rocket
const forwardRocket = (_idRoomRocket, _dataMsg) => {
    console.log("_idRoomRocket", _idRoomRocket);
    console.log("_dataMsg.message", _dataMsg.message);
    console.log(" _dataMsg.sender.name", _dataMsg.sender.name);
    console.log("_dataMsg.sender.avatar", _dataMsg.sender.avatar);

    apiRocket.sendMsgRock(_idRoomRocket,
        _dataMsg.message.text, _dataMsg.sender.name, _dataMsg.sender.avatar);
}

module.exports = {handleMessage}
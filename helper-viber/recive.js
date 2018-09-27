const apiRocket = require("../helper-rocket/apiRest"),
    mongodb = require("../database/mongodb"),
    msgRocketModel = require("../libs/models/msgRocket"),
    forwardRocket = require("../libs/forwardRocket"),
    ProcessStr = require("../libs/processStr")

const handleMessage = async (_data) => {
    /**
     * _Data: {event, timestamp, message_token, sender: {id, name, avatar, language, country, api_version}, message, silent}
     */

    /**
     * Chưa xử lý trường hợp seen, delivery
     */
    if (_data.event != 'message') return;
    var checkDataUser = await mongodb.findOne(process.env.MONGODB_COLLECTION, { "uid": _data.sender.id }).then(data => data).catch(data => data);
    var idRoomRocket = null;
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
            let createWebhookRocket = apiRocket.createOutGoingWebhookRocket(process.env.URL_WEBHOOK_VIBER, nameRoomRocket).then(data => data).catch(data => data);
            idRoomRocket = createRoomRocket.success ? createRoomRocket.channel._id : undefined;
        }

        let msgRocket = new msgRocketModel.msgRocket("Viber", idRoomRocket, nameRoomRocket, _data.sender.id, _data.sender);
        mongodb.insert(process.env.MONGODB_COLLECTION, msgRocket.toJson()).then(data => data);
    }
    // kiểm tra giá trị
    if (typeof idRoomRocket == "undefined") return;
    forwardRocket.forwardRocket(idRoomRocket, _data.message.text, _data.sender.name, _data.sender.avatar)
}

module.exports = { handleMessage }
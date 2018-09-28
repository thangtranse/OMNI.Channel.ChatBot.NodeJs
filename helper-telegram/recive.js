const apiRocket = require("../helper-rocket/apiRest"),
    ProcessStr = require("../libs/processStr"),
    mongodb = require("../database/mongodb"),
    msgRocketModel = require("../libs/models/msgRocket"),
    forwardRocket = require("../libs/forwardRocket")

const handleMessage = async (_data) => {
    /**
     * Chưa xử lý trường hợp seen, delivery
     */
    if (_data.type != 'message') return;
    var checkDataUser = await mongodb.findOne(process.env.MONGODB_COLLECTION, { "uid": _data.result.chat.id }).then(data => data).catch(data => data);
    var idRoomRocket = null;
    if (checkDataUser) {
        idRoomRocket = checkDataUser.idRoomRocket;
    } else { // chưa có nè
        let nameSender = _data.result.chat.first_name + "." + _data.result.chat.last_name;
        nameSender = nameSender.toLowerCase().trim().replace(/(\s)/g, ".");
        nameSender = ProcessStr.clearUnikey(nameSender);
        let nameRoomRocket = `Telegram.${nameSender}`;
        let infoRoomRocket = await apiRocket.infoChannel(nameRoomRocket).then(data => data).catch(data => data);
        if (infoRoomRocket.success) {
            idRoomRocket = infoRoomRocket.channel._id;
        } else {
            let createRoomRocket = await apiRocket.createChannelRocket(nameRoomRocket).then(data => data).catch(data => data);
            // Phương thức không đồng bộ
            await apiRocket.createOutGoingWebhookRocket(process.env.URL_WEBHOOK_TELEGRAM, nameRoomRocket).then(data => data).catch(data => data);
            idRoomRocket = createRoomRocket.success ? createRoomRocket.channel._id : undefined;
        }
        let msgRocket = new msgRocketModel.msgRocket("Skype", idRoomRocket, nameRoomRocket, _data.result.chat.id, _data);
        mongodb.insert(process.env.MONGODB_COLLECTION, msgRocket.toJson()).then(data => data);
    }
    // kiểm tra giá trị
    if (typeof idRoomRocket == "undefined") return;
    forwardRocket.forwardRocket(idRoomRocket, _data.result.text, _data.result.chat.first_name + " " + _data.result.chat.last_name, "");
}

module.exports = { handleMessage }
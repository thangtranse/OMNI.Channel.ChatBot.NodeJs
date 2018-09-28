const apiRocket = require("../helper-rocket/apiRest"),
    ProcessStr = require("../libs/processStr"),
    mongodb = require("../database/mongodb"),
    msgRocketModel = require("../libs/models/msgRocket"),
    forwardRocket = require("../libs/forwardRocket")

const handleMessage = async (_data) => {
    console.log("handleMessage", _data)
    var checkDataUser = await mongodb.findOne(process.env.MONGODB_COLLECTION, { "uid": _data.message.chat.id }).then(data => data).catch(data => data);
    var idRoomRocket = null;
    if (checkDataUser) {
        idRoomRocket = checkDataUser.idRoomRocket;
    } else { // chưa có nè
        let nameSender = _data.message.chat.first_name + "." + _data.message.chat.last_name;
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
        let msgRocket = new msgRocketModel.msgRocket("Telegram", idRoomRocket, nameRoomRocket, _data.message.chat.id, _data);
        mongodb.insert(process.env.MONGODB_COLLECTION, msgRocket.toJson()).then(data => data);
    }
    // kiểm tra giá trị
    if (typeof idRoomRocket == "undefined") return;
    forwardRocket.forwardRocket(idRoomRocket, _data.message.text, _data.message.chat.first_name + " " + _data.message.chat.last_name, "");
}

module.exports = { handleMessage }
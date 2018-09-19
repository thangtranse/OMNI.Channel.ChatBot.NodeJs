const apiRocket = require("../helper-rocket/apiRest")
const ProcessStr = require("../libs/processStr")
const mongodb = require("../database/mongodb")
const msgRocketModel = require("../libs/models/msgRocket")
const forwardRocket = require("../libs/forwardRocket")
const config = require("../config")

const handleMessage = async (_data) => {
    /**
     * Chưa xử lý trường hợp seen, delivery
     */
    if (_data.type != 'message') return;
    var checkDataUser = await mongodb.findOne(config.mongodb.collection, {"uid": _data.from.id}).then(data => data);
    var idRoomRocket = null;
    if (checkDataUser) {
        idRoomRocket = checkDataUser.idRoomRocket;
    } else { // chưa có nè
        let nameSender = _data.from.name.toLowerCase().trim().replace(/(\s)/g, ".");
        nameSender = ProcessStr.clearUnikey(nameSender);
        let nameRoomRocket = `Skype.${nameSender}`;
        let infoRoomRocket = await apiRocket.infoChannel(nameRoomRocket).then(data => data).catch(data => data);
        if (infoRoomRocket.success) {
            idRoomRocket = infoRoomRocket.channel._id;
        } else {
            let createRoomRocket = await apiRocket.createChannelRocket(nameRoomRocket).then(data => data).catch(data => data);
            // Phương thức không đồng bộ
            let createWebhookRocket = apiRocket.createOutGoingWebhookRocket_VIBER(nameRoomRocket).then(data => data).catch(data => data);
            idRoomRocket = createRoomRocket.success ? createRoomRocket.channel._id : undefined;
        }

        let msgRocket = new msgRocketModel.msgRocket("Skype", idRoomRocket, nameRoomRocket, _data.from.id, _data);
        mongodb.insert(config.mongodb.collection, msgRocket.toJson()).then(data => data);
    }
    // kiểm tra giá trị
    if (typeof idRoomRocket == "undefined") return;
    forwardRocket.forwardRocket(idRoomRocket, _data.text, _data.from.name, "");
}

module.exports = {handleMessage}
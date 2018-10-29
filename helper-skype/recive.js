const apiRocket = require("../helper-rocket/apiRest"),
    ProcessStr = require("../libs/processStr"),
    mongodb = require("../database/mongodb"),
    msgRocketModel = require("../libs/models/msgRocket"),
    forwardRocket = require("../libs/forwardRocket");

const handleMessage = async (_data) => {
    /**
     * Chưa xử lý trường hợp seen, delivery
     */
    if (_data.type != 'message') return;

    console.log("skype show msg: ", _data)
    var checkDataUser = await mongodb.findOne(process.env.MONGODB_COLLECTION, { "uid": _data.from.id }).then(data => data).catch(data => data);
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
            await apiRocket.createOutGoingWebhookRocket(process.env.URL_WEBHOOK_SKYPE, nameRoomRocket).then(data => data).catch(data => data);
            idRoomRocket = createRoomRocket.success ? createRoomRocket.channel._id : undefined;
        }
        let msgRocket = new msgRocketModel.msgRocket("Skype", idRoomRocket, nameRoomRocket, _data.from.id, _data);
        mongodb.insert(process.env.MONGODB_COLLECTION, msgRocket.toJson()).then(data => data);
    }
    console.log("thangtm", idRoomRocket)
    // kiểm tra giá trị
    if (typeof idRoomRocket == "undefined") return;

    // Xử lý đa phương tiện
    if (typeof _data.attachments != "undefined") {
        console.log("skype media normal")
        MessengerObject(_data)
    } else if(typeof _data.text != "undefined") { // Tin nhắn văn bản thông thường
        console.log("skype sms normal")
        forwardRocket.forwardRocket(idRoomRocket, _data.text, _data.from.name, "");
    }
}


MessengerObject = (_data) => {
    _data.attachments.map((object, index, array) => {
        switch (object.contentType) {
            case 'image':

                break;
        }
    });
}


module.exports = { handleMessage }
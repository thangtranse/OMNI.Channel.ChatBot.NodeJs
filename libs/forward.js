const config = require('../config');
const mongodb = require('../database/mongodb');
const apiOpen = require('../helper-zalo/apiOpen');
const apiViber = require("../helper-viber/apiViber");
const graph = require("../helper-messenger/graph");


const forwardZalo = async (_data) => {
    /**
     * _data: {bot, channel_id, channel_name, message_id, timestamp, user_id, user_name, text, alias}
     */
    var getDataUser = await mongodb.findOne(config.mongodb.collection, {"idRoomRocket": _data.channel_id}).then(data => data);
    if (getDataUser && _data.user_name.trim() != config.rocket.username) {
        let uidZalo = getDataUser.userId;
        apiOpen.sending(uidZalo, _data.text);
    }
}


const forwardViber = async (_data) => {
    var getDataUser = await mongodb.findOne(config.mongodb.collection, {"idRoomRocket": _data.channel_id}).then(data => data);
    if (getDataUser && _data.user_name.trim() != config.rocket.username) {
        let uidViber = getDataUser.uid;
        apiViber.sendMsg(uidViber, _data.text);
    }
}


const forwardFacebook = async (_data) => {
    var getDataUser = await mongodb.findOne(config.mongodb.collection, {"idRoomRocket": _data.channel_id}).then(data => data);
    if (getDataUser && _data.user_name.trim() != config.rocket.username) {
        graph.sentMsgFacebook(getDataUser.uid, _data.text);
    }
}

module.exports = {}
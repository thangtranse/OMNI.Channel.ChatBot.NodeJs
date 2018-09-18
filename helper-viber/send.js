const mongodb = require('../database/mongodb');
const apiViber = require("./apiViber");
const config = require("../config");

const forwardViber = async (_data) => {
    var getDataUser = await mongodb.findOne(config.mongodb.collection, {"idRoomRocket": _data.channel_id}).then(data => data);
    if (getDataUser && _data.user_name.trim() != config.rocket.username) {
        let uidViber = getDataUser.uid;
        apiViber.sendMsg(uidViber, _data.text);
    }
}

module.exports = {forwardViber}
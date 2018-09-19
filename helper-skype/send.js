const mongodb = require('../database/mongodb');
const apiSkype = require("./apiSkype");
const config = require("../config");

const forwardViber = async (_data) => {
    var getDataUser = await mongodb.findOne(config.mongodb.collection, {"idRoomRocket": _data.channel_id}).then(data => data);
    if (getDataUser && _data.user_name.trim() != config.rocket.username) {
        let uidViber = getDataUser.uid;
        getDataUser.userDetail.text = _data.text;
        apiSkype.sendMsg(getDataUser.userDetail.serviceUrl, getDataUser.userDetail.conversation.id, getDataUser.userDetail.id, getDataUser.userDetail);
    }
}

module.exports = {forwardViber}
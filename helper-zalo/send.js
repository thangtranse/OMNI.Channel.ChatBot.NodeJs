const ProcessStr = require('../libs/processStr');
const config = require('../config');
const apiOpen = require('./apiOpen');
const mongodb = require('../database/mongodb');

const forwardZalo = async (_data) => {
    /**
     * _data: {bot, channel_id, channel_name, message_id, timestamp, user_id, user_name, text, alias}
     */
    var getDataUser = await mongodb.findOne(config.mongodb.collection, {"idRoomRocket": _data.channel_id}).then(data => data);
    console.log("không vào được id: ", _data.channel_id);
    console.log("không vào được: ", getDataUser);
    if (getDataUser) {
        let uidZalo = getDataUser.userId;
        console.log("uidZalo: ", uidZalo);
        apiOpen.sending(uidZalo, _data.text);
    }

}


module.exports = {forwardZalo}
const ProcessStr = require('../libs/processStr'),
    msgRocketModel = require("../libs/models/msgRocket"),
    apiOpen = require('./apiOpen'),
    mongodb = require('../database/mongodb')

const forwardZalo = async (_data) => {
    /**
     * _data: {bot, channel_id, channel_name, message_id, timestamp, user_id, user_name, text, alias}
     */
    var getDataUser = await mongodb.findOne(process.env.MONGODB_COLLECTION, { "idRoomRocket": _data.channel_id }).then(data => data);

    if (getDataUser && _data.user_name.trim() != process.env.ROCKET_USERNAME) {
        let uidZalo = getDataUser.uid;
        apiOpen.sending(uidZalo, _data.text);
    }
}

module.exports = { forwardZalo }
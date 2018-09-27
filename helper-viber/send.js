const mongodb = require('../database/mongodb'),
    apiViber = require("./apiViber")

const forwardViber = async (_data) => {
    var getDataUser = await mongodb.findOne(process.env.MONGODB_COLLECTION, { "idRoomRocket": _data.channel_id }).then(data => data);
    if (getDataUser && _data.user_name.trim() != process.env.ROCKET_USERNAME) {
        let uidViber = getDataUser.uid;
        apiViber.sendMsg(uidViber, _data.text);
    }
}

module.exports = { forwardViber }
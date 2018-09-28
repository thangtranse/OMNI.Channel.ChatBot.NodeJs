const mongodb = require('../database/mongodb'),
    apiTelegram = require("./apiTelegram")

const forwardSkype = async (_data) => {
    var getDataUser = await mongodb.findOne(process.env.MONGODB_COLLECTION, { "idRoomRocket": _data.channel_id }).then(data => data).catch(data => data);
    if (getDataUser && _data.user_name.trim() != process.env.ROCKET_USERNAME) {
        getDataUser.userDetail.text = _data.text;
        await apiTelegram.sendMessenger(_data.text, getDataUser.userDetail.result.chat.id);
    }
}

module.exports = { forwardSkype }
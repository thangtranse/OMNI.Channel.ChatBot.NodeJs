const mongodb = require('../database/mongodb'),
    apiSkype = require("./apiSkype")

const forwardSkype = async (_data) => {
    var getDataUser = await mongodb.findOne(process.env.MONGODB_COLLECTION, { "idRoomRocket": _data.channel_id }).then(data => data).catch(data => data);
    if (getDataUser && _data.user_name.trim() != process.env.ROCKET_USERNAME) {
        getDataUser.userDetail.text = _data.text;
        await apiSkype.sendMsg(getDataUser.userDetail.serviceUrl, getDataUser.userDetail.conversation.id, getDataUser.userDetail.id, getDataUser.userDetail);
    }
}

module.exports = { forwardSkype }
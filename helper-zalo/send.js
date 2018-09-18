const ProcessStr = require('../libs/processStr');
const config = require('../config');
const msgRocketModel = require("../libs/models/msgRocket")
const apiOpen = require('./apiOpen');
const mongodb = require('../database/mongodb');

const forwardZalo = async (_data) => {
    /**
     * _data: {bot, channel_id, channel_name, message_id, timestamp, user_id, user_name, text, alias}
     */

    let msgRocket = msgRocketModel.find({"idRoomRocket": _data.channel_id}, (err, result) => {
        return new Promise((resolve, reject) => {
            if (err) reject(err)
            else resolve(result)
        })
    })

    var getDataUser = await msgRocket.then(data => data)

    if (getDataUser && _data.user_name.trim() != config.rocket.username) {
        let uidZalo = getDataUser.uid;
        apiOpen.sending(uidZalo, _data.text);
    }
}


module.exports = {forwardZalo}
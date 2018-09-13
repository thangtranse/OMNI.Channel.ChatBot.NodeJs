const ProcessStr = require('../libs/processStr');
const config = require('../config');
const apiOpen = require('./apiOpen');

const forwardZalo = (_data) => {
    /**
     * _data: {bot, channel_id, channel_name, message_id, timestamp, user_id, user_name, text, alias}
     */
    if (_data.user_name.trim() == config.rocket.username) return;

    let uidZalo = ProcessStr.getIdFormRocket(_data.channel_name);
    apiOpen.sending(uidZalo, _data.text);
}


module.exports = {forwardZalo}
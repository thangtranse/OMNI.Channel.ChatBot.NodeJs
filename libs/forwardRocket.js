const apiRocket = require("../helper-rocket/apiRest");

/**
 * Tất cả tin nhắn gửi về Rocket.Chat sẽ đi qua đây
 * @param _idRoomRocket
 * @param _message
 * @param _displayName
 * @param _avatars
 */
const forwardRocket = (_idRoomRocket, _message, _displayName, _avatars) => {
    apiRocket.sendMsgRock(_idRoomRocket, _message, _displayName, _avatars);
}

module.exports = {forwardRocket}
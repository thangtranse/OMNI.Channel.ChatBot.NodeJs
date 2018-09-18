const apiRocket = require("../helper-rocket/apiRest");

const forwardRocket = (_idRoomRocket, _message, _displayName, _avatars) => {
    apiRocket.sendMsgRock(_idRoomRocket, _message, _displayName, _avatars);
}

module.exports = {forwardRocket}
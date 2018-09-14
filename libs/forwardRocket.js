
// Chuyển tiếp tin nhắn sang Rocket
const forwardRocket = (_idRoomRocket, _dataMsg, _dataUser) => {
    if (_dataUser.avatars)
        _dataUser.avatars = Object.values(_dataUser.avatars)[1];
    else
        _dataUser.avatars = "";
    apiRocket.sendMsgRock(_idRoomRocket,
        _dataMsg.message, _dataUser.displayName, _dataUser.avatars);
}


module.exports = {}
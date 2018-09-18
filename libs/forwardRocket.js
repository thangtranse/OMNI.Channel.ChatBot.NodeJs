const config = require('../config');
const mongodb = require('../database/mongodb');
const apiOpen = require('../helper-zalo/apiOpen');
const apiViber = require("../helper-viber/apiViber");
const graph = require("../helper-messenger/graph");

// Tin nhắn fb
const forwardRocket = (_idRoomRocket, _dataMsg, _infoUser) => {
    apiRocket.sendMsgRock(_idRoomRocket,
        _dataMsg, _infoUser.first_name + " " + _infoUser.last_name, _infoUser.profile_pic);
}


// Chuyển tiếp tin nhắn ZALO sang Rocket
const forwardRocket = (_idRoomRocket, _dataMsg) => {
    console.log("_idRoomRocket", _idRoomRocket);
    console.log("_dataMsg.message", _dataMsg.message);
    console.log(" _dataMsg.sender.name", _dataMsg.sender.name);
    console.log("_dataMsg.sender.avatar", _dataMsg.sender.avatar);

    apiRocket.sendMsgRock(_idRoomRocket,
        _dataMsg.message.text, _dataMsg.sender.name, _dataMsg.sender.avatar);
}

// Chuyển tiếp tin nhắn ZALO sang Rocket
const forwardRocket = (_idRoomRocket, _dataMsg, _dataUser) => {
    if (_dataUser.avatars)
        _dataUser.avatars = Object.values(_dataUser.avatars)[1];
    else
        _dataUser.avatars = "";
    apiRocket.sendMsgRock(_idRoomRocket,
        _dataMsg.message, _dataUser.displayName, _dataUser.avatars);
}


module.exports = {forwardRocket}
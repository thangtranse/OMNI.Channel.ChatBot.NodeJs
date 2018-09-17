const mongodb = require('../database/mongodb');
const apiViber = require("./apiViber");
const config = require("../config");

const forwardViber = async (_data) => {
    console.log("forwardViber: ", _data);
    // var getDataUser = await mongodb.findOne(config.mongodb.collection, {"idRoomRocket": _data.channel_id}).then(data => data);


}

module.exports = {forwardViber}
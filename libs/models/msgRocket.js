const mongoose = require('mongoose')

var schemaMsgRocket = mongoose.Schema({
    localSent: {
        type: String,
        required: true
    },
    idRoomRocket: {
        type: String,
        required: true
    },
    nameRoomRocket: {
        type: String,
        required: true
    },
    uid: {
        type: String,
        required: true
    },
    userDetail: Object
})

module.exports = mongoose.model('msgRocket', schemaMsgRocket)


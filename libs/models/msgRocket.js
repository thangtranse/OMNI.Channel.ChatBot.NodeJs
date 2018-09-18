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
<<<<<<< HEAD
    detail: Object
=======
    userDetail: Object
>>>>>>> f9f25aab6d5ab30646526be4c5d494a2fe3588e9
})

module.exports = mongoose.model('msgRocket', schemaMsgRocket)


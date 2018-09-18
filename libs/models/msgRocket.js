var localSent, idRoomRocket, nameRoomRocket, uid, userDetail;

class msgRocket {

    constructor(_localSent, _idRoomRocket, _nameRoomRocket, _uid, _userDetail) {
        localSent = _localSent;
        idRoomRocket = _idRoomRocket;
        nameRoomRocket = _nameRoomRocket;
        uid = _uid;
        userDetail = _userDetail;
    }

    toJson() {
        return {
            localSent: localSent,
            idRoomRocket: idRoomRocket,
            nameRoomRocket: nameRoomRocket,
            uid: uid,
            userDetail: userDetail
        }
    }
}

module.exports = {msgRocket}


const firebase = require("firebase");
const admin = require('firebase-admin');
const serviceAccount = require('../ten-lua-firebase-adminsdk-8yey4-eaac26d921');

class connectDb {

    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }

    /**
     *
     * @param userId_fb
     * @param name
     * @param token_rocket
     * @param token_facebook
     * @param userId_rocket
     */
    writeUserData(userId_fb, name, token_rocket, token_facebook, userId_rocket) {
        set("users", userId_fb, name, token_rocket, token_facebook, userId_rocket)
    };

    /**
     * Lấy thông tin user
     * @param _idUser
     * @param callbback
     */
    getDataUser(_idUser, callback) {
        get("users", _idUser, callback);
    }

    /**
     * Lấy danh sách thông tin user đang tương tác với hệ thống
     * @param _value
     * @param callback
     */
    async getListUserConnect() {
        return await getListCollection("users");
    }

    queryTokenRocket(_value, callback) {
        var citiesRef = db.collection('users');
        var query = citiesRef.where('id_fb', '==', _value).get()
            .then(snapshot => callback(snapshot))
            .catch(err => {
                console.log('Error getting documents', err);
            });
    }

    deleteUser(_value) {
        del("users", _value);
    }

    // PRIVATE CUSTOMER

    async getDataUserPrivate(_idUser) {
        return await get("users_private", _idUser, data => data);
    }

    createUserPrive(userId_fb, name, token_facebook){
        console.log("test")
    }

    // PRIVATE CUSTOMER END
}

const set = (_collection, userId_fb, name, token_rocket, token_facebook, userId_rocket) => {
    var db = admin.firestore();
    var docRef = db.collection(_collection).doc(userId_fb);
    var setAda = docRef.set({
        id_fb: userId_fb.length > 0 ? userId_fb : "",
        id_rocket: userId_rocket.length > 0 ? userId_rocket : "",
        token_rocket: token_rocket.length > 0 ? token_rocket : "",
        token_facebook: token_facebook.length > 0 ? token_facebook : "",
        name: name.length > 0 ? name : ""
    });
}

const del = (_collection, _value) => {
    let db = admin.firestore();
    let deleteDoc = db.collection(_collection).doc(_value).delete();
}

const get = (_collection, _idUser, callback) => {
    var db = admin.firestore();
    var sfRef = db.collection(_collection).doc(_idUser);
    sfRef.get().then(collections => callback(collections._fieldsProto));
}

const getListCollection = async (_collection) => {
    let db = admin.firestore();
    let data = [];
    var citiesRef = db.collection('users');
    await citiesRef.get().then(snapshot => {
        snapshot.forEach(doc => {
            if (typeof doc._fieldsProto.id_fb != "undefined") {
                data.push({
                    idMess: doc._fieldsProto.id_fb.stringValue,
                    idRocket: doc._fieldsProto.id_rocket.stringValue
                });
            }
        });
    }, err => {
        console.log(`Encountered error: ${err}`);
        return false;
    });
    return data;
}

module.exports = new connectDb();

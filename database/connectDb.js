const firebase = require("firebase");
const admin = require('firebase-admin');
const serviceAccount = require('../ten-lua-firebase-adminsdk-8yey4-eaac26d921');
var db;

class connectDb {

    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        db = admin.firestore();
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
        let temp = {
            id_fb: userId_fb.length > 0 ? userId_fb : "",
            id_rocket: userId_rocket.length > 0 ? userId_rocket : "",
            token_rocket: token_rocket.length > 0 ? token_rocket : "",
            token_facebook: token_facebook.length > 0 ? token_facebook : "",
            name: name.length > 0 ? name : ""
        };
        setCollection("users", userId_fb, temp)
    };

    /**
     * Lấy thông tin user
     * @param _idUser
     * @param callbback
     */
    getDataUser(_idUser, callback) {
        getDocument("users", _idUser, callback);
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
        delCollection("users", _value);
    }

    // PRIVATE CUSTOMER

    /**
     *
     * @param _userId
     * @param callback
     *
     * avatar.stringValue/valueType
     * first_name.stringValue/valueType
     * nameChannel.stringValue/valueType
     * userId_fb.stringValue/valueType
     * last_name.stringValue/valueType
     */
    getDataUserPrivate(_userId, callback) {
        getDocument("users_private", _userId, callback);
    }

    createUserPrivate(userId_fb, first_name, last_name, avatar, nameChannel, idChannel) {
        let temp = {
            userId_fb: userId_fb.length > 0 ? userId_fb : "",
            last_name: last_name.length > 0 ? last_name : "",
            avatar: avatar.length > 0 ? avatar : "",
            first_name: first_name.length > 0 ? first_name : "",
            nameChannel: nameChannel.length > 0 ? nameChannel : "",
            idChannel: idChannel.length > 0 ? idChannel : ""
        }
        setCollection("users_private", userId_fb, temp);
    }

    /**
     * {
     *      idChannel,userId_fb, last_name, first_name, avatar, nameChannel
     * }
     * @param _value
     * @param callback
     */
    queryIdChannel(_value, callback) {
        var citiesRef = db.collection('users_private');
        var allCities = citiesRef.get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    if (doc.data().nameChannel == _value) {
                        callback(doc.data());
                    }
                });
            })
            .catch(err => {
                console.log('Error getting documents', err);
            });
    }

    // PRIVATE CUSTOMER END
}

/**
 *
 * @param _collection: tên collection
 * @param userId_fb: tên document
 * @param _data: array fiels
 */
const setCollection = (_collection, userId_fb, _data) => {
    var docRef = db.collection(_collection).doc(userId_fb);
    var setAda = docRef.set(_data);
}

const delCollection = (_collection, _value) => {
    let deleteDoc = db.collection(_collection).doc(_value).delete();
}

const getDocument = (_collection, _idUser, callback) => {
    var sfRef = db.collection(_collection).doc(_idUser);
    sfRef.get().then(collections => callback(collections._fieldsProto));
}

const getListCollection = async (_collection) => {
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

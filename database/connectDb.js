const firebase = require("firebase");
const admin = require('firebase-admin');
const serviceAccount = require('../ten-lua-firebase-adminsdk-8yey4-eaac26d921');

class connectDb {
    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }

    writeUserData(userId_fb, name, token_rocket, token_facebook, userId_rocket) {
        var db = admin.firestore();
        var docRef = db.collection('users').doc(userId_fb);
        var setAda = docRef.set({
            id_fb: userId_fb.length > 0 ? userId_fb : "",
            id_rocket: userId_rocket.length > 0 ? userId_rocket : "",
            token_rocket: token_rocket.length > 0 ? token_rocket : "",
            token_facebook: token_facebook.length > 0 ? token_facebook : "",
            name: name.length > 0 ? name : ""
        });
    }

    /**
     * Lấy thông tin user
     * @param _idUser
     * @param callbback
     */
    getDataUser(_idUser, callbback) {
        console.log("conDB: ", _idUser);
        var db = admin.firestore();
        var sfRef = db.collection('users').doc(_idUser);
        sfRef.get().then(collections => callbback(collections._fieldsProto));
    }

    /**
     * Lấy danh sách thông tin user đang tương tác với hệ thống
     * @param _value
     * @param callback
     */
    async getDataUserConnect() {
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

    queryTokenRocket(_value, callback) {
        var citiesRef = db.collection('users');
        var query = citiesRef.where('id_fb', '==', _value).get()
            .then(snapshot => callback(snapshot))
            .catch(err => {
                console.log('Error getting documents', err);
            });
    }

    deleteUser(_value) {
        let db = admin.firestore();
        let deleteDoc = db.collection('users').doc(_value).delete();
        console.log("đăng xuất: ", deleteDoc)
    }
}

module.exports = new connectDb();

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

    queryTokenRocket(_value, callback) {
        var citiesRef = db.collection('users');
        var query = citiesRef.where('token_rocket', '==', _value).get()
            .then(snapshot => callback(snapshot))
            .catch(err => {
                console.log('Error getting documents', err);
            });

    }
}

module.exports = new connectDb();

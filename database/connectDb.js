const firebase = require("firebase");
const admin = require('firebase-admin');
const serviceAccount = require('../ten-lua-firebase-adminsdk-8yey4-eaac26d921');

class connectDb {
    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: 'https://ten-lua.firebaseio.com'
        });
        var db = admin.firestore();
    }

    writeUserData(userId_fb, name, token_rocket, token_facebook, userId_rocket) {
        firebase.database().ref('users/' + userId_fb).set({
            id_fb: userId_fb.length > 0 ? userId_fb : "",
            id_rocket: userId_rocket.length > 0 ? userId_rocket : "",
            token_rocket: token_rocket.length > 0 ? token_rocket : "",
            token_facebook: token_facebook.length > 0 ? token_facebook : "",
            name: name.length > 0 ? name : ""
        });
    }

    readUserData() {
        var userId = firebase.auth().currentUser.uid;
        return firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
            var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
        });
    }
}

module.exports = new connectDb();

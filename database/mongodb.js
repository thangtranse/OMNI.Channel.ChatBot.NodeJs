const MongoClient = require('mongodb').MongoClient;
const config = require('../config');

module.exports = class mongodb {
    constructor() {
        MongoClient.connect(config.mongodb, function (err, db) {
            if (!err) {
                console.log("We are connected");
            }
        });
    }
}

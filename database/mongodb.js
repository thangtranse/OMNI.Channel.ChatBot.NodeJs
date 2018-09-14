const MongoClient = require('mongodb').MongoClient;
const config = require('../config');

const connectdb = (_collection) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(config.mongodb.url, {useNewUrlParser: true}, (err, db) => {
            if (!err) {
                console.log("We are connected");
                let dbo = db.db(config.mongodb.dbname);
                var dbCollection = dbo.collection(_collection);
                resolve(dbCollection);
            } else {
                console.log("Lỗi rồi");
                reject(err);
            }
        });
    })
}

const findOne = async (_collection, _array) => {
    var dbo = await connectdb(_collection).then(data => data);
    return new Promise((resolve, reject) => {
        dbo.findOne(_array, (err, result) => {
            if (err)
                reject(err)
            else
                resolve(result)
        })
    })
}

const insert = async (_collection, _arrayData) => {
    var dbo = await connectdb(_collection).then(data => data);
    return new Promise((resolve, reject) => {
        dbo.insertOne(_arrayData, (err, result) => {
            if (err)
                reject(err);
            else
                resolve(result);
        })
    })
}

module.exports = {findOne, insert};

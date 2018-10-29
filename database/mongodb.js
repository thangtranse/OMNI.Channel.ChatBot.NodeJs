const MongoClient = require('mongodb').MongoClient;


const connectdb = (_collection) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(process.env.MONGODB_URL, { useNewUrlParser: true }, (err, db) => {
            if (!err) {
                let dbo = db.db(process.env.MONGODB_DB_NAME);
                dbo.createCollection(process.env.MONGODB_COLLECTION, (err, result) => {
                    if(err) reject(err);;
                })
                var dbCollection = dbo.collection(_collection);
                console.log("We are connected");
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

module.exports = { findOne, insert };

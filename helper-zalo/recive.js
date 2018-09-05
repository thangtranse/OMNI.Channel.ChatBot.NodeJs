const db = require("../database/connectDb");


const handleMessage = (_data) => {
    console.log("zalo sent messenger: ", _data)
}

module.exports = {handleMessage}
var fs = require('fs'),
    path = require('path');

var Logger = exports.Logger = {};
var infoStream = fs.createWriteStream(__dirname + '/systemLogs/info.config', {
    flags: 'w',
    encoding: 'utf-8',
    mode: 0666
});
var debugStream = fs.createWriteStream(__dirname + '/systemLogs/debug.config', {
    flags: 'w',
    encoding: 'utf-8',
    mode: 0666
});
var errorStream = fs.createWriteStream(__dirname + '/systemLogs/error.config', {
    flags: 'w',
    encoding: 'utf-8',
    mode: 0666
});
//
// var infoStream = fs.createWriteStream(infoStream);
// var debugStream = fs.createWriteStream(debugStream);
// var errorStream = fs.createWriteStream(errorStream);

infoStream.on('error', (err) => {
    console.log("infoStream error: ", err)
})
debugStream.on('error', (err) => {
    console.log("debugStream error:", err)
})
errorStream.on('error', (err) => {
    console.log("errorStream error:", err)
})

Logger.info = function (key, msg) {
    msg = typeof msg == 'object' ? JSON.parse(msg) : msg;
    infoStream.write(new Date().toISOString() + " - " + key + " : " + msg + "\n");
};

Logger.debug = function (key, msg) {
    msg = typeof msg == 'object' ? JSON.parse(msg) : msg;
    debugStream.write(new Date().toISOString() + " - " + key + " : " + msg + "\n");
};

Logger.error = function (key, msg) {
    msg = typeof msg == 'object' ? JSON.parse(msg) : msg;
    errorStream.write(new Date().toISOString() + " - " + key + " : " + msg + "\n");
};

/**
 * Lưu để sau này dùng !!!
 * @param _header
 * @param _data
 */
const writeLog = (_header, _data) => {
    let date = new Date();
    _data = '\n' + date.getDay() + "\\" + date.getMonth() + " " + date.getHours() + ":" + date.getMinutes() + "=>" + _header + ':\n-----------------\n' + _data + '\n-----------------\n';
    fs.appendFile('./historyLogs.log', _data, function (err) {
        if (err) return console.error(err);
        console.log("Thành công");
    });
}
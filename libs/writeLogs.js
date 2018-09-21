var fs = require('fs'),
    path = require('path');

var Logger = exports.Logger = {};
var infoStream = fs.createWriteStream(__dirname + '/systemLogs/info.log', {flags: 'w', encoding: 'utf-8',mode: 0666});
var debugStream = fs.createWriteStream(__dirname + '/systemLogs/debug.log', {flags: 'w', encoding: 'utf-8',mode: 0666});
var errorStream = fs.createWriteStream(__dirname + '/systemLogs/error.log', {flags: 'w', encoding: 'utf-8',mode: 0666});
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
    var message = new Date().toISOString() + " - " + key + " : " + msg + "\n";
    infoStream.write(message);
};

Logger.debug = function (key, msg) {
    var message = new Date().toISOString() + " - " + key + " : " + msg + "\n";
    debugStream.write(message);
};

Logger.error = function (key, msg) {
    var message = new Date().toISOString() + " - " + key + " : " + msg + "\n";
    errorStream.write(message);
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
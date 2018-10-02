const request = require('request'),
    log = require('../libs/writeLogs').Logger;

const tokenBot = process.env.TELEGRAM_TOKEN_BOT;
const pathFile = process.env.ASSET_TELEGRAM
const urlTelegram = 'https://api.telegram.org/bot' + tokenBot;
const urlDownloadFile = 'https://api.telegram.org/file/bot' + tokenBot;
const download = require("download")

sendMessenger = (_messenger, _chatId) => {
    return new Promise((resolve, reject) => {
        request({
            url: `${urlTelegram}/sendMessage?chat_id=${_chatId}&text=${_messenger}`,
            method: "GET"
        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                resolve(body);
            } else {
                log.error("file:apiTelegram, function:sendMessenger, Status Code", response.statusCode)
                log.error("file:apiTelegram, function:sendMessenger, body", body)
                log.error("file:apiTelegram, function:sendMessenger, error", error)
                reject(error);
            }
        })
    })
}
/**
 * Get Path File
 * input:
 * _idFile: id of file
 * output:
 * 200
 * {"ok":true,"result":{"file_id":"...","file_size":1123,"file_path":"photos/file_0.jpg"}}
 */
getPathFile = (_idFile) => {
    return new Promise((reject, resolve) => {
        request({
            url: `${urlTelegram}/getFile?file_id=${_idFile}`,
            method: 'GET'
        }, (error, result, body) => {
            if (!error && result.statusCode === 200) {
                resolve(body);
            } else {
                log.error("file:apiTelegram, function:getPathFile, Status Code", result.statusCode)
                log.error("file:apiTelegram, function:getPathFile, body", body)
                log.error("file:apiTelegram, function:getPathFile, error", error)
                reject(error);
            }
        })
    });
}
/**
 * Download File
 * https://api.telegram.org/file/bot620675041:AAEcLStcLT4fl9wN2dCqdj0Cf4xTF48Hk_Y/photos/file_0.jpg
 */
const https = require("https")

downloadFile = (_pathFile) => {
    return new Promise((reject, resolve) => {
        download(`${urlDownloadFile}/${_pathFile}`, pathFile)
            .then(() => reject(true))
            .catch((_data) => resolve(_data))
    })
}

module.exports = { sendMessenger, getPathFile, downloadFile }
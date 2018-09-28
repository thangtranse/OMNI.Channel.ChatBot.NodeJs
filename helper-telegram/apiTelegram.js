const request = require('request'),
    log = require('../libs/writeLogs').Logger;

const tokenBot = process.env.TELEGRAM_TOKEN_BOT;
const urlTelegram = 'https://api.telegram.org/bot';

sendMessenger = (_messenger, _chatId) => {
    return new Promise((resolve, reject) => {
        request({
            url: `${urlTelegram}${tokenBot}/sendMessage?chat_id=${_chatId}&text=${_messenger}`,
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

module.exports = { sendMessenger }
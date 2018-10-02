const log = require("../libs/writeLogs").Logger
const apiTelegram = require("../helper-telegram/apiTelegram")
const download = require("download")
const apiRocket = require('../helper-rocket/apiRest')
const fs = require('fs')
const path = require('path')


module.exports = function (app) {
    // Facebook
    app.route('/osource-facebook-webhook')
        .get((req, resp) => {
            log.debug("[GET] /osource-facebook-webhook", req.query)
            let VERIFY_TOKEN = "tranminhthang-sccc" // Mã xác minh khi đăng ký webhook Facebook
            let mode = req.query['hub.mode'];
            let token = req.query['hub.verify_token'];
            let challenge = req.query['hub.challenge'];
            if (mode && token) {
                if (mode === 'subscribe' && token === VERIFY_TOKEN) {
                    resp.status(200).send(challenge);
                } else {
                    resp.sendStatus(403);
                }
            }
        })
        .post((req, resp) => {
            log.debug("[POST] /osource-facebook-webhook", req.body)
            resp.end()
        })
    // Zalo
    app.route("/osource-zalo-webhook")
        .get((req, resp) => {
            log.debug("[GET] /osource-zalo-webhook", req.query)
            resp.end()
        })
        .post((req, resp) => {
            log.debug("[POST] /osource-zalo-webhook", req.body)
            resp.end()
        })

    // Test File Upload TELEGRAM
    app.route("/uploadFile")
        .get(async (req, resp) => {
            console.log(`https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN_BOT}/photos/file_1.jpg`)
            // resp.end(`https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN_BOT}/photos/file_0.jpg`)
            download(`https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN_BOT}/photos/file_1.jpg`, './').then(() => {
                console.log("thangdeptrai")
                resp.end(`https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN_BOT}/photos/file_1.jpg`);
            })
            resp.end();

        })
    // Test Upload File to Rocket.Chat
    app.get("/uploadFileRocket", (req, resp) => {
        var filepth = path.join(__dirname, 'asset_telegram/file_1.jpg')
        console.log('thang', filepth)
        apiRocket.roomUpload("GENERAL", filepth)
            .then(data => {
                console.log("thangdep xau", data)
            })
            .catch(data => {
                console.log("thangdep", data)
            })
        resp.end()
    })
}
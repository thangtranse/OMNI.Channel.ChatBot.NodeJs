const log = require("../libs/writeLogs").Logger,
    apiTelegram = require("../helper-telegram/apiTelegram"),
    download = require("download"),
    apiRocket = require('../helper-rocket/apiRest'),
    db = require('../database/mongodb'),
    fs = require('fs'),
    path = require('path'),
    apiGraph = require('../helper-messenger/graph')


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
    app.route('/postnewsfeed')
        .get(async (req, resp) => {
            var temp = await apiGraph.postNewsFeed("thang dep trai", "").then(data => data).catch(data => data)
            console.log("thangtm ", temp)
            resp.end()
        })
    app.route('/sendimage')
        .get(async (req, resp) => {
            var temp = await apiGraph.parameterSentGraphWithMedia("messages", 1661436757312768, "https://www.apple.com/ac/structured-data/images/knowledge_graph_logo.png?201606271147");
            console.log("thangtm ", temp)
            resp.end()
        })
    app.route('/sendMsgRepliesQuick')
        .get(async (req, resp) => {
            var temp = await apiGraph.parameterSentGraphQuickReplies(1661436757312768, "https://www.apple.com/ac/structured-data/images/knowledge_graph_logo.png?201606271147");
            console.log("thangtm ", temp)
            resp.end()
        })
    // END FACEBOOK    
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

    app.route("/testdb")
        .get((res, resp) => {
            console.log("oke chuwa");
            db.findOne(process.env.MONGODB_COLLECTION, "thang")
            resp.end()
        })
}
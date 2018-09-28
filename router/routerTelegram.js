const log = require("../libs/writeLogs").Logger,
    recive = require("../helper-telegram/recive"),
    send = require("../helper-telegram/send");

module.exports = function (app) {
    // Telegram
    app.route('/telegram-webhook')
        .get((req, resp) => {
            log.debug("[GET] /telegram-webhook", req.query)
            resp.end()
        })
        .post((req, resp) => {
            log.debug("[POST] /telegram-webhook", req.body)
            recive.handleMessage(req.body);
            resp.end()
        })
    app.route('/rocket_telegram')
        .get((req, resp) => {
            log.debug("[GET] /rocket_telegram", req.query)
            resp.end()
        })
        .post((req, resp) => {
            log.debug("[POST] /rocket_telegram", req.body)
            send.forwardSkype(req.body);
            resp.end()
        })
}
const log = require("../libs/writeLogs").Logger

module.exports = function (app) {
    // Telegram
    app.route('/telegram-webhook')
        .get((req, resp) => {
            log.debug("[GET] /telegram-webhook", req.query)
            resp.end()
        })
        .post((req, resp) => {
            log.debug("[POST] /telegram-webhook", req.body)
            resp.end()
        })
}
const log = require("../libs/writeLogs").Logger


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
}
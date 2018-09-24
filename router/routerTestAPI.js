const log = require("../libs/writeLogs").Logger


module.exports = function (app) {
    app.route('/osource-facebook-webhook')
        .get((req, resp) => {
            log.debug("[GET] /osource-facebook-webhook", JSON.stringify(req))
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
            log.debug("[POST] /osource-facebook-webhook", JSON.stringify(req))
            resp.end()
        })
}
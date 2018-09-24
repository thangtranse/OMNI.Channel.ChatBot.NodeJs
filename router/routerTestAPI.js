const log = require("../libs/writeLogs").Logger


module.exports = function (app) {
    app.route('/osource-facebook-webhook')
        .get((res, resp) => {
            log.debug("[GET] /osource-facebook-webhook", JSON.stringify(res.body))
            let VERIFY_TOKEN = "tranminhthang-sccc" // Mã xác minh khi đăng ký webhook Facebook
            let mode = req.query['hub.mode'];
            let token = req.query['hub.verify_token'];
            let challenge = req.query['hub.challenge'];
            if (mode && token) {
                if (mode === 'subscribe' && token === VERIFY_TOKEN) {
                    res.status(200).send(challenge);
                } else {
                    res.sendStatus(403);
                }
            }
        })
        .post((res, resp) => {
            log.debug("[POST] /osource-facebook-webhook", JSON.stringify(res.body))
            resp.end()
        })
}
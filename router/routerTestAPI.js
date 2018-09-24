const log = require("../libs/writeLogs").Logger


module.exports = function (app) {
    app.route('/osource.facebook.webhook')
        .get((res, resp) => {
            log.debug("[GET] /osource.facebook.webhook", JSON.stringify(res.body))
            resp.end()
        })
        .post((res, resp) => {
            log.debug("[POST] /osource.facebook.webhook", JSON.stringify(res.body))
            resp.end()
        })
}
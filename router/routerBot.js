const log = require("../libs/writeLogs").Logger


/**
 * BOT
 * Nhận các Request từ Rocket về
 * @param app
 */
module.exports = function (app) {
    app.route('/rocket_bot')
        .get((req, resp) => {
            log.debug("[get] url: /rocket_bot", JSON.stringify(req.body))
            resp.end();
        })
        .post((req, resp) => {
            log.debug("[post] url: /rocket_bot", JSON.stringify(req.body))

            resp.end();
        })
}
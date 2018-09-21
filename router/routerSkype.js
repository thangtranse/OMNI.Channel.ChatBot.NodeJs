const reciveSkype = require("../helper-skype/recive");
const send = require("../helper-skype/send");
const logs = require("../libs/writeLogs").Logger;

module.exports = function (app) {
    app.route('/webhook_skype')
        .get((req, resp) => {
            logs.debug("GET webhook_azure", JSON.stringify(req.body));
            resp.end();
        })
        .post((req, resp) => {
            send.forwardSkype(req.body);
            resp.end();
        })
    app.route('/webhook_azure')
        .post((req, resp) => {
            logs.debug("POST webhook_azure", JSON.stringify(req.body));
            reciveSkype.handleMessage(req.body);
            resp.end();
        })
}
const reciveSkype = require("../helper-skype/recive");
const send = require("../helper-skype/send");

module.exports = function (app) {
    app.route('/webhook_skype')
        .get((req, resp) => {
            writeLog("GET webhook_azure", JSON.stringify(req.body));
            resp.end();
        })
        .post((req, resp) => {
            send.forwardSkype(req.body);
            resp.end();
        })
    app.route('./webhook_azure')
        .post((req, resp) => {
            writeLog("POST webhook_azure", JSON.stringify(req.body));
            reciveSkype.handleMessage(req.body);
            resp.end();
        })
}
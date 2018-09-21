const reciveViber = require("../helper-viber/recive");
const sendViber = require("../helper-viber/send");

module.exports = function (app) {
    app.post("/viber", (res, resp) => {
        reciveViber.handleMessage(res.body);
        resp.end();
    })

    app.post("/webhook_viber", (res, resp) => {
        sendViber.forwardViber(res.body);
        resp.end();
    })

    app.get("/viber", (res, resp) => {
        resp.end();
    })
}
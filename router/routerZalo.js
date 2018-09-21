const apiZalo = require('../helper-zalo/apiOpen');
const zaloRecive = require('../helper-zalo/recive');
const zaloSend = require('../helper-zalo/send');

module.exports = function (app) {
    app.get("/zalowebhook", async (req, res) => {
        zaloRecive.handleMessage(req.query);
        res.end();
    });

    app.post("/webhook_zalo", (req, res) => {
        zaloSend.forwardZalo(req.body);
        res.end();
    });
}
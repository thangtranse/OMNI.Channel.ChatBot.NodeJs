
const MessengerSend = require('../helper-messenger/send'),
    MessengerRecive = require('../helper-messenger/recive'),
    log = require("../libs/writeLogs").Logger

module.exports = function (app) {
    // Creates the endpoint for our webhook
    /**
     * {
     *     bot, channel_id, channel_name, message_id, timestamp, user_id, user_name, text
     * }
     */
    app.route('/webhook_facebook')
        .post(async (req, res) => {
            MessengerSend.forwardFacebook(req.body);
            res.end();
        });

    /**
    * Creates the endpoint for our webhook
    * Nhận Request từ FB gửi về
    *
    */
    app.route('')
        .post((req, res) => {
            let body = req.body;
            /**
             * body: {object, entry : [{id, time, messaging: {} }]}
             */
            log.debug("/webhook req", req.body)
            if (body.object === 'page') {
                body.entry.forEach((entry) => {
                    if (!entry.messaging) return;
                    let pageEntry = entry.messaging;
                    pageEntry.forEach((messagingEvent) => {
                        let sender_psid = messagingEvent.sender.id;
                        if (messagingEvent.message) {
                            console.log("if 1", messagingEvent);
                            log.debug("/webhook", messagingEvent)
                            MessengerRecive.handleMessage(sender_psid, messagingEvent.message);
                        } else if (messagingEvent.account_linking) { // eslint-disable-line camelcase, max-len
                            console.log("else 1");
                        } else if (messagingEvent.postback) {
                            console.log("if 2 postback", messagingEvent.postback);
                            MessengerRecive.handlePostback(sender_psid, messagingEvent.postback);
                        } else {
                            console.log("else 2", messagingEvent.postback);
                        }
                    });
                });
                res.status(200).send('EVENT_RECEIVED');
            } else {
                res.sendStatus(404);
            }
        });
}
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session')
const request = require('request');
const db = require('./database/connectDb');
const fs = require('fs');
const configAuth = require('./config');
const app = express().use(bodyParser.json());

var id = "";
// Session
app.set('trust proxy', 1) // trust first proxy
app.use(session({secret: 'SCC-Thangtm13'}));
// Session END

const callRocket = require('./webhook-rocket/createWebhook');
const api = require('./webhook-rocket/apiRest');
const apiRealTime = require('./webhook-rocket/apiRealTime');
var ddp
// var apireal = new apiRealTime();
// Start Server
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
// app.listen(4001, () => console.log('webhook is listening'));
// Start Server END
// Passport FB
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());
// xác định đăng nhập từ FB
app.get('/auth/facebook', passport.authenticate('facebook'));
// Xử lý dữ liệu callback về
app.get('/auth/facebook/callback', passport.authenticate('facebook',
    {failureRedirect: '/auth/facebook', successRedirect: '/'})
);
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

passport.use(new FacebookStrategy(configAuth.facebookAuth,
    function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            // Lấy được token khi User thực hiện đăng nhập
            done(null, accessToken);
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
})
// Passport FB END

// Khi đăng nhập thành công sẽ trỏ về link này
app.get("/", (req, resp) => {
    if (id.length != 0 && typeof req.session.passport.user != "undefined") {
        if (id.length != 0 && typeof req.session.passport.user != "undefined") {
            api.loginWithFacebook(req.session.passport.user, (data) => {
                if (data.status == "success") {

                    db.writeUserData(id, data.data.me.name, data.data.authToken, req.session.passport.user, data.data.userId);
                    console.log("id nhận tin nhắn đây nè: ", id);
                    callSendAPI(id, {"text": `Xin chào "${data.data.me.name}"`});
                    callSendAPI(id, {"text": `BOT: Tin nhắn bạn gửi sẽ được chuyển vào group "#GENERAL" Hãy bắt đầu trò chuyện!`});

                    fs.readFile('index.html', (err, data) => {
                        resp.end(data);
                    })
                }
                // đăng ký lắng nghe
                // apireal.login(req.session.passport.user);
            });
        } else {
            resp.end();
        }
    }
});

// Creates the endpoint for our webhook
app.post('/webhook', (req, res) => {
    let body = req.body;
    console.log("Nhập request từ Facebook");
    if (body.object === 'page') {
        body.entry.forEach((entry) => {
            if (!entry.messaging) {
                return;
            }
            let pageEntry = entry.messaging;
            pageEntry.forEach((messagingEvent) => {
                let sender_psid = messagingEvent.sender.id;
                id = sender_psid;
                if (messagingEvent.message) {
                    console.log("if 1", messagingEvent);
                    handleMessage(sender_psid, messagingEvent.message);
                } else if (messagingEvent.account_linking) { // eslint-disable-line camelcase, max-len
                    console.log("else 1");
                }
                if (messagingEvent.postback) {
                    console.log("if 2 postback", messagingEvent.postback);
                    handlePostback(sender_psid, messagingEvent.postback);
                } else {
                    console.log("else 2", messagingEvent.postback);
                    // console.error('Webhook received unknown messagingEvent: ', messagingEvent);
                }
            });
        });
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

/**
 * Dùng để xác thực với Facebook
 */
app.get('/webhook', (req, res) => {
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "thang_dep_trai"
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
        console.log("call this");
        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});

/**
 * Handles messages events
 * Phản hồi tin nhắn khách hàng
 * @param sender_psid id-user gửi tin nhắn
 * @param received_message nội dung tin nhắn
 */
var handleMessage = (sender_psid, received_message) => {
    let response = null;
    // tin nhắn không chưa nội dung
    console.log("handleMessage", received_message.text);
    if (!received_message.text) {
        return;
    }
    // kiểm tra id đối tượng gửi tin đã đăng nhập hay chưa
    db.getDataUser(sender_psid, (data) => {
        console.log("kiểm tra sender_psid: ", sender_psid);
        if (typeof data != "undefined") { // khách hàng đã login
            console.log("Tồn tại: ", data);
            switch ((received_message.text).toLowerCase()) {
                case 'bắt đầu':
                    callSendAPI(sender_psid, {"text": "Bạn đã đăng nhập rồi!"});
                    break;
                default:
                    response = {
                        "text": received_message
                    }
            }
            api.sendMess('GENERAL', received_message.text, data.token_rocket.stringValue, data.id_rocket.stringValue,
                data => {
                    console.log("tin nhắn được gửi đến rocket: ", data.status);
                });
        } else { // khách hàng chưa login
            console.log("KH chưa tồn tại");
            switch ((received_message.text).toLowerCase()) {
                case 'bắt đầu':
                    loginRocketWithFacebook(sender_psid);
                    break;
                default:
                    response = {
                        "text": received_message
                    }
            }
        }
    });

    // // Sends the response message
    // if (response != null) {
    //     // callSendAPI(sender_psid, response);
    //     // sendMsgToRocket(sender_psid, received_message.text)
    //     api.sendMess('7z54Pw8cppA8xMt2j', received_message.text);
    // }
}

/**
 * Thực hiện đăng nhập bằng tài khoản FB với ROCKET
 */
var loginRocketWithFacebook = (sender_psid) => {
    var response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Đăng nhập để trò chuyện cùng chúng tôi",
                    "subtitle": "Tài khoản FB của bạn sẽ liên kết đến ứng dụng của chúng tôi...",
                    "buttons": [
                        {
                            "type": "account_link",
                            "url": "https://ten-lua-webhook.herokuapp.com/auth/facebook"
                        }
                    ],
                }]
            }
        }
    }
    callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
    console.log("post_back", sender_psid);
    console.log("received_postback", received_postback);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
// Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }
    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": {"access_token": 'EAAG9mksIwrUBAGI7pm0p4X7rAS25WJNZBDCGS3XdnPX6Bsf0whRmnT2OdHZCFTZCgK7lAcJi8ZBn8hZC1WKxhTTS5VZBsSEZCamCMKje7ZCiPokxuhDEgbiFEXPlukU9rRm3uE0JzEO2oyxCcWpDIvZCYR4ATW6YZAkdZABQi7wUTtQVgZDZD'},
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

app.get('/login', (req, res) => {
    const accountLinkingToken = req.query.account_linking_token;
    const redirectURI = req.query.redirect_uri;
    console.log("token", accountLinkingToken);
    api.loginWithFacebook(accountLinkingToken);
    res.end();
});

// Creates the endpoint for our webhook
app.post('/ten-lua', async (req, res) => {
    let body = req.body;
    // body.token: 'QFJB7u78GHwLD2P37vwdaeRC',
    // body.bot: false,
    // body.channel_id: 'K5T7c6MJaGLcYiYpf',
    // body.channel_name: 'facebook_msg',
    // body.message_id: 'xyPKWqnmxWG84sPoE',
    // body.timestamp: '2018-08-12T10:09:54.092Z',
    // body.user_id: 'AHBrCEjwq4H2TYdj9',
    // body.user_name: 'thangtm',
    // body.text: 'Test Outcome'
    console.log("passport", req.session.passport);
    console.log("session", req.session);
    console.log(body);
    let temp = await db.getDataUserConnect().then(data => data);
    temp.map(x => callSendAPI(x, body.text));
    res.end();
});

// Creates the endpoint for our webhook
app.get('/listusers', (req, res) => {

    var login = b.login();

    login.then(data => {
        req.session.authToken = data.body.data.authToken;
        req.session.userId = data.body.data.userId;
        b.getListUser(req.session.authToken, req.session.userId, data => {
            console.log(data);
            let temp = data.toString();
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write("<pre>" + JSON.stringify(data) + "</pre>");
            res.end();
        });
    })


});

app.get("/getlist", (req, res) => {
    console.log("oke");
    let temp = db.getDataUserConnect().then(data => data);
    console.log(temp);
    res.end();
});



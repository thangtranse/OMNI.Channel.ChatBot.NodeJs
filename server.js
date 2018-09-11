const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session')
const db = require('./database/connectDb');
const fs = require('fs');
const configAuth = require('./config');
const app = express().use(bodyParser.json());
var id = "";

// Session
app.set('trust proxy', 1) // trust first proxy
app.use(session({secret: 'SCC-Thangtm13'}));
// Session END

// Zalo
const apiZalo = require('./helper-zalo/apiOpen');
const zaloRecive = require('./helper-zalo/recive');
// END Zalo

const api = require('./helper-rocket/apiRest');
const MessengerRecive = require('./helper-messenger/recive');
const MessengerSend = require('./helper-messenger/send');

// Start Server
app.set('port', process.env.PORT || 1337);
app.listen(app.get('port'), () => console.log('webhook is listening in port: ', app.get("port")));
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
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/auth/facebook',
    successRedirect: '/'
}));
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
    console.log("oke chưa?");
    console.log(resp.data);
    console.log("id: ", id);
    if (id.length != 0 && typeof req.session.passport.user != "undefined") {
        api.loginWithFacebook(req.session.passport.user, (data) => {
            if (data.status == "success") {
                console.log("info: ", data.data);
                db.writeUserData(id, data.data.me.name, data.data.authToken, req.session.passport.user, data.data.userId);
                console.log("id nhận tin nhắn đây nè: ", id);
                MessengerSend.callSendAPI(id, {"text": `Xin chào "${data.data.me.name}"`});
                MessengerSend.callSendAPI(id, {"text": `BOT: Tin nhắn bạn gửi sẽ được chuyển vào group "#GENERAL" Hãy bắt đầu trò chuyện!`});
                MessengerSend.callSendAPI(id, {"text": `BOT: Để biết các câu lệnh đơn giản bạn hãy gõ --help`});
                if (typeof data.data.me.username == "undefined") {
                    console.log("undefine");
                    api.updateProfile(data.data.authToken, data.data.userId, {"username": data.data.me.name});
                }
                fs.readFile('./public/index.html', (err, data) => {
                    resp.end(data);
                })
            }
        });
    } else {
        resp.end();
    }
});

app.post("viber", (res, resp) => {
    console.log("thangtm: ", res.data);
    resp.end();
})

app.get("viber", (res, resp) => {
    console.log("thangtm get: ", res.data);
    resp.end();
})

/**
 * Creates the endpoint for our webhook
 * Nhận Request từ FB gửi về
 *
 */
app.post('/webhook', (req, res) => {
    let body = req.body;
    console.log("Nhập request từ Facebook");
    console.log("----------------------------");
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
                    MessengerRecive.handleMessage(sender_psid, messagingEvent.message);
                } else if (messagingEvent.account_linking) { // eslint-disable-line camelcase, max-len
                    console.log("else 1");
                } else if (messagingEvent.postback) {
                    console.log("if 2 postback", messagingEvent.postback);
                    MessengerRecive.handlePostback(sender_psid, messagingEvent.postback);
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

    let temp = await db.getListUserConnect().then(data => data);
    temp.map(x => {
        if (x.idRocket != body.user_id)
            MessengerSend.callSendAPI(x.idMess, {"text": body.text});
    });
    res.end();
});

// Creates the endpoint for our webhook
/**
 * {
 *     bot, channel_id, channel_name, message_id, timestamp, user_id, user_name, text
 * }
 */
app.post('/customerprivate', async (req, res) => {
    let body = req.body;
    db.queryIdChannel(body.channel_name, data => {
        console.log("1----2---3----4----:", body);
        if (body.user_id != "AHBrCEjwq4H2TYdj9")
            MessengerSend.callSendAPI(data.userId_fb, {text: body.text});
    });
    res.end();
});


// ZALO
app.get("/zalowebhook", async (req, res) => {
    console.log("----------------------------------");
    console.log(req.query);
    console.log("----------------------------------");

    zaloRecive.handleMessage(req.query);
    res.end();
});


// ZALO END


// TEST
app.get("/test", async (req, res) => {
    db.queryIdChannel("thang.tran.1661436757312768", data => {
        console.log("ahihi: ", data);
    });
    res.end();
});

const t = require('./helper-messenger/graph');
app.get("/fb", (req, res) => {
    console.log("new: ", t.getInforCustomerChatWithPage('166143675731276'));
});

app.get("/livechat", (req, res) => {
    fs.readFile('./public/livechat.html', (err, data) => {
        res.end(data);
    })
});


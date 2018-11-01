const express = require('express'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    app = express().use(bodyParser.json()),
    session = require('express-session'),
    passport = require('passport');

require('dotenv').config()

// var mongoose = require('mongoose');
// mongoose.connect(config.mongodb.url);
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//     console.log("Connect complete!");
// });


// Session
app.set('trust proxy', 1) // trust first proxy
app.use(session({ secret: 'SCC-Thangtm13' }));
app.use("/logs", express.static('./libs/systemLogs'));
// app.use("/app", express.static(''));
// Session END

const api = require('./helper-rocket/apiRest');
const MessengerSend = require('./helper-messenger/send');
//
// Start Server
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => console.log('webhook is listening in port: ', app.get('port')));
// Start Server END

// Passport FB
const FacebookStrategy = require('passport-facebook').Strategy;
app.use(bodyParser.urlencoded({ extended: true }));
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

var facebookAuth = {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL
}

passport.use(new FacebookStrategy(facebookAuth, function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
        // Lấy được token khi User thực hiện đăng nhập
        done(null, accessToken);
    });
}));

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
        api.loginWithFacebook(req.session.passport.user, (data) => {
            if (data.status == "success") {
                console.log("info: ", data.data);
                db.writeUserData(id, data.data.me.name, data.data.authToken, req.session.passport.user, data.data.userId);
                console.log("id nhận tin nhắn đây nè: ", id);
                MessengerSend.callSendAPI(id, { "text": `Xin chào "${data.data.me.name}"` });
                MessengerSend.callSendAPI(id, { "text": `BOT: Tin nhắn bạn gửi sẽ được chuyển vào group "#GENERAL" Hãy bắt đầu trò chuyện!` });
                MessengerSend.callSendAPI(id, { "text": `BOT: Để biết các câu lệnh đơn giản bạn hãy gõ --help` });
                if (typeof data.data.me.username == "undefined") {
                    console.log("undefine");
                    api.updateProfile(data.data.authToken, data.data.userId, { "username": data.data.me.name });
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

    // let temp = await db.getListUserConnect().then(data => data);
    // temp.map(x => {
    //     if (x.idRocket != body.user_id)
    //         MessengerSend.callSendAPI(x.idMess, { "text": body.text });
    // });
    res.end();
});

app.get("/livechat", (req, res) => {
    fs.readFile('./public/livechat.html', (err, data) => {
        res.end(data);
    })
});

var m = require("./libs/models/msgRocket");
app.get("/mongoose_create", async (req, res) => {
    m.create({ localSent: "123", idRoomRocket: "456", nameRoomRocket: "789", uid: "111" }, (err, result) => {
        if (!err) console.log("thanh công", result)
        else
            console.log("erorr", err)
        res.end();
    });
});
app.get("/mongoose_find", async (req, res) => {
    let thangg = m.find({ localSent: "1234" }, (err, result) => {
        return new Promise((resolve, reject) => {
            if (!err) resolve(result)
            else
                reject(err)
        })
    });

    thangg.then(data => res.end(JSON.stringify(data)))
});

// ROUTER
const routerBot = require('./router/routerBot')
const routerSkype = require('./router/routerSkype')
const routerZalo = require('./router/routerZalo')
const routerViber = require('./router/routerViber')
const routerTestApi = require('./router/routerTestAPI')
const routerTelegram = require('./router/routerTelegram')
const routerFacebook = require('./router/routerFacebook')

routerBot(app)
routerSkype(app)
routerZalo(app)
routerViber(app)
routerTestApi(app)
routerTelegram(app)
routerFacebook(app)
// ROUTER END

// LOG
app.get("/debug.config", async (req, res) => {
    fs.readFile('./libs/systemLogs/debug.config', (err, data) => {
        res.header("Content-Type", "application/json; charset=utf-8");
        res.end(data);
    })
});
app.get("/info.config", async (req, res) => {
    fs.readFile('./libs/systemLogs/info.config', (err, data) => {
        res.header("Content-Type", "application/json; charset=utf-8");
        res.end(data);
    })
});
app.get("/error.config", async (req, res) => {
    fs.readFile('./libs/systemLogs/error.config', (err, data) => {
        res.header("Content-Type", "application/json; charset=utf-8");
        res.end(data);
    })
});
// LOG END
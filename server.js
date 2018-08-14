const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session')
const request = require('request');
const fs = require('fs');

const app = express().use(bodyParser.json());
// Session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'FMS',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 300000,
        secure: false
    }
}));

const callRocket = require('./webhook-rocket/createWebhook');
const api = require('./webhook-rocket/apiRest');


app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
// app.listen(4001, () => console.log('webhook is listening'));

app.get('/', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile('index.html', (err, data) => {
        if (err) throw err;
        res.end(data);
    });

});


// Creates the endpoint for our webhook
app.post('/webhook', (req, res) => {
    let body = req.body;
    console.log("Nhập request từ Facebook");
    console.log("body", body.entry[0].changes);
    // Checks this is an event from a page subscription
    if (body.object === 'page') {
        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {
            if (!entry.messaging) {
                return;
            }
            // Gets the message. entry.messaging is an array, but
            // will only ever contain one message, so we get index 0
            let pageEntry = entry.messaging;
            pageEntry.forEach((messagingEvent) => {
                console.log("messagingEvent", {messagingEvent});
                let sender_psid = messagingEvent.sender.id;
                if (messagingEvent.message) {
                    console.log("trueeeee");
                    handleMessage(sender_psid, messagingEvent.message);
                } else if (messagingEvent.account_linking) { // eslint-disable-line camelcase, max-len
                    console.log("chưa biết chuyện gì xãy ra");
                }
                if (messagingEvent.postback) {
                    console.log("postback");
                    handlePostback(sender_psid, messagingEvent.postback);
                } else {
                    console.error(
                        'Webhook received unknown messagingEvent: ',
                        messagingEvent
                    );
                }
            });
        });
        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
});

// Adds support for GET requests to our webhook
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

// Handles messages events
function handleMessage(sender_psid, received_message) {
    let response;
    // Check if the message contains text
    if (received_message.text) {
        // Create the payload for a basic text message
        response = {
            "text": `You sent the message: "${received_message.text}". Now send me an image!`
        }
    }
    let request_body = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Is this the right picture?",
                    "subtitle": "Tap a button to answer."
                }]
            }
        }
    }
    console.log("nó ra đây rồi")
    // Sends the response message
    callSendAPI(sender_psid, request_body);
    // sendMsgToRocket(sender_psid, received_message.text)
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
        "qs": {"access_token": 'EAAG9mksIwrUBANTYHX24Q6thLlpgwoj5tr16XngoWeYVgnSHRGhyGpyPxy4cGJT730ijU1thvgODZClbGwAaIngcNYux2N364lHAHn7IwUy1v9eKBZBR5vXngZBAZC8qRKiLBjb994vUmse4cNvXbq38iX8nCvW1gKdOnoOtnwZDZD'},
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
    api.loginWithFacebook(accountLinkingToken);
    console.log("accountLinkingToken", accountLinkingToken);
    console.log("redirectURI", redirectURI);
    res.end();
});

function sendMsgToRocket(_id, _msg) {
    let request_body = {
        "text": _msg,
        "userId": _id
    }
    request({
        "uri": "https://ten-lua.herokuapp.com/hooks/G9HvcSvqrkBcAmgz9/HXp6YNwzcD273PuCBk7PhnXgn3b33gFBjoS77rWztTyp7kPb",
        "qs": {"access_token": 'G9HvcSvqrkBcAmgz9/HXp6YNwzcD273PuCBk7PhnXgn3b33gFBjoS77rWztTyp7kPb'},
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

// Creates the endpoint for our webhook
app.post('/ten-lua', (req, res) => {
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
    console.log(body);
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

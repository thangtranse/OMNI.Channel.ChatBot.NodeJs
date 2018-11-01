const request = require('request');
const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN
const FACEBOOK_CLIENT_ID = 725589064452103

/**
 * Gửi tin nhắn VĂN BẢN đến người dùng
 * @param {*} endpoint 
 * @param {*} sender_psid 
 * @param {*} response 
 * 1661436757312768
 */
const parameterSentGraph = (endpoint, sender_psid, response) => {
    let request_body = {
        "messaging_type": "",
        "recipient": {
            "id": sender_psid
        },
        "message": {
            "text": response
        }
    }
    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/" + endpoint,
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            // Message has been successfully received by Facebook.
            console.log(
                `Successfully sent message to endpoint: `,
                JSON.stringify(body)
            );
        } else {
            console.error(
                `Failed calling Messenger API endpoint`,
                response.statusCode,
                response.statusMessage,
                body.error
            );
        }
    });
}

/**
 * Gửi tin nhắn HÌNH ẢNH đến người dùng
 * @param {*} endpoint loại "messages"
 * @param {*} sender_psid id người nhận
 * @param {*} _urlImage url hình ảnh
 */
const parameterSentGraphWithMedia = (endpoint, sender_psid, _urlImage) => {
    let request_body = {
        "messaging_type": "",
        "recipient": {
            "id": sender_psid
        },
        "message": {
            "attachment": {
                "type": "image",
                "payload": {
                    "url": _urlImage,
                    "is_reusable": true
                }
            }
        }
    }
    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/" + endpoint,
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            // Message has been successfully received by Facebook.
            console.log(
                `Successfully sent message to endpoint: `,
                JSON.stringify(body)
            );
        } else {
            console.error(
                `Failed calling Messenger API endpoint`,
                response.statusCode,
                response.statusMessage,
                body.error
            );
        }
    });
}

const parameterSentGraphQuickReplies = (sender_psid, _urlImage) => {
    let request_body = {
        "messaging_type": "",
        "recipient": {
            "id": sender_psid
        },
        "message": {
            "text": "Here is a quick reply!",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "Search",
                    "payload": "<POSTBACK_PAYLOAD>",
                    "image_url": _urlImage
                },
                {
                    "content_type": "location"
                }
            ]
        }
    }
    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            // Message has been successfully received by Facebook.
            console.log(
                `Successfully sent message to endpoint: `,
                JSON.stringify(body)
            );
        } else {
            console.error(
                `Failed calling Messenger API endpoint`,
                response.statusCode,
                response.statusMessage,
                body.error
            );
        }
    });
}

const getInforCustomerChatWithPage = (_Userid, ) => {
    return new Promise((resolve, reject) => {
        request({
            "uri": `https://graph.facebook.com/${_Userid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`,
            "method": "GET",
        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                resolve(body);
            } else {
                console.error(
                    `Failed calling Messenger API endpoint`,
                    response.statusCode,
                    response.statusMessage,
                    body.error
                );
                reject(response.statusCode);
            }
        });
    })
}

/**
 * Gửi tin nhắn "text" sang người dùng Facebook
 * @param sender_psid
 * @param response
 */
const sentMsgFacebook = (sender_psid, response) => {
    parameterSentGraph("messages", sender_psid, response);
}




/**
 * Đăng nội dung lên NewsFeed
 * @param {*} _contentNewsFeed Content to post News Feed
 * @param {} _link Link Url website
 */
const postNewsFeed = (_contentNewsFeed, _link) => {
    var url = `https://graph.facebook.com/${FACEBOOK_CLIENT_ID}/feed?message=${_contentNewsFeed}&access_token${PAGE_ACCESS_TOKEN}`
    if (_link.length != 0) {

        url = `https://graph.facebook.com/${FACEBOOK_CLIENT_ID}/feed?message=${_contentNewsFeed}&link=${_link}&access_token${PAGE_ACCESS_TOKEN}`
    }
    return new Promise((resolve, reject) => {
        request({
            "uri": url,
            "method": "POST",
        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                resolve(body);
            } else {
                console.error(
                    `Failed calling Messenger API endpoint`,
                    response,
                    body);
                reject(response.statusCode);
            }
        });
    })
}

module.exports = {
    parameterSentGraph,
    getInforCustomerChatWithPage,
    sentMsgFacebook,
    postNewsFeed,
    parameterSentGraphWithMedia,
    parameterSentGraphQuickReplies
}

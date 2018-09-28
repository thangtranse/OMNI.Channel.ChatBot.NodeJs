const request = require('request'),
    log = require('../libs/writeLogs').Logger;

const sendMsg = async (_url, _conversationId, _activityId, _dataMsg) => {
    let valueToken = await getToken();
    log.debug("apiSkype sendMsg: ", valueToken);
    return new Promise((resolve, reject) => {
        request({
            url: `${_url}v3/conversations/${_conversationId}/activities/${_activityId}`,
            method: "POST",
            headers: {
                "Authorization": "Bearer " + valueToken,
                "Content-Type": "application/json"
            },
            json: _dataMsg
        }, (error, response, body) => {
            console.log("thang:: ", response.statusCode);
            console.log("body:: ", body);
            console.log("error:: ", error);
            if (!error && response.statusCode === 200) {
                resolve(body);
            }

            log.error("file:apiSkype, function:sendMsg, Status Code", response.statusCode)
            log.error("file:apiSkype, function:sendMsg, body", body)
            reject(error);

        })
    })
}

const getToken = () => {
    return new Promise((resolve, reject) => {
        request({
            url: "https://login.microsoftonline.com/botframework.com/oauth2/v2.0/token",
            method: "POST",
            form: {
                "grant_type": process.env.SKYPE_GRANT_TYPE,
                "client_id": process.env.SKYPE_CLIENT_ID,
                "client_secret": process.env.SKYPE_CLIENT_SECRET,
                "scope": process.env.SKYPE_SCOPE
            }
        }, (error, response, body) => {
            log.debug("apiSkype getToken: ", body)
            if (!error && response.statusCode === 200) {
                let temp = JSON.parse(body);
                resolve(temp.access_token);
            }
            log.error("file:apiSkype, function:getToken, Status Code", response.statusCode)
            log.error("file:apiSkype, function:getToken, body", body)
            reject(body);
        })
    })
}

module.exports = { sendMsg }
const request = require('request');

const URL_API_ROCKET = process.env.ROCKET_URL_API_ROCKET;
// const URL_WEBHOOK_CALLBACK = 'http://ten-lua-webhook.herokuapp.com/customerprivate';
const URL_WEBHOOK_CALLBACK_ZALO = process.env.URL_WEBHOOK_ZALO;
const URL_WEBHOOK_CALLBACK_VIBER = process.env.URL_WEBHOOK_VIBER;
const URL_WEBHOOK_CALLBACK_FACEBOOK = process.env.URL_WEBHOOK_FACEBOOK;
const Agent = ["bot", "thangtester", "toannc", "huongvg", "thoattk"];

var axios = require('axios');

var axiosInstance = axios.create({
    baseURL: URL_API_ROCKET,
    timeout: 5000
});

/**
 * Thực hiện:
 * - login
 * - loginWithFacebook
 * - updateProfile
 * - getListUser
 * - sendMess
 * - searchUser
 * - createChannel
 * - createOutGoingWebhook
 */
class apiRest {

    constructor() {
    }

    /**
     {
        userId: 'AHBrCEjwq4H2TYdj9',
        authToken: '1_aP69HkRa_VZLlaryjUA0v69xSYMN9keFM1KQkb6pA',
        me:
        { _id: 'AHBrCEjwq4H2TYdj9',
        name: 'thangtm',
        emails: [ [Object] ],
        status: 'away',
        statusConnection: 'away',
        username: 'thangtm',
        utcOffset: 7,
        active: true,
        roles: [ 'admin', 'bot' ],
        settings: { preferences: [Object] } }
    }
     * @returns {Promise<any>}
     */
    login() {
        return new Promise((resolve, reject) => {
            var request_body = {
                username: 'thangtm',
                password: 'zxc123'
            };
            request({
                "url": URL_API_ROCKET + 'login',
                "method": "POST",
                "json": request_body
            }, (err, res, body) => {
                if (!err && body.status == 'success') {
                    resolve(body.data);
                } else {
                    reject(err)
                }
            });
        })
    }

    loginWithFacebook(_token, callback) {
        axiosInstance({
            method: 'POST',
            url: 'login',
            headers: { 'Content-type': 'application/json' },
            data: {
                "serviceName": "facebook",
                "accessToken": _token,
                "secret": process.env.FACEBOOK_CLIENT_SECRET,
                "expiresIn": 500
            }
        })
            .then(response => callback(response.data))
            .catch(err => error(err));
    }

    updateProfile(_token, _uid, _data, callback) {
        if (typeof _data.username != 'undefined') {
            console.log("oke");
            _data.username = randomUsername(_data.username);
        }
        axiosInstance({
            method: 'POST',
            url: 'users.update',
            headers: {
                'X-Auth-Token': _token,
                'X-User-Id': _uid,
                'Content-type': 'application/json'
            },
            data: {
                userId: _uid,
                data: _data
            }
        })
            .then(response => callback(response.data))
            .catch(err => error(err));
    }

    getListUser(_token, _uid, _callback) {
        axiosInstance({
            method: 'GET',
            url: 'users.list?query={}',
            headers: {
                'X-Auth-Token': _token,
                'X-User-Id': _uid
            }
        })
            .then(response => _callback(response.data))
            .catch(err => error(err));
    }

    /**
     * 5.  Messages
     *
     * @param roomID: ID PHÒNG
     * @param msg: NỘI DUNG TIN NHẮN
     * @param _token: TOKEN ROCKET NGƯỜI GỬI
     * @param _uid: ID ROCKET NGƯỜI GỬI
     * @param callback
     */
    sendMess(roomID, msg, _token, _uid, _firstName, _lassName, _urlAvatar, callback) {
        axiosInstance({
            method: 'POST',
            url: 'chat.sendMessage',
            headers: {
                'X-Auth-Token': _token,
                'X-User-Id': _uid
            },
            data: {
                message: {
                    alias: `${_firstName} ${_lassName}`,
                    avatar: _urlAvatar,
                    rid: roomID,
                    msg: msg
                }
            }
        })
            .then(response => callback(response))
            .catch(err => error(err));
    }

    // Tương tự thằng trên nhưng sử dụng PROMISE
    sendMsgRock(roomID, msg, _nameSent, _urlAvatar) {
        console.log("apiRest RocketChat: ", roomID + " - " + msg + " - " + _nameSent + " - " + _urlAvatar)
        return new Promise((resolve, reject) => {
            axiosInstance({
                method: 'POST',
                url: 'chat.sendMessage',
                headers: {
                    'X-Auth-Token': process.env.ROCKET_TOKEN,
                    'X-User-Id': process.env.ROCKET_USERID
                },
                data: {
                    message: {
                        alias: _nameSent,
                        avatar: _urlAvatar,
                        rid: roomID,
                        msg: msg
                    }
                }
            })
                .then(response => {
                    console.log("sendMsgRock: ", response.data);
                    resolve(response.data);
                })
                .catch(err => {
                    console.log("error sendMsgRock: ", err.response.data);
                    reject(err.response.data);
                });
        })
    }

    /**
     * Tim kiếm User
     * @param _dataSearch
     * @param _token
     * @param _uid
     * @param _callback
     */
    searchUser(_dataSearch, _token, _uid, _callback) {
        axiosInstance({
            method: 'GET',
            url: `users.list?query={ "name": { "$regex": "${_dataSearch}" } }`,
            headers: {
                'X-Auth-Token': _token,
                'X-User-Id': _uid
            }
        })
            .then(response => _callback(response.data))
            .catch(err => error(err));
    }

    /**
     * Thực hiện tạo Channel:
     *
     * Mặc định sẽ Add thêm USER "bot" vào
     *
     * @param channelName: Tên channel
     * @param _useridAdmin: ID ADMIN dùng để tạo channel
     * @param _authAdmin: TOKEN ADMIN
     * @param callback
     * {
     *     data: {
     *         channel: { id, name, fnam, t,msgs,userCount,u, customFields, ts,ro,sysMes, _updateAt }
     *         success
     *         }
     *     }
     * }
     */
    createChannel(channelName, _useridAdmin, _authAdmin, callback) {
        axiosInstance({
            method: 'POST',
            url: 'channels.create',
            headers: {
                'X-Auth-Token': _authAdmin,
                'X-User-Id': _useridAdmin
            },
            data: {
                name: channelName,
                members: Agent
            }
        }).then(response => {
            return callback(response)
        }).catch(message => {
            console.log("createchannel lỗi gì đây: ", message.response.data);
        })
    }

    // Tương tự thằng trên nhưng sử dụng Promise
    createChannelRocket(_channelName) {
        return new Promise((reject, resolve) => {
            axiosInstance({
                method: 'POST',
                url: 'channels.create',
                headers: {
                    'X-Auth-Token': process.env.ROCKET_TOKEN,
                    'X-User-Id': process.env.ROCKET_USERID
                },
                data: {
                    name: _channelName,
                    members: Agent
                }
            }).then(response => {
                console.log("createChannelRocket: ", response.data);
                resolve(response.data);
            }).catch(message => {
                console.log("createChannelRocket: ", message.response.data);
                reject(message.response.data);
            })
        });
    }

    /**
     *
     * @param channelName
     * @param _idAdmin
     * @param _authAdmin
     * @param callback
     *  { channel:
          { _id: 'YSWAzzr8zubHCxWc2',
            name: 'ngan.nguyen.2297198383653874',
            fname: 'ngan.nguyen.2297198383653874',
            t: 'c',
            msgs: 14,
            usersCount: 2,
            u: [Object],
            customFields: {},
            ts: '2018-09-12T02:55:21.187Z',
            ro: false,
            sysMes: true,
            _updatedAt: '2018-09-12T03:24:44.713Z',
            lastMessage: [Object],
            lm: '2018-09-12T03:24:44.657Z' },
         success: true }
     }
     */
    infoChannel(channelName) {
        return new Promise((resolve, reject) => {
            axiosInstance({
                method: 'GET',
                url: 'channels.info?roomName=' + channelName,
                headers: {
                    'X-Auth-Token': process.env.ROCKET_TOKEN,
                    'X-User-Id': process.env.ROCKET_USERID
                }
            }).then(response => {
                resolve(response.data);
            }).catch(message => {
                console.log("apiRest rocketChat [infoChannel]", message.response)
                reject(false);
            })
        })
    }

    // createOutGoingWebhook(_name, _useridAdmin, _authAdmin, callback) {
    //     axiosInstance({
    //         method: 'POST',
    //         url: 'integrations.create',
    //         headers: {
    //             'X-Auth-Token': _authAdmin,
    //             'X-User-Id': _useridAdmin
    //         },
    //         data: {
    //             type: "webhook-outgoing",
    //             name: _name,
    //             event: "sendMessage",
    //             enabled: true,
    //             username: "rocket.cat",
    //             urls: [URL_WEBHOOK_CALLBACK],
    //             scriptEnabled: false,
    //             channel: '#' + _name
    //         }
    //     }).then(response => {
    //         return callback(response)
    //     }).catch(function (message) {
    //         console.log("webhook lỗi: ", message);
    //     })
    // }

    // Tương tự thằng trên nhưng dùng Promise
    createOutGoingWebhookRocket_ZALO(_name) {
        return new Promise((resolve, reject) => {
            axiosInstance({
                method: 'POST',
                url: 'integrations.create',
                headers: {
                    'X-Auth-Token': process.env.ROCKET_TOKEN,
                    'X-User-Id': process.env.ROCKET_USERID
                },
                data: {
                    type: "webhook-outgoing",
                    name: _name,
                    event: "sendMessage",
                    enabled: true,
                    username: "rocket.cat",
                    urls: [URL_WEBHOOK_CALLBACK_ZALO],
                    scriptEnabled: false,
                    channel: '#' + _name
                }
            }).then(response => {
                resolve(response.data);
            }).catch(function (message) {
                reject(message.response.data);
            })
        });
    }

    // Tương tự thằng trên nhưng dùng Promise
    createOutGoingWebhookRocket_VIBER(_name) {
        return new Promise((resolve, reject) => {
            axiosInstance({
                method: 'POST',
                url: 'integrations.create',
                headers: {
                    'X-Auth-Token': process.env.ROCKET_TOKEN,
                    'X-User-Id': process.env.ROCKET_USERID
                },
                data: {
                    type: "webhook-outgoing",
                    name: _name,
                    event: "sendMessage",
                    enabled: true,
                    username: "rocket.cat",
                    urls: [URL_WEBHOOK_CALLBACK_VIBER],
                    scriptEnabled: false,
                    channel: '#' + _name
                }
            }).then(response => {
                resolve(response.data);
            }).catch(function (message) {
                reject(message.response.data);
            })
        });
    }

    // Tương tự thằng trên nhưng dùng Promise
    createOutGoingWebhookRocket_FACEBOOK(_name) {
        return new Promise((resolve, reject) => {
            axiosInstance({
                method: 'POST',
                url: 'integrations.create',
                headers: {
                    'X-Auth-Token': process.env.ROCKET_TOKEN,
                    'X-User-Id': process.env.ROCKET_USERID
                },
                data: {
                    type: "webhook-outgoing",
                    name: _name,
                    event: "sendMessage",
                    enabled: true,
                    username: "rocket.cat",
                    urls: [URL_WEBHOOK_CALLBACK_FACEBOOK],
                    scriptEnabled: false,
                    channel: '#' + _name
                }
            }).then(response => {
                resolve(response.data);
            }).catch(function (message) {
                reject(message.response.data);
            })
        });
    }

    // Tương tự thằng trên nhưng dùng Promise
    createOutGoingWebhookRocket(_url, _name) {
        return new Promise((resolve, reject) => {
            axiosInstance({
                method: 'POST',
                url: 'integrations.create',
                headers: {
                    'X-Auth-Token': process.env.ROCKET_TOKEN,
                    'X-User-Id': process.env.ROCKET_USERID
                },
                data: {
                    type: "webhook-outgoing",
                    name: _name,
                    event: "sendMessage",
                    enabled: true,
                    username: "rocket.cat",
                    urls: [_url],
                    scriptEnabled: false,
                    channel: '#' + _name
                }
            }).then(response => {
                resolve(response.data);
            }).catch(function (message) {
                reject(message.response.data);
            })
        });
    }

    roomUpload(_idRoom, _pathFile) {
        return new Promise((resolve, reject) => {
            axiosInstance({
                method: 'POST',
                url: `rooms.upload/${_idRoom}`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Auth-Token': process.env.ROCKET_TOKEN,
                    'X-User-Id': process.env.ROCKET_USERID
                },
                data: {
                    file: _pathFile
                }
            }).then(response => {
                resolve(response.data);
            }).catch(function (message) {
                reject(message.response.data);
            })
        });
    }

    // END CLASS
}

/**
 * Thực hiện conver username người dùng
 * - đổi các khoản trắng thành '.'
 * - chuyển về chữ thường
 * - random number
 * @param _email
 * @returns {string}
 */
const randomUsername = _email => (`${_email.replace(/(\s)/g, ".")}.${Math.floor((Math.random() * 100))}`).toLowerCase();

/**
 * Hiển thị lỗi
 * @param err
 */
const error = err => {
    console.log("API REST ERR: ", err.response);
}

module.exports = new apiRest();

const request = require('request');
const URL_API_ROCKET = 'https://ten-lua.herokuapp.com/api/v1/';
const URL_WEBHOOK_CALLBACK = 'http://ten-lua-webhook.herokuapp.com/customerprivate';
var axios = require('axios');
var configs = require("../config.json");

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
            headers: {'Content-type': 'application/json'},
            data: {
                "serviceName": "facebook",
                "accessToken": _token,
                "secret": configs.facebookAuth.clientSecret,
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

    // 5.  Messages
    sendMess(roomID, msg, _token, _uid, callback) {
        axiosInstance({
            method: 'POST',
            url: 'chat.sendMessage',
            headers: {
                'X-Auth-Token': _token,
                'X-User-Id': _uid
            },
            data: {
                message: {
                    rid: roomID,
                    msg: msg
                }
            }
        })
            .then(response => callback(response))
            .catch(err => error(err));
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
     * Mặc định sẽ Add thêm USER "admin" vào
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
        channelName  = clearUnikey(channelName);
        axiosInstance({
            method: 'POST',
            url: 'channels.create',
            headers: {
                'X-Auth-Token': _authAdmin,
                'X-User-Id': _useridAdmin
            },
            data: {
                name: channelName,
                members: ["admin"]
            }
        }).then(response => {
            return callback(response)
        }).catch(message => {
            console.log("createchannel lỗi gì đây: ", message);
        })
    }

    createOutGoingWebhook(_name, _useridAdmin, _authAdmin, callback) {
        axiosInstance({
            method: 'POST',
            url: 'integrations.create',
            headers: {
                'X-Auth-Token': _authAdmin,
                'X-User-Id': _useridAdmin
            },
            data: {
                type: "webhook-outgoing",
                name: _name,
                event: "sendMessage",
                enabled: true,
                username: "rocket.cat",
                urls: [URL_WEBHOOK_CALLBACK],
                scriptEnabled: false,
                channel: '#' + _name
            }
        }).then(response => {
            return callback(response)
        }).catch(function (message) {
            console.log("webhook lỗi: ", message);
        })
    }
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
    console.log("API ERR: ", err.response);
}

const clearUnikey = _data => {
    _data = _data.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    _data = _data.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    _data = _data.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    _data = _data.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    _data = _data.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    _data = _data.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    _data = _data.replace(/đ/g, "d");
    _data = _data.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    _data = _data.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    _data = _data.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    _data = _data.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    _data = _data.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    _data = _data.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    _data = _data.replace(/Đ/g, "D");
    return _data;
}

module.exports = new apiRest();

const request = require('request');
const URL_API_ROCKET = 'http://ten-lua.herokuapp.com/api/v1/';
var axios = require('axios');
var configs = require("../config.json");

var axiosInstance = axios.create({
    baseURL: URL_API_ROCKET,
    timeout: 5000
});

class apiRest {

    constructor() {
    }

    login() {
        var promise = new Promise((resolve, reject) => {
            var request_body = {
                username: 'thangtm',
                password: 'zxc123'
            };
            request({
                "url": URL_API_ROCKET + 'login',
                "method": "POST",
                "json": request_body
            }, (err, res, body) => {
                if (!err) {
                    resolve(res);
                } else {
                    reject(err)
                }
            });
        })
        return promise;
    }

    loginWithFacebook(_token, callback) {
        let data = {
            "serviceName": "facebook",
            "accessToken": _token,
            "secret": configs.facebookAuth.clientSecret,
            "expiresIn": 300
        };
        request({
            "url": URL_API_ROCKET + 'login',
            "method": "POST",
            "json": data
        }, (error, response, body) => {
            if (!error) {
                console.log('Đăng nhập thành công!', body);
                console.log('Đăng nhập thành công! event response.statusCode == 200: ', response.statusCode == 200);
                return callback(body);
            } else {
                console.error("Unable to send message:" + err);
            }
        });
    }

    updateProfile(_token, _uid, _data, callback) {
        console.log("1122");
        if (typeof _data.username != 'undefined') {
            console.log("oke");
            _data.username = randomUsername(_data.username);
        }
        console.log("112233", _data.username);
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
module.exports = new apiRest();

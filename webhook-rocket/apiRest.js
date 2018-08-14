const request = require('request');
var axios = require('axios');
const URL_API_ROCKET = 'http://ten-lua.herokuapp.com/api/v1/';
const SECRET_KEY = 'b5222fa7378e3add050404750c0fdc5d';


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

    loginWithFacebook(_token) {
        let data = {
            "serviceName": "facebook",
            "accessToken": _token,
            "secret": SECRET_KEY,
            "expiresIn": 200
        };
        request({
            "url": URL_API_ROCKET + 'login',
            "method": "POST",
            "json": data
        }, (err, res, body) => {
            if (!err) {
                console.log('Đăng nhập thành công!', body);
                if (body.error != 400) {
                    console.log("khác 400");
                }
            } else {
                console.error("Unable to send message:" + err);
            }
        });
    }

    getListUser(_token, _uid, _callback) {
        axiosInstance({
            method: 'GET',
            url: 'users.list?query={}',
            headers: {
                'X-Auth-Token': _token,
                'X-User-Id': _uid
            }
        }).then(response => {
            return _callback(response.data);
        }).catch(function (message) {
            console.log("Lỗi hã");
            console.log(message);
        })
    }


}

module.exports = new apiRest();

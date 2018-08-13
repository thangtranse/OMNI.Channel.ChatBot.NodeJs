var request;
const URL_API_ROCKET = 'http://ten-lua.herokuapp.com/api/v1/';
class createWebhook {

    constructor(_request) {
        console.log("chạy qua đây nè");
        request = _request;
        login();
    }

    create_income(){
        request({
            "uri": URL_API_ROCKET + 'integrations.create',
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
}

login = () => {
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
            console.log("Thông tin");
            console.log(res);
            console.log(body);
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

module.exports = createWebhook;
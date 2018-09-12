const db = require("../database/connectDb");
const apiOpen = require("./apiOpen");

const handleMessage = (_data) => {
    /**
     * _data: { fromoid, phone, appid, msgid, event, pageid, message, oaid, mac, timestamp }
     *
     */
    switch (_data.event) {
        case 'sendgifmsg': // tin nhắn dạng gif
            break;
        case 'sendstickermsg': // tin nhắn dạng sticker
            break;
        case 'sendlocationmsg': //tin nhắn địa điểm
            break;
        case 'sendlinkmsg': // tin nhắn dạng liên kết
            break;
        case 'sendvoicemsg': // tin nhắn dạng âm thanh
            break;
        case 'sendimagemsg': // tin nhắn dạng hình
            break;
        case 'sendmsg': // tin nhắn dạng text
            console.log("thangtm: ", _data);
            apiOpen.getInforUser(_data.fromoid);

            break;
    }
}

module.exports = {handleMessage}
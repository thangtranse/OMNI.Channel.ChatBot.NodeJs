const ProcessStr = require('../libs/processStr');
const apiOpen = require('./apiOpen');

const forwardZalo = (_data) => {
    console.log("thangtm: ", _data);

    let uidZalo = ProcessStr.getIdFormRocket(_data.channel_name);
    console.log("thangtm: ", uidZalo);
    apiOpen.sending(uidZalo, _data.text);
}


module.exports = {forwardZalo}
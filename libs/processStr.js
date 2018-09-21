/**
 * Xóa Các Ký tự UNIKEY
 * @param _data
 * @returns {*}
 */
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

/**
 * Thực hiện tách chuổi lấy id
 * Lấy Tất cả các giá trị phía sau dấu chấm cuối cùng và trả về giá trị đó
 * @param _str
 */
const getIdFormRocket = (_str) => {
    return _str.slice(_str.lastIndexOf('.') + 1);
}

module.exports = {clearUnikey, getIdFormRocket}
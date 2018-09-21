module.exports = function (app) {
    app.route('/rocket_bot')
        .get((req, resp) => {
            console.log("Thắng");
            resp.end();
        })
        .post((req, resp) => {
            console.log("Thắng post");
            resp.end();
        })
}
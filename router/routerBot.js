module.exports = function (app) {
    app.route('/rocket_bot')
        .get((req, resp) => {
            console.log("Thắng get: ", req.body);
            resp.end();
        })
        .post((req, resp) => {
            console.log("Thắng post: ", req.body);
            resp.end();
        })
}
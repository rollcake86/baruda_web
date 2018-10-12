

module.exports = function (res , msg) {

    res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
    res.write(JSON.stringify(msg));
    res.end();

}
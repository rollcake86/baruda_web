

module.exports = function (res , err) {

    var object = {key : false , msg : err};

    res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
    res.write(JSON.stringify(object));
    res.end();

}
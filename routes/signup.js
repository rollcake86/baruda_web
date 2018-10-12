module.exports = function (res , msg) {

    var object = {key : true , msg : msg};

    res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
    res.write(JSON.stringify(object));
    res.end();

}
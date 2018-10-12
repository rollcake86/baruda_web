

module.exports = function (res , msg , msg2) {

    var object = {key : true , msg : msg , msg2 : msg2};

    res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
    res.write(JSON.stringify(object));
    res.end();

}
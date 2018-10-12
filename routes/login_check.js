module.exports = function (res , profile) {

    var object = {key : true , msg : profile};

    res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
    res.write(JSON.stringify(object));
    res.end();

}
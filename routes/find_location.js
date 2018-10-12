

module.exports = function (res , results) {


    var jsonArray = {};
    var key = 'location';
    jsonArray[key] = [];

    res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
    for (var i = 0; i < results.length; i++) {
        var jsonObject = {
            contentid: results[i]._doc.contentid,
            title: results[i]._doc.title,
            addr1: results[i]._doc.addr1,
            addr2: results[i]._doc.addr2,
            tel: results[i]._doc.tel,
            contenttypeid: results[i]._doc.contenttypeid,
            firstimage: results[i]._doc.firstimage,
            mapx: results[i]._doc.geometry.coordinates[0],
            mapy: results[i]._doc.geometry.coordinates[1]
        }
        jsonArray[key].push(jsonObject);
    }
    var result = {result : true ,  key : jsonArray };
    res.write(JSON.stringify(result));
    res.end();
}
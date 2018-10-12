var errorJson = require('./error_json');
var resultJson = require('./result_json');
var resultCountJson = require('./result_value_json');

CheckDB = function (database, value, callback) {

    database.FloorModel.findOne({'key': value}, function (err, data) {
        if (err) {
            callback(null, null);
        }
        console.log('data : ' + data);

        if (data) {
            callback(false, null);
        } else {
            callback(true, value);
        }
    });
};

var CheckBottomDB = function (database, value, callback) {

    database.BottomModel.findOne({'key': value}, function (err, data) {
        if (err) {
            callback(null, null);
        }
        console.log('data : ' + data);

        if (data) {
            callback(false, null);
        } else {
            callback(true, value);
        }
    });
};

var addbottom = function (req, res) {
    console.log("addbottom Coupon 실행");

    var database = req.app.get('database');
    var couponid = req.param('couponid');

    var paramName = req.body.keyname || req.query.keyname;
    var paramColor = req.body.color || req.query.color;
    var paramCompany = req.body.company || req.query.company;
    var paramKind = req.body.kind || req.query.kind;
    var paramKey = req.body.key || req.query.key;
    var paramImg = req.body.image || req.query.image;

    CheckBottomDB(database, paramName, function (req, data) {
        if (req == null) {
            errorJson(res, '데이터베이스 연결 실패');
        }

        if (req === true) {
            var bottom = new database.BottomModel({
                'name': paramName,
                'color': paramColor,
                'company': paramCompany,
                'kind': paramKind,
                'key': paramKey,
                'img': paramImg
            });

            bottom.save(function (err) {
                if (err) {
                    errorJson(res, '저장 실패');
                }
            });
            return res.redirect('../public/addkind.html');
        }
        return res.redirect('../public/addkind.html');
    });
};

var addpaper = function (req, res) {
    console.log("addpaper Coupon 실행");

    var database = req.app.get('database');
    var couponid = req.param('couponid');

    var paramName = req.body.keyname || req.query.keyname;
    var paramColor = req.body.color || req.query.color;
    var paramCompany = req.body.company || req.query.company;
    var paramKind = req.body.kind || req.query.kind;
    var paramKey = req.body.key || req.query.key;
    var paramImg = req.body.image || req.query.image;

    CheckDB(database, paramName, function (req, data) {
        if (req == null) {
            errorJson(res, '데이터베이스 연결 실패');
        }

        if (req === true) {
            var floor = new database.FloorModel({
                'name': paramName,
                'color': paramColor,
                'company': paramCompany,
                'kind': paramKind,
                'key': paramKey,
                'img': paramImg
            });

            floor.save(function (err) {
                if (err) {
                    errorJson(res, '저장 실패');
                }
            });
            return res.redirect('../public/addkind2.html');
        }
        return res.redirect('../public/addkind2.html');
    });
};



module.exports.addpaper = addpaper;
module.exports.addbottom = addbottom;

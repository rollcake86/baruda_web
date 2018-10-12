var errorJson = require('./error_json');
var resultJson = require('./result_json');
var resultListJson = require('./result_listjson');
var multiparty = require('multiparty');
var fs = require('fs');


var inputcoupon = function (req, res) {
    console.log("input Coupon 실행");

    var database = req.app.get('database');
    var couponid = req.param('couponid');

    console.log(couponid);

    saveCoupon(database, couponid, function (req, data) {

        if (req == null) {
            errorJson(res, '데이터베이스 연결 실패');
        }

        if (req === true) {
            var coupon = new database.CouponModel({
                'coupon': couponid,
                'option': "off",
                'check': false,
                'coupon_date': {type: Date, 'default': Date.now}
            });

            coupon.save(function (err) {
                if (err) {
                    errorJson(res, '저장 실패');
                }
            });
            return res.redirect('/process/savecoupon');
        }
        return res.redirect('/process/savecoupon');
    });
}

// 쿠폰 리스트 검색 라우터
var couponlist = function (req, res) {
    console.log("couponlist 실행");

    var id = req.app.get('id');
    var pw = req.app.get('pw');

    var adminId = req.app.get('admin');
    var adminPw = req.app.get('adminpw');

    if (id === adminId && pw === adminPw) {

        var database = req.app.get('database');

        if (database.db) {
            database.CouponModel.findAll(function (err, data) {
                if (err) errorJson('데이터 베이스 에러');

                res.writeHead('200', {'Content-Type': 'text/html;charset=utf-8'});

                var context = {
                    title: '쿠폰 목록',
                    clients: data,
                    page: 0,
                    pageCount: 100,
                    perPage: 0,
                    totalRecords: data.length,
                    size: 100
                };

                req.app.render('listcoupon', context, function (err, html) {
                    if (err) {
                        console.log('error : ' + err.stack);
                        return;
                    }
                    res.end(html);
                });

            });

        } else {
            errorJson(res, '데이터 베이스 에러');
        }

    } else {
        return res.redirect('/');
    }

}


// 많은 쿠폰 한번에 넣는 메소드
var inputcoupons = function (req, res) {
    console.log("inputcoupons 실행");

    var database = req.app.get('database');
    var paramFile = req.param('couponfile');

    var form = new multiparty.Form();

    // get field name & value
    form.on('field', function (name, value) {
        console.log('normal field / name = ' + name + ' , value = ' + value);
    });

    // file upload handling
    form.on('part', function (part) {
        var filename;
        var size;
        if (part.filename) {
            filename = part.filename;
            size = part.byteCount;
        } else {
            part.resume();
        }

        console.log("Write Streaming file :" + filename);
        var writeStream = fs.createWriteStream('/tmp/' + filename);
        writeStream.filename = filename;
        part.pipe(writeStream);

        part.on('data', function (chunk) {
            var s = String(chunk);
            var ss = s.split("\n");
            for (var i in ss) {
                if (ss[i].length !== 0 && ss[i] !== ' ' && ss[i] !== '\n' && ss[i].length > 5) {

                    var couponId;
                    if (ss[i].indexOf('\r') !== -1) {
                        couponId = ss[i].replace(/[\n\r]/g, '');
                    } else {
                        couponId = ss[i];
                    }

                    database.CouponModel.findOneAndUpdate(
                        {'coupon': couponId}, /* query */
                        {
                            'coupon': couponId,
                            'option': "off",
                            'check': false,
                            'coupon_date': {type: Date, 'default': Date.now}
                        }, /* update */
                        {upsert: true}, /* create if it doesn't exist */
                        function (err, data) {
                            if (err) console.error(err);

                            console.log('data : ' + data);
                        });

                }
            }

        });

        part.on('end', function () {
            console.log(filename + ' Part read complete');
            writeStream.end();
        });
    });

    // all uploads are completed
    form.on('close', function () {
        // res.send('<script type="text/javascript">alert("업로드 완료");</script>');
        return res.redirect('/process/savecoupon');
    });

    // track progress
    form.on('progress', function (byteRead, byteExpected) {
        console.log(' Reading total  ' + byteRead + '/' + byteExpected);
    });
    form.parse(req);
}


var updatecoupon = function (req, res) {
    console.log('updatecoupon 모듈 실행');

    var database = req.app.get('database');
    var paramAccessToken = req.param('accessToken');
    var paramCouponId = req.param('couponId');

    if (database.db) {
        database.UserModel.findOne({authToken: paramAccessToken}, function (err, data) {
                if (err) {
                    errorJson(res, '로딩 실패');
                }
                if (data) {
                    if (data._doc.coupon.length !== 0) {
                        for (var i = 0; i < data._doc.coupon.length; i++) {
                            if (data._doc.coupon[i].coupons === paramCouponId) {
                                console.log('중복 된 쿠폰')
                                resultJson(res, '중복 된 쿠폰');
                            }
                        }
                    }

                    // else {

                    console.log('coupon 없음');

                    var coupons = {
                        'coupon': paramCouponId,
                        'option': "off",
                        'coupon_date': Date.now()
                    };
                    database.UserModel.update({authToken: paramAccessToken}, {$push: {coupon: coupons}}, function (err, data) {

                        if (err) {
                            errorJson(res, '저장 실패');
                        }

                        if (data) {
                            console.log('업데이트 추가');
                            resultJson(res, '업데이트 추가');
                        } else {
                            console.log('error 발생');
                        }
                    });
                    // }
                } else {
                    console.log('not data');
                    errorJson(res, 'not data');
                }
            }
        );
    } else {
        errorJson(res, '데이터베이스 연결 실패');
    }
}


// 쿠폰 삭제하는 메소드
var deletecoupon = function (req, res) {
    console.log("deletecoupon Coupon 실행");

    var database = req.app.get('database');
    var paramCouponid = req.param('couponid');

    var couponId = String(paramCouponid);
    if (database.db) {
        database.CouponModel.findOne({'coupon': couponId}, function (err, data) {
            if (err) {
                errorJson(res, '로딩 실패');
            }

            console.log('data : ' + data);

            if (data) {
                database.CouponModel.deleteOne({'coupon': couponId}, function (err) {
                    if (err) errorJson(res, '데이터 베이스 로딩 실패');

                });
                return res.redirect('/process/listcoupon');
            }
        });
    } else {
        errorJson(res, "데이터 베이스가 조회가 되지 않습니다.");
    }
}

// 쿠폰 리스트 나오는 메소드
var listcoupon = function (req, res) {
    console.log("listcoupon Coupon 실행");

    var database = req.app.get('database');
    var paramAccessToken = req.param('accessToken');

    if (database.db) {
        database.UserModel.findOne({authToken: paramAccessToken}, function (err, data) {
            if (err) {
                errorJson(res, '로딩 실패');
            }
            if (data) {
                console.log('data : ' + data);
                if (data._doc.coupon.length > 0) {
                    console.log(data._doc.coupon)
                    resultListJson(res, data._doc.coupon);
                }
                else {
                    console.log('쿠폰이 없습니다');
                    resultJson(res, 'null');
                }
            }
        });
    } else {
        errorJson(res, "데이터 베이스가 조회가 되지 않습니다.");
    }
}

var saveCoupon = function (database, couponText, callback) {

    database.CouponModel.findOne({'coupon': couponText}, function (err, data) {
        if (err) {
            callback(null, null);
        }
        console.log('data : ' + data);

        if (data) {
            callback(false, null);
        } else {
            callback(true, couponText);
        }
    });
}

var savecoupon = function (req, res) {
    console.log('coupon 모듈 안에 있는 savecoupon 호출됨');

    var id = req.app.get('id');
    var pw = req.app.get('pw');

    var adminId = req.app.get('admin');
    var adminPw = req.app.get('adminpw');

    if (id === adminId && pw === adminPw) {
        res.render('savecoupon', {title: 'Express'});
    } else {
        return res.redirect('/');
    }

}

module.exports.deletecoupon = deletecoupon;
module.exports.couponlist = couponlist;
module.exports.updatecoupon = updatecoupon;
module.exports.savecoupon = savecoupon;
module.exports.inputcoupon = inputcoupon;
module.exports.inputcoupons = inputcoupons;
module.exports.listcoupon = listcoupon;
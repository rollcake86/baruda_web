var errorJson = require('./error_json');
var resultJson = require('./result_json');
var resultCountJson = require('./result_value_json')

// 룰렛이 있는지 체크하는 파일

var TOTAL_COUNT = 2;

var getcoupon = function (req, res) {
    console.log("get point coupon 실행");

    var database = req.app.get('database');
    var paramAccessToken = req.param('accessToken');

    if (database.db) {
        database.UserModel.findOne({'authToken': paramAccessToken}, function (err, data) {
            if (err) errorJson(res, '데이터 베이스 문제');

            if (data) {
                console.log(data);

                var point = data._doc.point;

                if (point >= 100) {
                    point = Number(point) - 100;
                    database.UserModel.updateOne({'authToken': paramAccessToken}, {'point': point}, function (err, data) {
                        if (err) {
                            errorJson(res, "저장 문제 오류");
                        }
                        if (data) {
                            // resultJson(res , point);
                            getCouponList(res, database, function (req) {
                                var regIds = [];
                                for (var i = 0; i < req.length; i++) {
                                    var curId = req[i]._doc.coupon;
                                    var check = req[i]._doc.check;
                                    if (check === false) {
                                        regIds.push(curId);
                                    }
                                }

                                console.log('regIds.length  : ' + regIds.length);
                                if (regIds.length !== 0) {
                                    getCouponRandom(function (req) {
                                        if (req === true) {
                                            console.log("ture : " + req + " : " + regIds[0]);
                                            couponUpdate(database, res, regIds[0], paramAccessToken);
                                            resultJson(res, regIds[0]);
                                        } else {
                                            resultJson(res, "result_fail");
                                        }
                                    });
                                } else {
                                    resultJson(res, "result_fail");
                                }

                            });
                        }
                    });
                } else {
                    resultJson(res, "포인트가 모자라요");
                }
            }
        });
    }
}

function eventCountCheck(database, id, hour, callback) {
    if (database.db) {
        database.UserModel.findOne({'authToken': id}, function (err, data) {
            if (err) {
                callback(err, null);
            }

            var eventTime = Number(formatDate(data._doc.event_time));

            if (eventTime == Number(hour + 1) || eventTime == Number(hour) || eventTime + 1 == Number(hour)) {

            } else {
                database.UserModel.update({'authToken': id}, {$set: {event_count: 0}}, function (err, data) {
                    if (err) {
                        callback(err, null);
                    }
                    console.log('data : ' + data);
                });
            }

            if (TOTAL_COUNT > data._doc.event_count) {
                var countNumber = Number(data._doc.event_count) + 1;
                database.UserModel.update({'authToken': id}, {
                    $set: {
                        event_count: countNumber,
                        event_time: Date.now()
                    }
                }, function (err, data) {
                    if (err) {
                        callback(err, null);
                    }
                    if (data) {
                        callback(null, countNumber);
                    }
                });
            } else {
                callback(null, 0);
            }
        });
    } else {
        console.log('data base error');
    }
}

var getremindcount = function (req, res) {
    console.log("getremindcount 실행");

    var database = req.app.get('database');
    var paramAccessToken = req.param('accessToken');

    if (database.db) {
        database.UserModel.findOne({'authToken': paramAccessToken}, function (err, data) {
            if (err) {
                errorJson(res, "서버 에러입니다");
            }

            var eventTime = Number(formatDate(data._doc.event_time));

            if (eventTime == Number(formatHour() + 1) || eventTime == Number(formatHour()) || eventTime + 1 == Number(formatHour())) {
                resultJson(res, 0);
            } else {
                database.UserModel.update({'authToken': paramAccessToken}, {$set: {event_count: 0}}, function (err, data) {
                    if (err) {
                        errorJson(res, "서버 에러입니다");
                    }
                });
                console.log('event_count ' + (TOTAL_COUNT - data._doc.event_count))
                resultJson(res, (TOTAL_COUNT - data._doc.event_count));
            }
        });
    } else {
        errorJson(res, "서버 에러입니다");
    }
}

function beforeEventCheck(database, paramAccessToken) {

}

var geteventcoupon = function (req, res) {
    console.log("geteventcoupon 실행");

    var database = req.app.get('database');
    var paramAccessToken = req.param('accessToken');

    if (formatHour() == "11" || formatHour() == "12" || formatHour() == "13" || formatHour() == "0") {
        eventCountCheck(database, paramAccessToken, formatHour(), function (err, data) {
            if (err) {
                errorJson(res, "서버 에러입니다");
            }
            if (data > 0 ) {
                getCouponList(res, database, function (req) {
                    var regIds = [];
                    for (var i = 0; i < req.length; i++) {
                        var curId = req[i]._doc.coupon;
                        var check = req[i]._doc.check;
                        if (check == false) {
                            regIds.push(curId);
                        }
                    }
                    if (regIds.length !== 0) {
                        getCouponRandom(function (req) {
                            if (req === true) {
                                couponUpdate(database, res, regIds[0], paramAccessToken);
                                resultCountJson(res, regIds[0] , 2 - data );
                            } else {
                                resultCountJson(res, "result_fail" , 2 - data);
                            }
                        });
                    } else {
                        resultCountJson(res, "result_fail" , 2 - data);
                    }
                });
            } else {
                resultJson(res, "count_over");
            }
        });

    } else if (formatHour() == "18" || formatHour() == "19" || formatHour() == "20" || formatHour() == "21") {
        eventCountCheck(database, paramAccessToken, formatHour(), function (err, data) {
            if (err) {
                errorJson(res, "서버 에러입니다");
            }
            if (data > 0) {
                getCouponList(res, database, function (req) {
                    var regIds = [];
                    for (var i = 0; i < req.length; i++) {
                        var curId = req[i]._doc.coupon;
                        var check = req[i]._doc.check;
                        if (check == false) {
                            regIds.push(curId);
                        }
                    }
                    if (regIds.length !== 0) {
                        getCouponRandom(function (req) {
                            if (req == true) {
                                couponUpdate(database, res, regIds[0], paramAccessToken);
                                resultCountJson(res, regIds[0] , 2 - data );
                            } else {
                                resultCountJson(res, "result_fail" , 2 - data);
                            }
                        });
                    } else {
                        resultCountJson(res, "result_fail" , 2 - data);
                    }
                });
            } else {
                resultJson(res, "count_over");
            }
        });
    } else {
        resultJson(res, "time_over");
    }
}

function formatDateToString(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function formatDate(date) {
    var d = new Date(date),
        hour = d.getHours() + 9;
    if(hour >= 24){
        hour = hour - 24;
    }
    return hour;
}

function formatHour() {
    // 한국시간 확인
    var newDay = Date.now();
    var d = new Date(newDay);
    var dc = Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 9, d.getUTCDay(), d.getUTCHours(), d.getUTCMinutes());
    return formatDate(dc);
}

function getCouponList(res, database, callback) {

    if (database.db) {
        database.CouponModel.findAll(function (err, results) {
            if (err) {
                errorJson(res, '조회중 오류 발생 다시 시도해 주세요');
            }
            if (results) {
                callback(results);
            }
        });
    } else {
        errorJson(res, '데이터 베이스 에러');
    }

}

function couponUpdate(database, res, couponid, paramAccessToken) {

    database.CouponModel.update({coupon: couponid}, {$set: {check: true}}, function (err, res) {
        if (err) {
            errorJson(res, '저장 실패');
        }
        console.log("쿠폰 수정 완료 " + res);
    });

    var coupons = {
        'coupon': couponid,
        'option': "off",
        'coupon_date': Date.now()
    };
    database.UserModel.update({authToken: paramAccessToken}, {$push: {coupon: coupons}}, function (err, data) {

        if (err) {
            errorJson(res, '저장 실패');
        }
        if (data) {
            console.log('업데이트 추가');
        } else {
            console.log('error 발생');
        }
    });

}

function getCouponRandom(callback) {
    var result = Math.random();
    console.log(result);
    // 룰렛 랜덤 조정
    if (result < 0.9) {
        callback(true);
    } else {
        callback(false);
    }
}


module.exports.getcoupon = getcoupon;
module.exports.geteventcoupon = geteventcoupon;
module.exports.getremindcount = getremindcount;
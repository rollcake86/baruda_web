// var express = require('express');
// var router = express.Router();
var singupJson = require('./signup');
var errorJson = require('./error_json');
var resultJson = require('./result_json');

/* GET users listing. */
module.exports = function (req, res) {

    // router.get('/', function (req, res, next) {
    //     res.send('respond with a resource');
    // });

    //로그인 폼 링크
    app.get('/users', function (req, res) {
        console.log('/users 패스 요청됨.');

    });
}

var checkuser = function (req, res) {
    console.log('checkuser 호출됨');
    var paramAccessToken = req.param('accessToken');

    var database = req.app.get('database');

    if (database.db) {
        database.UserModel.findOne({'authToken': paramAccessToken}, function (err, data) {
            if (err) {
                errorJson(res, "회원 찾기 문제 발생");
            }
            if (data) {
                resultJson(res, true);
            } else {
                resultJson(res, false);
            }
        })
    } else {
        errorJson(res, "데이터 베이스 문제로 프로그램 종료합니다");
    }
}

var pointupdate = function (req, res) {
    console.log('pointupdate 호출됨');
    var paramAccessToken = req.param('accessToken');
    var savePoint = req.param('point');

    var database = req.app.get('database');


    if (database.db) {
        database.UserModel.findOne({'authToken': paramAccessToken}, function (err, data) {
            if (err) {
                errorJson(res, "회원 찾기 문제 발생");
            }

            if (data) {
                var beforePoint = data._doc.point;
                console.log(beforePoint);

                beforePoint = Number(beforePoint) + Number(savePoint);
                database.UserModel.updateOne({'authToken': paramAccessToken}, {'point': beforePoint}, function (err, data) {
                    if (err) {
                        errorJson(res, "저장 문제 오류");
                    }

                    if (data) {
                        resultJson(res, beforePoint);
                    }
                });
            }

        })

    } else {
        errorJson(res, "데이터 베이스 문제로 프로그램 종료합니다");
    }
}

var deleteuser = function (req, res) {
    console.log('deleteuser 모듈 호출');

    var paramAccessToken = req.param('accessToken');
    var database = req.app.get('database');

    if (database.db) {
        database.UserModel.findOne({'authToken': paramAccessToken}, function (err, data) {
            if (err) {
                errorJson(res, '데이터베이스 연결 실패');
            }
            if (data) {
                database.UserModel.deleteOne({'authToken': paramAccessToken}, function (err, data) {
                    if (err) {
                        errorJson(res, '삭제 중 서버 에러');
                    }
                    singupJson(res, "삭제 완료");
                });
            }
        });
    } else {
        errorJson(res, '데이터베이스 연결 실패');
    }

}

var signup = function (req, res) {
    console.log('location 모듈 안에 있는 signup 호출됨.');

    var paramAccessToken = req.param('accessToken');
    var paramName = req.param('name');
    var paramEmail = req.param('email');
    var paramProvider = req.param('provider');
    var paramBirth = req.param('birth');

    var database = req.app.get('database');

    console.log(paramAccessToken + " : " + paramName + " : " + paramEmail + " :" + paramProvider);

    if (database.db) {
        database.UserModel.findOne({'authToken': paramAccessToken}, function (err, loc) {
            if (err) {
                errorJson(res, '데이터베이스 연결 실패');
            }
            if (loc) {
                singupJson(res, "로그인 완료");
            } else {
                var user = new database.UserModel({
                    'authToken': paramAccessToken,
                    'email': paramEmail,
                    'name': paramName,
                    'provider': paramProvider,
                    'birth': paramBirth,
                });
                user.save(function (err) {
                    if (err) {
                        throw err;
                    }
                    singupJson(res, "회원가입 완료");
                });
            }
        });

    } else {
        errorJson(res, '데이터베이스 연결 실패');
    }
};

var login = function (req, res) {
    console.log('user 모듈 안에 있는 login 호출됨');

    var paramTitle = req.body.title || req.query.title;
    var paramPassword = req.body.password || req.query.password;

    var adminId = req.app.get('admin');
    var adminPw = req.app.get('adminpw');

    if (paramTitle === adminId && paramPassword == adminPw) {
        req.app.set('id', paramTitle);
        req.app.set('pw', paramPassword);
        return res.redirect('/process/main');
    } else {
        return res.redirect('/');
    }

}

var listuser = function (req, res) {
    console.log('user 모듈 안에 있는 listuser 호출됨');


    var id = req.app.get('id');
    var pw = req.app.get('pw');

    var adminId = req.app.get('admin');
    var adminPw = req.app.get('adminpw');

    if (id === adminId && pw === adminPw) {
        var paramPage = 0;
        var paramPerPage = 100;

        var database = req.app.get('database');

        if (database.db) {
            var optiopns = {
                page: paramPage,
                perPage: paramPerPage
            }

            database.UserModel.list(optiopns, function (err, results) {
                if (err) {
                    console.error('게시판 글 목록 조회 중 오류 발생 : ' + err.stack);
                    return;
                }

                if (results) {
                    database.UserModel.count().exec(function (err, count) {
                        console.log('count : ' + count);

                        res.writeHead('200', {'Content-Type': 'text/html;charset=utf-8'});

                        var context = {
                            title: '회원 목록',
                            clients: results,
                            page: parseInt(paramPage),
                            pageCount: Math.ceil(count / paramPerPage),
                            perPage: paramPage,
                            totalRecords: count,
                            size: paramPerPage
                        };

                        req.app.render('listclient', context, function (err, html) {
                            if (err) {
                                console.log('error : ' + err.stack);
                                return;
                            }
                            res.end(html);
                        });


                    });

                }

            })
        }
    } else {
        return res.redirect('/');
    }


}


module.exports.login = login;
module.exports.listuser = listuser;
module.exports.deleteuser = deleteuser;
module.exports.signup = signup;
module.exports.checkuser = checkuser;
module.exports.pointupdate = pointupdate;
// module.exports = router;

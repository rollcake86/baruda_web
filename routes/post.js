var Entities = require('html-entities').AllHtmlEntities;
var errorJson = require('./error_json');
var resultJson = require('./result_json');

var addpost = function (req, res) {
    console.log('post 모듈 안에 있는 addpost 호출됨');

    var paramTitle = req.body.title || req.query.title;
    var paramContents = req.body.contents || req.query.contents;
    var paramWriter = req.body.writer || req.query.writer;

    var database = req.app.get('database');

    if (database.db) {
        var post = new database.PostModel({
            title: paramTitle,
            contents: paramContents,
            writer: paramWriter
        });

        post.save(function (err) {
            if (err) {
                throw err;
            }
            return res.redirect('/process/showpost/' + post._id);
        });
    }
}

var listpost = function (req, res) {
    console.log('ppst 모듈 안에 있는 listpost 호출됨');

    var paramPage = 0;
    var paramPerPage = 10;

    var database = req.app.get('database');

    if (database.db) {
        var optiopns = {
            page: paramPage,
            perPage: paramPerPage
        }

        database.PostModel.list(optiopns, function (err, results) {
            if (err) {
                console.error('게시판 글 목록 조회 중 오류 발생 : ' + err.stack);
                return;
            }

            if (results) {
                database.PostModel.count().exec(function (err, count) {
                    console.log('count : ' + count);

                    res.writeHead('200', {'Content-Type': 'text/html;charset=utf-8'});

                    var context = {
                        title: '글 목록',
                        posts: results,
                        page: parseInt(paramPage),
                        pageCount: Math.ceil(count / paramPerPage),
                        perPage: paramPage,
                        totalRecords: count,
                        size: paramPerPage
                    };

                    req.app.render('listpost', context, function (err, html) {
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
}

var listpostjson = function (req, res) {
    console.log('ppst 모듈 안에 있는 listpostjson 호출됨');

    var paramPage = 0;
    var paramPerPage = 10;

    var database = req.app.get('database');

    if (database.db) {
        var optiopns = {
            page: paramPage,
            perPage: paramPerPage
        }

        database.PostModel.list(optiopns, function (err, results) {
            if (err) {
                errorJson(res, "서버 에러입니다");
            }

            if (results) {
                resultJson(res, results);
            }
        });
    }
}

var showpost = function (req, res) {
    console.log('post 모듈 안에 있는 showpost 호출');

    var paramId = req.body.id || req.query.id || req.params.id;

    var database = req.app.get('database');

    if (database.db) {
        console.log('id : ' + paramId);
        database.PostModel.load(paramId, function (err, results) {
            if (err) {
                res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
                res.write('{"result" : false , "msg" : "에러입니다"}');
                res.end();
                return;
            }

            if (results) {
                console.dir(results);
                res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});

                var context = {
                    title: '글 조회 ',
                    posts: results,
                    Entities: Entities
                };
                req.app.render('showpost', context, function (err, html) {
                    if (err) {
                        throw  err
                    }
                    res.end(html);
                });

            }

        });

    }
}

module.exports.showpost = showpost;
module.exports.addpost = addpost;
module.exports.listpost = listpost;
module.exports.listpostjson = listpostjson;
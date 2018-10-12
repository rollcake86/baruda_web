var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var helmet = require('helmet');

// var index = require('./routes/index');
// var users = require('./routes/users');

var config = require('./config/config');
var database = require('./database/database');
var route_loader = require('./routes/route_loader');

var session = require('express-session');
var expressErrorHandler = require('express-error-handler');

//===== Passport 사용 =====//
var passport = require('passport');
var flash = require('connect-flash');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//보안관련 적용
app.use(helmet());
app.disable('x-powered-by');

// admin 보안 관련 적용
app.set('admin' , 'qkfmek');
app.set('adminpw' , 'qkfmek!');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', index);
// app.use('/users', users);

//===== 서버 변수 설정 및 static으로 public 폴더 설정  =====//
console.log('config.server_port : %d', config.server_port);
app.set('port', config.server_port);
app.use('/public', express.static(path.join(__dirname, 'public')));

//===== body-parser, cookie-parser, express-session 사용 설정 =====//
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(session({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));


//===== Passport 사용 설정 =====//
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//===== 라우터 미들웨어 사용 =====//
app.get('/', function(request, response) {
    // list.html을 읽음
    var infoLen = config.route_info.length;
    console.log('설정에 정의된 라우팅 모듈의 수 : %d', infoLen);

    for (var i = 0; i < infoLen; i++) {
        var curItem = config.route_info[i];

        // 모듈 파일에서 모듈 불러옴
        var curModule = require(curItem.file);
        console.log('%s 파일에서 모듈정보를 읽어옴.', curItem.file);

        //  라우팅 처리
        if (curItem.type === 'get') {
            app.get(curItem.path, curModule[curItem.method]);
        }
        console.log('라우팅 모듈 [%s]이(가) 설정됨.', curItem.method);
    }
});

app.get('*', function(req, res, next) {
    var error = new Error('페이지 에러');
    error.status = 404;
    next(error);
});

app.post('/', function(request, response) {
    // list.html을 읽음
    var infoLen = config.route_info.length;
    console.log('설정에 정의된 라우팅 모듈의 수 : %d', infoLen);

    for (var i = 0; i < infoLen; i++) {
        var curItem = config.route_info[i];

        // 모듈 파일에서 모듈 불러옴
        var curModule = require(curItem.file);
        console.log('%s 파일에서 모듈정보를 읽어옴.', curItem.file);

        if (curItem.type === 'post') {
            app.post(curItem.path, curModule[curItem.method]);
        } else {
            app.post(curItem.path, curModule[curItem.method]);
        }
        console.log('라우팅 모듈 [%s]이(가) 설정됨.', curItem.method);
    }
});


//라우팅 정보를 읽어들여 라우팅 설정
route_loader.init(app);



//===== Passport 관련 라우팅 및 설정 =====//

// 패스포트 설정
var configPassport = require('./config/passport');
configPassport(app, passport);

//패스포트 관련 함수 라우팅
var userPassport = require('./routes/user_passport');
userPassport(app, passport);

//위치데이터 관련 함수 라우팅
var location = require('./routes/location');
location(app , database);

/*
var isLoggedIn = function(req, res, next) {
	console.log('isLoggedIn 미들웨어 호출됨.');

	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect('/');
}
*/



function errorHandler(err, req, res, next) {
    res.status(404).send('404 Error 이 페이지가 존재하지 않습니다');
}

// app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );


//===== 서버 시작 =====//

//확인되지 않은 예외 처리 - 서버 프로세스 종료하지 않고 유지함
process.on('uncaughtException', function (err) {
    console.log('uncaughtException 발생함 : ' + err);
    console.log('서버 프로세스 종료하지 않고 유지함.');

    console.log(err.stack);
});

// 프로세스 종료 시에 데이터베이스 연결 해제
process.on('SIGTERM', function () {
    console.log("프로세스가 종료됩니다.");
    app.close();
});

app.on('close', function () {
    console.log("Express 서버 객체가 종료됩니다.");
    if (database.db) {
        database.db.close();
    }
});

// 시작된 서버 객체를 리턴받도록 합니다.
var server = http.createServer(app).listen(process.env.PORT || app.get('port'), function(){
    console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));
    // 데이터베이스 초기화
    database.init(app, config);
});
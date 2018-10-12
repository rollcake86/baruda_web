var request = require('request');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var errorJson = require('./error_json');
var findLocation = require('./find_location');

module.exports = function (app, database) {

    //로그인 폼 링크
    app.get('/location', function (req, res) {
        console.log('/location 패스 요청됨.');

    });

}

var findNear = function (req, res) {
    console.log('location 모듈 안에 있는 findNear 호출됨.');

    var paramLongitude = req.param('longitude');
    var paramLatitude = req.param('latitude');
    var maxDistance = 1000;

    var database = req.app.get('database');

    if (database.db) {
        // 1. 가까운 커피숍 검색
        database.LocationModel.findNear(paramLongitude, paramLatitude, maxDistance, function (err, results) {
            if (err) {
                throw err;
            }
            if (results) {
                findLocation(res , results);
            } else {
                errorJson(res, '가까운 관광지 조회  실패');
            }
        });
    } else {
        errorJson(res, '데이터베이스 연결 실패');
    }
};

var savelocation = function (req, res) {
    console.log('location 모듈 안에 있는 findNear 호출됨.');

    var city = req.param('city');
    var villiage = req.param('villiage');

    var database = req.app.get('database');

    getTourList('N', '1', city, villiage, function (list, result) {
        var page = Math.ceil(result / 10);
        for (var i = 1; i <= page; i++) {
            getTourList('Y', i + '', city, villiage, function (list, result) {
                for (var j = 0; j < result.length; j++) {
                    saveLocation(j, result, function (check, result) {

                        if (check == null) {
                            throw  err;
                        }

                        if (check == true) {

                            try {
                                var mapx = Number(result.mapx);
                                var mapy = Number(result.mapy);

                                var locations = new database.LocationModel({
                                    'contentid': result.contentid,
                                    'addr1': result.addr1,
                                    'addr2': result.addr2,
                                    'readcount': result.readcount
                                    ,
                                    'firstimage': result.firstimage,
                                    'contenttypeid': result.contenttypeid,
                                    'tel': result.tel,
                                    'title': result.title,
                                    'createdtime': result.createdtime,
                                    'modifiedtime': result.modifiedtime,
                                    'geometry': {
                                        type: 'Point',
                                        // coordinates: [result[0].mapx, result[0].mapy]
                                        coordinates: [mapx, mapy]
                                    }
                                });
                                locations.save(function (err) {
                                    if (err) {
                                        throw err;
                                    }
                                });
                                console.log(result.title);
                            } catch (e) {
                                console.log(e);
                            }
                        } else {
                            console.log('이미 추가되었습니다');
                        }

                    });
                }
            });
        }
    });


    function getTourList(list, page, city, villiage, callback) {
        var url = 'http://api.visitkorea.or.kr/openapi/service/rest/KorService/areaBasedList';
        var queryParams = '?' + encodeURIComponent('ServiceKey') + '=NyZeSq4N2Vr5k%2FOjpie7RzHh3M%2FzELiqGJHwm8tHgVIVH1PCnw1mYv6rkn9AaIb8zScYJOlt%2Fvo2FTXYE6En9A%3D%3D';
        /* Service Key*/
        queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent(page);
        /* 페이지번호 */
        queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10');
        /* 한페이지결과수 */
        queryParams += '&' + encodeURIComponent('MobileApp') + '=' + encodeURIComponent('Gaboda');
        /* 서비스명=어플명 */
        queryParams += '&' + encodeURIComponent('MobileOS') + '=' + encodeURIComponent('ETC');
        /* AND(안드로이드),IOS(아이폰),WIN(원도우폰),ETC */
        queryParams += '&' + encodeURIComponent('arrange') + '=' + encodeURIComponent('A');
        /* (A=제목순, B=조회순, C=수정일순, D=생성일순) , 대표이미지 정렬 추가(D=제목순, P=조회순, Q=수정일순, R=생성일순) */
        queryParams += '&' + encodeURIComponent('cat1') + '=' + encodeURIComponent('A02');
        /* 대분류 */
        queryParams += '&' + encodeURIComponent('contentTypeId') + '=' + encodeURIComponent('');
        /* 관광타입(관광지, 숙박등) ID */
        queryParams += '&' + encodeURIComponent('areaCode') + '=' + encodeURIComponent(city);
        /* 지역코드 */
        queryParams += '&' + encodeURIComponent('sigunguCode') + '=' + encodeURIComponent(villiage);
        /* 시군구코드 */
        queryParams += '&' + encodeURIComponent('cat2') + '=' + encodeURIComponent('');
        /* 중분류 */
        queryParams += '&' + encodeURIComponent('cat3') + '=' + encodeURIComponent('');
        /* 소분류 */
        queryParams += '&' + encodeURIComponent('listYN') + '=' + encodeURIComponent(list);
        /* 목록구분 */

        console.log(url + queryParams);
        request({
            url: url + queryParams,
            method: 'GET'
        }, function (error, response, body) {
            if (list == 'N') {
                parser.parseString(body, function (err, result) {
                    console.log(result);
                    console.log(result['response']['body']['0']['totalCount']);
                    callback(list, result['response']['body']['0']['totalCount']);
                });
            } else {
                parser.parseString(body, function (err, result) {
                    callback(list, result['response']['body']['0']['items']['0']['item']);
                });
            }
        });
    }

    var saveLocation = function (j, result, callback) {
        database.LocationModel.findOne({'contentid': result[j].contentid}, function (err, loc) {
            console.log('content id : ' + result[j].title + " : " + result[j].contentid);
            if (err) {
                callback(null, null);
            }
            if (loc) {
                callback(false, null);
            } else {
                callback(true, result[j]);
            }
        });
    }

};


var findCircle = function (req, res) {
    console.log('location 모듈 안에 있는 findNear 호출됨.');

    var paramCenterLongitude = req.param('center_longitude');
    var paramCenterLatitude = req.param('center_latitude');
    var paramRadius = req.param('radius');

    var database = req.app.get('database');

    if (database.db) {
        // 1. 가까운 커피숍 검색
        database.LocationModel.findCircle(paramCenterLongitude, paramCenterLatitude, paramRadius, function (err, results) {
            if (err) {
                throw err;
            }
            if (results) {
                findLocation(res , results);
            } else {
                errorJson(res, '가까운 관광지 조회  실패');
            }
        });
    } else {
        errorJson(res, '데이터베이스 연결 실패');
    }
};

module.exports.savelocation = savelocation;
module.exports.findNear = findNear;
module.exports.findCircle = findCircle;
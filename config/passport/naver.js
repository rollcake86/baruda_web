/*
    패스포트 카카오 설정
 */

var NaverStrategy = require('passport-naver').Strategy;
var config = require('../config');

module.exports = function(app, passport) {

    return new NaverStrategy({
            clientID: config.naver.client_id,
            clientSecret: config.naver.secret_id,
            callbackURL: config.naver.callback_url
        },
        function (accessToken, refreshToken, profile, done) {
            var _profile = profile._json;
            var options = {
                criteria: { 'naver.id': profile.id }
            };

            var database = app.get('database');
            database.UserModel.load(options, function (err, user) {
                if (err) return done(err);

                if (!user) {
                    var user = new database.UserModel({
                        name: _profile.nickname,
                        email: _profile.id,
                        provider: 'naver',
                        authToken: accessToken,
                        naver: _profile._json
                    });

                    user.save(function (err) {
                        if (err) console.log(err);
                        return done(err, user);
                    });
                } else {
                    return done(err, user);
                }
            });
        }
    );
}
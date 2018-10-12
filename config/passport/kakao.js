/*
    패스포트 카카오 설정
 */

var KakaoStrategy = require('passport-kakao').Strategy;
var config = require('../config');

module.exports = function(app, passport) {

    return new KakaoStrategy({
            clientID: config.kakao.client_id,
            callbackURL: config.kakao.callback_url
        },
        function (accessToken, refreshToken, profile, done) {
            var _profile = profile._json;
            var options = {
                criteria: { 'kakao.id': profile.id }
            };

            var database = app.get('database');
            database.UserModel.load(options, function (err, user) {
                if (err) return done(err);

                if (!user) {
                    var user = new database.UserModel({
                        name: _profile.account_email,
                        email: _profile.id,
                        provider: 'kakao',
                        authToken: accessToken,
                        kakao: _profile._json
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
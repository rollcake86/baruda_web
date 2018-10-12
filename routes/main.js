var resultJson = require('./result_value_json');
var fs = require('fs');

var main = function (req, res) {
    console.log('main 모듈 안에 있는 main 호출됨');

    var id = req.app.get('id');
    var pw = req.app.get('pw');

    var adminId = req.app.get('admin');
    var adminPw = req.app.get('adminpw');

    if(id === adminId && pw === adminPw){
        res.render('main', { title: 'Express' });
    }else{
        return res.redirect('/');
    }

}

var setting = function (req, res) {
    console.log('main 모듈 안에 있는 setting 호출됨');

    var id = req.app.get('id');
    var pw = req.app.get('pw');

    var adminId = req.app.get('admin');
    var adminPw = req.app.get('adminpw');

    if(id === adminId && pw === adminPw){

        var data = fs.readFileSync('./config.json'),
            myObj;

        try {
            myObj = JSON.parse(data);
            return res.render('setting', { title: 'Express'  , check :myObj.key , content : myObj.msg});
        }
        catch (err) {
            console.log('There has been an error parsing your JSON.')
            console.log(err);
            return res.render('setting', { title: 'Express'  , check :false , content : ""});

        }

    }else{
        return res.redirect('/');
    }

}

var serversetting = function (req, res) {
    console.log("serversetting 실행");

    var paramCheck = req.param('checked');
    var paramContent = req.param('content');

    console.log(paramCheck)
    var check = false;
    if(paramCheck === 'true'){
        check = true;
    }


    var myOptions = {
        key: check,
        msg: paramContent
    };

    var data = JSON.stringify(myOptions);

    fs.writeFile('./config.json', data, function (err) {
        if (err) {
            console.log('There has been an error saving your configuration data.');
            console.log(err.message);
            return;
        }
        console.log('Configuration saved successfully.')
    });

    return res.redirect('/process/main');

}

var admincheck = function (req , res) {
   return res.render('index', { title: 'Express' });
}


module.exports.main = main;
module.exports.admincheck = admincheck;
module.exports.setting = setting;
module.exports.serversetting = serversetting;

var addpost = function (req, res) {
    console.log('main 모듈 안에 있는 main 호출됨');

    var id = req.app.get('id');
    var pw = req.app.get('pw');

    var adminId = req.app.get('admin');
    var adminPw = req.app.get('adminpw');

    if(id === adminId && pw === adminPw){
        res.render('addpost', { title: 'Express' });
    }else{
        return res.redirect('/');
    }

}

var listpost = function (req, res) {
    console.log('board 모듈 안에 있는 listpost 호출됨');

    var id = req.app.get('id');
    var pw = req.app.get('pw');

    var adminId = req.app.get('admin');
    var adminPw = req.app.get('adminpw');

    if(id === adminId && pw === adminPw){
        res.render('addpost', { title: 'Express' });
    }else{
        return res.redirect('/');
    }

}




module.exports.addpost = addpost;
module.exports.listpost = listpost;
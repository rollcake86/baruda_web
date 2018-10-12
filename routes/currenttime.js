var resultJson = require('./result_json');

var currenttime = function (req, res) {
    var newDay = Date.now();
    var d = new Date(newDay);
    var dc = Date.UTC(d.getUTCFullYear() , d.getUTCMonth()+9 ,d.getUTCDay() , d.getUTCHours() , d.getUTCMinutes());
    resultJson(res, formatDate(dc));
}

function formatDate(date) {
    var d = new Date(date),
        hour = d.getHours() + 9;
    if(hour >= 24){
        hour = hour - 24;
    }
    return hour;
}


module.exports.currenttime = currenttime;
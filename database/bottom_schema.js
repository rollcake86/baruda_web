/**
 * 모듈에 대해 알아보기
 *
 * Coupon 객체를 모듈로 만들기
 */

var Schema = {};

Schema.createSchema = function (mongoose) {

    // 스키마 정의
    var FloorSchema = mongoose.Schema({
        name: {type: String, 'default': ''}
        , company: {type:String , 'default':""}
        , color: {type: String , 'default': ""}
        , kind: {type: String , 'default': ""}
        , key: {type: String , 'default': ""}
        , img: {type: String , 'default': ""}
    });

    FloorSchema.static('findAll', function (callback) {
        return this.find({}, callback);
    });

    FloorSchema.static('load', function (options, callback) {
        options.select = options.select || 'name';
        this.findOne(options.criteria)
            .select(options.select)
            .exec(callback);
    });

    // 모델을 위한 스키마 등록
    mongoose.model('Bottom', FloorSchema);

    console.log('BottomSchema 정의함.');

    return FloorSchema;

};


// module.exports에 UserSchema 객체 직접 할당
module.exports = Schema;




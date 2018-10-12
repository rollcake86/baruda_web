var SchemaObj = {};

SchemaObj.createSchema = function (mongoose) {

    var PostSchema = mongoose.Schema({
        title: {type: String, trim: true, 'default': ""},
        contents: {type: String, trim: true, 'default': ""},
        writer: {type: String, trim: true, 'default': ""},
        created_at: {type: Date, index: {unique: false}, 'default': Date.now},
        updated_at: {type: Date, index: {unique: false}, 'default': Date.now}
    });

    PostSchema.path('title').required(true, '글 제목을 입력하셔야 합니다');
    PostSchema.path('contents').required(true, '글 내용을 입력하셔야 합니다');

    PostSchema.methods = {
        savePost: function (callback) {
            var self = this;

            this.validate(function (err) {
                if (err) return callback(err);

                self.save(callback);
            });
        }
    }

    PostSchema.statics = {
        load: function (id, callback) {
            this.findOne({_id: id}).exec(callback);
        },
        list: function (options, callback) {
            var criteria = options.criteria || {};

            this.find(criteria).sort({'created_at': -1}).limit(Number(options.perPage))
                .skip(options.perPage * options.page)
                .exec(callback)

        }
    }
    console.log('PostSchema 정의함');

    return PostSchema;
}

module.exports = SchemaObj;
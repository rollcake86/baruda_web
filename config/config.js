/*
 * 설정
 */

module.exports = {

    fcm_api_key: 'AAAALv3HUHk:APA91bEW_48L8Lk7q7-2xaHbck30S67voK5IquItGlWHKrLpU3XFoLjfR_PajcL4cQv19hR6fFuD1oCLAhJdSjyxG5qrjxXl9bfgUUv4ayHidaBG7OiEuT-FxQfpQBvwFHDk4qcIEt-A',
    server_port: 3004,
    // db_url: 'mongodb://gabodaadmin:794613ab@ds113749.mlab.com:13749/heroku_ckv8nl9l',
    db_url: 'mongodb://admin:794613ab@ds227853.mlab.com:27853/baruda_web',
    db_schemas: [
        {file: './post_schema', collection: 'post', schemaName: 'PostSchema', modelName: 'PostModel'},
        {file: './floor_schema', collection: 'floor', schemaName: 'FloorSchema', modelName: 'FloorModel'},
        {file: './bottom_schema', collection: 'bottom', schemaName: 'BottomSchema', modelName: 'BottomModel'}
    ],
    route_info: [
        {file: './post', path: '/process/listpost', method: 'listpost', type: 'get'}
        , {file: './post', path: '/process/showpost/:id', method: 'showpost', type: 'get'}

        // pc 용
        , {file: './addpaper', path: '/process/addpaper', method: 'addpaper', type: 'post'}
        , {file: './addpaper', path: '/process/addbottom', method: 'addbottom', type: 'post'}
        , {file: './board', path: '/process/addpost', method: 'addpost', type: 'get'}


    ],
    facebook: {		// passport facebook
        clientID: '1442860336022433',
        clientSecret: '13a40d84eb35f9f071b8f09de10ee734',
        callbackURL: 'http://localhost:3000/auth/facebook/callback'
    },
    twitter: {		// passport twitter
        clientID: 'id',
        clientSecret: 'secret',
        callbackURL: '/auth/twitter/callback'
    },
    google: {		// passport google
        clientID: 'id',
        clientSecret: 'secret',
        callbackURL: '/auth/google/callback'
    },
    naver: {
        client_id: 'zRDSeXfcxLogoNw5t_Eu',
        secret_id: 'wZEgoDAh4w',
        callback_url: '/auth/login/naver/callback'
    },
    kakao: {
        client_id: 'a6415711beeeb875683b8fd388fc743e',
        callback_url: '/auth/login/kakao/callback'
    }

}
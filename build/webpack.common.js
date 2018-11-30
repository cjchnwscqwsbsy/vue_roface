"use strict";

const path = require('path');
const prodConfg = require('../config').build;

//拼接路径
function resolve(track){
    return path.join(__dirname,'..',track);
}

//资源路径
function assetsPath(_path){
    return path.join(prodConfg.staticPath,_path);
}

module.exports = {
    entry: path.resolve(__dirname,'../src/main.js'),
    //配置模块如何被解析
    resolve: {
        //自动解析文件扩展名
        extensions: ['.js','.vue','.json'],
        alias:{
            vue$:'vue/dist/vue.js',
            utils:resolve('src/utils'),
            component:resolve('src/component'),
            public:resolve('public'),
            page:resolve('src/page')
        }
    },
    module:{
        rules: [
            {
                test:/\.js$/,
                use:{loader:'babel-loader'},
                include:resolve('src')
            },
            {
                test:/\.(png|jpe?g|git|svg)(\?.*)/,
                loader:'url-loader',
                options:{
                    limit:8192,
                    name:assetsPath('img/[name].[hash:8].[ext]')
                }
            }
        ]
    }
};

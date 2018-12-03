"use strict";

const webpack = require("webpack");
const path = require('path');
//引入webpack开发环境配置参数
const devConfig = require("../config").dev;
//引入webpack基本配置
const baseConf = require("./webpack.common");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
//编译提示的webpack插件！
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
//发送系统通知的一个node模块！
const notifier = require("node-notifier");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
// const HotModuleReplacementPlugin = require();

const devConf = merge(baseConf,{
    output:{
        filename:'[name].js',
        publicPath:devConfig.publicPath
    },
    mode:'development',
    devtool:devConfig.devtoolType,
    //启动一个express服务器进行本地开发
    devServer:{
        clientLogLevel:'warning',  //HMR控制台log等级
        hot:true,
        inline:true,  //自动刷新
        open:true,
        //在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
        historyApiFallback: true,
        host: devConfig.host,
        port: devConfig.port,
        //配置反向代理解决跨域
        proxy: devConfig.proxyTable,
        compress: true,
        // 在浏览器上全屏显示编译的errors或warnings。
        overlay: {
            errors: true,
            warnings: false
        },
        // 终端输出的只有初始启动信息。 webpack 的警告和错误是不输出到终端的
        // quiet: true
    },
    module:{
        rules:[
            {
                test:/\.vue$/,
                loader:'vue-loader',
                options:devConfig.vueloaderConf
            },
            //使用vue-style-loader!css-loader!postcss-loader处理以css结尾的文件！
            {
                test:'/\.css$/',
                use:[
                    'vue-style-loader',
                    {
                        loader:'css-loader',
                        options:{
                            sourceMap:true
                        }
                    },
                    {
                        loader:'postcss-loader',
                        options:{
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.less$/,
                use: [
                    "vue-style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: "less-loader",
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            }
        ]
    },
    plugins:[
        new VueLoaderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),    //显示模块相对路径
        //编译出错时,该插件可跳过输出,确保输出资源不会包含错误!
        // new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
            title:'xrk',
            filename:'index.html',
            template: path.resolve(__dirname,'../index.html'),
            inject: true      //js资源插入位置，true:body元素底部
        }),
        //编译提示插件
        new FriendlyErrorsPlugin({
            //编译成功提示！
            compilationSuccessInfo: {
                messages: [
                    `Your application is running here: http://${devConfig.host}:${devConfig.port}`
                ]
            },
            //编译出错
            onErrors:function (severity,errors) {
                if (severity !== 'error') {
                    return;
                }
                const error = errors[0];
                const filename = error.file.split('!').pop();
                //编译出错右下角弹出错误提示
                notifier.notify({
                    title: 'Errors',
                    message:severity + ':' + error.name,
                    subtitle:filename || '',
                    // icon:path.join(__dirname,'xc-cli.png')
                })
            }
        })
    ]
});
module.exports = devConf;

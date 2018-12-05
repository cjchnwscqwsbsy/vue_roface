"use strict";

const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const prodConfig = require("../config").build;
const baseConf = require("./webpack.common");
//一个创建html入口文件的webpack插件！
const HtmlWebpackPlugin = require("html-webpack-plugin");
//一个抽离出css的webpack插件！
const ExtractTextPlugin = require("extract-text-webpack-plugin");
//一个压缩css的webpack插件！
const OptimizeCSSPlugin = require("optimize-css-assets-webpack-plugin");
//一个拷贝文件的webpack插件！
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

//资源路径
function assetsPath(_path) {
    return path.join(prodConfig.staticPath, _path);
}
const prodConf = merge(baseConf,{
    output:{
        //Build后所有文件存放的位置
        path: path.resolve(__dirname, "../public"),
        //html引用资源路径,可在此配置cdn引用地址！
        publicPath: prodConfig.publicPath,
        //文件名
        filename: assetsPath("js/[name].[chunkhash].js"),
        //用于打包require.ensure(代码分割)方法中引入的模块
        chunkFilename: assetsPath("js/[name].[chunkhash].js")
    },
    mode:'production',
    devtool:prodConfig.devtoolType,
    //压缩js
    optimization:{
        splitChunks:{
            cacheGroups: {
                vendor:{//node_modules内的依赖库
                    chunks:"initial",
                    test: /node_modules/,
                    name:"vendor",
                    minChunks: 1, //被不同entry引用次数(import),1次的话没必要提取
                    maxInitialRequests: 5,
                    minSize: 0,
                    priority:100,
                    // enforce: true?
                },
                app: {// ‘src/js’ 下的js文件
                    chunks:"initial",
                    name: "app", //生成文件名，依据output规则
                    minChunks: 2,
                    minSize: 0,
                    priority:2
                }
            }
        },
        runtimeChunk:{
            name:'manifest',
        }
    },
    module:{
        rules:[
            {
                test:/\.vue$/,
                loader:'vue-loader',
                options:prodConfig.vueloaderConf
            },
            {
                test:/\.css$/,
                use:ExtractTextPlugin.extract({
                    use:['css-loader','postcss-loader'],
                    fallback:'vue-style-loader'
                })
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    use: ["css-loader", "less-loader", "postcss-loader"],
                    fallback: "vue-style-loader"
                })
            }
        ]
    },
    plugins:[
        new CleanWebpackPlugin([path.resolve(__dirname, "../public")]),
        new VueLoaderPlugin(),
        //每个chunk头部添加xrk!
        new webpack.BannerPlugin("xrk"),
        //分离入口引用的css,不内嵌到js bundle中!
        new ExtractTextPlugin({
            filename: assetsPath("css/[name].[hash].css"),
            allChunks: false
        }),
        //压缩css
        new OptimizeCSSPlugin(),
        //根据模块相对路径生成四位数hash值作为模块id
        new webpack.HashedModuleIdsPlugin(),
        //作用域提升,提升代码在浏览器执行速度
        new webpack.optimize.ModuleConcatenationPlugin(),

        //将整个文件复制到构建输出指定目录下
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, "../static"),
                to: prodConfig.staticPath,
                ignore: [".*"]
            }
        ]),

        //生成html
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, "../public/index.html"),
            template: "index.html",
            favicon: path.resolve(__dirname, "../favicon.ico"),
            //js资源插入位置,true表示插入到body元素底部
            inject: true,
            //压缩配置
            minify: {
                //删除Html注释
                removeComments: true,
                //去除空格
                collapseWhitespace: true,
                //去除属性引号
                removeAttributeQuotes: true
            },
            //根据依赖引入chunk
            chunksSortMode: "dependency"
        })
    ]
});
module.exports = prodConf;

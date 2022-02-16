const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const mode = process.env.NODE_ENV;
const entryFile = path.resolve(__dirname,"src","client.jsx");
const outputDir = path.resolve(__dirname,"dist");
const fs = require('fs');
const webpack = require("webpack");

const config = {
    mode:mode,
    entry:{
        app:[entryFile],
    },
    resolve:{
        extensions:['.js','.jsx'],
        fallback:{
            process:require.resolve("process"),
            zlib:require.resolve("browserify-zlib"),
            stream:require.resolve("stream-browserify"),
            util:require.resolve("util"),
            buffer:require.resolve("buffer"),
            assert:require.resolve("assert"),
        }
    },
    module:{
        rules:[
            {
                test:/\.(jsx|js)$/,
                exclude:/node_modules/,
                use:['babel-loader']
            },
            {
                test:/\.css$/,
                use:[mode==='development'?'style-loader':MiniCssExtractPlugin.loader,'css-loader'],
            },
            {
                test:/\.(jpg|gif|svg|jpeg|png)$/,
                use:{
                    loader:'url-loader',
                    options:{
                        publicPath:'/img/',
                        name:'[name].[ext]?[hash]',
                        mimetype:'image/png',
                        encoding:'base64',
                        limit:10000,
                        fallback:require.resolve('file-loader'),
                    }
                }
            }
        ]
    },
    plugins:[
        new webpack.ProvidePlugin({
            Buffer:["buffer","Buffer"],
            process:"process",
        }),
        new HtmlWebpackPlugin({
            template: "./index.html",
            templateParameters:{
                env:process.env.NODE_ENV==="development"?"개발중":""
            },
            minify:{
                collapseWhitespace:true,
                removeComments:true,
            }
        }),
        ...(mode==='production'?[new MiniCssExtractPlugin({
            filename:"[name].css"
        })]:[]),
        new CleanWebpackPlugin(),
    ],
    output:{
        path:outputDir,
        filename:'[name].[hash].js'
    },
    optimization:{
        minimize:true,
        minimizer:[
            new TerserJSPlugin({
                test:/\.(js|jsx)$/,
                terserOptions:{
                    compress:{
                        drop_console:true,
                    }
                }
            })
        ]
    },
    devServer:{
        static:[
            {
                directory:path.join(__dirname,"static/"),
                publicPath:"/assets",
                watch:true,
            }
        ],
        /* https:{
            ca:fs.readFileSync(path.join(__dirname,'../httpsDocument/server.csr')),
            key:fs.readFileSync('../httpsDocument/server.key'),
            cert:fs.readFileSync('../httpsDocument/server.crt'),
            requestCert:true,
        }, */
        historyApiFallback:true,
        port:8090,
        host:"0.0.0.0",
        open:true,
        hot:true,
        proxy:{
            '/ai-tools':`http://1.201.8.81:9996`
        }
    }
}

module.exports = config;
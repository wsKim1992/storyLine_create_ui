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
const dotenv = require('dotenv');
dotenv.config();
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
            },{
                test:/\.(ttf|woff|otf|eot|TTF)$/,
                use:{
                    loader:'url-loader',
                    options:{
                        publicPath:'/font/',
                        name:'[name].[ext]',
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
            },
            metas:[
                {
                    path:'https://novel.aizac.io/assets/img/novel_main_002.jpg',
                    attributes:{
                        property:'og:image',
                    } 
                },{
                    attributes:{
                        property:'og:url',
                        content:'https://novel.aizac.io/main'
                    }
                },{
                    attributes:{
                        property:'og:title',
                        content:'AI-zac Novel'
                    }
                },{
                    attributes:{
                        property:'og:description',
                        content:'AI 소설생성 서비스'
                    }
                },{
                    attributes: {
                        property: 'og:image:width',
                        content: "200"
                    }
                },{
                    attributes: {
                        property: 'og:image:height',
                        content: "200"
                    }
                }
            ]
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
        port:9009,
        host:"0.0.0.0",
        open:true,
        hot:true,
        proxy:{
            '/ai-tools':`http://${process.env.API_URL}:${process.env.API_PORT}`
        }
    }
}

module.exports = config;
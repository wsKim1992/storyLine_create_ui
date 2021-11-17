const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const { default: TerserPlugin } = require("terser-webpack-plugin/types");

const mode = process.env.NODE_ENV;
const entryFile = path.resolve(__dirname,"src","client.jsx");
const outputDir = path.resolve(__dirname,"dist");

const config = {
    mode:mode,
    entry:{
        app:[entryFile]
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
                test:/\.(jpg|gif|svg|jpeg|png)/,
                use:{
                    loader:'url-loader',
                    options:{
                        publicPath:'/dist/',
                        name:'[name].[ext]?[hash]',
                        mimetype:'image/png',
                        encoding:'base64',
                        limit:10*1024,
                    }
                }
            }
        ]
    },
    plugins:[
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
        filename:'bundle.[hash].js'
    },
    optimization:{
        minimize:true,
        minimizer:[
            new TerserPlugin({
                test:/\.(js|jsx)$/,
                exclude:/node_modules/,
            })
        ]
    }
}

module.exports = config;
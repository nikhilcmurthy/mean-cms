'use strict';

var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

const APP = path.resolve(__dirname, 'app');
const BUILD_DIR = path.resolve(__dirname, 'app/app-dist');
const NODE_MODULES = path.resolve(__dirname, 'node_modules');

const webpackConfig = {
    devtool: 'source-map',

    // set application base directory (must be an absolute path)
    // for resolving entry and output path
    context: APP,
    entry: {
        babelPolyfill: 'babel-polyfill',
        app: [
            'webpack-dev-server/client?http://localhost:8080',
            'webpack/hot/dev-server',
            './app-core/bootstrap.js'
        ],
        vendor: [
            'jquery', 'angular', 'angular-animate', 'angular-aria', 'angular-material',
            'angular-material-data-table', 'angular-messages', 'angular-ui-router', 'lodash', 'ng-file-upload'
        ]
    },
    output: {
        path: BUILD_DIR,
        filename: '[name].js',
        publicPath: '/app-dist/',
        pathinfo: true
    },
    resolve: {
        alias: {
            npm: NODE_MODULES
        }
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'ng-annotate?add=true!babel?presets=es2015&plugins=transform-runtime'
            },
            {
                test: /\.html$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'raw'
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('css?sourceMap!less?sourceMap')
            },
            {
                test: /\.css$/,
                loader: 'style!css'
            },
            {
                test: [/fontawesome-webfont\.svg/, /fontawesome-webfont\.eot/, /fontawesome-webfont\.ttf/, /fontawesome-webfont\.woff/, /fontawesome-webfont\.woff2/],
                loader: 'file?name=fonts/[name].[ext]'
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: 'vendor',
            filename: 'vendor.js',
            minChunks: Infinity
        }),
        new webpack.ProvidePlugin({
            $: 'jQuery',
            'window.jquery': 'jquery'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin('[name].css', ['allChunks'])
    ]
};

module.exports = webpackConfig;

'use strict';

var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

const APP = path.resolve(__dirname, 'app');
const BUILD_DIR = path.resolve(__dirname, 'app/app-dist');
const NODE_MODULES = path.resolve(__dirname, 'node_modules');

// hot module replacement (HMR) is not available in angular. There is
// no angular version of 'react-hot-loader'.
//
// commenting HMR entry point and webpack plugin for future reference
const webpackConfig = {
    devtool: 'source-map',

    // set application base directory (must be an absolute path)
    // for resolving entry and output path
    context: APP,

    // multiple entry points to support vendor - app code splitting
    entry: {
        babelPolyfill: 'babel-polyfill',
        app: [
            'webpack-dev-server/client?http://localhost:8080',
            //'webpack/hot/dev-server',
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
                test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0.9])?$/,
                loader: 'file?name=fonts/[name].[ext]'
            },
            {
                test: /\.(png|gif|jpe?g|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url?limit=10000'
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url'
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

        // create a separate chunk for application css files for easier debugging
        new ExtractTextPlugin('[name].css', ['allChunks'])

        //new webpack.HotModuleReplacementPlugin()
    ]
};

module.exports = webpackConfig;

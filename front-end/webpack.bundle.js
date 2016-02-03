const debug = require('debug')('cms:front-end:bundler');
const colors = require('colors/safe');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config');
const path = require('path');
const config = require('./config.json');

module.exports = function () {
    // setup webpack compiler
    const compiler = webpack(webpackConfig);

    // register handlers for 'compile' and 'done' events to
    // facilitate dev time instrumentation
    compiler.plugin('compile', function () {
        debug(colors.cyan('webpack::compiler - start packing a new bundle'));
    });
    compiler.plugin('done', function () {
        debug(colors.cyan('webpack::compiler - new bundle created'));
    });

    // create a new instance of webpack-dev-server with it's own configuration object
    // NOTE : webpack-dev-server does not read config settings from webpack.config.js
    //
    // disable hot module reloading, fallback to default browser full refresh
    const bundle = new WebpackDevServer(compiler, {
        contentBase: path.resolve(__dirname, 'app'),
        publicPath: '/app-dist/',
        //hot: true,
        quiet: false,
        noInfo: false,
        // other supported stats values : 'minimal' / 'normal' / 'verbose'
        stats: {
            assets: true,
            version: true,
            timings: true,
            hash: true,
            chunks: true,
            colors: true,
            errorDetails: true,
            chunkModules: false // true to display per chunk module information
        }
    });

    // host webpack-dev-server on port 8080
    bundle.listen(config.webpack.devServerPort, config.webpack.devServerHost, () => {
        const {address, port} = bundle.listeningApp.address();
        const baseUrl = `http://${address}:${port}/`;
        debug(colors.cyan('webpack::compiler - dev server listening on %s'), baseUrl);
    });
};

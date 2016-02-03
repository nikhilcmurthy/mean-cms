require('rootpath')();
const debug = require('debug')('cms:front-end:server');
const colors = require('colors/safe');
const http = require('http');
const express = require('express');
const session = require('express-session');
const path = require('path');
const proxy = require('http-proxy');
const bodyParser = require('body-parser');
const request = require('request');
const webpack = require('webpack');
const config = require('./config.json');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? config.port : process.env.PORT;
const httpProxy = proxy.createProxyServer();
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

// mount authentication check for all incoming requests
// redirect unauthenticated requests to '/login'
app.use(function (req, res, next) {
    if (req.path !== '/login' && !req.session.token) {
        debug(colors.grey.bold('/auth handler : %s'), req.originalUrl);
        return res.redirect('/login?returnUrl=' + encodeURIComponent(req.path));
    }
    next();
});

// mount webpack-dev-server middleware in development mode
// route all 'asset' requests to webpack
if(isDeveloping) {
    const bundle = require('./webpack.bundle');
    bundle();
    // all asset requests are proxied to webpack-dev-server
    app.all('/app-dist/*', (req, res) => {
        debug(colors.grey.bold('/webpack-asset handler : %s'), req.originalUrl);
        const webpackServerURL = `http://localhost:${config.webpack.devServerPort}`;
        httpProxy.web(req, res, {target: webpackServerURL});
    });
} else {
    // serve app requests from /app-dist in production
    app.use(express.static('app/app-dist'));
}

// serve bower components from /bower_components
app.use('/bower_components', express.static('bower_components'));

app.get('/login', function (req, res) {
    delete req.session.token;

    res.render(__dirname + '/login/index.ejs');
});

app.post('/login', function (req, res) {
    request.post({
        url: config.apiUrl + '/authenticate',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            return res.render(__dirname + '/login/index.ejs', { error: 'An error occurred' });
        } else if (!body.token) {
            return res.render(__dirname + '/login/index.ejs', { error: 'Username or password is incorrect', username: req.body.username });
        }

        // save token in session
        req.session.token = body.token;

        // redirect to returnUrl
        var returnUrl = req.query.returnUrl && decodeURIComponent(req.query.returnUrl) || '/';
        res.redirect(returnUrl);
    });
});

// make token available to angular app on /token path
app.get('/token', function (req, res) {
    debug(colors.grey.bold('/security-token handler : %s'), req.originalUrl);
    res.send(req.session.token);
});

// uploads route passes through to the same route on the api along with JWT token
app.get('/uploads/:filename', function (req, res) {
    request.get({
        url: config.apiUrl + '/uploads/' + req.params.filename,
        headers: { 'Authorization': 'Bearer ' + req.session.token }
    }).pipe(res);
});

// rewrite virtual urls to angular app
app.get('*', function (req, res, next) {
    debug(colors.grey.bold('/catch-all handler : %s'), req.originalUrl);
    res.sendFile(__dirname + '/app/index.html');
});

const server = http.createServer(app);
server.listen(port, config.host, () => {
    const {address} = server.address();
    const baseUrl = `http://${address}:${port}`;
    debug(colors.green.bold('server listening : %s/'), baseUrl);
    debug(colors.green.bold('node environment : %s'), process.env.NODE_ENV);
});

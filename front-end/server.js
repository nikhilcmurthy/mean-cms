require('rootpath')();
var express = require('express');
var app = express();
var session = require('express-session');
var path = require('path');
var bodyParser = require('body-parser')
var request = require('request');
var config = require('config.json');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

// session auth to secure the client app
app.use(function (req, res, next) {
    if (req.path !== '/login' && !req.session.token) {
        return res.redirect('/login?returnUrl=' + encodeURIComponent(req.path));
    }

    next();
});

// serve client app from root path
app.use(express.static('app'));

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
    res.sendFile(__dirname + '/app/index.html');
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Client app server listening at http://%s:%s', host, port);
});
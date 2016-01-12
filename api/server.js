require('rootpath')();
var express = require('express');
var app = express();
var expressJwt = require('express-jwt');
var bodyParser = require('body-parser')
var bcrypt = require('bcryptjs');
var _ = require('lodash');
var config = require('config.json');

// db connection
var mongo = require('mongodb');
var monk = require('monk');
var db = monk(config.connectionString);

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// enable JWT
app.use(expressJwt({ secret: config.secret }).unless({ path: ['/authenticate'] }));

// enable CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// make db and io accessible on req object
app.use(function (req, res, next) {
    req.db = db;
    req.io = io;
    next();
});

// routes
app.use('/authenticate', require('./routes/authenticate'));
app.use('/users', require('./routes/users'));
app.use('/uploads', require('./routes/uploads'));

// create default admin user if 'users' collection is empty
db.get('users').count({}, function (err, count) {
    if (count === 0) {
        console.log('users collection empty so creating default admin user (admin:admin)');
        db.get('users').insert({ firstName: 'Default', lastName: 'Admin', username: 'admin', hash: bcrypt.hashSync('admin', 10) });
    }
});

http.listen(3001, function () {
    console.log('API server listening on port 3001');
});
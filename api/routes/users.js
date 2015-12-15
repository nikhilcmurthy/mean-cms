var express = require('express');
var router = express.Router();

var bcrypt = require('bcryptjs');
var _ = require('lodash');
var Q = require('q');

// get all
router.get('/', function (req, res) {
    var users = req.db.get('users');

    users.find({}, { fields: { hash: 0 } }, function (err, docs) {
        res.send(docs);
    });
});

// get by id
router.get('/:_id', function (req, res) {
    var users = req.db.get('users');

    users.findById(
        req.params._id,
        function (err, doc) {
            if (doc) {
                // return user
                return res.send(_.omit(doc, 'hash'));
            }

            // user not found
            res.sendStatus(404);
        });
});

// create
router.post('/', function (req, res) {
    var users = req.db.get('users');

    validateUser()
        .then(createUser);

    function validateUser() {
        var deferred = Q.defer();

        // validation
        users.findOne(
            { username: req.body.username },
            function (err, doc) {
                if (err) throw err;

                if (doc) {
                    return res.status(400).send('Username already exists');
                } else {
                    deferred.resolve();
                }
            });

        return deferred.promise;
    }

    function createUser() {
        // set user to req.body without the cleartext password
        var user = _.omit(req.body, 'password');

        // add hashed password to user object
        user.hash = bcrypt.hashSync(req.body.password, 10);

        // add saved:true property to file
        user.files = _.map(user.files, function (file) { return _.extend(file, { saved: true }); });

        users.insert(
            user,
            function (err, doc) {
                if (err) throw err;

                // notify all connected sockets
                req.io.emit('users', { action: 'created', item: _.omit(doc, 'hash') });

                res.sendStatus(200);
            });
    }
});

// update
router.put('/:_id', function (req, res) {
    var users = req.db.get('users');

    // TODO: add validation

    var set = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,

        // add saved:true property to file
        files: _.map(req.body.files, function (file) { return _.extend(file, { saved: true }); })
    };

    // update password if entered
    if (req.body.password) {
        set.hash = bcrypt.hashSync(req.body.password, 10);
    }

    users.findAndModify(
        { _id: req.params._id },
        { $set: set }, 
        { 'new': true },
        function (err, doc) {
            if (err) throw err;

            // notify all connected sockets
            req.io.emit('users', { action: 'updated', item: _.omit(doc, 'hash') });

            res.sendStatus(200);
        });
});

// delete
router.delete('/:_id', function (req, res) {
    var users = req.db.get('users');

    users.remove(
        { _id: req.params._id },
        function (err) {
            if (err) throw err;

            // notify all connected sockets
            req.io.emit('users', { action: 'deleted', _id: req.params._id });

            res.sendStatus(200);
        });
});

module.exports = router;
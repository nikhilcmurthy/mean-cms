var express = require('express');
var router = express.Router();
var _ = require('lodash');
var Q = require('q');

var entityType = 'services';

// get all
router.get('/', function (req, res) {
    var collection = req.db.get(entityType);

    collection.find({}, function (err, docs) {
        res.send(docs);
    });
});

// get by id
router.get('/:_id', function (req, res) {
    var collection = req.db.get(entityType);

    collection.findById(
        req.params._id,
        function (err, doc) {
            if (doc) {
                res.send(doc);
            } else {
                res.sendStatus(404);
            }
        });
});

// create
router.post('/', function (req, res) {
    var collection = req.db.get(entityType);

    collection.insert(
        req.body,
        function (err, doc) {
            if (err) throw err;

            // notify all connected sockets
            req.io.emit(entityType, { action: 'created', item: doc });

            res.sendStatus(200);
        });
});

// update
router.put('/:_id', function (req, res) {
    var collection = req.db.get(entityType);

    collection.findAndModify(
        { _id: req.params._id },
        { $set: req.body }, 
        { 'new': true },
        function (err, doc) {
            if (err) throw err;

            // notify all connected sockets
            req.io.emit(entityType, { action: 'updated', item: _.omit(doc, 'hash') });

            res.sendStatus(200);
        });
});

// delete
router.delete('/:_id', function (req, res) {
    var collection = req.db.get(entityType);

    collection.remove(
        { _id: req.params._id },
        function (err) {
            if (err) throw err;

            // notify all connected sockets
            req.io.emit(entityType, { action: 'deleted', _id: req.params._id });

            res.sendStatus(200);
        });
});

module.exports = router;
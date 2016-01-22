var express = require('express');
var router = express.Router();
var _ = require('lodash');
var Q = require('q');

// get all
router.get('/:dataType', function (req, res) {
    var collection = req.db.get(req.params.dataType);

    collection.find({}, function (err, docs) {
        res.send(docs);
    });
});

// get by id
router.get('/:dataType/:_id', function (req, res) {
    var collection = req.db.get(req.params.dataType);

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
router.post('/:dataType', function (req, res) {
    var collection = req.db.get(req.params.dataType);

    collection.insert(
        req.body,
        function (err, doc) {
            if (err) throw err;

            // notify all connected sockets
            req.io.emit(req.params.dataType, { action: 'created', item: doc });

            res.sendStatus(200);
        });
});

// update
router.put('/:dataType/:_id', function (req, res) {
    var collection = req.db.get(req.params.dataType);

    collection.findAndModify(
        { _id: req.params._id },
        { $set: req.body }, 
        { 'new': true },
        function (err, doc) {
            if (err) throw err;

            // notify all connected sockets
            req.io.emit(req.params.dataType, { action: 'updated', item: doc });

            res.sendStatus(200);
        });
});

// delete
router.delete('/:dataType/:_id', function (req, res) {
    var collection = req.db.get(req.params.dataType);

    collection.remove(
        { _id: req.params._id },
        function (err) {
            if (err) throw err;

            // notify all connected sockets
            req.io.emit(req.params.dataType, { action: 'deleted', _id: req.params._id });

            res.sendStatus(200);
        });
});

module.exports = router;
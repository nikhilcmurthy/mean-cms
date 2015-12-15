var express = require('express');
var router = express.Router();

var bcrypt = require('bcryptjs');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var config = require('config.json');

router.post('/', function (req, res) {
    var users = req.db.get('users');

    users.findOne({ username: req.body.username }, function (err, doc) {
        if(doc && bcrypt.compareSync(req.body.password, doc.hash)) {
            // authentication successful
            return res.send({ token: jwt.sign({ username: doc.username }, config.secret) });
        }

        // authentication failed
        res.sendStatus(401);
    });
});

module.exports = router;
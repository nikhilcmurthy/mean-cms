var express = require('express');
var router = express.Router();

var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty({ uploadDir: '../uploads' });
var path = require('path');
var fs = require('fs');

// get file
router.get('/:filename', function (req, res) {
    res.sendFile(path.resolve('../uploads/' + req.params.filename));
});

// upload file
router.post('/', multipartyMiddleware, function (req, res) {
    res.send(path.basename(req.files.file.path));
});

// delete file
router.delete('/:filename', function (req, res) {
    fs.unlink(path.resolve('../uploads/' + req.params.filename), function (err) {
        if (err) console.log(err);

        res.sendStatus(200);
    });
});

module.exports = router;
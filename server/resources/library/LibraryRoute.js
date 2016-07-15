var express = require('express');
var fs = require('fs');
var path = require('path');
var mm = require('musicmetadata');

var multer = require('multer');
var upload = multer( {
  dest: path.join(__dirname + '/../../library/')
} );

var router = express.Router();

router.get('/', function(req, res) {
  return new Promise(function(resolve, reject) {
    fs.readdir(path.join(__dirname + '/../../library'), 'utf8', function(err, files) {
      if (err) {
        reject(err);
      } else {
        files = files.filter(function(item) {
          return !(/(^|\/)\.[^\/\.]/g).test(item);
        });
        resolve(files);
      }
    });
  })
  .then(function(songFiles) {
    var promises = [];
    songFiles.forEach(function(fileName) {
      promises.push(new Promise(function (resolve,reject) {
        mm(fs.createReadStream(path.join(__dirname + '/../../library/' + fileName)), function (err, metadata) {
          // Coverart is not currently processed,
          // so it is removed from the response.
          delete metadata.picture;
          metadata.fileName = fileName;
          resolve(metadata);
        });
      }));
    });
    return Promise.all(promises);
  })
  .then(function(metadata) {
    res.send(metadata);
  });
});

router.post('/', upload.single('song'), function(req, res) {
  res.end(req.filename);
});

module.exports = router;

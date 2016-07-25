var express = require('express');
var fs = require('fs');
var path = require('path');
var redis = require("redis");
var client = redis.createClient();
var mm = require('musicmetadata'); // Extract metadata from songs
var md5File = require('md5-file/promise'); // Calculate the hash of song data for redis key
var multer = require('multer'); // Multi-part form upload parser used to handle the song uploads

var songLibraryPath = path.join(__dirname + '/../../songLibrary/');

// Directs song upload to be saved in songLibrary folder 
var upload = multer( { 
  dest: songLibraryPath
} ).single('song');

var router = express.Router();


router.get('/', function(req, res) {
  return new Promise(function(resolve, reject) {
    client.hgetall('music library', function(err, libraryHash) {
      var songs = [];
      for (var songHash in libraryHash) {
        songs.push(JSON.parse(libraryHash[songHash]));
      }
      resolve(songs);
    });
  })
  .then(function(metadata) {
    res.send(metadata);
  });
});

router.post('/', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      console.log('multer error', err);
      return;
    }
    // Get metadata from song file
    new Promise(function(resolve, reject) {
      console.log(fs.createReadStream(songLibraryPath + req.file.filename));
      mm(fs.createReadStream(songLibraryPath + req.file.filename), function (err, metadata) {
        if (err) {
          console.log('music metadata error -', err);
        }
        delete metadata.picture;
        metadata.fileName = req.file.filename;
        console.log('metadata saved');
        resolve(metadata);
      });
    })
    .catch(function(error) {
      console.log('musicmetadata error', error);
    })
    // Add the metadata to the redis database 
    .then(function(metadata) {

      // calculates file hash for redis key
      return md5File(req.file.path)
      .then(function(hash) {
        return client.hset('music library', hash, JSON.stringify(metadata));
      }).then(function() {
        console.log('redis save', metadata);
        res.sendStatus(201);
      });
    })
    .catch(function(error) {
        console.log('redis database saving error', error);
    });
  });
});


module.exports = router;

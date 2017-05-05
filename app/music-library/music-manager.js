const PATH = 'C:\\Users\\blaze_spirit\\Desktop\\testing-groud\\music-library-2';
const PATH2 = 'E:\\My_Music';

//==================================

const filewalker = require('filewalker');
const fileSystem = require('fs');
const musicMetadata = require('musicmetadata');

const shortID = require('shortid');
const tingoDB = require('tingodb')().Db;
const mediaDB = new tingoDB('./app/music-library', {});
const musicCollection = mediaDB.collection("music-collection.db");

const init = function() {
  musicCollection.findOne({}, function(err, item) {
    if (item === null) { // collection not exist. Perform full initialization.
      // scanDirectory();

      // callback hell start here
      filewalker(PATH2, { matchRegExp: /\.(?:mp3)$/i })
        .on('file', function(relativePath, stats, fullPath) {
          let readableStream = fileSystem.createReadStream(fullPath);
          let trackObj = {};

          musicMetadata(readableStream, function(err, metadata) {
            if (err) {
              throw err;
            }

            trackObj._id = shortID.generate();
            trackObj.title = metadata.title;
            trackObj.artist = metadata.artist;
            trackObj.album = metadata.album;
            trackObj.albumArtist = metadata.albumartist;
            trackObj.genre = metadata.genre;
            trackObj.year = metadata.year;
            trackObj.track = metadata.track;
            trackObj.disk = metadata.disk;
            trackObj.path = fullPath;
            trackObj.type = 'track';

            readableStream.close();

            // insert to DB.
            musicCollection.insert(trackObj);
          })
        })
        .on('error', function(err) {
          console.error(err);
        })
        .on('done', function() {
          console.log('DONE !!!');
          console.log('%d dirs, %d files, %d bytes', this.dirs, this.files, this.bytes);
        })
      .walk();

    } else {

    }
  });
}

const getTrack = function(trackNum, page, callback) {
  if (page < 1) {
    page = 1;
  }

  musicCollection.find({ type: 'track' })
                 .skip((page - 1) * trackNum)
                 .limit(trackNum)
                 .toArray(function(err, record) {
                    callback(record);
                 });
}

const musicManager = {
  // methods
  init: init,
  getTrack: getTrack

};

module.exports = musicManager;

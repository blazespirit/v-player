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

const { DATABASE } = require('../config-constant');

const init = function() {
  musicCollection.findOne({}, function(err, item) {
    if (item === null) { // collection not exist. Perform full initialization.
      // callback hell start here.
      // 1. filewalker traverse the directory specified.
      // 2. on 'file' event, extract metadata.
      // 3. extracted metadata will be inserted to DB.
      filewalker(PATH, { matchRegExp: /\.(?:mp3)$/i }) // TODO -- get PATH from user input.
        .on('file', function(relativePath, stats, fullPath) {
          let readableStream = fileSystem.createReadStream(fullPath);
          let trackObj = {};

          musicMetadata(readableStream, function(err, metadata) {
            if (err) {
              throw err;
            }

            // if no title metadata found, set file name as title. 
            let title = metadata.title.trim();

            if (title === '') {
              title = fullPath.split('\\').pop().split('/').pop(); // get file name.
              title = title.replace(/\.[^/.]+$/, "");              // remove .extension. 
            }

            trackObj._id = shortID.generate();
            trackObj.type = DATABASE.TYPE.TRACK;
            trackObj.path = fullPath;
            trackObj.title = title;
            trackObj.artist = metadata.artist;
            trackObj.album = metadata.album;

            // ===== other optional fields =====

            // trackObj.albumArtist = metadata.albumartist;
            // trackObj.genre = metadata.genre;
            // trackObj.year = metadata.year;
            // trackObj.track = metadata.track;
            // trackObj.disk = metadata.disk;

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

const getTrackList = function(trackNum, page, vuexStore) {
  if (page < 1) {
    page = 1;
  }
  musicCollection.find({ type: 'track' })
                 .skip((page - 1) * trackNum)
                 .limit(trackNum)
                 .toArray(function(err, record) {
                    vuexStore.commit('UPDATE_TRACK_LIST', { trackList: record });
                 });
}

const getSingleTrack = function(index, vuexStore) {
  if (index < 0) {
    index = 0;
  }
  musicCollection.find({ type: 'track' })
                 .skip(index)
                 .limit(1)
                 .toArray(function(err, record) {
                    if (record[0] !== undefined) {
                      vuexStore.commit('UPDATE_TRACK', record[0]);
                    }
                    else {
                      vuexStore.commit('UPDATE_INDEX', 0);
                      vuexStore.commit('GET_SINGLE_TRACK', vuexStore);
                    }
                 });
}

const musicManager = {
  // methods
  init: init,
  getTrackList: getTrackList,
  getSingleTrack: getSingleTrack

};

module.exports = musicManager;

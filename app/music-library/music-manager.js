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

const { DATABASE,
        MUSIC } = require('../config-constant');

const init = function(vuexStore) {
  let totalRecord = null;
  let insertedRecord = 0;

  musicCollection.findOne({}, function(err, item) {
    if (item === null) { // collection not exist. Perform full initialization.
      vuexStore.commit('SHOW_LOADING');
      // callback hell start here.
      // 1. filewalker traverse the directory specified.
      // 2. on 'file' event, extract metadata.
      // 3. extracted metadata will be inserted to DB.
      filewalker(PATH, { matchRegExp: /\.(?:mp3)$/i }) // TODO -- get PATH from user input.
        .on('file', function(relativePath, stats, fullPath) {
          let readableStream = fileSystem.createReadStream(fullPath);
          let trackObj = { };

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
            musicCollection.insert(trackObj, function(err, record){
              insertedRecord++;
              
              if (insertedRecord === totalRecord) {
                _processAlbumGrouping();
              }
            });
          })
        })
        .on('error', function(err) {
          console.error(err);
        })
        .on('done', function() {
          console.log('DONE !!!');
          console.log('%d dirs, %d files, %d bytes', this.dirs, this.files, this.bytes);
          totalRecord = this.files;
        })
      .walk();

    } else {

    }
  });
};

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
};

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

                      if (record[0].albumId) {
                        getAlbumArt(record[0].albumId, vuexStore);
                      }
                      else {
                        vuexStore.commit('UPDATE_ALBUM_ART', '');
                      } 
                    }
                    else {
                      vuexStore.commit('UPDATE_INDEX', 0);
                      vuexStore.commit('GET_SINGLE_TRACK', vuexStore);
                    }
                 });
};

const getSingleTrackAndPlay = function(index, vuexStore) { // TODO -- consider merge with 'getSingleTrack'.
  if (index < 0) {
    index = 0;
  }
  musicCollection.find({ type: 'track' })
                 .skip(index)
                 .limit(1)
                 .toArray(function(err, record) {
                    if (record[0] !== undefined) {
                      vuexStore.commit('UPDATE_TRACK', record[0]);

                      if (record[0].albumId) {
                        getAlbumArt(record[0].albumId, vuexStore);
                      }
                      else {
                        vuexStore.commit('UPDATE_ALBUM_ART', '');
                      } 
                    }
                    else {
                      vuexStore.commit('UPDATE_INDEX', 0);
                      vuexStore.commit('GET_SINGLE_TRACK', vuexStore);
                    }
                    vuexStore.commit('UPDATE_IS_PLAYING', true);
                 });
};

const getAlbumArt = function(albumId, vuexStore) { // TODO -- consider refactor.
  musicCollection.findOne({ type: 'album', _id: albumId }, function(err, result) {
    vuexStore.commit('UPDATE_ALBUM_ART', result.albumArtBase64);
  });
};

const getTotalTrackNumber = function() {
  musicCollection.count({ type: 'track' }, function(err, count) {
    // console.log(count); // TODO -- remove if not used.
  });
};

const updatePagination = function(vuexStore) {
  musicCollection.count({ type: 'track' }, function(err, count) {
    let totalPage = Math.ceil(count / MUSIC.TRACK_PER_PAGE);
    vuexStore.commit('UPDATE_PAGINATION', totalPage);
  });
};

// this function perform album grouping.
// it create records which contain the album art and it's track.
const _processAlbumGrouping = function() {
  let totalAlbum = null;
  let processedAlbum = 0;
  // search and group the track with 'album' metadata.
  // track without 'album' metadata will be ignore.
  musicCollection.group(['album'], {'album': { $ne: '' }}, { }, function (obj, prev) {}, true, function(err, results) {
    if (err) {
      throw err;
    }

    totalAlbum = results.length;

    for (let i = 0; i < results.length; i++) {
      let albumObj = {
        _id: shortID.generate(),
        title: results[i].album,
        trackIdList: [],
        albumArtBase64: '',
        type: 'album'
      };

      musicCollection.find({ type: 'track', album: albumObj.title })
                     .toArray(function(err, recordList) {
                        if (err) {
                          throw err;
                        }
                        // update album art
                        let filePath = recordList[0].path;

                        if (fileSystem.existsSync(filePath)) {
                          let readStream = fileSystem.createReadStream(filePath);

                          musicMetadata(readStream, function(err, metadata) {
                            if (err) {
                              readStream.close();
                              throw err;
                            }
                            // check if album art available.
                            // if yes, extract it as base64 data URL and insert to DB.
                            if (metadata.picture.length > 0) {
                              let albumArtBuffer = metadata.picture[0].data;
                              let base64String = '';

                              for (let i = 0; i < albumArtBuffer.length; i++) {
                                  base64String += String.fromCharCode(albumArtBuffer[i]);
                              }
                              let Base64Image = window.btoa(base64String);
                              albumObj.albumArtBase64 = Base64Image;
                            }
                            readStream.close(); // close stream to prevent leak.
                          });
                        }

                        // add tracks ID to albumObj.
                        for (let j = 0; j < recordList.length; j++) {
                          albumObj.trackIdList.push(recordList[j]._id);

                          // update track record with albumObj ID.
                          musicCollection.update({ _id: recordList[j]._id },
                                                 { $set: 
                                                    { albumId: albumObj._id }
                                                 });
                        }
                        // insert albumObj to DB.
                        musicCollection.insert(albumObj, function(err, record) {});
                          processedAlbum++;

                          if (processedAlbum === totalAlbum) {
                            vuexStore.commit('HIDE_LOADING');
                          }
                     });
    }
  });
};

const musicManager = {
  // methods
  init: init,
  getTrackList: getTrackList,
  getSingleTrack: getSingleTrack,
  getSingleTrackAndPlay: getSingleTrackAndPlay,
  getAlbumArt: getAlbumArt,
  getTotalTrackNumber: getTotalTrackNumber,
  updatePagination: updatePagination

};

module.exports = musicManager;

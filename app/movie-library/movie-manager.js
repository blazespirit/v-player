const filewalker = require('filewalker');
const fileSystem = require('fs');

const shortID = require('shortid');
const tingoDB = require('tingodb')().Db;
const mediaDB = new tingoDB('./app/movie-library', {});
const movieCollection = mediaDB.collection("movie-collection.db");

const { DATABASE,
        MOVIE,
        EVENT } = require('../config-constant');

const eventBus = require('../event-bus');

const scan = function(vuexStore, extDrivePath) {
  let totalRecord = null;
  let insertedRecord = 0;

  movieCollection.findOne({}, function(err, item) {
    if (item === null) { // collection not exist. Perform full initialization.
      // callback hell start here.
      // 1. filewalker traverse the directory specified.
      // 2. on 'file' event, extract info from file name.
      // 3. extracted info will be inserted to DB.
      filewalker(extDrivePath[0], { matchRegExp: /\.(?:avi|mp4|mkv)$/i }) // TODO -- temporaly get 1st ext drive.
        .on('file', function(relativePath, stats, fullPath) {
          let movieFileName = fullPath.split('\\').pop().split('/').pop();
          let fileNameArray = movieFileName.split('].[');
          let movieTitleEng = '';
          let movieTitleChi = '';
          let movieGenre = '';

          if (fileNameArray.length === 3) {
            movieTitleEng = fileNameArray[1];
            movieTitleChi = fileNameArray[2].split(']')[0];
            movieGenre    = fileNameArray[0].split('[')[1];
          }
          else {
            movieTitleEng = movieFileName;
            movieTitleChi = '';
            movieGenre    = 'unknown';
          }
          
          let movieObj = { };

          movieObj._id = shortID.generate();
          movieObj.titleEng = movieTitleEng;
          movieObj.titleChi = movieTitleChi;
          movieObj.genre = movieGenre;
          movieObj.path = fullPath;

          movieCollection.insert(movieObj, function(err, record){
            insertedRecord++;
            
            if (insertedRecord === totalRecord) {
              eventBus.$emit(EVENT.SCAN_MOVIE_DONE);
            }
          });
        })
        .on('error', function(err) {
          console.error(err);
        })
        .on('done', function() {
          console.log('%d dirs, %d files, %d bytes', this.dirs, this.files, this.bytes);
          totalRecord = this.files;
        })
      .walk();
    } else {
      eventBus.$emit(EVENT.SCAN_MOVIE_DONE); // TODO -- may need to refactor.
    }
  });
};

const getMovieList = function(movieNum, page, vuexStore) {
  if (page < 1) {
    page = 1;
  }
  movieCollection.find()
                 .skip((page - 1) * movieNum)
                 .limit(movieNum)
                 .toArray(function(err, record) {
                    vuexStore.commit('UPDATE_MOVIE_LIST', { movieList: record });
                 });
};

const updatePagination = function(vuexStore) {
  movieCollection.count({ }, function(err, count) {
    let totalPage = Math.ceil(count / MOVIE.MOVIE_PER_PAGE);
    vuexStore.commit('UPDATE_MOVIE_PAGINATION', totalPage);
  });
};

const movieManager = {
  // methods
  scan: scan,
  getMovieList: getMovieList,
  updatePagination: updatePagination
};

module.exports = movieManager;

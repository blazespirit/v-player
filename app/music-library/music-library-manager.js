const MediaLibrary = require('media-library');

const musicLibraryManager = new MediaLibrary({
  dataPath: './app/music-library',
  paths: [ 'C:\\Users\\blaze_spirit\\Desktop\\testing-groud\\music-library' ]
});

musicLibraryManager.scan();

module.exports = musicLibraryManager;

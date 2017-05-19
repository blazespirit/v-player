// this media-manager coordinate the media files scanning process.

const vuexStore = require('./vuex/vuex-store');
const musicManager = require('./music-library/music-manager');
const movieManager = require('./movie-library/movie-manager');
const eventBus = require('./event-bus');
const { EVENT, EXT_DRIVE_NAME } = require('./config-constant');

const drivelist = require('drivelist');

const init = function() {
  let pathList;
  vuexStore.commit('SHOW_LOADING');

  scanExtDrive();

  eventBus.$on(EVENT.EXT_DRIVE_PATH, function(extDrivePathList) {
    if (extDrivePathList.length > 0) {
      pathList = extDrivePathList;
      vuexStore.commit('UPDATE_LOADING_TEXT', 'Scanning music files...');
      musicManager.scan(vuexStore, pathList);
    }
    else {
      eventBus.$emit(EVENT.NO_EXT_DRIVE_FOUND);
    }
    
  });

  eventBus.$on(EVENT.SCAN_MUSIC_DONE, function() {
    // start scan for movie files.
    vuexStore.commit('UPDATE_LOADING_TEXT', 'Scanning movie files...');
    movieManager.scan(vuexStore, pathList);
  });

  eventBus.$on(EVENT.SCAN_MOVIE_DONE, function() {
    vuexStore.commit('HIDE_LOADING');
  });

  eventBus.$on(EVENT.NO_EXT_DRIVE_FOUND, function() {
    // TODO -- handle for no external drive found.
    vuexStore.commit('UPDATE_LOADING_TEXT', 'No external drive found.');
    vuexStore.commit('SHOW_LOADING');
  });
}

const scanExtDrive = function() {
  let extDrivePathList = [];

  drivelist.list((error, drivesList) => {
    if (error) {
      throw error;
    }
    for (let i = 0; i < drivesList.length; i++) {
      for (let j = 0; j < EXT_DRIVE_NAME.length; j++) {
        if (drivesList[i].description === EXT_DRIVE_NAME[j]) { // match hard-coded drive name.
          let mountPointList = drivesList[i].mountpoints;

          for (let k = 0; k < mountPointList.length; k++) {
            extDrivePathList.push(mountPointList[k].path);
          }
        }
      }
    }
    eventBus.$emit(EVENT.EXT_DRIVE_PATH, extDrivePathList);
  });
}

const mediaManager = {
  // methods
  init: init
};

module.exports = mediaManager;

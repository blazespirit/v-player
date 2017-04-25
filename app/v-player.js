const { BrowserWindow } = require('electron').remote;

const Vue = require('vue');
const Vuex = require('vuex');
const store = require('./app/vuex-store'); // path relative to entry file 'index.html'.
const clock = require('./app/component/clock');
const musicLibrary = require('./app/component/music-library');
const movieLibrary = require('./app/component/movie-library');
const nowPlaying = require('./app/component/now-playing');

let vm = new Vue({
  el: '#v-player',
  store,
  template: `
    <div id="v-player">
      <div id="clock">
        <clock></clock>
      </div>
      <div id="menu-item">
        <music></music>
        <movie></movie>
      </div>
      <now-playing></now-playing>
    </div>
  `,
  data: {
    str1: 'movie library',
    str2: 'music library'
  },
  components: {
    'clock': clock,
    'music': musicLibrary,
    'movie': movieLibrary,
    'now-playing': nowPlaying
  }
});

// ===== remote control server =====
require('./app/remote-control-server').startServer();


// ===== media-library =====
let global_tracks;
const EventEmitter = require('events');
const mediaLibraryEvent = new EventEmitter();
mediaLibraryEvent.on('scanDone', () => {
  mediaLibraryEvent.emit('playTrack');
});

var MediaLibrary = require('media-library');
var library = new MediaLibrary({
  // persistent storage location (optional)
  dataPath: './',
  // the paths to scan
  paths: [ 'C:\\Users\\blaze_spirit\\Desktop\\v-player\\TESTING' ]
});

// Scanning files (only needed at first start and when paths are added)
library.scan()
.on('track', (track) => {
  console.log(`track: ${track.artist} - ${track.title}`);
})
.on('done', () => {
    // listing all tracks
    library.tracks((err, tracks) => {
      console.log(tracks)
      global_tracks = tracks;
      mediaLibraryEvent.emit('scanDone');
    });
});

// ===== howler.js =====
const howler = require('howler');

mediaLibraryEvent.on('playTrack', () => {
  console.log('let sing ~');
  let track = new Howl({
    src: [global_tracks[1].path],
    html5: true
  });

  //track.play();
});


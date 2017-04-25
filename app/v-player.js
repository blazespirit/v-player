const { BrowserWindow } = require('electron').remote;

const Vue = require('vue');
const vuexStore = require('./app/vuex-store'); // path relative to entry file 'index.html'.
const vueRouter = require('./app/vue-router/router');
const clock = require('./app/component/clock');
const home = require('./app/component/home');
const nowPlaying = require('./app/component/now-playing');
const musicLibrary = require('./app/component/music-library');
const movieLibrary = require('./app/component/movie-library');

// register component at 'global' scope.
// eg, popup dialog.
// Vue.component('music', musicLibrary);
// Vue.component('movie', movieLibrary);

let vm = new Vue({
  el: '#v-player',
  store: vuexStore,
  router: vueRouter,
  template: `
    <div id="v-player">
      <div id="clock">
        <clock></clock>
      </div>
      <router-view></router-view>
      <now-playing></now-playing>
    </div>
  `,
  data: {
    str1: 'movie library',
    str2: 'music library'
  },
  components: {
    'clock': clock,
    'home': home,
    'music-library': musicLibrary,
    'movie-library': movieLibrary,
    'now-playing': nowPlaying
  }
});

// ===== remote control server =====
require('./app/remote-control-server').startServer();

// ===== music-library-manager =====
const musicLibraryManager = require('./app/music-library/music-library-manager');

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
  paths: [ 'C:\\Users\\blaze_spirit\\Desktop\\testing-groud\\music-library' ]
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
  let track = new Howl({
    src: [global_tracks[1].path],
    html5: true
  });

  //track.play();
});


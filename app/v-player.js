// TODO -- consider parsing music metadata onload instead of store it to DB.

const { BrowserWindow } = require('electron').remote;

const Vue = require('vue');
const vuexStore = require('./app/vuex/vuex-store'); // path relative to entry file 'index.html'.
const vueRouter = require('./app/vue-router/router');
const loadingOverlay = require('./app/component/loading-overlay');
const viewLabel = require('./app/component/view-label');
const clock = require('./app/component/clock');
const home = require('./app/component/home');
const nowPlaying = require('./app/component/now-playing');
const musicLibrary = require('./app/component/music-library');
const movieLibrary = require('./app/component/movie-library');

const mediaManager = require('./app/media-manager');

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
      <div id="top-panel">
        <view-label></view-label>
        <clock></clock>
      </div>
      <div id="middle-panel">
        <router-view></router-view>
      </div>
      <div id="bottom-panel">
        <now-playing></now-playing>
      </div>
      <loading-overlay></loading-overlay>
    </div>
  `,
  data: {
    str1: 'movie library',
    str2: 'music library'
  },
  components: {
    'loading-overlay': loadingOverlay,
    'view-label': viewLabel,
    'clock': clock,
    'home': home,
    'music-library': musicLibrary,
    'movie-library': movieLibrary,
    'now-playing': nowPlaying
  }
});

// ===== remote control server =====
require('./app/remote-control-server').startServer();

// ===== Initialization =====
mediaManager.init();

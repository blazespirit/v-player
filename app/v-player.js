const { BrowserWindow } = require('electron').remote;

const Vue = require('vue');
const vuexStore = require('./app/vuex-store'); // path relative to entry file 'index.html'.
const vueRouter = require('./app/vue-router/router');
const viewLabel = require('./app/component/view-label');
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
    </div>
  `,
  data: {
    str1: 'movie library',
    str2: 'music library'
  },
  components: {
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

// ===== music-library =====
const musicMananger = require('./app/music-library/music-manager');

musicMananger.init();

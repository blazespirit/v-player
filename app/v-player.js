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

// ===== test filewalker =====
let filewalker = require('filewalker');
let options = {
  maxPending: 20,
  matchRegExp: /\.(?:wav|mp3|wma|flac|ape|aac|m4a|ogg)$/i
}

let fs = require('fs');
let mm = require('musicmetadata');

// filewalker('C:\\Users\\blaze_spirit\\Desktop\\testing-groud\\music-library', options)
//   .on('dir', function(p) {
//     console.log('dir:  %s', p);
//   })
//   .on('file', function(p, s, absolutePath) {
//     console.log('file: %s, %d bytes', absolutePath, s.size);
//     extractMetaData(absolutePath);
//   })
//   .on('error', function(err) {
//     console.error(err);
//   })
//   .on('done', function() {
//     console.log('done');
//     console.log('%d dirs, %d files, %d bytes', this.dirs, this.files, this.bytes);
//   })
// .walk();

// function extractMetaData(filePath) {
//   let readableStream = fs.createReadStream(filePath);
//   let parser = mm(readableStream, function (err, metadata) {
//     if (err) {
//       readableStream.close();
//       throw err;
//     }
//     readableStream.close();
//     console.log(metadata);
//   });
// }

// ===== music-library =====
let tingoDB = require('tingoDB')().Db;
let mediaBD = new tingoDB('./app/mediaDB', {});
var musicCollection = mediaBD.collection("music-collection");

// musicCollection.insert([{a:1, b:'2'}]);
musicCollection.findOne({a:1}, function(err, item) {
  console.log(item);
});

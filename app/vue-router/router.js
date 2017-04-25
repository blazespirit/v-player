const Vue = require('vue');
const VueRouter = require('vue-router');

const home = require('../component/home');
const musicLibrary = require('../component/music-library');
const movieLibrary = require('../component/movie-library');

Vue.use(VueRouter);

const routes = [
  { path: '/home', component: home },
  { path: '/music-library', component: musicLibrary },
  { path: '/movie-library', component: movieLibrary }
];

const router = new VueRouter({
  mode: 'abstract', // 'hash' or 'abstract' mode allow router.push() method to work before any router-link click.
  routes // short for routes: routes
});

// init.
router.replace('home');

module.exports = router;

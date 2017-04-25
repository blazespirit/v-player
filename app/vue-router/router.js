const Vue = require('vue');
const VueRouter = require('vue-router');

const home = require('../component/home');
const trackList = require('../component/track-list');

Vue.use(VueRouter);

const routes = [
  { path: '/', component: home },
  { path: '/track-list', component: trackList }
];

const router = new VueRouter({
  mode: 'history',
  routes // short for routes: routes
});

// init.
router.replace('/');

module.exports = router;

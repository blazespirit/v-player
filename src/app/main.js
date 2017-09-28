import Vue from 'vue';
// import VuexStore from './vuex/store.js';
// import Router from './vue-router/router.js';
import App from './component/app.vue';
import Css from '../style.css';

new Vue({
  el: 'v-player',
//   store: VuexStore,
//   router: Router,
  render: h => h(App)
})
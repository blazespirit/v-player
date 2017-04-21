const Vue = require('vue');
const Vuex = require('vuex');

Vue.use(Vuex);

exports.store = new Vuex.Store({
  state: {
    activeItem: ''
  },
  mutations: {
    CHANGE_ACTIVE: function(state, dummyActive) {
      state.activeItem = dummyActive;
    }
  }
});

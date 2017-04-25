const actionFlow = require('./action-flow');
const gesture = require('./gesture-action');
const menu = require('./menu-item');

const Vue = require('vue');
const Vuex = require('vuex');

Vue.use(Vuex);

const vuexStore = new Vuex.Store({
  state: {
    activeItem: menu.MUSIC
  },
  mutations: {
    CHANGE_ACTIVE: function(state, actionObj) {
      let actionFlowObj = actionObj.actionFlow.get(vuexStore.state.activeItem);
      let gestureFunc = actionFlowObj[actionObj.gesture];

      if (gestureFunc) {
        state.activeItem = gestureFunc();
      }
    }
  }
});

module.exports = vuexStore;

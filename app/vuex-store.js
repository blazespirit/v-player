const Vue = require('vue');
const Vuex = require('vuex');

const LANGUAGE = require('./locale-string').LANGUAGE;
const STR = require('./locale-string').STR;

const actionFlow = require('./action-flow');
const gesture = require('./gesture-action');
const menu = require('./menu-item');

Vue.use(Vuex);

const vuexStore = new Vuex.Store({
  state: {
    language: LANGUAGE.ENGLISH,
    currentView: 'home',
    activeItem: menu.MUSIC
  },
  mutations: {
    CHANGE_ACTIVE: function(state, actionObj) {
      let actionFlowObj = actionObj.actionFlow.get(vuexStore.state.activeItem);
      let gestureFunc = actionFlowObj[actionObj.gesture];

      if (gestureFunc) {
        state.activeItem = gestureFunc();
      }
    },
    toggleLanguage: function(state) { // TODO -- remove this later.
      if (state.language === LANGUAGE.ENGLISH) {
        state.language = LANGUAGE.CHINESE;
      } else {
        state.language = LANGUAGE.ENGLISH;
      }
    }
  },
  getters: {
    getViewLabel: function(state) {
      // viewLabel: STR.VIEW_LABEL.HOME[language],
      if (STR.VIEW_LABEL.MUSIC[state.language]) {
        return STR.VIEW_LABEL.MUSIC[state.language];
      } else {
        return STR.VIEW_LABEL.MUSIC.DEFAULT;
      }
    }
  }
});

module.exports = vuexStore;

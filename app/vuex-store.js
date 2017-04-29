const Vue = require('vue');
const Vuex = require('vuex');

const { LANGUAGE,
        VIEW,
        FOCUS_ITEM,
        STR } = require('./config-constant');

const actionFlow = require('./action-flow');
const gesture = require('./gesture-action');
const menu = require('./menu-item');

Vue.use(Vuex);

const vuexStore = new Vuex.Store({
  state: {
    language: LANGUAGE.ENGLISH,
    currentView: VIEW.HOME,
    focused: FOCUS_ITEM.MUSIC_LIBRARY,

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
      if (STR.VIEW_LABEL[state.currentView][state.language]) {
        return STR.VIEW_LABEL[state.currentView][state.language];
      } else {
        return STR.VIEW_LABEL[state.currentView].DEFAULT;
      }
    }
  }
});

module.exports = vuexStore;

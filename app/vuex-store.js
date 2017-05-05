const Vue = require('vue');
const Vuex = require('vuex');

const { LANGUAGE,
        VIEW,
        FOCUS_ITEM,
        STR,
        MUSIC } = require('./config-constant');

const actionFlow = require('./action-flow');
const gesture = require('./gesture-action');

const musicManager = require('./music-library/music-manager');

Vue.use(Vuex);

const vuexStore = new Vuex.Store({
  state: {
    // application settings
    language: LANGUAGE.ENGLISH,

    // state for GUI
    currentView: VIEW.HOME,
    focused: FOCUS_ITEM.MUSIC_LIBRARY,

    // state for music library.
    musicLibrary: {
      trackList: [],
      trackListCurrentPage: 1,
      trackListTotalPage: null
    }

  },
  mutations: {
    CHANGE_CURRENT_VIEW: function(state, view) {
      state.currentView = view;
    },
    CHANGE_ACTIVE: function(state, actionObj) {
      let actionFlowObj = actionObj.actionFlow.get(vuexStore.state.focused);
      let gestureFunc = actionFlowObj[actionObj.gesture];

      if (gestureFunc) {
        state.focused = gestureFunc();
      }
    },
    GET_TRACK_LIST: function(state) {
      musicManager.getTrack(MUSIC.TRACK_PER_PAGE, state.musicLibrary.trackListCurrentPage, (track) => {
        state.musicLibrary.trackList = track;
      });
    },
    GET_TRACK_LIST_NEXT_PAGE: function(state) {
      state.musicLibrary.trackListCurrentPage++;
      musicManager.getTrack(MUSIC.TRACK_PER_PAGE, state.musicLibrary.trackListCurrentPage, (track) => {
        state.musicLibrary.trackList = track;
      });
    },
    GET_TRACK_LIST_PREVIOUS_PAGE: function(state) {
      state.musicLibrary.trackListCurrentPage--;
      if (state.musicLibrary.trackListCurrentPage < 1) { // prevent page number < 1;
        state.musicLibrary.trackListCurrentPage = 1;
      }
      musicManager.getTrack(MUSIC.TRACK_PER_PAGE, state.musicLibrary.trackListCurrentPage, (track) => {
        state.musicLibrary.trackList = track;
      });
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
    },
    getTrackList: function(state) {
      return state.musicLibrary.trackList;
    }
  }
});

module.exports = vuexStore;

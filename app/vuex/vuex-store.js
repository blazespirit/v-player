const Vue = require('vue');
const Vuex = require('vuex');

const { LANGUAGE,
        VIEW,
        FOCUSABLE_ITEM,
        STR,
        MUSIC } = require('../config-constant');

const actionFlow = require('../action-flow');

const musicManager = require('../music-library/music-manager');

Vue.use(Vuex);

const vuexStore = new Vuex.Store({
  strict: true, // strict mode.
  state: {
    // application settings
    language: LANGUAGE.ENGLISH,

    // state for GUI
    currentView: VIEW.HOME,
    focused: FOCUSABLE_ITEM.MUSIC_LIBRARY,

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
    NAVIGATION_ACTION: function(state, actionObj) {
      let stateObj = actionFlow(state.focused, actionObj.gesture);
      
      if (stateObj.noop) {
        return;
      }
      if (stateObj.focus) {
        state.focused = stateObj.focus;
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

const Vue = require('vue');
const Vuex = require('vuex');

const { LANGUAGE,
        VIEW,
        FOCUSABLE_ITEM,
        STR,
        MUSIC,
        STATUS } = require('../config-constant');

const actionFlow = require('../action-flow');

const musicManager = require('../music-library/music-manager');

Vue.use(Vuex);

const vuexStore = new Vuex.Store({
  strict: true, // strict mode.
  state: {
    // application settings
    language: LANGUAGE.ENGLISH,

    // state for GUI
    view: VIEW.HOME,
    focus: FOCUSABLE_ITEM.PLAY_BUTTON,

    // state for music library.
    musicLibrary: {
      trackList: [],
      trackListCurrentPage: 1,
      trackListTotalPage: null,
      focusIndex: 0 // array based index. (start from 0)
    },

    // state for now-playing component
    nowPlaying: {
      title: '',
      artist: '',
      album: '',
      path: '',
      isPlaying: true,
      fetchStatus: '',
      index: 0
    }
  },
  mutations: {
    CHANGE_CURRENT_VIEW: function(state, view) {
      state.view = view;
    },
    NAVIGATION_ACTION: function(state, actionObj) {
      let stateObj = actionFlow.getStateObj(state.focus, actionObj.gesture);
      
      if (stateObj.noop) {
        return;
      }
      if (stateObj.view) {
        state.view = stateObj.view;
      }
      if (stateObj.focus) {
        state.focus = stateObj.focus;
      }
      if (stateObj.focusIndex) {
        state.focusIndex = stateObj.focusIndex;
      }
      if (stateObj.focusIndexPlus && typeof stateObj.focusIndexPlus === 'number') {
        // prevent index > track number per page.
        if (state.musicLibrary.focusIndex + stateObj.focusIndexPlus > state.musicLibrary.trackList.length - 1) {
          state.musicLibrary.focusIndex = state.musicLibrary.trackList.length - 1;
        }
        else {
          state.musicLibrary.focusIndex += stateObj.focusIndexPlus;
        }
      }
      if (stateObj.focusIndexMinus && typeof stateObj.focusIndexMinus === 'number') {
        // prevent index < 1.
        if (state.musicLibrary.focusIndex - stateObj.focusIndexMinus < 0) {
          state.musicLibrary.focusIndex = 0;
        }
        else {
          state.musicLibrary.focusIndex -= stateObj.focusIndexMinus
        }
      }
      if (stateObj.togglePlayPause) {
        _togglePlayPause(state);
      }
      if (stateObj.upFromNowPlaying) {
        if (state.view === VIEW.HOME) {
          state.focus = FOCUSABLE_ITEM.MUSIC_LIBRARY;
        }
        else if (state.view === VIEW.MUSIC) {
          state.focus = FOCUSABLE_ITEM.TRACK_LIST;
        }
      }
      if (stateObj.previousTrack) {

      }
    },
    // this function is used by 'GET_TRACK_LIST', 'GET_TRACK_LIST_NEXT_PAGE', & 'GET_TRACK_LIST_PREVIOUS_PAGE'
    // to update the state of tracklist after fetch from DB.
    UPDATE_TRACK_LIST: function(state, trackObj) {
      state.musicLibrary.trackList = trackObj.trackList;
    },
    GET_TRACK_LIST: function(state) {
      musicManager.getTrackList(MUSIC.TRACK_PER_PAGE, state.musicLibrary.trackListCurrentPage, vuexStore);
    },
    GET_TRACK_LIST_NEXT_PAGE: function(state) { // TODO -- last page limit handling.
      state.musicLibrary.trackListCurrentPage++;
      musicManager.getTrackList(MUSIC.TRACK_PER_PAGE, state.musicLibrary.trackListCurrentPage, vuexStore);
    },
    GET_TRACK_LIST_PREVIOUS_PAGE: function(state) {
      state.musicLibrary.trackListCurrentPage--;
      if (state.musicLibrary.trackListCurrentPage < 1) { // prevent page number < 1;
        state.musicLibrary.trackListCurrentPage = 1;
      }
      musicManager.getTrackList(MUSIC.TRACK_PER_PAGE, state.musicLibrary.trackListCurrentPage, vuexStore);
    },
    // ========== now-playing ==========
    UPDATE_TRACK: function(state, trackObj) {
      state.nowPlaying.title = trackObj.title;
      state.nowPlaying.artist = trackObj.artist[0];
      state.nowPlaying.album = trackObj.album;
      state.nowPlaying.path = trackObj.path;

      state.nowPlaying.fetchStatus = STATUS.FETCH_COMPLETE;
    },
    UPDATE_INDEX: function(state, index) {
      state.nowPlaying.index = index;
    },
    GET_SINGLE_TRACK: function(state) {
      state.nowPlaying.fetchStatus = STATUS.FETCHING;
      musicManager.getSingleTrack(state.nowPlaying.index, vuexStore);
    },
    INCREASE_INDEX: function(state) {
      state.nowPlaying.index++;
    },
    DECREASE_INDEX: function(state) {
      if (state.nowPlaying.index - 1 < 0) {
        state.nowPlaying.index = 0;
      }
      else {
        state.nowPlaying.index--;
      } 
    },
    TOGGLE_PLAY_PAUSE: function(state) {
      _togglePlayPause(state);
    },
    NEXT_TRACK: function(state) {
      // state.nowPlaying.index++;
    },
    PREVIOUS_TRACK: function(state) {

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
      if (STR.VIEW_LABEL[state.view][state.language]) {
        return STR.VIEW_LABEL[state.view][state.language];
      } else {
        return STR.VIEW_LABEL[state.view].DEFAULT;
      }
    },
    getFocusIndex: function(state) {
      let index = state.musicLibrary.focusIndex;

      return index;
    },
    getTrackList: function(state) {
      return state.musicLibrary.trackList;
    },
    // ========== now-playing getter ==========
    getPath:function(state) {
      return state.nowPlaying.path;
    },
    getTitle:function(state) {
      return state.nowPlaying.title;
    },
    getArtist:function(state) {
      return state.nowPlaying.artist;
    },
    getAlbum:function(state) {
      return state.nowPlaying.album;
    },
    isPlaying: function(state) {
      return state.nowPlaying.isPlaying;
    },
    getFetchStatus: function(state) {
      return state.nowPlaying.fetchStatus;
    }
  }
});

// private functions.
function _togglePlayPause(state) {
  if (state.nowPlaying.isPlaying === true) {
        state.nowPlaying.isPlaying = false;
  }
  else {
    state.nowPlaying.isPlaying = true;
  }
};

module.exports = vuexStore;

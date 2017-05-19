// TODO -- consider using 'action' for async mutations.

const Vue = require('vue');
const Vuex = require('vuex');

const { LANGUAGE,
        VIEW,
        FOCUSABLE_ITEM,
        STR,
        MUSIC,
        MOVIE,
        STATUS } = require('../config-constant');

const actionFlow = require('../action-flow');

const musicManager = require('../music-library/music-manager');
const movieManager = require('../movie-library/movie-manager');

Vue.use(Vuex);

const vuexStore = new Vuex.Store({
  strict: true, // strict mode.
  state: {
    // application settings
    language: LANGUAGE.CHINESE,

    // state for GUI
    view: VIEW.HOME,
    focus: FOCUSABLE_ITEM.MUSIC_LIBRARY,

    // state for music library.
    musicLibrary: {
      trackList: [],
      trackListCurrentPage: 1,
      trackListTotalPage: null,
      focusIndex: 0 // array based index. (start from 0)
    },

    // state for movie library.
    movieLibrary: {
      movieList: [],
      movieListCurrentPage: 1,
      movieListTotalPage: null,
      focusIndex: 0, // array based index. (start from 0)
      status: null
    },

    // state for now-playing component
    nowPlaying: {
      title: '',
      artist: '',
      album: '',
      path: '',
      isPlaying: false,
      fetchStatus: '',
      index: 0,
      albumArtBase64: ''
    },

    // state for loading-overlay component
    loadingOverlay: {
      isShow: false,
      loadingText: 'Loading...'
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
      // ===== track list navigation =====
      if (stateObj.musicFocusIndex) {
        state.musicLibrary.focusIndex = stateObj.musicFocusIndex;
      }
      if (stateObj.musicFocusIndexPlus && typeof stateObj.musicFocusIndexPlus === 'number') {
        // prevent index > track list length.
        // if index > track list length, go to now-playing 'play' button.
        if (state.musicLibrary.focusIndex + stateObj.musicFocusIndexPlus > state.musicLibrary.trackList.length - 1) {
          state.musicLibrary.focusIndex = state.musicLibrary.trackList.length - 1;

          state.focus = FOCUSABLE_ITEM.PLAY_BUTTON
        }
        else {
          state.musicLibrary.focusIndex += stateObj.musicFocusIndexPlus;
        }
      }
      if (stateObj.musicFocusIndexMinus && typeof stateObj.musicFocusIndexMinus === 'number') {
        // prevent index < 1.
        if (state.musicLibrary.focusIndex - stateObj.musicFocusIndexMinus < 0) {
          state.musicLibrary.focusIndex = 0;
        }
        else {
          state.musicLibrary.focusIndex -= stateObj.musicFocusIndexMinus
        }
      }
      if (stateObj.trackListPreviousPage) {
        _trackListPreviousPage(state);
      }
      if (stateObj.trackListNextPage) {
        _trackListNextPage(state);
      }
      if (stateObj.playSelectedTrack) {
        let offset = (state.musicLibrary.trackListCurrentPage - 1) * MUSIC.TRACK_PER_PAGE;
        let index = state.musicLibrary.focusIndex;

        state.nowPlaying.index = offset + index;
        _getTrackAndPlay(state);
      }
      // ===== movie list navigation =====
      if (stateObj.movieFocusIndex) {
        state.moviecLibrary.focusIndex = stateObj.movieFocusIndex;
      }
      if (stateObj.movieFocusIndexPlus && typeof stateObj.movieFocusIndexPlus === 'number') {
        // prevent index > movie list length.
        // if index > movie list length, go to now-playing 'play' button.
        if (state.movieLibrary.focusIndex + stateObj.movieFocusIndexPlus > state.movieLibrary.movieList.length - 1) {
          state.movieLibrary.focusIndex = state.movieLibrary.movieList.length - 1;

          state.focus = FOCUSABLE_ITEM.PLAY_BUTTON
        }
        else {
          state.movieLibrary.focusIndex += stateObj.movieFocusIndexPlus;
        }
      }
      if (stateObj.movieFocusIndexMinus && typeof stateObj.movieFocusIndexMinus === 'number') {
        // prevent index < 1.
        if (state.movieLibrary.focusIndex - stateObj.movieFocusIndexMinus < 0) {
          state.movieLibrary.focusIndex = 0;
        }
        else {
          state.movieLibrary.focusIndex -= stateObj.movieFocusIndexMinus
        }
      }
      if (stateObj.movieListPreviousPage) {
        _movieListPreviousPage(state);
      }
      if (stateObj.movieListNextPage) {
        _movieListNextPage(state);
      }
      if (stateObj.playSelectedMovie) {
        state.focus = FOCUSABLE_ITEM.OMX_PLAYER;
        state.movieLibrary.status = MOVIE.STATUS_PLAY;
      }
      // ===== omxPlayer navigation =====
      if (stateObj.toggleMoviePlayPause) {
        if (state.movieLibrary.status === MOVIE.STATUS_PLAY) {
          state.movieLibrary.status = MOVIE.STATUS_PAUSE;
        }
        else if (state.movieLibrary.status === MOVIE.STATUS_PAUSE) {
          state.movieLibrary.status = MOVIE.STATUS_PLAY;
        }
      }
      if (stateObj.stopMovie) {
        state.focus = FOCUSABLE_ITEM.MOVIE_LIST;
        state.movieLibrary.status = MOVIE.STATUS_STOP;
      }
      // ===== now-playing navigation =====
      if (stateObj.toggleMusicPlayPause) {
        _toggleMusicPlayPause(state);
      }
      if (stateObj.upFromNowPlaying) {
        if (state.view === VIEW.HOME) {
          state.focus = FOCUSABLE_ITEM.MUSIC_LIBRARY;
        }
        else if (state.view === VIEW.MUSIC) {
          state.focus = FOCUSABLE_ITEM.TRACK_LIST;
        }
        else if (state.view === VIEW.MOVIE) {
          state.focus = FOCUSABLE_ITEM.MOVIE_LIST;
        }
      }
      if (stateObj.previousTrack) {
        _previousTrack(state);
      }
      if (stateObj.nextTrack) {
        _nextTrack(state);
      }
    },
    // ========== music-library ==========
    // this function is used by 'GET_TRACK_LIST', 'GET_TRACK_LIST_NEXT_PAGE', & 'GET_TRACK_LIST_PREVIOUS_PAGE'
    // to update the state of tracklist after fetch from DB.
    UPDATE_TRACK_LIST: function(state, trackObj) {
      state.musicLibrary.trackList = trackObj.trackList;

      // if returned track list < focus index, update focus index.
      if (state.musicLibrary.focusIndex > trackObj.trackList.length - 1) {
        state.musicLibrary.focusIndex = trackObj.trackList.length - 1;
      }
    },
    GET_TRACK_LIST: function(state) {
      musicManager.getTrackList(MUSIC.TRACK_PER_PAGE, state.musicLibrary.trackListCurrentPage, vuexStore);
    },
    UPDATE_MUSIC_PAGINATION: function(state, totalPage) {
      state.musicLibrary.trackListTotalPage = totalPage;
    },
    INIT_MUSIC_LIBRARY: function(state) {
      musicManager.getTrackList(MUSIC.TRACK_PER_PAGE, state.musicLibrary.trackListCurrentPage, vuexStore);
      musicManager.updatePagination(vuexStore);
    },
    GET_TRACK_LIST_NEXT_PAGE: function(state) {
      _trackListNextPage(state);
    },
    GET_TRACK_LIST_PREVIOUS_PAGE: function(state) {
      _trackListPreviousPage(state);
    },
    // ========== movie-library ==========
    UPDATE_MOVIE_LIST: function(state, movieObj) {
      state.movieLibrary.movieList = movieObj.movieList;

      // if returned movie list < focus index, update focus index.
      if (state.movieLibrary.focusIndex > movieObj.movieList.length - 1) {
        state.movieLibrary.focusIndex = movieObj.movieList.length - 1;
      }
    },
    GET_MOVIE_LIST: function(state) {
      movieManager.getMovieList(MOVIE.MOVIE_PER_PAGE, state.movieLibrary.movieListCurrentPage, vuexStore);
    },
    UPDATE_MOVIE_PAGINATION: function(state, totalPage) {
      state.movieLibrary.movieListTotalPage = totalPage;
    },
    INIT_MOVIE_LIBRARY: function(state) {
      movieManager.getMovieList(MOVIE.MOVIE_PER_PAGE, state.movieLibrary.movieListCurrentPage, vuexStore);
      movieManager.updatePagination(vuexStore);
    },
    GET_MOVIE_LIST_NEXT_PAGE: function(state) {
      _movieListNextPage(state);
    },
    GET_MOVIE_LIST_PREVIOUS_PAGE: function(state) {
      _movieListPreviousPage(state);
    },
    UPDATE_MOVIE_STATUS: function (state, status) {
      state.movieLibrary.status = status;
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
    UPDATE_IS_PLAYING: function(state, isPlaying) {
      state.nowPlaying.isPlaying = isPlaying;
    },
    UPDATE_ALBUM_ART: function(state, albumArtBase64) {
      state.nowPlaying.albumArtBase64 = albumArtBase64;
    },
    GET_SINGLE_TRACK: function(state) {
      _getTrack(state);
    },
    PLAY_SELECTED_TRACK: function(state) {
      let offset = state.musicLibrary.trackListCurrentPage - 1;
      let index = state.musicLibrary.focusIndex;

      state.nowPlaying.index = offset + index;
      _getTrackAndPlay(state);

    },
    TOGGLE_MUSIC_PLAY_PAUSE: function(state) {
      _toggleMusicPlayPause(state);
    },
    NEXT_TRACK: function(state) {
      _nextTrack(state);
    },
    PREVIOUS_TRACK: function(state) {
      _previousTrack(state);
    },
    // ========== loading-overlay ==========
    SHOW_LOADING: function(state){
      state.loadingOverlay.isShow = true;
    },
    HIDE_LOADING: function(state){
      state.loadingOverlay.isShow = false;
    },
    UPDATE_LOADING_TEXT: function(state, text) {
      state.loadingOverlay.loadingText = text;
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
    getLanguage: function(state) {
      return state.language;
    },
    getViewLabel: function(state) {
      if (STR.VIEW_LABEL[state.view][state.language]) {
        return STR.VIEW_LABEL[state.view][state.language];
      } else {
        return STR.VIEW_LABEL[state.view].DEFAULT;
      }
    },
    getFocus: function(state) {
      return state.focus;
    },
    getView: function(state) {
      return state.view;
    },
    // ========== music-library getter ==========
    getMusicFocusIndex: function(state) {
      let index = state.musicLibrary.focusIndex;

      return index;
    },
    getTrackList: function(state) {
      return state.musicLibrary.trackList;
    },
    getTrackListCurrentPage: function(state) {
      return state.musicLibrary.trackListCurrentPage;
    },
    getTrackListTotalPage: function(state) {
      return state.musicLibrary.trackListTotalPage;
    },
    // ========== movie-library getter ==========
    getMovieFocusIndex: function(state) {
      let index = state.movieLibrary.focusIndex;

      return index;
    },
    getMovieList: function(state) {
      return state.movieLibrary.movieList;
    },
    getMovieListCurrentPage: function(state) {
      return state.movieLibrary.movieListCurrentPage;
    },
    getMovieListTotalPage: function(state) {
      return state.movieLibrary.movieListTotalPage;
    },
    getMovieStatus: function(state) {
      return state.movieLibrary.status;
    },
    getMovieFilePath: function(state) {
      let movieList = state.movieLibrary.movieList;
      let index = state.movieLibrary.focusIndex;
      let path = movieList[index].path;
      
      return path;
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
    getAlbumArtBase64:function(state) {
      return state.nowPlaying.albumArtBase64;
    },
    isMusicPlaying: function(state) {
      return state.nowPlaying.isPlaying;
    },
    getFetchStatus: function(state) {
      return state.nowPlaying.fetchStatus;
    },
    // ========== loading-overlay getter ==========
    getIsShow: function(state) {
      return state.loadingOverlay.isShow;
    },
    getLoadingText: function(state) {
      return state.loadingOverlay.loadingText;
    },
  }
});

// ========== private functions ==========
function _getTrack(state) {
  state.nowPlaying.fetchStatus = STATUS.FETCHING;
  musicManager.getSingleTrack(state.nowPlaying.index, vuexStore);
}

function _getTrackAndPlay(state) {
  state.nowPlaying.fetchStatus = STATUS.FETCHING;
  musicManager.getSingleTrackAndPlay(state.nowPlaying.index, vuexStore);
}

function _toggleMusicPlayPause(state) {
  if (state.nowPlaying.isPlaying === true) {
    state.nowPlaying.isPlaying = false;
  }
  else {
    state.nowPlaying.isPlaying = true;
  }
};

function _nextTrack(state) {
  state.nowPlaying.index++;
  _getTrack(state);
}

function _previousTrack(state) {
  if (state.nowPlaying.index - 1 < 0) {
    state.nowPlaying.index = 0;
  }
  else {
    state.nowPlaying.index--;
  }
  _getTrack(state);
}

function _trackListNextPage(state) {
  state.musicLibrary.trackListCurrentPage++;
  if (typeof state.musicLibrary.trackListTotalPage === 'number' &&
      state.musicLibrary.trackListCurrentPage > state.musicLibrary.trackListTotalPage) {
        state.musicLibrary.trackListCurrentPage = state.musicLibrary.trackListTotalPage;
  }
  musicManager.getTrackList(MUSIC.TRACK_PER_PAGE, state.musicLibrary.trackListCurrentPage, vuexStore);
}

function _trackListPreviousPage(state) {
  state.musicLibrary.trackListCurrentPage--;
  if (state.musicLibrary.trackListCurrentPage < 1) { // prevent page number < 1;
    state.musicLibrary.trackListCurrentPage = 1;
  }
  musicManager.getTrackList(MUSIC.TRACK_PER_PAGE, state.musicLibrary.trackListCurrentPage, vuexStore);
}

function _movieListNextPage(state) {
  state.movieLibrary.movieListCurrentPage++;
  if (typeof state.movieLibrary.movieListTotalPage === 'number' &&
      state.movieLibrary.movieListCurrentPage > state.movieLibrary.movieListTotalPage) {
        state.movieLibrary.movieListCurrentPage = state.movieLibrary.movieListTotalPage;
  }
  movieManager.getMovieList(MOVIE.MOVIE_PER_PAGE, state.movieLibrary.movieListCurrentPage, vuexStore);
}

function _movieListPreviousPage(state) {
  state.movieLibrary.movieListCurrentPage--;
  if (state.movieLibrary.movieListCurrentPage < 1) { // prevent page number < 1;
    state.movieLibrary.movieListCurrentPage = 1;
  }
  movieManager.getMovieList(MOVIE.MOVIE_PER_PAGE, state.movieLibrary.movieListCurrentPage, vuexStore);
}

module.exports = vuexStore;

const LANGUAGE = {
  ENGLISH: 'eng',
  CHINESE: 'chi'
};

const VIEW = {
  HOME : 'home',
  MUSIC: 'music',
  MOVIE: 'movie'
}

const FOCUS_ITEM = {
  MUSIC_LIBRARY: 'musicLibrary',
  MOVIE_LIBRARY: 'movieLibrary',
  PLAY_BUTTON: 'playButton',
  PREVIOUS_BUTTON: 'previousButton',
  NEXT_BUTTON: 'nextButton'
}

const GESTURE = {
  SWIPE_LEFT: 'swipeLeft',
  SWIPE_RIGHT: 'swipeRight',
  SWIPE_TOP: 'swipeTop',
  SWIPE_DOWN: 'swipeDown'
}

const STR = {
  VIEW_LABEL: {
    [VIEW.HOME]: {
      DEFAULT: 'Home',
      [LANGUAGE.ENGLISH]: 'Home',
      [LANGUAGE.CHINESE]: '主页'
    },
    [VIEW.MUSIC]: {
      DEFAULT: 'Music',
      [LANGUAGE.ENGLISH]: 'Music',
      [LANGUAGE.CHINESE]: '音乐'
    },
    [VIEW.MOVIE]: {
      DEFAULT: 'Movie',
      [LANGUAGE.ENGLISH]: 'Movie',
      [LANGUAGE.CHINESE]: '影片'
    },
  }
};

module.exports = {
  LANGUAGE: LANGUAGE,
  VIEW: VIEW,
  FOCUS_ITEM: FOCUS_ITEM,
  GESTURE: GESTURE,
  
  STR: STR
}

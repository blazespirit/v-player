const LANGUAGE = {
  ENGLISH: 'eng',
  CHINESE: 'chi'
};

const VIEW = {
  HOME : 'home',
  MUSIC: 'music',
  MOVIE: 'movie'
}

const FOCUSABLE_ITEM = {
  MUSIC_LIBRARY: 'musicLibrary',
  MOVIE_LIBRARY: 'movieLibrary',
  PLAY_BUTTON: 'playButton',
  PREVIOUS_BUTTON: 'previousButton',
  NEXT_BUTTON: 'nextButton'
}

const GESTURE = {
  SWIPE_LEFT : 'swipeLeft',
  SWIPE_RIGHT: 'swipeRight',
  SWIPE_UP   : 'swipeUp',
  SWIPE_DOWN : 'swipeDown',
  TAP        : 'tap',
  PRESS      : 'press'
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

const MUSIC = {
  TRACK_PER_PAGE: 10
}

module.exports = {
  LANGUAGE: LANGUAGE,
  VIEW: VIEW,
  FOCUSABLE_ITEM: FOCUSABLE_ITEM,
  GESTURE: GESTURE,

  MUSIC: MUSIC,
  
  STR: STR
}

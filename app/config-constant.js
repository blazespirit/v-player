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
  // home page
  MUSIC_LIBRARY: 'musicLibrary',
  MOVIE_LIBRARY: 'movieLibrary',

  // now playing panel
  PLAY_BUTTON: 'playButton',
  PREVIOUS_BUTTON: 'previousButton',
  NEXT_BUTTON: 'nextButton',

  // music library
  TRACK_LIST: 'trackList',

  // movie library
  MOVIE_LIST: 'movieList',

  // OMX
  OMX_PLAYER: 'omxPlayer'
}

const GESTURE = {
  SWIPE_LEFT : 'swipeLeft',
  SWIPE_RIGHT: 'swipeRight',
  SWIPE_UP   : 'swipeUp',
  SWIPE_DOWN : 'swipeDown',
  TAP        : 'tap',
  PRESS      : 'press',
  PINCH      : 'pinch'
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

const MOVIE = {
  MOVIE_PER_PAGE: 10,
  STATUS_PLAY: 'play',
  STATUS_PAUSE: 'pause',
  STATUS_STOP: 'stop',
  GENRE: {
    ACTION   : 'action',
    ANIMATION: 'animation',
    COMEDY   : 'comedy',
    CRIME    : 'crime',
    DRAMA    : 'drama',
    HORROR   : 'horror',
    MYSTERY  : 'mystery',
    ROMANCE  : 'romance',
    SCI_FI   : 'sciFi',
    UNKNOWN  : 'unknown'
  }
}

const STATUS = {
  FETCHING: 'fetching',
  FETCH_COMPLETE: 'fetchComplete'
}

const DATABASE = {
  TYPE: {
    TRACK    : 'track',
    ALBUM    : 'album',
    ALBUM_ART: 'albumArt'
  }
}

const REMOTE_CTRL_SERVER = {
  IP_ADDRESS: '192.168.1.25',
  PORT: 3000,
  IPV4_STR: 'IPv4',
  WLAN_NAME: 'wlan0'
}

const EVENT = {
  INIT: 'init',
  SCAN_MUSIC_DONE: 'scanMusicDone',
  SCAN_MOVIE_DONE: 'scanMovieDone',
  EXT_DRIVE_PATH: 'extDrivePath',
  NO_EXT_DRIVE_FOUND: 'noExtDriveFound'
}

const OMX = {
  OPTION: {
    '-b': true,             // Set background to black
    '-o': 'hdmi',           // Audio output device.
    '--no-ghost-box': true  // No semitransparent boxes behind subtitles
  }
}

// ===== external drive names (hard-coded) =====
const EXT_DRIVE_NAME = ['Fujitsu HDD USB Device'];

module.exports = {
  LANGUAGE: LANGUAGE,
  VIEW: VIEW,
  FOCUSABLE_ITEM: FOCUSABLE_ITEM,
  GESTURE: GESTURE,

  MUSIC: MUSIC,
  MOVIE: MOVIE,
  STATUS: STATUS,
  DATABASE: DATABASE,

  STR: STR,

  REMOTE_CTRL_SERVER: REMOTE_CTRL_SERVER,
  EVENT: EVENT,
  OMX: OMX,

  EXT_DRIVE_NAME: EXT_DRIVE_NAME

}

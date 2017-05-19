const { GESTURE,
        VIEW,
        FOCUSABLE_ITEM } = require('./config-constant');


const stateActionMap = new Map();

// action map for music library icon at home page.
const musicActionMap = new Map([
  // key & value pair array.
  [ GESTURE.SWIPE_LEFT,  { noop: true } ], // no operation.
  [ GESTURE.SWIPE_RIGHT, { focus: FOCUSABLE_ITEM.MOVIE_LIBRARY }],
  [ GESTURE.SWIPE_UP,    { noop: true } ],
  [ GESTURE.SWIPE_DOWN,  { focus: FOCUSABLE_ITEM.PLAY_BUTTON } ],
  [ GESTURE.TAP,         { view: VIEW.MUSIC, 
                           focus: FOCUSABLE_ITEM.TRACK_LIST,
                           musicFocusIndex: 0 } ],
  [ GESTURE.PRESS,       { noop: true } ],
  [ GESTURE.PINCH,       { noop: true } ]
]);

// action map for track list in music-library
const trackListActionMap = new Map([
  // key & value pair array.
  [ GESTURE.SWIPE_LEFT,  { trackListPreviousPage: true } ], // no operation.
  [ GESTURE.SWIPE_RIGHT, { trackListNextPage: true } ],
  [ GESTURE.SWIPE_UP,    { musicFocusIndexMinus: 1 } ],
  [ GESTURE.SWIPE_DOWN,  { musicFocusIndexPlus: 1 } ],
  [ GESTURE.TAP,         { playSelectedTrack: true } ],
  [ GESTURE.PRESS,       { noop: true } ],
  [ GESTURE.PINCH,       { view: VIEW.HOME, 
                           focus: FOCUSABLE_ITEM.MUSIC_LIBRARY } ]
]);

// action map for movie library icon at home page.
const movieActionMap = new Map([
  // key & value pair array.
  [ GESTURE.SWIPE_LEFT,  { focus: FOCUSABLE_ITEM.MUSIC_LIBRARY } ],
  [ GESTURE.SWIPE_RIGHT, { noop: true } ], // no operation.
  [ GESTURE.SWIPE_UP,    { noop: true } ],
  [ GESTURE.SWIPE_DOWN,  { focus: FOCUSABLE_ITEM.PLAY_BUTTON } ],
  [ GESTURE.TAP,         { view: VIEW.MOVIE,
                           focus: FOCUSABLE_ITEM.MOVIE_LIST,
                           movieFocusIndex: 0 } ],
  [ GESTURE.PRESS,       { noop: true } ],
  [ GESTURE.PINCH,       { noop: true } ]
]);

// action map for movie list in movie-library
const movieListActionMap = new Map([
  // key & value pair array.
  [ GESTURE.SWIPE_LEFT,  { movieListPreviousPage: true } ], // no operation.
  [ GESTURE.SWIPE_RIGHT, { movieListNextPage: true } ],
  [ GESTURE.SWIPE_UP,    { movieFocusIndexMinus: 1 } ],
  [ GESTURE.SWIPE_DOWN,  { movieFocusIndexPlus: 1 } ],
  [ GESTURE.TAP,         { playSelectedMovie: true } ],
  [ GESTURE.PRESS,       { noop: true } ],
  [ GESTURE.PINCH,       { view: VIEW.HOME, 
                           focus: FOCUSABLE_ITEM.MOVIE_LIBRARY } ]
]);

// action map for omxPlayer.
const omxPlayerActionMap = new Map([
  // key & value pair array.
  [ GESTURE.SWIPE_LEFT,  { noop: true } ], // no operation.
  [ GESTURE.SWIPE_RIGHT, { noop: true } ],
  [ GESTURE.SWIPE_UP,    { noop: true } ],
  [ GESTURE.SWIPE_DOWN,  { noop: true } ],
  [ GESTURE.TAP,         { toggleMoviePlayPause: true } ],
  [ GESTURE.PRESS,       { noop: true } ],
  [ GESTURE.PINCH,       { stopMovie: true } ]
]);

// action map for play button in now-playing.
const playButtonActionMap = new Map([
  // key & value pair array.
  [ GESTURE.SWIPE_LEFT,  { focus: FOCUSABLE_ITEM.PREVIOUS_BUTTON } ],
  [ GESTURE.SWIPE_RIGHT, { focus: FOCUSABLE_ITEM.NEXT_BUTTON } ],
  [ GESTURE.SWIPE_UP,    { upFromNowPlaying: true } ],
  [ GESTURE.SWIPE_DOWN,  { noop: true } ],
  [ GESTURE.TAP,         { toggleMusicPlayPause: true } ],
  [ GESTURE.PRESS,       { noop: true } ],
  [ GESTURE.PINCH,       { noop: true } ]
]);

// action map for previous button in now-playing.
const previousButtonActionMap = new Map([
  // key & value pair array.
  [ GESTURE.SWIPE_LEFT,  { noop: true } ],
  [ GESTURE.SWIPE_RIGHT, { focus: FOCUSABLE_ITEM.PLAY_BUTTON } ],
  [ GESTURE.SWIPE_UP,    { upFromNowPlaying: true } ],
  [ GESTURE.SWIPE_DOWN,  { noop: true } ],
  [ GESTURE.TAP,         { previousTrack: true } ],
  [ GESTURE.PRESS,       { noop: true } ],
  [ GESTURE.PINCH,       { noop: true } ]
]);

// action map for previous button in now-playing.
const nextButtonActionMap = new Map([
  // key & value pair array.
  [ GESTURE.SWIPE_LEFT,  { focus: FOCUSABLE_ITEM.PLAY_BUTTON } ],
  [ GESTURE.SWIPE_RIGHT, { noop: true } ],
  [ GESTURE.SWIPE_UP,    { upFromNowPlaying: true } ],
  [ GESTURE.SWIPE_DOWN,  { noop: true } ],
  [ GESTURE.TAP,         { nextTrack: true } ],
  [ GESTURE.PRESS,       { noop: true } ],
  [ GESTURE.PINCH,       { noop: true } ]
]);

// action flow at home page.
stateActionMap.set(FOCUSABLE_ITEM.MUSIC_LIBRARY, musicActionMap);
stateActionMap.set(FOCUSABLE_ITEM.MOVIE_LIBRARY, movieActionMap);

// action flow at music-library page.
stateActionMap.set(FOCUSABLE_ITEM.TRACK_LIST, trackListActionMap);

// action flow at movie-library page.
stateActionMap.set(FOCUSABLE_ITEM.MOVIE_LIST, movieListActionMap);

// action flow at omxPlayer
stateActionMap.set(FOCUSABLE_ITEM.OMX_PLAYER, omxPlayerActionMap);

// action flow for now-playing.
stateActionMap.set(FOCUSABLE_ITEM.PLAY_BUTTON, playButtonActionMap);
stateActionMap.set(FOCUSABLE_ITEM.PREVIOUS_BUTTON, previousButtonActionMap);
stateActionMap.set(FOCUSABLE_ITEM.NEXT_BUTTON, nextButtonActionMap);

const getStateObj = function(currentFocusItem, gesture) {
  let actionMap = stateActionMap.get(currentFocusItem);
  let stateObj;

  if (actionMap) {
    stateObj = actionMap.get(gesture);
  }

  if (stateObj) {
    return stateObj;
  } else {
    return { noop: true };
  }
}

module.exports = {
  getStateObj: getStateObj
}

const { GESTURE,
        FOCUSABLE_ITEM } = require('./config-constant');


const stateActionMap = new Map();

// action map for music library icon at home page.
const musicActionMap = new Map([
  // key & value pair array.
  [ GESTURE.SWIPE_LEFT,  { noop: true } ], // no operation.
  [ GESTURE.SWIPE_RIGHT, { focus: FOCUSABLE_ITEM.MOVIE_LIBRARY } ],
  [ GESTURE.SWIPE_UP,    { noop: true } ],
  [ GESTURE.SWIPE_DOWN,  { noop: true } ],
  [ GESTURE.TAP,         { noop: true } ],
  [ GESTURE.PRESS,       { noop: true } ]
]);

// action map for movie library icon at home page.
const movieActionMap = new Map([
  // key & value pair array.
  [ GESTURE.SWIPE_LEFT,  { focus: FOCUSABLE_ITEM.MUSIC_LIBRARY } ],
  [ GESTURE.SWIPE_RIGHT, { noop: true } ], // no operation.
  [ GESTURE.SWIPE_UP,    { noop: true } ],
  [ GESTURE.SWIPE_DOWN,  { noop: true } ],
  [ GESTURE.TAP,         { noop: true } ],
  [ GESTURE.PRESS,       { noop: true } ]
]);

// action flow at home page.
stateActionMap.set(FOCUSABLE_ITEM.MUSIC_LIBRARY, musicActionMap);
stateActionMap.set(FOCUSABLE_ITEM.MOVIE_LIBRARY, movieActionMap);

// action flow at music-library page.

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

module.exports = getStateObj;

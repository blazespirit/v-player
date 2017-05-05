const CONFIG = require('./config-constant');
const gesture = require('./gesture-action');

const actionFlow = new Map();

// TODO -- consider refactor to more readable code.
// action flow at home page.
actionFlow.set(CONFIG.FOCUS_ITEM.MUSIC_LIBRARY, {
  [gesture.SWIPE_RIGHT]: function() {
    return CONFIG.FOCUS_ITEM.MOVIE_LIBRARY;
  }
});

actionFlow.set(CONFIG.FOCUS_ITEM.MOVIE_LIBRARY, {
  [gesture.SWIPE_LEFT]: function() {
    return CONFIG.FOCUS_ITEM.MUSIC_LIBRARY;
  }
});

// action flow at music-library page.


module.exports = actionFlow;

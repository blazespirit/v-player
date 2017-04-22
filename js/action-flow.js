const menu = require('./menu-item');
const gesture = require('./gesture-action');

const actionFlow = new Map();

// TODO -- consider refactor to more readable code.
actionFlow.set(menu.MUSIC, {
  [gesture.SWIPE_RIGHT]: function() {
    return menu.MOVIE;
  }
});

actionFlow.set(menu.MOVIE, {
  [gesture.SWIPE_LEFT]: function() {
    return menu.MUSIC;
  }
});

module.exports = actionFlow;
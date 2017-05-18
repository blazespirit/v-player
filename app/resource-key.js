// Contain all the app resource-key with different locale.
const { LANGUAGE } = require('./config-constant');

const RSC_KEY_LIST = {
  PAGE: 'page',
  TRACK_LIST: 'trackList',
  MOVIE_LIST: 'movieList'
}

// English resource keys.
const RSC_KEY_ENG = new Map();
RSC_KEY_ENG.set(RSC_KEY_LIST.PAGE, 'PAGE');
RSC_KEY_ENG.set(RSC_KEY_LIST.TRACK_LIST, 'Track List');
RSC_KEY_ENG.set(RSC_KEY_LIST.MOVIE_LIST, 'Movie List');

// Chinese resource keys.
const RSC_KEY_CHI = new Map();
RSC_KEY_CHI.set(RSC_KEY_LIST.PAGE, '页');
RSC_KEY_CHI.set(RSC_KEY_LIST.TRACK_LIST, '曲目列表');
RSC_KEY_CHI.set(RSC_KEY_LIST.MOVIE_LIST, '电影列表');

const RSC_KEY_MAP = new Map();
RSC_KEY_MAP.set(LANGUAGE.ENGLISH, RSC_KEY_ENG);
RSC_KEY_MAP.set(LANGUAGE.CHINESE, RSC_KEY_CHI);

// get resource key method.
const getResourceKey = function(language, resourceKey) {
  let rscKeyMap = RSC_KEY_MAP.get(language);
  let rscKey = rscKeyMap.get(resourceKey);

  return rscKey;
}

const RSC_KEY = {
  RSC_KEY_LIST: RSC_KEY_LIST,
  getResourceKey: getResourceKey
}

module.exports = RSC_KEY;

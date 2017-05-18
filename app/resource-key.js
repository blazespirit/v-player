// Contain all the app resource-key with different locale.
const { LANGUAGE } = require('./config-constant');

const RSC_KEY_LIST = {
  PAGE: 'page',
  TRACK_LIST: 'trackList',
  MOVIE_LIST: 'movieList',
  GENRE_ACTION   : 'action',
  GENRE_ANIMATION: 'animation',
  GENRE_COMEDY   : 'comedy',
  GENRE_CRIME    : 'crime',
  GENRE_DRAMA    : 'drama',
  GENRE_HORROR   : 'horror',
  GENRE_MYSTERY  : 'mystery',
  GENRE_ROMANCE  : 'romance',
  GENRE_SCI_FI   : 'sciFi',
  GENRE_UNKNOWN  : 'unknown'
}

// English resource keys.
const RSC_KEY_ENG = new Map();
RSC_KEY_ENG.set(RSC_KEY_LIST.PAGE, 'PAGE');
RSC_KEY_ENG.set(RSC_KEY_LIST.TRACK_LIST, 'Track List');
RSC_KEY_ENG.set(RSC_KEY_LIST.MOVIE_LIST, 'Movie List');
RSC_KEY_ENG.set(RSC_KEY_LIST.GENRE_ACTION, 'Action');
RSC_KEY_ENG.set(RSC_KEY_LIST.GENRE_ANIMATION, 'Animation');
RSC_KEY_ENG.set(RSC_KEY_LIST.GENRE_COMEDY, 'Comedy');
RSC_KEY_ENG.set(RSC_KEY_LIST.GENRE_CRIME, 'Crime');
RSC_KEY_ENG.set(RSC_KEY_LIST.GENRE_DRAMA, 'Drama');
RSC_KEY_ENG.set(RSC_KEY_LIST.GENRE_HORROR, 'Horror');
RSC_KEY_ENG.set(RSC_KEY_LIST.GENRE_MYSTERY, 'Mystery');
RSC_KEY_ENG.set(RSC_KEY_LIST.GENRE_ROMANCE, 'Romance');
RSC_KEY_ENG.set(RSC_KEY_LIST.GENRE_SCI_FI, 'Sci-Fi');
RSC_KEY_ENG.set(RSC_KEY_LIST.GENRE_UNKNOWN, 'Unknown');

// Chinese resource keys.
const RSC_KEY_CHI = new Map();
RSC_KEY_CHI.set(RSC_KEY_LIST.PAGE, '页');
RSC_KEY_CHI.set(RSC_KEY_LIST.TRACK_LIST, '曲目列表');
RSC_KEY_CHI.set(RSC_KEY_LIST.MOVIE_LIST, '电影列表');
RSC_KEY_CHI.set(RSC_KEY_LIST.GENRE_ACTION, '动作');
RSC_KEY_CHI.set(RSC_KEY_LIST.GENRE_ANIMATION, '动画');
RSC_KEY_CHI.set(RSC_KEY_LIST.GENRE_COMEDY, '喜剧');
RSC_KEY_CHI.set(RSC_KEY_LIST.GENRE_CRIME, '犯罪');
RSC_KEY_CHI.set(RSC_KEY_LIST.GENRE_DRAMA, '剧情');
RSC_KEY_CHI.set(RSC_KEY_LIST.GENRE_HORROR, '恐怖');
RSC_KEY_CHI.set(RSC_KEY_LIST.GENRE_MYSTERY, '悬疑');
RSC_KEY_CHI.set(RSC_KEY_LIST.GENRE_ROMANCE, '爱情');
RSC_KEY_CHI.set(RSC_KEY_LIST.GENRE_SCI_FI, '科幻');
RSC_KEY_CHI.set(RSC_KEY_LIST.GENRE_UNKNOWN, '未知');

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

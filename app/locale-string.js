const LANGUAGE = {
  ENGLISH: 'eng',
  CHINESE: 'chi'
};

const STR = {
  VIEW_LABEL: {
    HOME: {
      DEFAULT: 'Home',
      [LANGUAGE.ENGLISH]: 'Home',
      [LANGUAGE.CHINESE]: '主页'
    },
    MUSIC: {
      DEFAULT: 'Music',
      [LANGUAGE.ENGLISH]: 'Music',
      [LANGUAGE.CHINESE]: '音乐'
    },
    MOVIE: {
      DEFAULT: 'Movie',
      [LANGUAGE.ENGLISH]: 'Movie',
      [LANGUAGE.CHINESE]: '影片'
    },
  }
};

module.exports = {
  LANGUAGE: LANGUAGE,
  STR: STR
}

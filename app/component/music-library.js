const { VIEW, FOCUSABLE_ITEM } = require('../config-constant');
const RSC_KEY = require('../resource-key');

const musicLibrary = {
  template: `
    <div id="music-library">
      <div class="left-box">
        <div class="previous-page-icon"
             v-bind:class="{ 'hide': isFirstPage }"></div>
      </div>
      <div class="middle-box">
        <div class="label">{{rscKeyTrackList}}<span class="pagination">{{currentPage}} / {{totalPage}} {{rscKeyPage}}</span></div>
        <div class="song-list">
          <div class="track" 
              v-bind:class="{ 'focus': isFocus && index === focusIndex }"
              v-for="(track, index) in trackList">
                  {{ track.title }}
          </div>
        </div>
      </div>
      <div class="right-box">
        <div class="next-page-icon"
             v-bind:class="{ 'hide': isLastPage }"></div>
      </div>
    </div>
  `,
  methods: {
    nextPage: function() {
      this.$store.commit('GET_TRACK_LIST_NEXT_PAGE');
    },
    previousPage: function() {
      this.$store.commit('GET_TRACK_LIST_PREVIOUS_PAGE');
    }
  },
  computed: {
    trackList: function() {
      return this.$store.getters.getTrackList;
    },
    focusIndex: function() {
      return this.$store.getters.getMusicFocusIndex;
    },
    isFocus: function() {
      return this.$store.getters.getFocus === FOCUSABLE_ITEM.TRACK_LIST;
    },
    currentPage: function() {
      return this.$store.getters.getTrackListCurrentPage;
    },
    totalPage: function() {
      return this.$store.getters.getTrackListTotalPage;
    },
    isFirstPage: function() {
      return (this.$store.getters.getTrackListCurrentPage === 1);
    },
    isLastPage: function() {
      return (this.$store.getters.getTrackListCurrentPage === this.$store.getters.getTrackListTotalPage);
    },
    viewChange: function() {
      return this.$store.getters.getView;
    },
    // resource key
    rscKeyPage: function() {
      let language = this.$store.getters.getLanguage;
      let rscKey = RSC_KEY.getResourceKey(language, RSC_KEY.RSC_KEY_LIST.PAGE);
      return rscKey;
    },
    rscKeyTrackList: function() {
      let language = this.$store.getters.getLanguage;
      let rscKey = RSC_KEY.getResourceKey(language, RSC_KEY.RSC_KEY_LIST.TRACK_LIST);
      return rscKey;
    }
  },
  watch: {
    viewChange: function(view) {
      if (view === VIEW.HOME) {
        this.$router.push('home');
      }
    }
  },
  created: function() {
    this.$store.commit('INIT_MUSIC_LIBRARY');
  }
};

module.exports = musicLibrary;

const { FOCUSABLE_ITEM } = require('../config-constant');

const musicLibrary = {
  template: `
    <div id="music-library">
      <div class="left-box">
        <div class="previous-page-icon"
             v-bind:class="{ 'hide': isFirstPage }"></div>
        <div class="blank-space"></div>
      </div>
      <div class="middle-box">
        <div class="label">Track List</div>
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
        <div class="track-page">{{currentPage}} / {{totalPage}} page</div>
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
      return this.$store.getters.getFocusIndex;
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
    }
  },
  created: function() {
    this.$store.commit('INIT_MUSIC_LIBRARY');
  }
};

module.exports = musicLibrary;

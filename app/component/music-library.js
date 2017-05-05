const musicLibrary = {
  template: `
    <div id="music-library">
      <div class="label">Track List</div>
      <div class="song-list">
        <div class="track" v-for="track in trackList"> {{ track.title }} </div>
      </div>
    </div>
  `,
  methods: {
    nextPage: function() { // TODO -- last page limit handling.
      this.$store.commit('GET_TRACK_LIST_NEXT_PAGE');
    },
    previousPage: function() {
      this.$store.commit('GET_TRACK_LIST_PREVIOUS_PAGE');
    }
  },
  computed: {
    trackList: function() {
      return this.$store.getters.getTrackList;
    }
  },
  created: function() {
    this.$store.commit('GET_TRACK_LIST');
  }
};

module.exports = musicLibrary;

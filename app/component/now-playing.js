const nowPlaying = {
  template: `
    <div id="now-playing">
      <div class="album-art"></div>
      <div class="track-info">
        <div class="track-title">Title long long long long long long long long</div>
        <div class="track-artist">Artist</div>
        <div class="track-album">Album</div>
      </div>
      <div class="track-control">
        <div class="previous-track"></div>
        <div class="play-pause"></div>
        <div class="next-track"></div>
      </div>
    </div>
  `,
  methods: {
    toggleActive: function() {
      // this.$store.commit('CHANGE_ACTIVE', 'music');
    }
  },
  computed: {
    isActive: function() {
      // return this.$store.state.activeItem === 'music';
    }
  }
};

module.exports = nowPlaying;

const musicLibrary = {
  template: `
    <div id="music-library">
      <div>Music Library</div>
      <div class="category">
        <div class="song">Songs</div>
        <div class="album">Albums</div>
        <div class="artist">Artists</div>
      </div>
      <div class="song-list">Songs list here</div>
    </div>
  `,
  methods: {
    toggleActive: function() {
      //this.$store.commit('CHANGE_ACTIVE', 'music');
    }
  },
  computed: {
    isActive: function() {
      //return this.$store.state.activeItem === 'music';
    }
  }
};

module.exports = musicLibrary;

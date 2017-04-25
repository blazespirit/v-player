const home = {
  template: `
    <div id="menu-item">
      <div id="music" v-bind:class="{ active: musicFocus }" @click="goToMusicLibrary"></div>
      <div id="movie" v-bind:class="{ active: movieFocus }" @click="goToMovieLibrary"></div>
    </div>
  `,
  methods: {
    goToMusicLibrary: function() {
      this.$router.push('music-library');
    },
    goToMovieLibrary: function() {
      this.$router.push('movie-library');
    },
  },
  computed: {
    musicFocus: function() {
      return this.$store.state.activeItem === 'music';
    },
    movieFocus: function() {
      return this.$store.state.activeItem === 'movie';
    }
  }
};

module.exports = home;

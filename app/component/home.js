const CONFIG = require('../config-constant');

const home = {
  template: `
    <div id="menu-item">
      <div id="music" v-bind:class="{ 'focus': musicFocus }" @click="goToMusicLibrary"></div>
      <div id="movie" v-bind:class="{ 'focus': movieFocus }" @click="goToMovieLibrary"></div>
    </div>
  `,
  methods: {
    goToMusicLibrary: function() {
      this.$router.push('music-library');
      this.$store.commit('CHANGE_CURRENT_VIEW', CONFIG.VIEW.MUSIC);
    },
    goToMovieLibrary: function() {
      this.$router.push('movie-library');
      this.$store.commit('CHANGE_CURRENT_VIEW', CONFIG.VIEW.MOVIE);
    },
  },
  computed: {
    musicFocus: function() {
      return this.$store.state.focus === CONFIG.FOCUSABLE_ITEM.MUSIC_LIBRARY;
    },
    movieFocus: function() {
      return this.$store.state.focus === CONFIG.FOCUSABLE_ITEM.MOVIE_LIBRARY;
    },
    viewChange: function() {
      return this.$store.getters.getView;
    }
  },
  watch: {
    viewChange: function(view) {
      if (view === CONFIG.VIEW.MUSIC) {
        this.$router.push('music-library');
      }
      else if (view === CONFIG.VIEW.MOVIE) {
        this.$router.push('movie-library');
      }
    }
  }
};

module.exports = home;

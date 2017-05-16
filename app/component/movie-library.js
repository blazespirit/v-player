const { VIEW, FOCUSABLE_ITEM } = require('../config-constant');

const movieLibrary = {
  template: `
    <div id="movie-library">
      <div class="left-box">
        <div class="previous-page-icon"
             v-bind:class="{ 'hide': isFirstPage }"></div>
      </div>
      <div class="middle-box">
        <div class="label">Movie List: <span class="pagination">{{currentPage}} / {{totalPage}} page</span></div>
        <div class="movie-list">
          <div class="movie" 
              v-bind:class="{ 'focus': isFocus && index === focusIndex }"
              v-for="(movie, index) in movieList">
                  {{ movie.titleEng }}
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
      this.$store.commit('GET_MOVIE_LIST_NEXT_PAGE');
    },
    previousPage: function() {
      this.$store.commit('GET_MOVIE_LIST_PREVIOUS_PAGE');
    }
  },
  computed: {
    movieList: function() {
      return this.$store.getters.getMovieList;
    },
    focusIndex: function() {
      return this.$store.getters.getMovieFocusIndex;
    },
    isFocus: function() {
      return this.$store.getters.getFocus === FOCUSABLE_ITEM.MOVIE_LIST;
    },
    currentPage: function() {
      return this.$store.getters.getMovieListCurrentPage;
    },
    totalPage: function() {
      return this.$store.getters.getMovieListTotalPage;
    },
    isFirstPage: function() {
      return (this.$store.getters.getMovieListCurrentPage === 1);
    },
    isLastPage: function() {
      return (this.$store.getters.getMovieListCurrentPage === this.$store.getters.getMovieListTotalPage);
    },
    viewChange: function() {
      return this.$store.getters.getView;
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
    this.$store.commit('INIT_MOVIE_LIBRARY');
  }
};

module.exports = movieLibrary;

const OmxManager = require('omx-manager');
const { VIEW,
        MOVIE,
        OMX,
        FOCUSABLE_ITEM } = require('../config-constant');

const RSC_KEY = require('../resource-key');

const movieLibrary = {
  template: `
    <div id="movie-library">
      <div class="left-box">
        <div class="previous-page-icon"
             v-bind:class="{ 'hide': isFirstPage }"></div>
      </div>
      <div class="middle-box">
        <div class="label">{{rscKeyMovieList}}<span class="pagination">{{currentPage}} / {{totalPage}} {{rscKeyPage}}</span></div>
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
  data: function() {
    return {
      movie: null // use as reference for omx movie object.
    };
  },
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
    status: function() {
      return this.$store.getters.getMovieStatus;
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
    rscKeyMovieList: function() {
      let language = this.$store.getters.getLanguage;
      let rscKey = RSC_KEY.getResourceKey(language, RSC_KEY.RSC_KEY_LIST.MOVIE_LIST);
      return rscKey;
    }
  },
  watch: {
    viewChange: function(view) {
      if (view === VIEW.HOME) {
        this.$router.push('home');
      }
    },
    status: function(status) {
      if (status === MOVIE.STATUS_PLAY) {
        if (this.movie === null) {
          let manager = new OmxManager();
          this.movie = manager.create(this.$store.getters.getMovieFilePath, OMX.OPTION); // TODO -- error handling for not-exist file.
          this.movie.play();
        }
        else {
          this.movie.play();
        }
        
        this.movie.on('end', () => {
          this.$store.commit('UPDATE_MOVIE_STATUS', MOVIE.STATUS_STOP);
        });
      }
      else if (status === MOVIE.STATUS_PAUSE) {
        this.movie.pause();
      }
      else if (status === MOVIE.STATUS_STOP) {
        this.movie.stop();
        this.movie = null;
      }
    }
  },
  created: function() {
    this.$store.commit('INIT_MOVIE_LIBRARY');
  }
};

module.exports = movieLibrary;

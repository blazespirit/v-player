const movieLibrary = {
  template: `
    <div id="movie-library">Movie Library</div>
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

module.exports = movieLibrary;

const movieLibrary = {
  template: `<div id="movie" v-bind:class="{ active: isActive }" @click="toggleActive"></div>`,
  methods: {
    toggleActive: function() {
      this.$store.commit('CHANGE_ACTIVE', 'movie');
    }
  },
  computed: {
    isActive: function() {
      return this.$store.state.activeItem === 'movie';
    }
  }
};

module.exports = movieLibrary;

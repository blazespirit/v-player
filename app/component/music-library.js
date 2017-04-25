const musicLibrary = {
  template: `<div id="music" v-bind:class="{ active: isActive }" @click="goToMusic"></div>`,
  methods: {
    goToMusic: function() {
      this.$router.push('track-list');
    }
  },
  computed: {
    isActive: function() {
      return this.$store.state.activeItem === 'music';
    }
  }
};

module.exports = musicLibrary;

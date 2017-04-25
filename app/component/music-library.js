const musicLibrary = {
  template: `<div id="music" v-bind:class="{ active: isActive }" @click="toggleActive"></div>`,
  methods: {
    toggleActive: function() {
      this.$store.commit('CHANGE_ACTIVE', 'music');
    }
  },
  computed: {
    isActive: function() {
      return this.$store.state.activeItem === 'music';
    }
  }
};

module.exports = musicLibrary;

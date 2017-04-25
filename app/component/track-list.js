const trackList = {
  template: `
    <div id="track-list">Track List</div>
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

module.exports = trackList;

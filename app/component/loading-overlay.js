const loadingOverlay = {
  template: `
    <div id="loading-overlay" v-if="isShow">
      <div class="loading-container">
        <div class="loading-text">{{ loadingText }}</div>
        <div class="loading-bar"></div>
      </div>
    </div>
  `,
  computed: {
    isShow: function() {
      return this.$store.getters.getIsShow;
    },
    loadingText: function() {
      return this.$store.getters.getLoadingText;
    }
  }
};

module.exports = loadingOverlay;

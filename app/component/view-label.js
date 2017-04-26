const viewLabel = {
  template: `
    <div id="view-label" @click="toggleLocale">
      {{ currentViewLabel }}
    </div>
  `,
  computed: {
    currentViewLabel: function() {
      return this.$store.getters.getViewLabel;
    }
  },
  methods: {
    toggleLocale: function() {
      this.$store.commit('toggleLanguage');
    }
  }
};

module.exports = viewLabel;

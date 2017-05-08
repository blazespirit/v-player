const viewLabel = {
  template: `
    <div id="view-label" @click="toggleLocale">
      {{ viewLabel }}
    </div>
  `,
  computed: {
    viewLabel: function() {
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

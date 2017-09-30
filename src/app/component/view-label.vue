<template>
    <div class="view-label" @click="toggleLocale">
        {{ viewLabel }}
    </div>
</template>

<script>
export default {
    computed: {
        viewLabel: function() {
            return 'Music'
            // return this.$store.getters.getViewLabel;
        }
    },
    methods: {
        toggleLocale: function() {
            // this.$store.commit('toggleLanguage');
        }
    }
}
</script>

<style scoped>
.view-label {
    padding-left: 15px;
}
</style>

<template>
    <div class="v-player">
        <div class="top-panel">
            <view-label></view-label>
            <clock></clock>
        </div>
        <div class="middle-panel">
            <router-view></router-view>
        </div>
        <div class="bottom-panel">
            <now-playing></now-playing>
        </div>
        <!-- <loading-overlay></loading-overlay> -->
    </div>
</template>

<script>
import ViewLabel from './view-label.vue';
import Clock from './clock.vue';
import NowPlaying from './now-playing.vue';

export default {
    components: {
        'view-label': ViewLabel,
        'clock': Clock,
        'now-playing': NowPlaying
    }
}
</script>

<style scoped>
.v-player {
    width: 100%;
    height: 100%;
    margin: 0px;
    background-image: url('../../assets/img/blue-prism.png');
    background-size: cover;
    background-clip: border-box;
    background-repeat: no-repeat;
}

.top-panel {
    height: 10vh;
    display: flex;
    justify-content: space-between;
    font-weight: 100;
    font-size: 1.6rem;
}

.bottom-panel {
    height: 15vh;
}

.middle-panel {
    height: 75vh;
}
</style>

const fileSystem = require('fs');
const howler = require('howler');
const { STATUS,
        FOCUSABLE_ITEM } = require('../config-constant');

const nowPlaying = {
  template: `
    <div id="now-playing">
      <div class="album-art"></div>
      <div class="track-info">
        <div class="track-title">{{ title }}</div>
        <div class="track-artist">{{ artist }}</div>
      </div>
      <div class="track-control">
        <div class="previous-track"
             v-bind:class="{ 'focus': previousFocus }"
             @click="previousTrack">
        </div>
        <div class="play-pause"
             v-bind:class="{ 'is-playing': isPlaying, 'focus': playFocus }"
             @click="togglePlayPause">
        </div>
        <div class="next-track"
             v-bind:class="{ 'focus': nextFocus }"
             @click="nextTrack">
        </div>
      </div>
    </div>
  `,
  data: function() {
    return {
      track: null // use as reference for Howler object.
    };
  },
  methods: {
    togglePlayPause: function() {
      this.$store.commit('TOGGLE_PLAY_PAUSE');
    },
    nextTrack: function() {
      this.$store.commit('INCREASE_INDEX');
      this.$store.commit('GET_SINGLE_TRACK');
    },
    previousTrack:function() {
      this.$store.commit('DECREASE_INDEX');
      this.$store.commit('GET_SINGLE_TRACK');
    }
  },
  computed: {
    path: function() {
      return this.$store.getters.getPath;
    },
    title: function() {
      return this.$store.getters.getTitle;
    },
    artist: function() {
      return this.$store.getters.getArtist;
    },
    album: function() {
      return this.$store.getters.getAlbum;
    },
    fetchStatus: function() {
      return this.$store.getters.getFetchStatus;
    },
    isPlaying: function() {
      return this.$store.getters.isPlaying;
    },
    playFocus: function() {
      return this.$store.state.focus === FOCUSABLE_ITEM.PLAY_BUTTON;
    },
    previousFocus: function() {
      return this.$store.state.focus === FOCUSABLE_ITEM.PREVIOUS_BUTTON;
    },
    nextFocus: function() {
      return this.$store.state.focus === FOCUSABLE_ITEM.NEXT_BUTTON;
    },
  },
  watch: {
    fetchStatus: function(status) {
      if (status === STATUS.FETCH_COMPLETE && fileSystem.existsSync(this.path)) {
        Howler.unload(); // destroy previous Howl object.

        this.track = new Howl({
          src: [this.path],
          html5: true,
          autoplay: this.isPlaying,
          onend: () => {
            this.nextTrack();
          }
        });
      }
    },
    isPlaying: function(isPlaying) {
      if (isPlaying === true) {
        this.track.play();
      }
      else {
        this.track.pause();
      }
    }
  },
  created: function() { // fetch 1st song info from DB and display it.
    this.$store.commit('GET_SINGLE_TRACK');
  }
};

module.exports = nowPlaying;

// === test howler.js ===

// console.log(howler);

// var soundMix = new Howl({
//   src: [sound2, sound1],
//   html5: true,
//   onload: function() {
//     console.log(soundMix.duration());
//   },
//   onend: function() {
//     console.log('its end');
//   }
// });

// var soundOne = new Howl({
//   src: [sound1],
//   html5: true
// });

// var soundTwo = new Howl({
//   src: [sound2],
//   html5: true
// });